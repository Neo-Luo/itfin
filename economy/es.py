#!/usr/bin/env python
#encoding: utf-8
import sys
reload(sys)
sys.setdefaultencoding('utf-8')
from elasticsearch import Elasticsearch
from duplicate import duplicate
from pybloom import ScalableBloomFilter
from economy.config import *

es = Elasticsearch([{'host':ES_HOST,'port':ES_PORT}])

def get_returnrate_content(index_name, text_id):
	query_body = {"size":500,"query":{"match":{"_id":text_id}}}
	res = es.search(index=index_name, doc_type='type1', body=query_body,request_timeout=100)
	content = res['hits']['hits'][0]['_source']
	return content

def get_promise_content(index_name, text_id):
	query_body = {"size":500,"query":{"match":{"_id":text_id}}}
	res = es.search(index=index_name, doc_type='type1', body=query_body,request_timeout=100)
	content = res['hits']['hits'][0]['_source']
	return content


def get_adContent(entity_name, score, index_name, type, date, ad123, ad_date):
	t = int(time.mktime(time.strptime(ad_date,'%Y-%m-%d')))
	start_time1 = datetime.strptime(ad_date,"%Y-%m-%d") - timedelta(days=int(date))
	start_time2 = start_time1.strftime("%Y-%m-%d")
	start_time = int(time.mktime(time.strptime(start_time2,'%Y-%m-%d')))

	score = 0
	query_body = {	"size":500,
					"query":{
						"bool":{
							"must":{"match":{"query_name":entity_name}},
							"should":[
								],
							"minimum_should_match":1
							}
						}
					}
	if ad123 == 0:
		query_body['query']['bool']['should'].append({"match":{"ad123":1}})
		query_body['query']['bool']['should'].append({"match":{"ad123":2}})
		query_body['query']['bool']['should'].append({"match":{"ad123":3}})
	elif ad123 == 1:
		query_body['query']['bool']['should'].append({"match":{"ad123":1}})
	elif ad123 == 2:
		query_body['query']['bool']['should'].append({"match":{"ad123":2}})
		query_body['query']['bool']['should'].append({"match":{"ad123":3}})
	
	if not ad_date == start_time2:
		query_body['query']['bool'].update({"filter":[{"range":{"publish_time":{"gt":start_time,"lte":t}}}]})
	print(query_body)
	res = es.search(index=index_name, doc_type=type, body=query_body, request_timeout=100)
	hits = res['hits']['hits']
	results = []
	if(len(hits)):
		for item in hits:
			name = item['_index']
			_id = item['_id']
			if(item['_score'] >= score):
				if entity_name in item['_source']['query_name']:
					result = item['_source']
					result.update({'source':name})
					result.update({'_id':_id})
					results.append(result)
	# 按发布时间排序
	#results.sort(key=lambda x: x['publish_time'], reverse=True)
	# 根据文本相似度去重
	dup_results = duplicate(results)
	return dup_results
	# return results

def editAd(id, index_name, type, ad123):
	updateBody = {
					"query": {
						"bool": {
							"must": [
								{"term": {"_id": id}}
							],
						}
					},
					"script": {
						"inline": "ctx._source.ad123 = params.ad123",
						"params": {
							"ad123": ad123
						} 
					}
	}
	if ad123 == 0:
		updateBody['script']['params'].update({'ad01':0})
	res = es.update_by_query(index=index_name, doc_type=type, body=updateBody)
	if res['updated']:
		dict = {'status':'ok'}
	else:
		dict = {'status':'fail'}
	return dict

def get_commentContent(entity_name, score, index_name, type, date, em, comment_date):
	score = 0
	t = int(time.mktime(time.strptime(comment_date,'%Y-%m-%d')))
	start_time1 = datetime.strptime(comment_date,"%Y-%m-%d") - timedelta(days=int(date))
	start_time2 = start_time1.strftime("%Y-%m-%d")
	start_time = int(time.mktime(time.strptime(start_time2,'%Y-%m-%d')))
	query_body = {	"size":500,
					"query":{
						"bool":{
							"must":{"match":{"query_name":entity_name}},
							"should":[
									],
							"minimum_should_match" : 1
								}
							}
				}

	if em == 100:
		query_body['query']['bool']['should'].append({"match":{"em0":1}})
		query_body['query']['bool']['should'].append({"match":{"em1":1}})
	elif em == 0:
		query_body['query']['bool']['should'].append({"match":{"em0":1}})
	elif em == 1:
		query_body['query']['bool']['should'].append({"match":{"em1":1}})

	if not comment_date == start_time2:
		query_body['query']['bool'].update({"filter":[{"range":{"publish_time":{"gt":start_time,"lte":t}}}]})

	res = es.search(index=index_name, doc_type=type, body=query_body, request_timeout=100)
	hits = res['hits']['hits']
	results = []
	if(len(hits)):
		for item in hits:
			name = item['_index']
			_id = item['_id']
			if(item['_score'] >= score):
				if entity_name in item['_source']['query_name']:
					result = item['_source']
					result.update({'source':name})
					result.update({'_id':_id})
					results.append(result)
	# 按发布时间排序
	#results.sort(key=lambda x: x['publish_time'], reverse=True)
	# 根据文本相似度去重
	dup_results = duplicate(results)
	return dup_results


def editComment(id, index_name, type, em):
	#判断是否存在em0字段
	query_body0 = {
				"query": {
					"bool": {
						"must": [
							{"term": {"_id": id}}
						],
						"filter":{
							"exists": {
								"field": "em0"
							}
						}
					}
				}
	}
	res0 = es.search(index=index_name, doc_type=type, body=query_body0, request_timeout=100)['hits']['total']

	#判断是否存在em1字段
	query_body1 = {
				"query": {
					"bool": {
						"must": [
							{"term": {"_id": id}}
						],
						"filter":{
							"exists": {
								"field": "em1"
							}
						}
					}
				}
	}
	res1 = es.search(index=index_name, doc_type=type, body=query_body1, request_timeout=100)['hits']['total']

	if em == 1:	#一般变严重
		if res1:	#存在em1，em0变为0，em1变为1
			updateBody = {
							"query": {
								"bool": {
									"must": [
										{"term": {"_id": id}}
									],
								}
							},
							"script": {
								"inline": "ctx._source.em0=0; ctx._source.em1=1"
							}
			}
			res = es.update_by_query(index=index_name, doc_type=type, body=updateBody)
			if res['updated']:
				dict = {'status':'ok'}
			else:
				dict = {'status':'fail'}
			return dict

		else:	#em1不存在，em0变为0，增加em1字段，em1变为1
			updateBody = {
							"query": {
								"bool": {
									"must": [
										{"term": {"_id": id}}
									],
								}
							},
							"script": {
								"inline": "ctx._source.em0=0; ctx._source.em1++; ctx._source.em1=1"
							}
			}
			res = es.update_by_query(index=index_name, doc_type=type, body=updateBody)
			if res['updated']:
				dict = {'status':'ok'}
			else:
				dict = {'status':'fail'}
			return dict

	elif em == 0:	#严重变一般
		if res0:	#有em0，em1变为0，em0变为1
			updateBody = {
							"query": {
								"bool": {
									"must": [
										{"term": {"_id": id}}
									],
								}
							},
							"script": {
								"inline": "ctx._source.em1=0; ctx._source.em0=1"
							}
			}
			res = es.update_by_query(index=index_name, doc_type=type, body=updateBody)
			if res['updated']:
				dict = {'status':'ok'}
			else:
				dict = {'status':'fail'}
			return dict
		else:	#没有em0，em1变为0，增加em0字段，em0变为1
			updateBody = {
							"query": {
								"bool": {
									"must": [
										{"term": {"_id": id}}
									],
								}
							},
							"script": {
								"inline": "ctx._source.em1=0; ctx._source.em0++; ctx._source.em0=1"
							}
			}
			res = es.update_by_query(index=index_name, doc_type=type, body=updateBody)
			if res['updated']:
				dict = {'status':'ok'}
			else:
				dict = {'status':'fail'}
			return dict
	elif em == 2:	#一般／严重 变为非负面
		updateBody = {
						"query": {
							"bool": {
								"must": [
									{"term": {"_id": id}}
								],
							}
						},
						"script": {
							"inline": ""
						}
		}
		inline = []
		if res0:	#如果存在em0字段，em0变为0
			inline.append("ctx._source.em0=0")
		if res1:	#如果存在em1字段，em0变为02
			inline.append("ctx._source.em1=0")
		updateBody["script"]["inline"] = ';'.join(inline)
		res = es.update_by_query(index=index_name, doc_type=type, body=updateBody)
		if res['updated']:
			dict = {'status':'ok'}
		else:
			dict = {'status':'fail'}
		return dict


def get_ab_info(index_name,type,firm_name):
	query_body = {"size":10000,"sort":{"in_date":{"order":"desc"}},"query":{"match":{"firm_name":firm_name}}}
	res = es.search(index=index_name, doc_type=type, body=query_body, request_timeout=100)
	hits = res['hits']['hits']
	results = []
	if(len(hits)):
		for item in hits:
			results.append(item)
	# 去掉重复文本
	unique_result = []
	# if(len(results)):
	for item in results:
		if item['_source'] not in unique_result:
			unique_result.append(item['_source'])
	return unique_result
	# return results

def get_ch_info(index_name,type,firm_name):
	query_body = {"size":10000,"sort":{"change_time":{"order":"desc"}},"query":{"match":{"firm_name":firm_name}}}
	res = es.search(index=index_name, doc_type=type, body=query_body, request_timeout=100)
	hits = res['hits']['hits']
	results = []
	if(len(hits)):
		for item in hits:
			results.append(item)
	# 去掉重复文本
	unique_result = []
	for item in results:
		if item['_source'] not in unique_result:
			unique_result.append(item['_source'])
	return unique_result
	# return results

def get_law_info(index_name,type,firm_name):
	query_body = {"size":10000,"sort":{"date":{"order":"desc"}},"query":{"match":{"firm_name":firm_name}}}
	res = es.search(index=index_name, doc_type=type, body=query_body, request_timeout=100)
	hits = res['hits']['hits']
	results = []
	if(len(hits)):
		for item in hits:
			results.append(item)
	# 去掉重复文本
	unique_result = []
	for item in results:
		if item['_source'] not in unique_result:
			unique_result.append(item['_source'])
	return unique_result
	# return results



def get_subfirmContent(firm,index_name):
	type_name = 'invest_info'
	query_body = {	"size":500,
					"query": {
						"bool": {
							"must": [{"term": {"firm_name": firm}}
									 # {"term": {"holder_type": u'公司'}}
									 ]
						}

					}

				}

	try:
		result = es.search(index=index_name, doc_type=type_name, body=query_body)['hits']['hits']
	except Exception, e:
		#print e
		return []
	# 去掉重复文本
	unique_result = []
	for item in result:
		if item['_source'] not in unique_result:
			unique_result.append(item['_source'])
	return unique_result

def get_holderContent(firm,index_name):
	type_name = 'holder_info'
	query_body = {"size": 500,
				  "query": {
					  "bool": {
						  "must": [{"term": {"firm_name": firm}}
								   # {"term": {"holder_type": u'公司'}}
								   ]
					  }

				  }

				  }

	try:
		result = es.search(index=index_name, doc_type=type_name, body=query_body)['hits']['hits']
	except Exception, e:
		# print e
		return []
	# 去掉重复文本
	unique_result = []
	for item in result:
		if item['_source'] not in unique_result:
			unique_result.append(item['_source'])
	return unique_result


def get_perceive_content(index_name,type,entity_name):
	list = []
	query_body = {
			"size":5000,
			"query":{
				"match":{
					"query_name":entity_name
				}
			}
	}
	for each in es.search(index=index_name,doc_type=type,body=query_body)['hits']['hits']:
		if entity_name in each['_source']['content']:
			list.append(each['_source'])
	return list


#首页
def getHotSpot(entity_list):
	exist_list = []
	type = 'type1'
	results = []
	number = 0
	flag = 0
	for index_name in ['bbs','forum','webo']:
		query_body = {
					"size":1000,
					"sort":{"publish_time":{"order":"desc"}},
					"query": {
						"bool": {
							"must": [
									{
								"match": {
									"em1": 1
									}
								}
							]
						}
					}
		}
		res = es.search(index=index_name, doc_type=type, body=query_body, request_timeout=400)
		hits = res['hits']['hits']

		if(len(hits)):
			for item in hits:
				entity_name = item['_source']['query_name']

				if entity_name not in exist_list:
					exist_list.append(entity_name)
					# sql语句
					# id = dict['id']
					# entity_type = dict['entity_type']
					content = item['_source']['content']
					results.append({'id':1,'name':entity_name,'content':content,'entity_type':1})
					if(len(exist_list)>=10):
						break
						
		if(len(exist_list)>=10):
						break					

	
	return results


def getHotSpot_backup(entity_list):
	type = 'type1'
	results = []
	number = 0
	flag = 0
	for dict in entity_list:
		indexB = ScalableBloomFilter(1000,0.001)
		for index_name in ['bbs','forum','webo']:
			query_body = {
					"sort":{"publish_time":{"order":"desc"}},
					"query": {
						"bool": {
							"must": [
								{
								"match": {
									"query_name": dict['name']
									}
								},
									{
								"match": {
									"em1": 1
									}
								}
							]
						}
					}
				}
			res = es.search(index=index_name, doc_type=type, body=query_body, request_timeout=100)
			hits = res['hits']['hits']

			if(len(hits)):
				for item in hits:
					if dict['name'] in item['_source']['content']:
						if not index_name in indexB:
							if number < 10:
								id = dict['id']
								entity_name = dict['name']
								entity_type = dict['entity_type']
								content = item['_source']['content']
								results.append({'id':id,'name':entity_name,'content':content,'entity_type':entity_type})
								[indexB.add(index_name)]
								number += 1
							else:
								flag = 1
								break

			if(flag):
				break
		if(flag):
			break
	
	return results

