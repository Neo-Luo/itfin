#!/usr/bin/env python
#encoding: utf-8

from flask import Flask, render_template, request, jsonify, Blueprint, send_from_directory, url_for
from economy.db import *
from . import entityPortrait
from economy.config import *
import json

field = ['id','entity_name','entity_type','operation_mode','province','city','district','date','illegal_type','entity_source','problem']
plat_field = ['id','entity_name','illegal_type','entity_type']

@entityPortrait.route('/entityPortrait/')
def entityportrait():
	return render_template('entityPortrait/entity_portrait.html')

@entityPortrait.route('/portrait/',methods=['POST','GET'])
def portrait():
	operation_mode = int(request.args.get('operation_mode',''))
	illegal_type = int(request.args.get('illegal_type',''))
	entity_type = int(request.args.get('entity_type',''))
	warn_distribute = request.args.get('warn_distribute','')
	#result = get(TABLE_ENTITY_LIST,TABLE_PLAT_DETAIL,TABLE_COMPANY_DETAIL,TABLE_PROJECT_DETAIL,TABLE_GONGSHANG,field,operation_mode,illegal_type,entity_type,warn_distribute)
	result = get(TABLE_ENTITY_LIST,TABLE_PLAT_DETAIL,TABLE_GONGSHANG,field,operation_mode,illegal_type,entity_type,warn_distribute)
	if result['status'] == 1:
		return json.dumps(result['data'],ensure_ascii=False)

@entityPortrait.route('/entityCount/',methods=['POST','GET'])
def entity_count():
	operation_mode = int(request.args.get('operation_mode',''))
	illegal_type = int(request.args.get('illegal_type',''))
	entity_type = int(request.args.get('entity_type',''))
	warn_distribute = request.args.get('warn_distribute','')
	result = entityCount(TABLE_ENTITY_LIST,TABLE_PLAT_DETAIL,TABLE_GONGSHANG,field,operation_mode,illegal_type,entity_type,warn_distribute)
	return json.dumps(result,ensure_ascii=False)

@entityPortrait.route('/diviPage/',methods=['POST','GET'])
def divi_page():
	operation_mode = int(request.args.get('operation_mode',''))
	illegal_type = int(request.args.get('illegal_type',''))
	entity_type = int(request.args.get('entity_type',''))
	warn_distribute = request.args.get('warn_distribute','')
	page_number = int(request.args.get('page_number',''))
	page_size = int(request.args.get('page_size',''))
	result = diviPage(TABLE_ENTITY_LIST,TABLE_PLAT_DETAIL,TABLE_GONGSHANG,field,operation_mode,\
						illegal_type,entity_type,warn_distribute,page_number,page_size)
	return json.dumps(result,ensure_ascii=False)


@entityPortrait.route('/platform/',methods=['POST','GET'])
def platform():
	result = get_platform(TABLE_MONITOR,plat_field)
	return json.dumps(result,ensure_ascii=False)

@entityPortrait.route('/company/',methods=['POST','GET'])
def company():
	result = get_company(TABLE_MONITOR,plat_field)
	return json.dumps(result,ensure_ascii=False)

@entityPortrait.route('/project/',methods=['POST','GET'])
def project():
	result = get_project(TABLE_MONITOR,plat_field)
	return json.dumps(result,ensure_ascii=False)


@entityPortrait.route('/portrait_letter/',methods=['POST','GET'])
def portraitLetter():
	letter = request.args.get('letter','')
	result = get_portrait(TABLE_ENTITY_LIST,TABLE_PLAT_DETAIL,TABLE_GONGSHANG,field,letter)
	return json.dumps(result,ensure_ascii=False)

@entityPortrait.route('/monitorCount/')
def m_count():
	result = get_monitor_count(TABLE_ENTITY_LIST)
	return json.dumps(result,ensure_ascii=False)








