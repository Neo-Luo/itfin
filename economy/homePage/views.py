#!/usr/bin/env python
#encoding: utf-8

from flask import Flask, render_template, request, jsonify, Blueprint, send_from_directory, url_for
from economy.db import *
from . import homePage
import json
from economy.config import *
from economy.entityPortrait import views
from economy.es import *

field = ['illegal_type','province','city','count']
province_field = ['province','count']
#warn_field = ['plat','com','pro']
warn_field = ['entity_type','count']
portrait_field = ['id','entity_name','entity_type','operation_mode','province','city','district','date','illegal_type']

@homePage.route('/')
def index():
	return render_template('homePage/homePage.html')

@homePage.route('/warnCount/')
def warn_count():
	result = h_getWarnCount(TABLE_MONITOR, warn_field, RISK_LEVEL, ILLEGAL_SCORE)
	return json.dumps(result,ensure_ascii=False)

@homePage.route('/cityRank/')
def city_rank():
	province = request.args.get('province','')
	result = get_city_rank(TABLE_MONITOR,TABLE_GONGSHANG,field,province, RISK_LEVEL, ILLEGAL_SCORE)#读取预存储数据需要注释掉这句
	#result = get_prepared_city_rank(province)    #建好表计算出数据后把这句恢复了就可以读取预存储数据了
	return json.dumps(result,ensure_ascii=False)

@homePage.route('/provinceRank/')
def province_rank():
	result = get_province_rank(TABLE_MONITOR,TABLE_GONGSHANG,province_field, RISK_LEVEL, ILLEGAL_SCORE)
	result.sort(key=lambda x:x['count7'],reverse=True)
	return json.dumps(result,ensure_ascii=False)

@homePage.route('/timeDistribute/')
def time_distribute():
	result = getTimeDistribute(TABLE_MONITOR,RISK_LEVEL,ILLEGAL_SCORE)
	return json.dumps(result,ensure_ascii=False)

@homePage.route('/hotSpot/')
def hot_spot():
	list = get(TABLE_ENTITY_LIST,TABLE_PLAT_DETAIL,TABLE_GONGSHANG,portrait_field,0,10000,0,'all')['data'][0:1000]
	entity_list = []
	for dict in list:
		entity_list.append({'id':dict['id'],'name':dict['entity_name'],'entity_type':dict['entity_type']})
	result = getHotSpot(entity_list)
	return json.dumps(result,ensure_ascii=False)
