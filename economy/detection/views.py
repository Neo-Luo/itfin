#!/usr/bin/env python
#encoding: utf-8

from flask import Flask, render_template, request, jsonify, Blueprint, send_from_directory, url_for, session
from economy.db import *
from . import detection
import json
from economy.config import *
from pybloom import ScalableBloomFilter

@detection.route('/detect/')
def detect():
	if session:
		username = session['username']
		role_id = session['role']
		uid = session['uid']
	else:
		username = ""
		role_id = ""
		uid = ""
	return render_template('detection/detection.html',username=username,role_id=role_id,uid=uid)

@detection.route('/detectData/',methods=['POST','GET'])
def detect_data():
	date = int(request.args.get('date',''))
	operation_mode = int(request.args.get('operation_mode',''))
	illegal_type = int(request.args.get('illegal_type',''))
	entity_type = int(request.args.get('entity_type',''))
	warn_distribute = request.args.get('warn_distribute','')
	page_number = int(request.args.get('page_number',''))
	page_size = int(request.args.get('page_size',''))
	detectionCount = int(request.args.get('detectionCount',''))
	result = getDetectData(date,TABLE_ENTITY_LIST,TABLE_MONITOR,TABLE_GONGSHANG,RISK_LEVEL,ILLEGAL_SCORE,operation_mode,illegal_type,entity_type,warn_distribute,page_number,page_size,detectionCount)
	return json.dumps(result,ensure_ascii=False)

@detection.route('/totalDetectData/',methods=['POST','GET'])
def total_detect_data():
	b = ScalableBloomFilter(1000000,0.001)
	date = int(request.args.get('date',''))
	operation_mode = request.args.get('operation_mode','')
	illegal_type = int(request.args.get('illegal_type',''))
	entity_type = int(request.args.get('entity_type',''))
	warn_distribute = request.args.get('warn_distribute','')
	problem = request.args.get('problem','')
	newEntity = int(request.args.get('newEntity',''))
	result = totalDetectData(date,TABLE_ENTITY_LIST,TABLE_MONITOR,TABLE_GONGSHANG,RISK_LEVEL,ILLEGAL_SCORE,operation_mode,illegal_type,entity_type,warn_distribute,problem,TABLE_INDEX_QUANTILE,TABLE_GUARANTEE_PROMISE)
	doubleId = []
	for dict in result:
		if not dict['id'] in b:
			[b.add(dict['id'])]
		else:
			doubleId.append(dict['id'])
	for id in doubleId:
		num = 0
		illegalTypeList = []
		for dict in result:
			if dict['id'] == id:
				num += 1
				illegalTypeList.append(dict['illegal_type'])
				dict.update({'illegal_type':illegalTypeList})
				if num > 1:
					result.remove(dict)
	if newEntity:
		bb = ScalableBloomFilter(1000000,0.001)
		newResult = []
		minDates = getMinDate(TABLE_MONITOR,RISK_LEVEL,ILLEGAL_SCORE)
		row_monitor_date = datetime.strptime(monitor_date,'%Y-%m-%d')
		for i,k in minDates.items():
			dateTime = datetime.strptime(k,'%Y-%m-%d')
			dValue = int((row_monitor_date-dateTime).total_seconds())/86400
			if dValue < date:
				[bb.add(i)]
		for dict in result:
			if dict['id'] in bb:
				newResult.append(dict)
		return json.dumps(newResult,ensure_ascii=False)
	return json.dumps(result,ensure_ascii=False)

@detection.route('/secondDetectData/',methods=['POST','GET'])
def second_detect_data():
	b = ScalableBloomFilter(1000000,0.001)
	date = int(request.args.get('date',''))
	operation_mode = request.args.get('operation_mode','')
	illegal_type = int(request.args.get('illegal_type',''))
	entity_type = int(request.args.get('entity_type',''))
	warn_distribute = request.args.get('warn_distribute','')
	problem = request.args.get('problem','')
	newEntity = int(request.args.get('newEntity',''))
	result = secondDetectData(date,TABLE_ENTITY_LIST,TABLE_MONITOR,TABLE_GONGSHANG,RISK_LEVEL,ILLEGAL_SCORE,operation_mode,illegal_type,entity_type,warn_distribute,problem,TABLE_INDEX_QUANTILE,TABLE_GUARANTEE_PROMISE)	
	doubleId = []
	for dict in result:
		if not dict['id'] in b:
			[b.add(dict['id'])]
		else:
			doubleId.append(dict['id'])
	for id in doubleId:
		num = 0
		illegalTypeList = []
		for dict in result:
			if dict['id'] == id:
				num += 1
				illegalTypeList.append(dict['illegal_type'])
				dict.update({'illegal_type':illegalTypeList})
				if num > 1:
					result.remove(dict)
	if newEntity:
		bb = ScalableBloomFilter(1000000,0.001)
		newResult = []
		minDates = getMinDate(TABLE_MONITOR,RISK_LEVEL,ILLEGAL_SCORE)
		row_monitor_date = datetime.strptime(monitor_date,'%Y-%m-%d')
		for i,k in minDates.items():
			dateTime = datetime.strptime(k,'%Y-%m-%d')
			dValue = int((row_monitor_date-dateTime).total_seconds())/86400
			if dValue < date:
				[bb.add(i)]
		for dict in result:
			if dict['id'] in bb:
				newResult.append(dict)
		return json.dumps(newResult,ensure_ascii=False)
	return json.dumps(result,ensure_ascii=False)


@detection.route('/detectionCount/',methods=['POST','GET'])
def detection_count():
	date = int(request.args.get('date',''))
	operation_mode = int(request.args.get('operation_mode',''))
	illegal_type = int(request.args.get('illegal_type',''))
	entity_type = int(request.args.get('entity_type',''))
	warn_distribute = request.args.get('warn_distribute','')
	result = detectionCount(date,TABLE_ENTITY_LIST,TABLE_MONITOR,TABLE_GONGSHANG,RISK_LEVEL,ILLEGAL_SCORE,operation_mode,illegal_type,entity_type,warn_distribute)
	return json.dumps(result,ensure_ascii=False)

@detection.route('/detectionResultCheck/')
def detection_result_check():
	entity_id = int(request.args.get('entity_id',''))
	date = request.args.get('date','')
	type = int(request.args.get('type',''))
	uid = int(request.args.get('uid',''))
	entity_name = request.args.get('entity_name','')
	remark = request.args.get('remark','')
	oldValue = request.args.get('oldValue','')
	username = request.args.get('username','')
	risk_rank = int(request.args.get('risk_rank',''))
	industry = request.args.get('industry','')
	fund_mode = request.args.get('fund_mode','')
	result = detectionResultCheck(TABLE_ENTITY_LIST, entity_id, date, type, uid, entity_name, TABLE_LOGS, remark, oldValue, username, risk_rank, industry, fund_mode, TABLE_CHECK_LOGS)
	return json.dumps(result,ensure_ascii=False)

@detection.route('/detectionResultRemark/')
def detection_result_remark():
	entity_id = int(request.args.get('entity_id',''))
	result = detectionResultRemark(TABLE_LOGS, entity_id)
	return json.dumps(result,ensure_ascii=False)

@detection.route('/detectRank/')
def detect_rank():
	date = request.args.get('date','')
	entity_type = int(request.args.get('entity_type',''))
	result = getDetectRank(TABLE_MONITOR, date, RISK_LEVEL, ILLEGAL_SCORE, entity_type)
	result.sort(key=lambda x:x['max(illegal_score)'],reverse=True)
	return json.dumps(result[0:20],ensure_ascii=False)

@detection.route('/detectDistribute/')
def detect_distribute():
	date = request.args.get('date','')
	result = getDetectDistribute(date,TABLE_MONITOR,TABLE_GONGSHANG,RISK_LEVEL,ILLEGAL_SCORE)
	result.sort(key=lambda x:x['sum'],reverse=True)
	return json.dumps(result,ensure_ascii=False)

@detection.route('/warnType/')
def warn_type():
	date = int(request.args.get('date',''))
	illegal_type = int(request.args.get('illegal_type',''))
	entity_type = int(request.args.get('entity_type',''))
	operation_mode = request.args.get('operation_mode','')
	warn_distribute = request.args.get('warn_distribute','')
	result = getWarnType(TABLE_MONITOR, TABLE_GONGSHANG, RISK_LEVEL, ILLEGAL_SCORE, date, illegal_type, entity_type, operation_mode, warn_distribute,TABLE_ENTITY_LIST)
	return json.dumps(result,ensure_ascii=False)


@detection.route('/OperationModeBox/')
def operation_mode_box():
	result = operationModeBox(TABLE_OPERATION_LIST)
	return json.dumps(result,ensure_ascii=False)

@detection.route('/IllegalTypeBox/')
def illegal_type_box():
	result = illegalTypeBox(TABLE_ILLEGAL_LIST)
	return json.dumps(result,ensure_ascii=False)

@detection.route('/ProblemBox/')
def problem_box():
	result = problemBox(TABLE_PROBLEM_LIST)
	return json.dumps(result,ensure_ascii=False)

@detection.route('/TimeDistribute/')
def time_Distribute():
	date = int(request.args.get('date',''))
	illegal_type = int(request.args.get('illegal_type',''))
	entity_type = int(request.args.get('entity_type',''))
	operation_mode = request.args.get('operation_mode','')
	warn_distribute = request.args.get('warn_distribute','')
	result = GetTimeDistribute(TABLE_MONITOR, TABLE_GONGSHANG, RISK_LEVEL, ILLEGAL_SCORE, date, illegal_type, entity_type, operation_mode, warn_distribute,TABLE_ENTITY_LIST)
	return json.dumps(result,ensure_ascii=False)

@detection.route('/warnCount/')
def warn_count():
	result = getWarnCount(TABLE_MONITOR, RISK_LEVEL,ILLEGAL_SCORE)
	return json.dumps(result,ensure_ascii=False)

@detection.route('/WarnEntityCount/')
def warn_entity_count():
	result = getWarnEntityCount(TABLE_MONITOR, RISK_LEVEL, ILLEGAL_SCORE)
	return json.dumps(result,ensure_ascii=False)

@detection.route('/secondWarnCount/')
def second_warn_count():
	result = getSecondWarnCount(TABLE_MONITOR, TABLE_ENTITY_LIST, RISK_LEVEL,ILLEGAL_SCORE)
	return json.dumps(result,ensure_ascii=False)

@detection.route('/secondWarnEntityCount/')
def second_warn_entity_count():
	result = getSecondWarnEntityCount(TABLE_MONITOR, TABLE_ENTITY_LIST, RISK_LEVEL, ILLEGAL_SCORE)
	return json.dumps(result,ensure_ascii=False)

@detection.route('/minDate/')
def min_date():
	result = getMinDate(TABLE_MONITOR,RISK_LEVEL,ILLEGAL_SCORE)
	return json.dumps(result,ensure_ascii=False)

@detection.route('/newWarnEntity/')
def new_warn_entity():
	minDates = getMinDate(TABLE_MONITOR,RISK_LEVEL,ILLEGAL_SCORE)
	row_monitor_date = datetime.strptime(monitor_date,'%Y-%m-%d')
	ago7 = []
	ago30 = []
	ago90 = []
	for i,k in minDates.items():
		dateTime = datetime.strptime(k,'%Y-%m-%d')
		dValue = int((row_monitor_date-dateTime).total_seconds())/86400
		if dValue < 7 and dValue >= 0:
			ago7.append(i)
		if dValue < 30 and dValue >= 0:
			ago30.append(i)
		if dValue < 90 and dValue >= 0:
			ago90.append(i)
	result = {'count7':len(ago7),'count30':len(ago30),'count90':len(ago90)}
	return json.dumps(result,ensure_ascii=False)

@detection.route('/secondNewWarnEntity/')
def second_new_warn_entity():
	minDates = getMinDate(TABLE_MONITOR, RISK_LEVEL, ILLEGAL_SCORE)
	row_monitor_date = datetime.strptime(monitor_date,'%Y-%m-%d')
	b7 = ScalableBloomFilter(100000,0.001)
	b30 = ScalableBloomFilter(100000,0.001)
	b90 = ScalableBloomFilter(100000,0.001)
	for i,k in minDates.items():
		dateTime = datetime.strptime(k,'%Y-%m-%d')
		dValue = int((row_monitor_date-dateTime).total_seconds())/86400
		if dValue < 7 and dValue >= 0:
			[b7.add(i)]
		if dValue < 30 and dValue >= 0:
			[b30.add(i)]
		if dValue < 90 and dValue >= 0:
			[b90.add(i)]
	result90 = secondDetectData(90,TABLE_ENTITY_LIST,TABLE_MONITOR,TABLE_GONGSHANG,RISK_LEVEL,ILLEGAL_SCORE,'all',0,0,'all','all',TABLE_INDEX_QUANTILE,TABLE_GUARANTEE_PROMISE)	
	count7 = 0
	count30 = 0
	count90 = 0
	resultIds = []
	for each in result90:
		if not each['id'] in resultIds:
			resultIds.append(each['id'])
	for id in resultIds:
		if id in b7:
			count7 += 1
		if id in b30:
			print(id)
			count30 += 1
		if id in b90:
			count90 += 1
	result = {'count7':count7, 'count30':count30, 'count90':count90}
	return json.dumps(result,ensure_ascii=False)

@detection.route('/addIndustry/')
def add_industry():
	industry = request.args.get('industry','')
	uid = int(request.args.get('uid',''))
	username = request.args.get('username','')
	result = addIndustry(TABLE_INDUSTRY_LIST, TABLE_LOGS, industry, uid, username)
	return json.dumps(result,ensure_ascii=False)

@detection.route('/addFundmode/')
def add_fundmode():
	fund_mode = request.args.get('fund_mode','')
	uid = int(request.args.get('uid',''))
	username = request.args.get('username','')
	result = addFundmode(TABLE_FUNDMODE_LIST, TABLE_LOGS, fund_mode, uid, username)
	return json.dumps(result,ensure_ascii=False)

@detection.route('/IndustryBox/')
def industry_box():
	result = industryBox(TABLE_INDUSTRY_LIST)
	return json.dumps(result,ensure_ascii=False)

@detection.route('/FundmodeBox/')
def fundmode_box():
	result = fundmodeBox(TABLE_FUNDMODE_LIST)
	return json.dumps(result,ensure_ascii=False)






