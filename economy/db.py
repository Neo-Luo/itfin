#!/usr/bin/env python
# coding:utf-8
import sys
reload(sys)
sys.setdefaultencoding('utf-8')
from datetime import datetime,timedelta
import pymysql as mysql
import pymysql.cursors
from pybloom import ScalableBloomFilter
import time
from xpinyin import Pinyin
from economy.config import *

p = Pinyin()
def defaultDatabase():
	conn = mysql.connect(host=HOST,user=USER,password=PASSWORD,db=DEFAULT_DB,charset=CHARSET,cursorclass=pymysql.cursors.DictCursor)
	conn.autocommit(True)
	cur = conn.cursor()
	return cur

def testDatabase():
	conn = mysql.connect(host=HOST,user=USER,password=PASSWORD,db=TEST_DB,charset=CHARSET,cursorclass=pymysql.cursors.DictCursor)
	conn.autocommit(True)
	cur = conn.cursor()
	return cur


#最大日期
def MaxDate(table):
	cur = defaultDatabase()
	sql = 'select * from %s'%table
	cur.execute(sql)
	data = cur.fetchone()
	return data

TABLE_DATE = MaxDate(TABLE_DATE_LIST)
plat_date = TABLE_DATE['plat_date']
monitor_date = TABLE_DATE['monitor_date']
gongshang_date = TABLE_DATE['gongshang_date']
ad_date = TABLE_DATE['ad_date']
comment_date = TABLE_DATE['comment_date']
return_date = TABLE_DATE['return_date']
promise_date = TABLE_DATE['promise_date']
quantile_date = TABLE_DATE['quantile_date']


#实体画像
def get(table1,table2,table5,operation_mode,illegal_type,entity_type,warn_distribute,problem,table6,table7):
	cur = defaultDatabase()
	sql1 = "select el.id,el.entity_name,el.entity_type,el.operation_mode,gs.province,gs.city,gs.district,pd.date,pd.illegal_type,el.entity_source,el.problem,qu.return_rank,qu.comment_rank,qu.ad_rank,qu.suit_rank,qu.abnor_rank,pro.promise_type,el.monitor_status from %s as el inner join %s as pd on el.id=pd.entity_id inner join %s as gs on el.id=gs.entity_id inner join %s as qu on el.id=qu.entity_id inner join %s as pro on el.id=pro.entity_id where qu.date='%s' and pro.date='%s' and gs.date='%s' and el.monitor_status>=1 and pd.date='%s' and pd.illegal_type=%d and el.entity_type=%d and gs.province='%s'" % (table1, table2, table5, table6, table7, quantile_date, promise_date, gongshang_date, plat_date, illegal_type, entity_type, warn_distribute)
	if operation_mode == 'all':
		sql1 = sql1.replace(" and el.operation_mode='all'","")
	if illegal_type == 10000:
		sql1 = sql1.replace(' and pd.illegal_type=10000','')
	if entity_type == 0:
		sql1 = sql1.replace(' and el.entity_type=0','')
	if warn_distribute == 'all':
		sql1 = sql1.replace(" and gs.province='all'","")
	if not problem == 'all':
		if problem == u'无':
			sql1 = sql1 + " and el.problem is null or el.problem=''"
		else:
			sql1 = sql1 + " and el.problem like '%%%s%%'"%problem
	if not operation_mode == 'all':
		sql1 = sql1 + " and el.operation_mode like '%%%s%%'"%operation_mode
	cur.execute(sql1)
	res1 = cur.fetchall()
	if res1:
		result = {'status':1,'data':res1}
	else:
		result = {'status':1,'data':[]}
	return result


def entityCount(table1,table2,table5,operation_mode,illegal_type,entity_type,warn_distribute):
	cur = defaultDatabase()
	sql01 = "select count(*) from %s as el inner join %s as pd on el.id=pd.entity_id inner join %s as gs on el.id=gs.entity_id where gs.date='%s' and el.monitor_status>=1 and pd.date='%s' and pd.operation_mode=%d and pd.illegal_type=%d and el.entity_type=%d and gs.province='%s'" % (table1,table2,table5,gongshang_date,plat_date,operation_mode,illegal_type,entity_type,warn_distribute)
	if operation_mode == 0:
		sql01 = sql01.replace(' and pd.operation_mode=0','')
	if illegal_type == 10000:
		sql01 = sql01.replace(' and pd.illegal_type=10000','')
	if entity_type == 0:
		sql01 = sql01.replace(' and el.entity_type=0','')
	if warn_distribute == 'all':
		sql01 = sql01.replace(" and gs.province='all'","")
	cur.execute(sql01)
	platCount = cur.fetchone()['count(*)']
	dict = {"resultsCount":platCount}
	return dict

def diviPage(table1,table2,table3,table4,table5,operation_mode,illegal_type,entity_type,warn_distribute,page_number,page_size):
	cur = defaultDatabase()
	begin = (page_number - 1) * page_size

	sql1 = "select el.id,el.entity_name,el.entity_type,pd.operation_mode,gs.province,gs.city,gs.district,pd.date,pd.illegal_type from %s as el inner join %s as pd on el.id=pd.entity_id inner join %s as gs on el.id=gs.entity_id where gs.date='%s' and el.monitor_status>=1 and pd.date='%s' and pd.operation_mode=%d and pd.illegal_type=%d and el.entity_type=%d and gs.province='%s' limit %d,%d" % (table1,table2,table5,gongshang_date,plat_date,operation_mode,illegal_type,entity_type,warn_distribute,begin,page_size)
	if operation_mode == 0:
		sql1 = sql1.replace(' and pd.operation_mode=0','')
	if illegal_type == 10000:
		sql1 = sql1.replace(' and pd.illegal_type=10000','')
	if entity_type == 0:
		sql1 = sql1.replace(' and el.entity_type=0','')
	if warn_distribute == 'all':
		sql1 = sql1.replace(" and gs.province='all'","")

	cur.execute(sql1)
	data = cur.fetchall()
	return data


def get_platform(table):
	cur = defaultDatabase()
	sql = "select entity_id,entity_name,illegal_type,entity_type from %s where illegal_type>0 and entity_type=1 and date='%s'"%(table,monitor_date)
	cur.execute(sql)
	data = cur.fetchall()
	cur.close()
	return data

def get_company(table):
	cur = defaultDatabase()
	sql = "select entity_id,entity_name,illegal_type,entity_type from %s where illegal_type>0 and entity_type=2 and date='%s'"%(table,monitor_date)
	cur.execute(sql)
	data = cur.fetchall()
	cur.close()
	return data

def get_project(table):
	cur = defaultDatabase()
	sql = "select entity_id,entity_name,illegal_type,entity_type from %s where illegal_type>0 and entity_type=3 and date='%s'"%(table,monitor_date)
	cur.execute(sql)
	data = cur.fetchall()
	cur.close()
	return data

def get_monitor_count(table):
	cur = defaultDatabase()
	sql1 = "select count(*) from %s where monitor_status>=1"%table
	cur.execute(sql1)
	res1 = cur.fetchone()['count(*)']
	t = int(time.time())
	a = time.localtime(t)
	b = time.strftime("%Y-%m-%d",a)
	sql3 = "select count(*) from %s where in_time=%s and monitor_status>=1"%(table, b)
	cur.execute(sql3)
	res3 = cur.fetchone()['count(*)']
	dict = {'all':res1,'today':res3}
	cur.close()
	return dict


def get_portrait(table1,table2,table5,letter):
	result = []
	cur = defaultDatabase()
	sql1 = "select el.id,el.entity_name,el.entity_type,el.operation_mode,gs.province,gs.city,gs.district,pd.date,pd.illegal_type,el.entity_source,el.problem from %s as el inner join %s as pd on el.id=pd.entity_id inner join %s as gs on el.id=gs.entity_id where gs.date='%s' and pd.date='%s'" % (table1,table2,table5,gongshang_date,plat_date)
	cur.execute(sql1)
	data = cur.fetchall()
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
	cur.close()
	return result



#实体详情页
def platform_detail(table1,table2,table3,table4,id):
	cur = defaultDatabase()
	sql = "select * from %s as el inner join %s as pd on el.id=pd.entity_id inner join %s as gs on el.id=gs.entity_id inner join %s as m on el.id=m.entity_id where el.id=%d and gs.date='%s' and m.date='%s' and pd.date='%s'" % (table1,table2,table3,table4,id,gongshang_date,monitor_date,plat_date)
	cur.execute(sql)
	data = cur.fetchall()
	cur.close()
	return data

def get_ad(table,id):
	cur = defaultDatabase()
	sql = "select * from %s where entity_id=%d and date <= '%s' order by date asc" % (table, id, ad_date)
	cur.execute(sql)
	data = cur.fetchall()
	k_list = []
	except_list = ['id', 'entity_id', 'entity_name', 'date', 'ad0_bbs', 'ad0_zhihu', 'ad0_forum', 'ad0_webo', 'ad0_wechat']
	for d in data:
	    for k in d.keys():
			if not k in except_list:
				if not k in k_list:
					k_list.append(k)
	number = 0
	for dict in data:
		for key in k_list:
			number += dict[key]
	if number == 0:
		data = []
	cur.close()
	return data

def get_comment(table,id):
	cur = defaultDatabase()
	sql = "select * from %s where entity_id=%d and date <= '%s' order by date asc" % (table,id,comment_date)
	cur.execute(sql)
	data = cur.fetchall()
	cur.close()
	return data

def get_gongshang(table,id):
	cur = defaultDatabase()
	sql = "select * from %s where entity_id=%d and date='%s'" % (table,id,gongshang_date)
	cur.execute(sql)
	data = cur.fetchall()
	cur.close()
	return data

def get_guarantee(table,id):
	cur = defaultDatabase()
	sql = "select * from %s where entity_id=%d and date='%s'" % (table,id,promise_date)
	cur.execute(sql)
	data = cur.fetchall()
	cur.close()
	return data

def get_return_rate(table1,table2,id):
	cur = defaultDatabase()
	sql = "select a.id,a.entity_id,a.entity_name,a.date,a.return_type,a.return_rate,a.related_text,a.index_name,a.text_id,a.rule_id,b.avg_return from %s as a inner join %s as b on a.entity_id=b.entity_id where a.entity_id=%d and a.date='%s' and b.date='%s'" % (table1,table2,id,return_date,plat_date)
	cur.execute(sql)
	data = cur.fetchall()
	cur.close()
	return data


def get_risk_comment_table(table,entity_id,illegal_type,illegal_score):
	cur = defaultDatabase()
	result = []
	dict = {}
	sql = "select date,illegal_type from %s where illegal_type>%d and illegal_score>=%d and entity_id=%d order by date desc"%(table,illegal_type,illegal_score,entity_id)
	cur.execute(sql)
	result = cur.fetchall()
	sql = "select count(*) from %s where illegal_type>%d and illegal_score>=%d and entity_id=%d order by date desc"%(table,illegal_type,illegal_score,entity_id)
	cur.execute(sql)
	res = cur.fetchone()['count(*)']
	dict = {res:result}
	cur.close()
	return dict


def EditDetail(table, table1, table2, dict):
	cur = defaultDatabase()
	sql = 'update %s as a inner join %s as b on a.entity_id=b.entity_id inner join %s as el on a.entity_id=el.id set el.operation_mode="%s",b.regist_address="%s",b.set_time="%s",b.legal_person="%s",b.capital="%s",a.company="%s" where a.entity_id=%d and a.date="%s" and b.date="%s"'%(table1,table2,table,dict['operation_mode'],dict['regist_address'],dict['set_time'],dict['legal_person'],dict['capital'],dict['company'],dict['entity_id'],dict['date'],dict['gs_date'])
	if "null" in [each for each in dict.values()]:
		sql = sql.replace('"null"','null')
	cur.execute(sql)
	dict = {'status':'ok'}
	cur.close()
	return dict


def EditReturnRate(table,return_rate,entity_id):
	cur = defaultDatabase()
	rate = float(return_rate/100.0)
	sql = 'update %s set return_rate=%.4f,status=1 where entity_id=%d'%(table,rate,entity_id)
	cur.execute(sql)
	dict = {'status':'ok'}
	cur.close()
	return dict


def EditRelatedPlat(table,entity_id,related_plat,date):
	cur = defaultDatabase()
	related_plat = related_plat.replace('，','')
	sql = 'update %s set related_plat="%s" where entity_id=%d and date="%s"'%(table,related_plat,entity_id,date)
	cur.execute(sql)
	dict = {'status':'ok'}
	cur.close()
	return dict


def EditRelatedCompany(table,entity_id,related_company,date):
	cur = defaultDatabase()
	related_company = related_company.replace('，','')
	sql = 'update %s set related_company="%s" where entity_id=%d and date="%s"'%(table,related_company,entity_id,date)
	cur.execute(sql)
	dict = {'status':'ok'}
	cur.close()
	return dict


def MonitorStatus(table1, table, entity_name, log_type, remark, uid, entity_id, date, username):
	cur = defaultDatabase()
	datetime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(int(time.time())))
	if log_type == 1:
		log_detail = "停止检测：" + entity_name + "," + str(entity_id) + "," + date
		monitor_status = 2
		sql0 = 'update %s set monitor_status=%d where entity_name="%s"'%(table1, monitor_status, entity_name)
		cur.execute(sql0)
		sql = 'insert into %s(datetime,user_id,username,log_type,log_detail,remark,entity_id) values("%s",%d,"%s",%d,"%s","%s",%d)'%(table, datetime, uid, username, log_type, log_detail, remark, entity_id)
		cur.execute(sql)
	elif log_type == 2:
		log_detail = "恢复监测：" + entity_name + "," + str(entity_id) + "," + date
		monitor_status = 1
		sql0 = 'update %s set monitor_status=%d where entity_name="%s"'%(table1, monitor_status, entity_name)
		cur.execute(sql0)
		sql = 'insert into %s(datetime,user_id,username,log_type,log_detail,remark,entity_id) values("%s",%d,"%s",%d,"%s","%s",%d)'%(table, datetime, uid, username, log_type, log_detail, remark, entity_id)
		cur.execute(sql)
	dict = {'status':'ok'}
	cur.close()
	return dict


def getQuantile(table, entity_id):
	cur = defaultDatabase()
	sql = 'select * from %s where date="%s" and entity_id=%d' % (table, quantile_date, entity_id)
	cur.execute(sql)
	data = cur.fetchall()
	cur.close()
	return data


def editProblem(table1, table2, entity_id, uid, entity_name, remark, date, oldValue, newValue, username):
	t = int(time.time())
	datetime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(t))
	log_type = 5
	log_detail = u'修改问题平台' + ':' + str(entity_id) + ',' + entity_name + ',' + date
	cur = defaultDatabase()
	#修改entity_list中的problem
	sql1 = 'update %s set problem="%s" where id=%d' % (table1, newValue, entity_id)
	cur.execute(sql1)
	#加入日志
	sql2 = 'insert into %s (datetime, user_id, username, log_type, log_detail, remark, entity_id, oldValue, newValue) values ("%s", %d, "%s", %d, "%s", "%s", %d, "%s", "%s")' % (table2, datetime, uid, username, log_type, log_detail, remark, entity_id, oldValue, newValue)
	cur.execute(sql2)
	dict = {'status':'ok'}
	cur.close()
	return dict


def addProblem(table, table1, problem, uid, username):
	t = int(time.time())
	datetime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(t))
	log_type = 6
	log_detail = u'添加问题平台' + ':' + str(uid)
	cur = defaultDatabase()
	sql = 'insert into %s (problem) values ("%s")' % (table, problem)
	cur.execute(sql)
	#加入日志
	sql1 = 'insert into %s (datetime, user_id, username, log_type, log_detail) values ("%s", %d, "%s", %d, "%s")' % (table1, datetime, uid, username, log_type, log_detail)
	cur.execute(sql1)
	dict = {'status':'ok'}
	cur.close()
	return dict



#监测预警
def totalDetectData(date,table1,table2,table3,risk_level,illegal_score,operation_mode,illegal_type,entity_type,warn_distribute,problem,table4,table5):
	cur = defaultDatabase()
	end_time = monitor_date
	start_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=int(date))
	start_time = start_time.strftime("%Y-%m-%d")
	sql1 = "select el.id,el.entity_name,el.entity_type,el.operation_mode,gs.province,gs.city,gs.district,pd.illegal_type,pd.date,el.support_num,el.against_num,el.entity_source,el.problem,pd.illegal_score,qu.return_rank,qu.comment_rank,qu.ad_rank,qu.suit_rank,qu.abnor_rank,pro.promise_type,el.monitor_status,el.risk_rank,el.industry,el.fund_mode from %s as el inner join %s as pd on pd.entity_id=el.id and pd.date>'%s' and pd.date<='%s' and pd.illegal_type>0 and pd.risk_level>%d and pd.illegal_score>=%d and pd.illegal_type=%d and pd.entity_type=%d inner join %s as gs on gs.entity_id=el.id and gs.date='%s' and gs.province='%s' inner join %s as qu on qu.entity_id=el.id and qu.date='%s' inner join %s as pro on pro.entity_id=el.id and pro.date='%s' where el.monitor_status>=1 order by pd.date desc,pd.illegal_score desc,el.id desc" % (table1, table2, start_time, end_time, risk_level, illegal_score, illegal_type, entity_type, table3, gongshang_date, warn_distribute, table4, quantile_date, table5, promise_date)
	if not operation_mode == 'all':
		sql1 = sql1.replace(" order"," and el.operation_mode like '%%%s%%' order"%operation_mode)
	if illegal_type == 0:
		sql1 = sql1.replace(' and pd.illegal_type=0','')
	if entity_type == 0:
		sql1 = sql1.replace(' and pd.entity_type=0','')
	if warn_distribute == 'all':
		sql1 = sql1.replace(" and gs.province='all'","")
	if not problem == 'all':
		if problem == u'无':
			sql1 = sql1.replace(" order"," and el.problem is null or el.problem='' order")
		else:
			sql1 = sql1.replace(" order"," and el.problem like '%%%s%%' order"%problem)
	cur.execute(sql1)
	result = cur.fetchall()
	cur.close()
	return result


def secondDetectData(date,table1,table2,table3,risk_level,illegal_score,operation_mode,illegal_type,entity_type,warn_distribute,problem,table4,table5):
	cur = defaultDatabase()
	end_time = monitor_date
	start_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=int(date))
	start_time = start_time.strftime("%Y-%m-%d")
	sql1 = "select el.id,el.entity_name,el.entity_type,el.operation_mode,gs.province,gs.city,gs.district,pd.illegal_type,pd.date,el.support_num,el.against_num,el.entity_source,el.problem,pd.illegal_score,qu.return_rank,qu.comment_rank,qu.ad_rank,qu.suit_rank,qu.abnor_rank,pro.promise_type,el.monitor_status,el.risk_rank,el.industry,el.fund_mode from %s as el inner join %s as pd on el.id=pd.entity_id inner join %s as gs on el.id=gs.entity_id inner join %s as qu on el.id=qu.entity_id inner join %s as pro on el.id=pro.entity_id where pro.date='%s' and qu.date='%s' and el.support_num>0 and el.against_num=0 and gs.date='%s' and pd.date>'%s' and pd.date<='%s' and el.monitor_status>=1 and pd.illegal_type>0 and pd.risk_level>%d and pd.illegal_score>=%d and pd.illegal_type=%d and pd.entity_type=%d and gs.province='%s' order by pd.date desc,pd.illegal_score desc,el.support_num desc,el.id desc" % (table1, table2, table3, table4, table5, promise_date, quantile_date, gongshang_date, start_time, end_time, risk_level, illegal_score, illegal_type, entity_type, warn_distribute)

	if not operation_mode == 'all':
		sql1 = sql1.replace(" order"," and el.operation_mode like '%%%s%%' order"%operation_mode)
	if illegal_type == 0:
		sql1 = sql1.replace(' and pd.illegal_type=0','')
	if entity_type == 0:
		sql1 = sql1.replace(' and pd.entity_type=0','')
	if warn_distribute == 'all':
		sql1 = sql1.replace(" and gs.province='all'","")
	if not problem == 'all':
		if problem == u'无':
			sql1 = sql1.replace(" order"," and el.problem is null or el.problem='' order")
		else:			
			sql1 = sql1.replace(" order"," and el.problem like '%%%s%%' order"%problem)
	cur.execute(sql1)
	result = cur.fetchall()
	cur.close()
	return result


def getDetectData(date,table1,table2,table3,risk_level,illegal_score,operation_mode,illegal_type,entity_type,warn_distribute,page_number,page_size,detectionCount):
	cur = defaultDatabase()
	begin = (page_number - 1) * page_size
	end_time = monitor_date
	start_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=int(date))
	start_time = start_time.strftime("%Y-%m-%d")
	sql1 = "select el.id,el.entity_name,el.entity_type,pd.operation_mode,gs.province,gs.city,gs.district,pd.illegal_type,pd.date,el.support_num,el.against_num,el.entity_source from %s as el inner join %s as pd on el.id=pd.entity_id inner join %s as gs on el.id=gs.entity_id where gs.date='%s' and pd.date>'%s' and pd.date<='%s' and el.monitor_status>=1 and pd.illegal_type>0 and pd.risk_level>%d and pd.illegal_score>=%d and pd.operation_mode=%d and pd.illegal_type=%d and pd.entity_type=%d and gs.province='%s' order by pd.date desc limit %d,%d" % (table1, table2, table3, gongshang_date, start_time, end_time, risk_level, illegal_score, operation_mode, illegal_type, entity_type, warn_distribute, begin, page_size)

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
	result = {'total':detectionCount,'rows':res}
	cur.close()
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
def detectionCount(date,table1,table2,table3,risk_level,illegal_score,operation_mode,illegal_type,entity_type,warn_distribute):
	cur = defaultDatabase()
	end_time = monitor_date
	start_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=int(date))
	start_time = start_time.strftime("%Y-%m-%d")
	sql1 = "select count(*) from %s as el inner join %s as pd on el.id=pd.entity_id inner join %s as gs on el.id=gs.entity_id where gs.date='%s' and pd.date>'%s' and pd.date<='%s' and el.monitor_status>=1 and pd.illegal_type>0 and pd.risk_level>%d and pd.illegal_score>=%d and pd.operation_mode=%d and pd.illegal_type=%d and pd.entity_type=%d and gs.province='%s' order by pd.date desc" % (table1, table2, table3, start_time, gongshang_date, end_time, risk_level, illegal_score, operation_mode, illegal_type, entity_type, warn_distribute)

	if operation_mode == 0:
		sql1 = sql1.replace(' and pd.operation_mode=0','')
	if illegal_type == 0:
		sql1 = sql1.replace(' and pd.illegal_type=0','')
	if entity_type == 0:
		sql1 = sql1.replace(' and pd.entity_type=0','')
	if warn_distribute == 'all':
		sql1 = sql1.replace(" and gs.province='all'","")

	cur.execute(sql1)
	res = cur.fetchone()['count(*)']
	cur.close()
	return res


def detectionResultCheck(table, entity_id, date, type, uid, entity_name, table1, remark, oldValue, username, risk_rank, industry, fund_mode, table2):
	t = int(time.time())
	datetime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(t))
	newValue = str(int(oldValue)+1)
	cur = defaultDatabase()
	sql6 = 'update %s set risk_rank=%d,industry="%s",fund_mode="%s" where id=%d' % (table, risk_rank, industry, fund_mode, entity_id)
	if industry == u'无':
		sql6 = sql6.replace('industry="%s"','industry=null')
	if fund_mode == u'无':
		sql6 = sql6.replace('fund_mode="%s"','fund_mode=null')
	cur.execute(sql6)
	sql7 = 'insert into %s (user_id,user_name,entity_id,entity_name,datetime,risk_rank,industry,fund_mode) values (%d,"%s",%d,"%s","%s",%d,"%s","%s")' % (table2, uid, username, entity_id, entity_name, datetime, risk_rank, industry, fund_mode) 
	cur.execute(sql7)
	if type == 1:	#赞成
		log_type = 3
		log_detail = u'赞成' + ':' + str(entity_id) + ',' + entity_name + ',' + date
		#根据uid和entity_id找出存在的log_type
		sql0 = 'select log_type from %s where entity_id=%d and user_id=%d' % (table1, entity_id, uid)
		cur.execute(sql0)
		res = cur.fetchone()
		if res:
			if res['log_type'] == log_type:	#点过赞
				dict = {'status':'fail'}
			elif res['log_type'] == 4:	#点过反对
				sql3 = "update %s set support_num=support_num+1 where id=%d"%(table,entity_id)
				cur.execute(sql3)
				sql4 = "update %s set against_num=against_num-1 where id=%d"%(table,entity_id)
				cur.execute(sql4)
				sql5 = "update %s set datetime='%s',log_type=%d,log_detail='%s',remark='%s',oldValue='%s',newValue='%s' where entity_id=%d and user_id=%d and log_type=4"%(table1,datetime,log_type,log_detail,remark,oldValue,newValue,entity_id, uid)
				cur.execute(sql5)
				dict = {'status':'ok'}
			else:	#未点过赞成／反对
				#点赞
				sql = "update %s set support_num=support_num+1 where id=%d"%(table,entity_id)
				cur.execute(sql)
				#存日志
				sql2 = "insert into %s (datetime,user_id,username,log_type,log_detail,remark,entity_id,oldValue,newValue) values ('%s',%d,'%s',%d,'%s','%s',%d,'%s','%s')"%(table1,datetime,uid,username,log_type,log_detail,remark,entity_id,oldValue,newValue)
				cur.execute(sql2)
				dict = {'status':'ok'}
		else:	#此人未对此平台进行过操作
			#点赞
			sql = "update %s set support_num=support_num+1 where id=%d"%(table,entity_id)
			cur.execute(sql)
			#存日志
			sql2 = "insert into %s (datetime,user_id,username,log_type,log_detail,remark,entity_id,oldValue,newValue) values ('%s',%d,'%s',%d,'%s','%s',%d,'%s','%s')"%(table1,datetime,uid,username,log_type,log_detail,remark,entity_id,oldValue,newValue)
			cur.execute(sql2)
			dict = {'status':'ok'}
		cur.close()
		return dict
	
	elif type == 0:	#反对
		log_type = 4
		log_detail = u'反对' + ':' + str(entity_id) + ',' + entity_name + ',' + date
		#根据uid和entity_id找出存在的log_type
		sql0 = 'select log_type from %s where entity_id=%d and user_id=%d' % (table1, entity_id, uid)
		cur.execute(sql0)
		res = cur.fetchone()
		if res:
			if res['log_type'] == log_type:	#点过反对
				dict = {'status':'fail'}
			elif res['log_type'] == 3:	#点过赞成
				sql3 = "update %s set against_num=against_num+1 where id=%d"%(table,entity_id)
				cur.execute(sql3)
				sql4 = "update %s set support_num=support_num-1 where id=%d"%(table,entity_id)
				cur.execute(sql4)
				sql5 = "update %s set datetime='%s',log_type=%d,log_detail='%s',remark='%s',oldValue='%s',newValue='%s' where entity_id=%d and user_id=%d and log_type=3"%(table1,datetime,log_type,log_detail,remark,oldValue,newValue ,entity_id, uid)
				cur.execute(sql5)
				dict = {'status':'ok'}
			else:	#未点过赞成／反对
				#反对
				sql = "update %s set against_num=against_num+1 where id=%d"%(table,entity_id)
				cur.execute(sql)
				#存日志
				sql2 = "insert into %s (datetime,user_id,username,log_type,log_detail,remark,entity_id,oldValue,newValue) values ('%s',%d,'%s',%d,'%s','%s',%d,'%s','%s')"%(table1,datetime,uid,username,log_type,log_detail,remark,entity_id,oldValue,newValue)
				cur.execute(sql2)
				dict = {'status':'ok'}
		else:
			#反对
			sql = "update %s set against_num=against_num+1 where id=%d"%(table,entity_id)
			cur.execute(sql)
			#存日志
			sql2 = "insert into %s (datetime,user_id,username,log_type,log_detail,remark,entity_id,oldValue,newValue) values ('%s',%d,'%s',%d,'%s','%s',%d,'%s','%s')"%(table1,datetime,uid,username,log_type,log_detail,remark,entity_id,oldValue,newValue)
			cur.execute(sql2)
			dict = {'status':'ok'}
		cur.close()
		return dict

def addIndustry(table1, table2, industry, uid, username):
	t = int(time.time())
	datetime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(t))
	log_type = 7
	log_detail = u'添加所属行业' + ':' + str(uid)
	cur = defaultDatabase()
	sql = 'insert into %s (industry) values ("%s")' % (table1, industry)
	cur.execute(sql)
	#加入日志
	sql1 = 'insert into %s (datetime, user_id, username, log_type, log_detail) values ("%s", %d, "%s", %d, "%s")' % (table2, datetime, uid, username, log_type, log_detail)
	cur.execute(sql1)
	dict = {'status':'ok'}
	cur.close()
	return dict

def addFundmode(table1, table2, fund_mode, uid, username):
	t = int(time.time())
	datetime = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(t))
	log_type = 8
	log_detail = u'添加集资模式' + ':' + str(uid)
	cur = defaultDatabase()
	sql = 'insert into %s (fund_mode) values ("%s")' % (table1, fund_mode)
	cur.execute(sql)
	#加入日志
	sql1 = 'insert into %s (datetime, user_id, username, log_type, log_detail) values ("%s", %d, "%s", %d, "%s")' % (table2, datetime, uid, username, log_type, log_detail)
	cur.execute(sql1)
	dict = {'status':'ok'}
	cur.close()
	return dict

def detectionResultRemark(table, entity_id):
	cur = defaultDatabase()
	sql = 'select username,datetime,remark from %s where entity_id=%d and log_type>=3 and log_type<=4' % (table, entity_id)
	cur.execute(sql)
	result = cur.fetchall()
	return result

def getDetectRank(table, date, risk_level, illegal_score, entity_type):
	cur = defaultDatabase()
	end_time = monitor_date
	start_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=int(date))
	start_time = start_time.strftime("%Y-%m-%d")
	sql = 'select entity_id,entity_name,max(illegal_score) from %s where date>"%s" and date<="%s" and illegal_type>0 and risk_level>%d and illegal_score>=%d and entity_type=%d group by entity_id order by sum(illegal_score) desc'%(table, start_time, end_time, risk_level, illegal_score, entity_type)
	if entity_type == 0:
		sql = sql.replace(' and entity_type=0','')
	cur.execute(sql)
	result = cur.fetchall()
	cur.close()
	return result

def getDetectDistribute(date,table,table4,risk_level,illegal_score):
	cur = defaultDatabase()
	end_time = monitor_date
	start_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=int(date))
	start_time = start_time.strftime("%Y-%m-%d")
	province_list = []
	resultlist = []
	sql1 = 'select pd.illegal_type,gs.province,gs.city,count(*) from %s as pd inner join %s as gs on pd.entity_id=gs.entity_id where pd.date>"%s" and pd.date<="%s" and pd.illegal_type=1 and pd.risk_level>%d and pd.illegal_score>=%d and gs.date="%s" group by province,city'%(table,table4,start_time,end_time,risk_level,illegal_score,gongshang_date)
	sql2 = 'select pd.illegal_type,gs.province,gs.city,count(*) from %s as pd inner join %s as gs on pd.entity_id=gs.entity_id where pd.date>"%s" and pd.date<="%s" and pd.illegal_type=2 and pd.risk_level>%d and pd.illegal_score>=%d and gs.date="%s" group by province,city'%(table,table4,start_time,end_time,risk_level,illegal_score,gongshang_date)
	sql3 = 'select pd.illegal_type,gs.province,gs.city,count(*) from %s as pd inner join %s as gs on pd.entity_id=gs.entity_id where pd.date>"%s" and pd.date<="%s" and pd.illegal_type=3 and pd.risk_level>%d and pd.illegal_score>=%d and gs.date="%s" group by province,city'%(table,table4,start_time,end_time,risk_level,illegal_score,gongshang_date)
	cur.execute(sql1)
	result1 = cur.fetchall()
	cur.execute(sql2)
	result2 = cur.fetchall()
	cur.execute(sql3)
	result3 = cur.fetchall()
	result = []
	for each in [result1, result2, result3]:
		if isinstance(each,list):
			result += each
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
					pro_dict.update({'count1':dict['count(*)']})
				elif dict['illegal_type'] == 2:
					pro_dict.update({'count2':dict['count(*)']})
				elif dict['illegal_type'] == 3:
					pro_dict.update({'count3':dict['count(*)']})
		try:
			count1 = pro_dict['count1']
		except:
			count1 = 0
		try:
			count2 = pro_dict['count2']
		except:
			count2 = 0
		try:
			count3 = pro_dict['count3']
		except:
			count3 = 0
		sum = count1 + count2 + count3
		pro_dict.update({'sum':sum})
		resultlist.append(pro_dict)
	cur.close()
	return resultlist

def getWarnCount(table,risk_level,illegal_score):
	cur = defaultDatabase()
	end_time = monitor_date
	start0_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=7)
	start1_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=30)
	start2_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=90)
	start_time0 = start0_time.strftime("%Y-%m-%d")
	start_time1 = start1_time.strftime("%Y-%m-%d")
	start_time2 = start2_time.strftime("%Y-%m-%d")
	sql01 = "select count(*) from %s where illegal_type>0 and risk_level>%d and illegal_score>=%d and date>'%s' and date<='%s'"%(table,risk_level,illegal_score,start_time0,end_time)
	sql02 = "select count(*) from %s where illegal_type>0 and risk_level>%d and illegal_score>=%d and date>'%s' and date<='%s'"%(table,risk_level,illegal_score,start_time1,end_time)
	sql03 = "select count(*) from %s where illegal_type>0 and risk_level>%d and illegal_score>=%d and date>'%s' and date<='%s'"%(table,risk_level,illegal_score,start_time2,end_time)
	cur.execute(sql01)
	c01 = cur.fetchone()['count(*)']
	cur.execute(sql02)
	c02 = cur.fetchone()['count(*)']
	cur.execute(sql03)
	c03 = cur.fetchone()['count(*)']
	count_7 = int(c01)
	count_30 = int(c02)
	count_90 = int(c03)
	dict = {'seven':count_7,'thirty':count_30,'ninty':count_90}
	cur.close()
	return dict


def getSecondWarnCount(table,table1,risk_level,illegal_score):
	cur = defaultDatabase()
	end_time = monitor_date
	start0_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=7)
	start1_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=30)
	start2_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=90)
	start_time0 = start0_time.strftime("%Y-%m-%d")
	start_time1 = start1_time.strftime("%Y-%m-%d")
	start_time2 = start2_time.strftime("%Y-%m-%d")
	sql01 = "select count(*) from %s as m inner join %s as el on el.id=m.entity_id where m.illegal_type>0 and m.risk_level>%d and m.illegal_score>=%d and m.date>'%s' and m.date<='%s' and el.support_num>0"%(table,table1,risk_level,illegal_score,start_time0,end_time)
	sql02 = "select count(*) from %s as m inner join %s as el on el.id=m.entity_id where m.illegal_type>0 and m.risk_level>%d and m.illegal_score>=%d and m.date>'%s' and m.date<='%s' and el.support_num>0"%(table,table1,risk_level,illegal_score,start_time1,end_time)
	sql03 = "select count(*) from %s as m inner join %s as el on el.id=m.entity_id where m.illegal_type>0 and m.risk_level>%d and m.illegal_score>=%d and m.date>'%s' and m.date<='%s' and el.support_num>0"%(table,table1,risk_level,illegal_score,start_time2,end_time)
	cur.execute(sql01)
	c01 = cur.fetchone()['count(*)']
	cur.execute(sql02)
	c02 = cur.fetchone()['count(*)']
	cur.execute(sql03)
	c03 = cur.fetchone()['count(*)']
	count_7 = int(c01)
	count_30 = int(c02)
	count_90 = int(c03)
	dict = {'seven':count_7,'thirty':count_30,'ninty':count_90}
	cur.close()
	return dict	


def getWarnEntityCount(table, risk_level, illegal_score):
	cur = defaultDatabase()
	end_time = monitor_date
	start0_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=7)
	start1_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=30)
	start2_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=90)
	start_time0 = start0_time.strftime("%Y-%m-%d")
	start_time1 = start1_time.strftime("%Y-%m-%d")
	start_time2 = start2_time.strftime("%Y-%m-%d")
	sql01 = "select count(*) from %s where illegal_type>0 and risk_level>%d and illegal_score>=%d and date>'%s' and date<='%s' group by entity_id"%(table,risk_level,illegal_score,start_time0,end_time)
	sql02 = "select count(*) from %s where illegal_type>0 and risk_level>%d and illegal_score>=%d and date>'%s' and date<='%s' group by entity_id"%(table,risk_level,illegal_score,start_time1,end_time)
	sql03 = "select count(*) from %s where illegal_type>0 and risk_level>%d and illegal_score>=%d and date>'%s' and date<='%s' group by entity_id"%(table,risk_level,illegal_score,start_time2,end_time)
	cur.execute(sql01)
	c01 = len(cur.fetchall())
	cur.execute(sql02)
	c02 = len(cur.fetchall())
	cur.execute(sql03)
	c03 = len(cur.fetchall())
	count_7 = int(c01)
	count_30 = int(c02)
	count_90 = int(c03)
	dict = {'seven':count_7,'thirty':count_30,'ninty':count_90}
	cur.close()
	return dict


def getSecondWarnEntityCount(table, table1, risk_level, illegal_score):
	cur = defaultDatabase()
	end_time = monitor_date
	start0_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=7)
	start1_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=30)
	start2_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=90)
	start_time0 = start0_time.strftime("%Y-%m-%d")
	start_time1 = start1_time.strftime("%Y-%m-%d")
	start_time2 = start2_time.strftime("%Y-%m-%d")
	sql01 = "select count(*) from %s as m inner join %s as el on el.id=m.entity_id where m.illegal_type>0 and m.risk_level>%d and m.illegal_score>=%d and m.date>'%s' and m.date<='%s' and el.support_num>0 group by entity_id"%(table,table1,risk_level,illegal_score,start_time0,end_time)
	sql02 = "select count(*) from %s as m inner join %s as el on el.id=m.entity_id where m.illegal_type>0 and m.risk_level>%d and m.illegal_score>=%d and m.date>'%s' and m.date<='%s' and el.support_num>0 group by entity_id"%(table,table1,risk_level,illegal_score,start_time1,end_time)
	sql03 = "select count(*) from %s as m inner join %s as el on el.id=m.entity_id where m.illegal_type>0 and m.risk_level>%d and m.illegal_score>=%d and m.date>'%s' and m.date<='%s' and el.support_num>0 group by entity_id"%(table,table1,risk_level,illegal_score,start_time2,end_time)
	cur.execute(sql01)
	c01 = len(cur.fetchall())
	cur.execute(sql02)
	c02 = len(cur.fetchall())
	cur.execute(sql03)
	c03 = len(cur.fetchall())
	count_7 = int(c01)
	count_30 = int(c02)
	count_90 = int(c03)
	dict = {'seven':count_7,'thirty':count_30,'ninty':count_90}
	cur.close()
	return dict


def getWarnType(table, table2, risk_level, illegal_score, date, illegal_type, entity_type, operation_mode, warn_distribute, table3):
	cur = defaultDatabase()
	end_time = monitor_date
	start_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=date)
	start_time = start_time.strftime("%Y-%m-%d")
	sql = 'select a.illegal_type,count(*) from %s as a inner join %s as b on a.entity_id=b.entity_id inner join %s as el on a.entity_id=el.id where b.date="%s" and a.risk_level>%d and a.illegal_score>=%d and a.date>"%s" and a.date<="%s" and a.illegal_type=%d and a.entity_type=%d and b.province="%s" group by a.illegal_type'%(table, table2, table3, gongshang_date, risk_level, illegal_score, start_time, end_time, illegal_type, entity_type, warn_distribute)
	if not operation_mode == 'all':
		sql = sql.replace(" group"," and el.operation_mode like '%%%s%%' group"%operation_mode)
	if illegal_type == 0:
		sql = sql.replace(' and a.illegal_type=0','')
	if entity_type == 0:
		sql = sql.replace(' and a.entity_type=0','')
	if warn_distribute == 'all':
		sql = sql.replace(' and b.province="all"','')
	cur.execute(sql)
	data = cur.fetchall()
	cur.close()
	return data


def GetTimeDistribute(table, table2, risk_level, illegal_score, date, illegal_type, entity_type, operation_mode, warn_distribute, table3):
	cur = defaultDatabase()
	list = []
	count_list = []
	end_time = monitor_date
	time_list = []
	for i in range(0, date):
		start_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=i)
		start_time = start_time.strftime("%Y-%m-%d")
		time_list.append(start_time)
	for i,time in enumerate(time_list):
		sql1 = "select count(*) from %s as a inner join %s as b on a.entity_id=b.entity_id inner join %s as el on a.entity_id=el.id where b.date='%s' and a.date='%s' and a.risk_level>%d and a.illegal_score>=%d and a.illegal_type=%d and a.entity_type=%d and b.province='%s'"%(table, table2, table3, gongshang_date, time, risk_level, illegal_score, illegal_type, entity_type, warn_distribute)
		if not operation_mode == 'all':
			sql1 = sql1 + " and el.operation_mode like '%%%s%%'" % operation_mode
		if illegal_type == 0:
			sql1 = sql1.replace(' and a.illegal_type=0',' and a.illegal_type>0')
		if entity_type == 0:
			sql1 = sql1.replace(' and a.entity_type=0','')
		if warn_distribute == 'all':
			sql1 = sql1.replace(" and b.province='all'","")
		cur.execute(sql1)
		result = cur.fetchone()['count(*)']
		dict = {'time':time,'count':result}
		list.append(dict)
	cur.close()
	return list


def getMinDate(table,RISK_LEVEL,ILLEGAL_SCORE):
	cur = defaultDatabase()
	sql = 'select entity_id,min(date) from %s where illegal_type>0 and risk_level>%d and illegal_score>=%d group by entity_id' % (table,RISK_LEVEL,ILLEGAL_SCORE)
	cur.execute(sql)
	res = cur.fetchall()
	dict = {}
	for row in res:
		dict.update({row['entity_id']:row['min(date)']})
	cur.close()
	return dict



# 首页
def h_getWarnCount(table, risk_level, illegal_score):
	cur = defaultDatabase()
	end_time = monitor_date
	start_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=7)
	start_time = start_time.strftime("%Y-%m-%d")
	sql = 'select entity_type,count(*) from %s where illegal_type>0 and risk_level>%d and illegal_score>=%d and date>"%s" and date<="%s" group by entity_type'%(table,risk_level,illegal_score,start_time,end_time)
	cur.execute(sql)
	data = cur.fetchall()
	typeList = [1,2,3]
	result_type = []
	for each in data:
		result_type.append(each['entity_type'])
	for t in typeList:
		if not t in result_type:
			data.append({'entity_type':t, 'count':0})
	cur.close()
	return data

def get_prepared_city_rank(province):           #读取预先存好的地图数据 用于替换views中的get_city_rank
    cur = defaultDatabase()
    if province:            #查询某一省份
        executer = "select max(date) from %s" % (TABLE_CITY_RANK)
        cur.execute(executer)
        last_date = cur.fetchone()['count(*)']
        executer = "select * from %s where province='%s' and date='%s'" % (TABLE_CITY_RANK,province,last_date)
        cur.execute(executer)
        result = cur.fetchall()
    else:
        executer = "select max(date) from %s" % (TABLE_PROVINCE_RANK)
        cur.execute(executer)
        last_date = cur.fetchone()['count(*)']
        executer = "select * from %s where date='%s'" % (TABLE_PROVINCE_RANK,last_date)
        cur.execute(executer)
        result = cur.fetchall()
    return result

def get_city_rank(table,table4,province_name,risk_level,illegal_score):
	cur = defaultDatabase()
	city_list = []
	list = []
	province_list = []
	end_time = monitor_date
	start_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=7)
	start_time = start_time.strftime("%Y-%m-%d")
	start1_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=30)
	start_time1 = start1_time.strftime("%Y-%m-%d")
	sql1 = 'select pd.illegal_type,gs.province,gs.city,count(*) from %s as pd inner join %s as gs on pd.entity_id=gs.entity_id where gs.date="%s" and pd.date>"%s" and pd.date<="%s" and illegal_type>0 and risk_level>%d and illegal_score>=%d group by province,city'%(table,table4,gongshang_date,start_time,end_time,risk_level,illegal_score)
	cur.execute(sql1)
	result1 = cur.fetchall()
	sql2 = 'select pd.illegal_type,gs.province,gs.city,count(*) from %s as pd inner join %s as gs on pd.entity_id=gs.entity_id where gs.date="%s" and pd.date>"%s" and pd.date<="%s" and illegal_type>0 and risk_level>%d and illegal_score>=%d group by province,city'%(table,table4,gongshang_date,start_time1,end_time,risk_level,illegal_score)
	cur.execute(sql2)
	result2 = cur.fetchall()
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
						pro_dict.update({'count7':dict['count(*)']})
				for dict in result2:
					if dict['city'] == d['city']:
						pro_dict.update({'count30':dict['count(*)']})
				list.append(pro_dict)
	if not province_name:
		for p in province_list:
			if p:
				pro_dict = {"province":p}
				count = 0
				for dict in result1:
					if dict['province'] == p:
						count += dict['count(*)']
				pro_dict.update({"count":count})
				list.append(pro_dict)
	cur.close()
	return list


def get_province_rank(table,table4,risk_level,illegal_score):
	cur = defaultDatabase()
	list = []
	province_list = []
	end_time = monitor_date
	start0_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=7)
	start1_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=30)
	start_time0 = start0_time.strftime("%Y-%m-%d")
	start_time1 = start1_time.strftime("%Y-%m-%d")
	sql1 = 'select gs.province,count(*) from %s as pd inner join %s as gs on pd.entity_id=gs.entity_id where gs.date="%s" and pd.date>"%s" and pd.date<="%s" and illegal_type>0 and risk_level>%d and illegal_score>=%d group by province'%(table,table4,gongshang_date,start_time0,end_time, risk_level,illegal_score)
	cur.execute(sql1)
	result1 = cur.fetchall()
	sql2 = 'select gs.province,count(*) from %s as pd inner join %s as gs on pd.entity_id=gs.entity_id where gs.date="%s" and pd.date>"%s" and pd.date<="%s" and illegal_type>0 and risk_level>%d and illegal_score>=%d group by province'%(table,table4,gongshang_date,start_time1,end_time, risk_level,illegal_score)
	cur.execute(sql2)
	result2 = cur.fetchall()
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
					pro_dict.update({'count7':dict['count(*)']})
			for dict in result2:
				if dict['province'] == d:
					pro_dict.update({'count30':dict['count(*)']})
			list.append(pro_dict)
	for li in list:
		try:
			if li['count7']:
				pass
		except:
			li['count7'] = 0
	cur.close()
	return list


def getTimeDistribute(table,risk_level,illegal_score):
	cur = defaultDatabase()
	list = []
	count_list = []
	end_time = monitor_date
	time_list = []
	for i in range(0,30):
		start_time = datetime.strptime(end_time,"%Y-%m-%d") - timedelta(days=i)
		start_time = start_time.strftime("%Y-%m-%d")
		time_list.append(start_time)
	for i,time in enumerate(time_list):
		sql1 = "select count(*) from %s where date='%s' and illegal_type>0 and risk_level>%d and illegal_score>=%d"%(table,time,risk_level,illegal_score)
		cur.execute(sql1)
		result = cur.fetchone()['count(*)']
		dict = {'time':time,'count':result}
		list.append(dict)
	cur.close()
	return list



#感知入库
def get_perceive_data(table):
	cur = defaultDatabase()
	sql = 'select * from %s where status<2 group by entity_name order by date desc,id desc'%table
	cur.execute(sql)
	result = cur.fetchall()
	cur.close()
	return result


def get_second_perceive_data(table):
	cur = defaultDatabase()
	sql = 'select * from %s where status=1 group by entity_name order by date desc,id desc'%table
	cur.execute(sql)
	result = cur.fetchall()
	cur.close()
	return result

def p_getWarnCount(table):
	cur = defaultDatabase()
	to = int(time.time())
	today = time.strftime("%Y-%m-%d",time.localtime(to))
	sql = 'select entity_type,count(*) from %s where date="%s" group by entity_type'%(table, today)
	cur.execute(sql)
	result = cur.fetchall()
	cur.close()
	return result


def second_p_getWarnCount(table):
	cur = defaultDatabase()
	to = int(time.time())
	today = time.strftime("%Y-%m-%d",time.localtime(to))
	sql = 'select entity_type,count(*) from %s where date="%s" and status=1 group by entity_type'%(table, today)
	cur.execute(sql)
	result = cur.fetchall()
	cur.close()
	return result	


def Edit(table,entity_id,entity_name,entity_type,company,related_person,keyword):
	cur = defaultDatabase()
	related_person = related_person.replace('，','')
	keyword = keyword.replace('，','')
	sql = 'update %s set entity_type=%d,real_name="%s",company="%s",related_person="%s",key_words="%s" where id=%d'%(table,entity_type,entity_name,company,related_person,keyword,entity_id)
	if company == 'null':
		sql = sql.replace('company="null"','company=null')
	if related_person == 'null':
		sql = sql.replace('related_person="null"','related_person=null')
	if keyword == 'null':
		sql = sql.replace('key_words="null"','key_words=null')
	cur.execute(sql)
	dict = {'status':'ok'}
	cur.close()
	return dict


def Add(table, entity_id):
	cur = defaultDatabase()
	sql = 'update %s set status=1 where id=%d'%(table, entity_id)
	cur.execute(sql)
	dict = {'status':'ok'}
	cur.close()
	return dict


def Cancel(table, entity_id):
	cur = defaultDatabase()
	sql = 'update %s set status=0 where id=%d'%(table, entity_id)
	cur.execute(sql)
	dict = {'status':'ok'}
	cur.close()
	return dict


def OnceInStorage(table, list):
	cur = defaultDatabase()
	sql = 'update %s set status=1 where id=%d'%(table,list[0])
	for id in list[1:]:
		sql += ' or id=%d'%id
	cur.execute(sql)
	dict = {'status':'ok'}
	cur.close()
	return dict


def InStorage(table, list):
	cur = defaultDatabase()
	date = time.localtime(int(time.time()))
	date = time.strftime("%Y-%m-%d",date)
	for each in list:
		sql = 'insert into %s(entity_type,entity_name,date,company,related_person,key_words,rec_type,status,in_type,real_name) values(%d,"%s","%s","%s","%s","%s",2,%d,%d,"%s")'%(table,each["entity_type"],each["entity_name"],date,each["company"],each["related_person"],each["key_words"],1,1,each["entity_name"])
		if "null" in [d for d in each.values()]:
			sql = sql.replace('"null"','null')
		cur.execute(sql)
	dict = {'status':'ok'}
	cur.close()
	return dict


def OutStorage(table, entity_id):
	cur = defaultDatabase()
	sql = 'update %s set status=2 where id=%d'%(table,entity_id)
	cur.execute(sql)
	dict = {'status':'ok'}
	cur.close()
	return dict



#下拉框
def operationModeBox(table):
	cur = defaultDatabase()
	sql = 'select * from %s'%table
	cur.execute(sql)
	data = cur.fetchall()
	cur.close()
	return data

def illegalTypeBox(table):
	cur = defaultDatabase()
	sql = 'select * from %s'%table
	cur.execute(sql)
	data = cur.fetchall()
	cur.close()
	return data

def problemBox(table):
	cur = defaultDatabase()
	sql = 'select * from %s'%table
	cur.execute(sql)
	data = cur.fetchall()
	cur.close()
	return data


def industryBox(table):
	cur = defaultDatabase()
	sql = 'select * from %s'%table
	cur.execute(sql)
	data = cur.fetchall()
	cur.close()
	return data


def fundmodeBox(table):
	cur = defaultDatabase()
	sql = 'select * from %s'%table
	cur.execute(sql)
	data = cur.fetchall()
	cur.close()
	return data




#用户管理
def register(table, data, field):
	cur = defaultDatabase()
	sql = 'insert into %s (%s) values(%s)' % (table, ','.join(field), ','.join(["'%s'" % data[x] for x in field]))
	cur.execute(sql)
	dict = {'status':'ok'}
	return dict


def check_user(table, data):
	cur = defaultDatabase()
	tag = False
	sql = 'select * from %s where username="%s"' % (table, data['username'])
	cur.execute(sql)
	user = cur.fetchone()
	if user:
		tag = True
	return tag


def getUser(table, data):
	cur = defaultDatabase()
	sql = 'select * from %s where username="%s"' % (table, data['username'])
	cur.execute(sql)
	result = cur.fetchone()
	cur.close()
	return result


def deleteUser(table, id):
	cur = defaultDatabase()
	sql = 'delete from %s where id=%d' % (table, id)
	cur.execute(sql)
	dict = {'status':'ok'}
	cur.close()
	return dict


def addUser(table, data, field):
	cur = defaultDatabase()
	sql = 'insert into %s (%s) values(%s)' % (table, ','.join(field), ','.join(["'%s'" % data[x] for x in field]))
	cur.execute(sql)
	dict = {'status':'ok'}
	cur.close()
	return dict


def getUserList(table):
	cur = defaultDatabase()
	sql = 'select id,username,role_id from %s'%(table)
	cur.execute(sql)
	data = cur.fetchall()
	cur.close()
	return data


def EditUser(table, data):
	cur = defaultDatabase()
	sql = 'update %s set username="%s",password="%s",role_id=%d where id=%d'%(table, data['username'], data['password'], data['role_id'], data['uid'])
	cur.execute(sql)
	dict = {'status':'ok'}
	cur.close()
	return dict


def getPassword(table, data):
	cur = defaultDatabase()
	sql = 'select password from %s where id=%d' % (table, data['uid'])
	cur.execute(sql)
	res = cur.fetchone()['password']
	return res


