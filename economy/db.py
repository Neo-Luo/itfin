#!/usr/bin/env python
# coding:utf-8
import sys
reload(sys)
sys.setdefaultencoding('utf-8')
from datetime import datetime,timedelta
import pymysql as mysql
from pybloom import ScalableBloomFilter
import time
from xpinyin import Pinyin

#conn = mysql.connect(host="0.0.0.0",user="root",password="root",db="db",charset='utf8')
conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
conn.autocommit(True)
cur = conn.cursor()
p = Pinyin()

#实体画像
def get(table1,table2,table3,table4,table5,field,operation_mode,illegal_type,entity_type,warn_distribute):
	#table1: entity_list	 table2: plat_detail 	table3: company_detail 		table4: project_detail
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()
	sql1 = "select el.id,el.entity_name,el.entity_type,el.location,pd.operation_mode,gs.province,gs.city,gs.district,pd.date,pd.illegal_type from %s as el inner join %s as pd on el.id=pd.entity_id inner join %s as gs on el.id=gs.entity_id where gs.date=(select max(date) from %s) and el.monitor_status='1' and pd.date=(select max(date) from %s as a) and pd.operation_mode=%d and pd.illegal_type=%d and el.entity_type=%d and gs.province='%s'" % (table1,table2,table5,table5,table2,operation_mode,illegal_type,entity_type,warn_distribute)
	sql2 = "select el.id,el.entity_name,el.entity_type,el.location,cd.operation_mode,gs.province,gs.city,gs.district,cd.date,cd.illegal_type from %s as el inner join %s as cd on el.id=cd.entity_id inner join %s as gs on el.id=gs.entity_id where gs.date=(select max(date) from %s) and el.monitor_status='1' and cd.date=(select max(date) from %s as a) and cd.operation_mode=%d and cd.illegal_type=%d and el.entity_type=%d and gs.province='%s'" % (table1,table3,table5,table5,table3,operation_mode,illegal_type,entity_type,warn_distribute)
	sql3 = "select el.id,el.entity_name,el.entity_type,el.location,p.operation_mode,gs.province,gs.city,gs.district,p.date,p.illegal_type from %s as el inner join %s as p on el.id=p.entity_id inner join %s as gs on el.id=gs.entity_id where gs.date=(select max(date) from %s) and el.monitor_status='1' and p.date=(select max(date) from %s as a) and p.operation_mode=%d and p.illegal_type=%d and el.entity_type=%d and gs.province='%s'" % (table1,table4,table5,table5,table4,operation_mode,illegal_type,entity_type,warn_distribute)
	if operation_mode == 0:
		sql1 = sql1.replace(' and pd.operation_mode=0','')
		sql2 = sql2.replace(' and cd.operation_mode=0','')
		sql3 = sql3.replace(' and p.operation_mode=0','')
	if illegal_type == 10000:
		sql1 = sql1.replace(' and pd.illegal_type=10000','')
		sql2 = sql2.replace(' and cd.illegal_type=10000','')
		sql3 = sql3.replace(' and p.illegal_type=10000','')
	if entity_type == 0:
		sql1 = sql1.replace(' and el.entity_type=0','')
		sql2 = sql2.replace(' and el.entity_type=0','')
		sql3 = sql3.replace(' and el.entity_type=0','')
	if warn_distribute == 'all':
		sql1 = sql1.replace(" and gs.province='all'","")
		sql2 = sql2.replace(" and gs.province='all'","")
		sql3 = sql3.replace(" and gs.province='all'","")
	cur.execute(sql1)
	res1 = cur.fetchall()
	cur.execute(sql2)
	res2 = cur.fetchall()
	cur.execute(sql3)
	res3 = cur.fetchall()
	res = res1 + res2 + res3
	if res:
		data = [{k:row[i] for i,k in enumerate(field)} for row in res]
		result = {'status':1,'data':data}
	else:
		result = {'status':0,'data':'null'}
	return result

def get_platform(table0,table,field):
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()
	sql = "select pd.id,pd.entity_name,pd.illegal_type,el.entity_type from %s as el inner join %s as pd on el.id=pd.entity_id where pd.illegal_type>0" % (table0, table)
	cur.execute(sql)
	res = cur.fetchall()
	data = [{k:row[i] for i,k in enumerate(field)} for row in res]
	return data

def get_company(table0,table,field):
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()
	sql = "select cd.id,cd.entity_name,cd.illegal_type,el.entity_type from %s as el inner join %s as cd on el.id=cd.entity_id where cd.illegal_type>0" % (table0, table)
	cur.execute(sql)
	res = cur.fetchall()
	data = [{k:row[i] for i,k in enumerate(field)} for row in res]
	return data

def get_project(table0,table,field):
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()
	sql = "select p.id,p.entity_name,p.illegal_type,el.entity_type from %s as el inner join %s as p on el.id=p.entity_id where p.illegal_type>0" % (table0, table)
	cur.execute(sql)
	res = cur.fetchall()
	data = [{k:row[i] for i,k in enumerate(field)} for row in res]
	return data

def get_monitor_count(table):
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()
	sql1 = "select count(*) from %s where monitor_status=1"%table
	cur.execute(sql1)
	res1 = cur.fetchall()[0][0]

	t = int(time.time())
	a = time.localtime(t)
	b = time.strftime("%Y-%m-%d",a)

	sql3 = "select count(*) from %s where in_time=%s and monitor_status=1"%(table, b)
	cur.execute(sql3)
	res3 = cur.fetchall()[0][0]

	dict = {'all':res1,'today':res3}
	return dict


def get_portrait(table1,table2,table3,table4,table5,field,letter):
	result = []
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()
	sql1 = "select el.id,el.entity_name,el.entity_type,el.location,pd.operation_mode,gs.province,gs.city,gs.district,pd.date,pd.illegal_type from %s as el inner join %s as pd on el.id=pd.entity_id inner join %s as gs on el.id=gs.entity_id where pd.date=gs.date and pd.date=(select max(date) from %s as a)" % (table1,table2,table5,table2)
	cur.execute(sql1)
	res1 = cur.fetchall()
	sql2 = "select el.id,el.entity_name,el.entity_type,el.location,cd.operation_mode,gs.province,gs.city,gs.district,cd.date,cd.illegal_type from %s as el inner join %s as cd on el.id=cd.entity_id inner join %s as gs on el.id=gs.entity_id where cd.date=gs.date and cd.date=(select max(date) from %s as a)" % (table1,table3,table5,table3)
	cur.execute(sql2)
	res2 = cur.fetchall()
	sql3 = "select el.id,el.entity_name,el.entity_type,el.location,p.operation_mode,gs.province,gs.city,gs.district,p.date,p.illegal_type from %s as el inner join %s as p on el.id=p.entity_id inner join %s as gs on el.id=gs.entity_id where p.date=gs.date and p.date=(select max(date) from %s as a)" % (table1,table4,table5,table4)
	cur.execute(sql3)
	res3 = cur.fetchall()
	res = res1 + res2 + res3
	data = [{k:row[i] for i,k in enumerate(field)} for row in res]
	for dict in data:
		name = p.get_initials(dict['entity_name'])
		initial = name.split('-')[0].lower()
		if initial == letter:
			result.append(dict)
		if letter == 'num':
			try:
				num = int(initial)
				result.append(dict)
			except:
				pass
	return result



#实体详情页
def platform_detail(table1,table2,table3,id,field):
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()
	sql = "select * from %s as el inner join %s as pd on el.id=pd.entity_id inner join %s as gs on el.id=gs.entity_id where el.id=%d and pd.date=(select max(date) from %s as a)" % (table1,table2,table3,id,table2)
	cur.execute(sql)
	res = cur.fetchall()
	data = [{k:str(row[i]).replace('(','').replace(')','').replace('人民币','').replace('万','').replace('元','') for i,k in enumerate(field)} for row in res]
	return data

def company_detail(table1,table2,table3,id,field):
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()
	sql = "select * from %s as el inner join %s as cd on el.id=cd.entity_id inner join %s as gs on el.id=gs.entity_id where el.id=%d and cd.date=(select max(date) from %s as a)" % (table1,table2,table3,id,table2)
	cur.execute(sql)
	res = cur.fetchall()
	data = [{k:str(row[i]).replace('(','').replace(')','').replace('人民币','').replace('万','').replace('元','') for i,k in enumerate(field)} for row in res]
	return data

def project_detail(table1,table2,table3,id,field):
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()
	sql = "select * from %s as el inner join %s as p on el.id=p.entity_id inner join %s as gs on el.id=gs.entity_id where el.id=%d and p.date=(select max(date) from %s as a)" % (table1,table2,table3,id,table2)
	cur.execute(sql)
	res = cur.fetchall()
	data = [{k:str(row[i]).replace('(','').replace(')','').replace('人民币','').replace('万','').replace('元','') for i,k in enumerate(field)} for row in res]
	return data


def get_ad(table,id,field):
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()
	sql = "select * from %s where entity_id=%d and date <= (select max(date) from %s as a)" % (table,id,table)
	cur.execute(sql)
	res = cur.fetchall()
	data = [{k:row[i] for i,k in enumerate(field)} for row in res]
	return data

def get_comment(table,id,field):
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()
	sql = "select * from %s where entity_id=%d and date <= (select max(date) from %s as a)" % (table,id,table)
	cur.execute(sql)
	res = cur.fetchall()
	data = [{k:row[i] for i,k in enumerate(field)} for row in res]
	return data

def get_gongshang(table,id,field):
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()
	sql = "select * from %s where entity_id=%d and date=(select max(date) from %s as a)" % (table,id,table)
	cur.execute(sql)
	res = cur.fetchall()
	data = [{k:row[i] for i,k in enumerate(field)} for row in res]
	return data

def get_guarantee(table,id,field):
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()
	sql = "select * from %s where entity_id=%d and date=(select max(date) from %s as a)" % (table,id,table)
	cur.execute(sql)
	res = cur.fetchall()
	data = [{k:row[i] for i,k in enumerate(field)} for row in res]
	return data

def get_return_rate(table1,table2,id,field):
	#table1: return_rate 	table2: plat/company/project_detail
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()
	sql = "select a.id,a.entity_id,a.entity_name,a.date,a.return_type,a.return_rate,a.related_text,a.index_name,a.text_id,a.rule_id,b.avg_return from %s as a inner join %s as b on a.entity_id=b.entity_id where a.entity_id=%d and a.date=(select max(date) from %s as a)" % (table1,table2,id,table1)
	cur.execute(sql)
	res = cur.fetchall()
	data = [{k:row[i] for i,k in enumerate(field)} for row in res]
	return data


def get_risk_comment_table(table1,table2,table3,entity_id,type,field):
	result = []
	dict = {}
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()
	if type == 1:
		sql = "select date,illegal_type from %s where illegal_type>0 and entity_id=%d order by date desc"%(table1,entity_id)
		cur.execute(sql)
		res = cur.fetchall()
		result = [{k:row[i] for i,k in enumerate(field)} for row in res]

		sql = "select count(*) from %s where illegal_type>0 and entity_id=%d order by date desc"%(table1,entity_id)
		cur.execute(sql)
		res = cur.fetchall()[0][0]
		dict = {res:result}

	if type == 2:
		sql = "select date,illegal_type from %s where illegal_type>0 and entity_id=%d order by date desc"%(table2,entity_id)
		cur.execute(sql)
		res = cur.fetchall()
		result = [{k:row[i] for i,k in enumerate(field)} for row in res]

		sql = "select count(*) from %s where illegal_type>0 and entity_id=%d order by date desc"%(table2,entity_id)
		cur.execute(sql)
		res = cur.fetchall()[0][0]
		dict = {res:result}

	if type == 3:
		sql = "select date,illegal_type from %s where illegal_type>0 and entity_id=%d order by date desc"%(table2,entity_id)
		cur.execute(sql)
		res = cur.fetchall()
		result = [{k:row[i] for i,k in enumerate(field)} for row in res]

		sql = "select count(*) from %s where illegal_type>0 and entity_id=%d order by date desc"%(table3,entity_id)
		cur.execute(sql)
		res = cur.fetchall()[0][0]
		dict = {res:result}
	return dict



#监测预警
def getDetectData(date,table1,table2,table3,field,risk_level,operation_mode,illegal_type,entity_type,warn_distribute):
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()
	sql = "select max(date) from %s"%table3
	cur.execute(sql)
	end_time = cur.fetchall()[0][0]
	start_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=int(date))
	start_time = start_time.strftime("%Y-%m-%d")
	sql1 = "select el.id,el.entity_name,el.entity_type,el.location,pd.operation_mode,gs.province,gs.city,gs.district,pd.illegal_type,pd.date from %s as el inner join %s as pd on el.id=pd.entity_id inner join %s as gs on el.id=gs.entity_id where gs.date=(select max(date) from gongshang_daily) and pd.date>'%s' and pd.date<='%s' and el.monitor_status='1' and pd.illegal_type>0 and pd.risk_level>%d and pd.operation_mode=%d and pd.illegal_type=%d and pd.entity_type=%d and gs.province='%s' order by pd.date desc" % (table1, table2, table3, start_time, end_time, risk_level, operation_mode, illegal_type, entity_type, warn_distribute)

	if operation_mode == 0:
		sql1 = sql1.replace(' and pd.operation_mode=0','')
	if illegal_type == 0:
		sql1 = sql1.replace(' and pd.illegal_type=0','')
	if entity_type == 0:
		sql1 = sql1.replace(' and pd.entity_type=0','')
	if warn_distribute == 'all':
		sql1 = sql1.replace(" and gs.province='all'","")

	cur.execute(sql1)
	res = cur.fetchall()
	result = [{k:row[i] for i,k in enumerate(field)} for row in res]
	return result
	'''演示版
	list = [u"绿能宝",u"亿好金服",u"速溶360",u"鑫脉财富",u"太保金服",u"穆金所",u"升隆财富",u"邑民金融"]
	list1 = [""]*8
	list2 = []
	filter_list = []
	for r in result:
		if not r['entity_name'] in filter_list and r['entity_name'] in list:
			for item in range(len(list)):
				if r['entity_name'] in list[item]:
					list1[item] = r
					filter_list.append(r['entity_name'])
		else:
			list2.append(r)
'''

def getDetectRank(table, date, field, risk_level, entity_type):
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()
	sql = "select max(date) from %s"%table
	cur.execute(sql)
	end_time = cur.fetchall()[0][0]
	start_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=int(date))
	start_time = start_time.strftime("%Y-%m-%d")

	sql = 'select entity_id,entity_name,max(risk_level) from %s where date>"%s" and date<="%s" and illegal_type>0 and risk_level>%d and entity_type=%d group by entity_id order by sum(risk_level) desc'%(table, start_time, end_time, risk_level, entity_type)
	if entity_type == 0:
		sql = sql.replace(' and entity_type=0','')
	cur.execute(sql)
	res = cur.fetchall()
	result = [{k:row[i] for i,k in enumerate(field)} for row in res]
	return result

def getDetectDistribute(date,table,table4,field,risk_level):
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()
	sql = "select max(date) from %s"%table
	cur.execute(sql)
	end_time = cur.fetchall()[0][0]
	start_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=int(date))
	start_time = start_time.strftime("%Y-%m-%d")
	province_list = []
	list = []
	sql1 = 'select pd.illegal_type,gs.province,gs.city,count(*) from %s as pd inner join %s as gs on pd.entity_id=gs.entity_id where pd.date>"%s" and pd.date<="%s" and pd.illegal_type=1 and pd.risk_level>%d and gs.date=(select max(date) from %s) group by province,city'%(table,table4,start_time,end_time,risk_level,table4)
	sql2 = 'select pd.illegal_type,gs.province,gs.city,count(*) from %s as pd inner join %s as gs on pd.entity_id=gs.entity_id where pd.date>"%s" and pd.date<="%s" and pd.illegal_type=2 and pd.risk_level>%d and gs.date=(select max(date) from %s) group by province,city'%(table,table4,start_time,end_time,risk_level,table4)
	sql3 = 'select pd.illegal_type,gs.province,gs.city,count(*) from %s as pd inner join %s as gs on pd.entity_id=gs.entity_id where pd.date>"%s" and pd.date<="%s" and pd.illegal_type=3 and pd.risk_level>%d and gs.date=(select max(date) from %s) group by province,city'%(table,table4,start_time,end_time,risk_level,table4)
	cur.execute(sql1)
	res1 = cur.fetchall()
	result1 = [{k:row[i] for i,k in enumerate(field)} for row in res1]
	cur.execute(sql2)
	res2 = cur.fetchall()
	result2 = [{k:row[i] for i,k in enumerate(field)} for row in res2]
	cur.execute(sql3)
	res3 = cur.fetchall()
	result3 = [{k:row[i] for i,k in enumerate(field)} for row in res3]
	result = result1 + result2 + result3
	b = ScalableBloomFilter(1000000,0.001)
	for p in result:
		if p['city']:
			if not p['city'] in b:
				[b.add(p['city'])]
				province_list.append({'province':p['province'],'city':p['city']})
	for d in province_list:
		pro_dict = {"province":d['province'],"city":d['city']}
		for dict in result:
			if dict['city'] == d['city']:
				if dict['illegal_type'] == 1:
					pro_dict.update({'count1':dict['count']})
				elif dict['illegal_type'] == 2:
					pro_dict.update({'count2':dict['count']})
				elif dict['illegal_type'] == 3:
					pro_dict.update({'count3':dict['count']})
		pro_dict.update({'count1':0,'count3':0}) # 空数据报错。记得删掉
		pro_dict.update({'sum':pro_dict['count1']+pro_dict['count2']+pro_dict['count3']})
		list.append(pro_dict)
	return list

def getWarnCount(table,risk_level):
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()
	sql = "select max(date) from %s"%table
	cur.execute(sql)
	end_time = cur.fetchall()[0][0]
	start0_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=7)
	start1_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=30)
	start2_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=90)
	start_time0 = start0_time.strftime("%Y-%m-%d")
	start_time1 = start1_time.strftime("%Y-%m-%d")
	start_time2 = start2_time.strftime("%Y-%m-%d")
	sql01 = "select count(*) from %s where illegal_type>0 and risk_level>%d and date>'%s' and date<='%s'"%(table,risk_level,start_time0,end_time)
	sql02 = "select count(*) from %s where illegal_type>0 and risk_level>%d and date>'%s' and date<='%s'"%(table,risk_level,start_time1,end_time)
	sql03 = "select count(*) from %s where illegal_type>0 and risk_level>%d and date>'%s' and date<='%s'"%(table,risk_level,start_time2,end_time)
	cur.execute(sql01)
	c01 = cur.fetchall()[0][0]
	cur.execute(sql02)
	c02 = cur.fetchall()[0][0]
	cur.execute(sql03)
	c03 = cur.fetchall()[0][0]
	count_7 = int(c01)
	count_30 = int(c02)
	count_90 = int(c03)
	dict = {'seven':count_7,'thirty':count_30,'ninty':count_90}
	return dict


def getWarnType(table, risk_level, date, field):
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()
	sql = 'select max(date) from %s'%table
	cur.execute(sql)
	end_time = cur.fetchall()[0][0]
	start_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=date)
	start_time = start_time.strftime("%Y-%m-%d")
	sql = 'select illegal_type,count(*) from %s where risk_level>%d and date>"%s" and date<="%s" group by illegal_type'%(table, risk_level, start_time, end_time)
	cur.execute(sql)
	res = cur.fetchall()
	data = [{k:row[i] for i,k in enumerate(field)} for row in res]
	return data


# 首页
def h_getWarnCount(table, field, risk_level):
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()
	sql = "select max(date) from %s"%table
	cur.execute(sql)
	end_time = cur.fetchall()[0][0]
	start_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=7)
	start_time = start_time.strftime("%Y-%m-%d")
	sql = 'select count(*) from %s where illegal_type>0 and risk_level>%d and date>"%s" and date<="%s" group by entity_type'%(table,risk_level,start_time,end_time)
	cur.execute(sql)
	'''没数据报错
	res = cur.fetchall()
	data = [{k:row[i] for i,k in enumerate(field)} for row in res][0]
	'''
	res = cur.fetchall()[0][0]
	data = [{'plat':res,'com':0,'pro':0}][0]
	return data


def get_city_rank(table,table4,field,province_name,risk_level):
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()
	city_list = []
	list = []
	province_list = []
	sql = "select max(date) from %s"%table
	cur.execute(sql)
	end_time = cur.fetchall()[0][0]
	start_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=7)
	start_time = start_time.strftime("%Y-%m-%d")
	start1_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=30)
	start_time1 = start1_time.strftime("%Y-%m-%d")
	sql1 = 'select pd.illegal_type,gs.province,gs.city,count(*) from %s as pd inner join %s as gs on pd.entity_id=gs.entity_id where gs.date=(select max(date) from %s) and pd.date>"%s" and pd.date<="%s" and illegal_type>0 and risk_level>%d group by province,city'%(table,table4,table4,start_time,end_time,risk_level)
	cur.execute(sql1)
	res1 = cur.fetchall()
	result1 = [{k:row[i] for i,k in enumerate(field)} for row in res1]
	sql2 = 'select pd.illegal_type,gs.province,gs.city,count(*) from %s as pd inner join %s as gs on pd.entity_id=gs.entity_id where gs.date=(select max(date) from %s) and pd.date>"%s" and pd.date<="%s" and illegal_type>0 and risk_level>%d group by province,city'%(table,table4,table4,start_time1,end_time,risk_level)
	cur.execute(sql2)
	res2 = cur.fetchall()
	result2 = [{k:row[i] for i,k in enumerate(field)} for row in res2]
	result = result1 + result2
	b = ScalableBloomFilter(1000000,0.001)
	for p in result:
		if not p['city'] in b:
			[b.add(p['city'])]
			city_list.append({'province':p['province'],'city':p['city']})
	for d in city_list:
		if not d['province'] in province_list:
			province_list.append(d['province'])
	if province_name:
		for d in city_list:
			if d['province'] == province_name and d['city']:
				pro_dict = {"province":d['province'],"city":d['city']}
				for dict in result1:
					if dict['city'] == d['city']:
						pro_dict.update({'count7':dict['count']})
				for dict in result2:
					if dict['city'] == d['city']:
						pro_dict.update({'count30':dict['count']})
				list.append(pro_dict)
	if not province_name:
		for p in province_list:
			if p:
				pro_dict = {"province":p}
				count = 0
				for dict in result1:
					if dict['province'] == p:
						count += dict['count']
				pro_dict.update({"count":count})
				list.append(pro_dict)
	return list


def get_province_rank(table,table4,field,risk_level):
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()
	list = []
	province_list = []
	sql = "select max(date) from %s"%table
	cur.execute(sql)
	end_time = cur.fetchall()[0][0]
	start0_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=7)
	start1_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=30)
	start_time0 = start0_time.strftime("%Y-%m-%d")
	start_time1 = start1_time.strftime("%Y-%m-%d")
	sql1 = 'select gs.province,count(*) from %s as pd inner join %s as gs on pd.entity_id=gs.entity_id where gs.date=(select max(date) from %s) and pd.date>"%s" and pd.date<="%s" and illegal_type>0 and risk_level>%d group by province'%(table,table4,table4,start_time0,end_time, risk_level)
	cur.execute(sql1)
	res1 = cur.fetchall()
	result1 = [{k:row[i] for i,k in enumerate(field)} for row in res1]
	sql2 = 'select gs.province,count(*) from %s as pd inner join %s as gs on pd.entity_id=gs.entity_id where gs.date=(select max(date) from %s) and pd.date>"%s" and pd.date<="%s" and illegal_type>0 and risk_level>%d group by province'%(table,table4,table4,start_time1,end_time, risk_level)
	cur.execute(sql2)
	res2 = cur.fetchall()
	result2 = [{k:row[i] for i,k in enumerate(field)} for row in res2]
	result = result1 + result2
	b = ScalableBloomFilter(1000000,0.001)
	for p in result:
		if not p['province'] in b:
			[b.add(p['province'])]
			province_list.append(p['province'])
	for d in province_list:
		if d:
			pro_dict = {"province":d}
			for dict in result1:
				if dict['province'] == d:
					pro_dict.update({'count7':dict['count']})
			for dict in result2:
				if dict['province'] == d:
					pro_dict.update({'count30':dict['count']})
			list.append(pro_dict)
	for li in list:
		try:
			if li['count7']:
				pass
		except:
			li['count7'] = 0
	return list


def getTimeDistribute(table,risk_level):
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()
	list = []
	count_list = []
	sql = "select max(date) from %s"%table
	cur.execute(sql)
	end_time = cur.fetchall()[0][0]
	time_list = []
	for i in range(0,30):
		start_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=i)
		start_time = start_time.strftime("%Y-%m-%d")
		time_list.append(start_time)
	for i,time in enumerate(time_list):
		sql1 = "select count(*) from %s where date='%s' and illegal_type>0 and risk_level>%d"%(table,time,risk_level)
		cur.execute(sql1)
		result = cur.fetchall()[0][0]
		dict = {'time':time,'count':result}
		list.append(dict)
	return list



#感知入库
def get_perceive_data(table,field):
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()

	sql = 'select * from %s group by entity_name order by date desc'%table
	cur.execute(sql)
	res = cur.fetchall()
	result = [{k:row[i] for i,k in enumerate(field)} for row in res]
	return result


def p_getWarnCount(table,field):
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()

	#sql1 = "select count(*) from %s where entity_type=1 group by entity_name"%table
	#sql2 = "select count(*) from %s where entity_type=2 group by entity_name"%table
	#sql3 = "select count(*) from %s where entity_type=3 group by entity_name"%table

	#cur.execute(sql1)
	#res1 = cur.fetchall()[0][0]
	#cur.execute(sql2)
	#res2 = cur.fetchall()[0][0]
	#cur.execute(sql3)
	#res3 = cur.fetchall()[0][0]
	#dict = {'platform':res1,'company':res2,'project':res3}
	#return dict

	sql = 'select entity_type,count(*) from %s where date=(select max(date) from sensor_daily as sd) group by entity_type'%table
	cur.execute(sql)
	res = cur.fetchall()
	result = [{k:row[i] for i,k in enumerate(field)} for row in res]
	return result



#下拉框
def operationModeBox(table, field):
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()

	sql = 'select * from %s'%table
	cur.execute(sql)
	res = cur.fetchall()
	data = [{k:row[i] for i,k in enumerate(field)} for row in res]
	return data

def illegalTypeBox(table, field):
	conn = mysql.connect(host="219.224.134.214",user="root",password="",db="itfin",charset='utf8')
	conn.autocommit(True)
	cur = conn.cursor()

	sql = 'select * from %s'%table
	cur.execute(sql)
	res = cur.fetchall()
	data = [{k:row[i] for i,k in enumerate(field)} for row in res]
	return data



