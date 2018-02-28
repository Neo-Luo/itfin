#!/usr/bin/env python
#encoding: utf-8

from flask import Flask, render_template, request, jsonify, Blueprint, send_from_directory, url_for, redirect, session
from flask_login import LoginManager, login_user, UserMixin, logout_user, login_required
from economy.db import *
from . import userManagement
import json
from economy.config import *
from economy.es import *
from flask_login import LoginManager,login_user,UserMixin,logout_user,login_required
import hashlib

salt='98b85629951ad584feaf87e28c073088'

@userManagement.route('/')
def index():
	if not session:
		return redirect('userManagement/login')
	return render_template('homePage/homePage.html')


#注册
@userManagement.route('/register',methods=['GET','POST'])
def Register():
	field = ['username', 'password']
	if request.method == 'POST':
		data = dict((k,v[0]) for k,v in dict(request.form).items())
		data['password'] = hashlib.md5(data['password']+salt).hexdigest()

		#判断用户名是否存在
		if check_user(TABLE_USERINFO, data):
			error = u'用户 %s 已存在' % (data['username'])
			return render_template('userManagement/register.html',error=error)

		#存入数据库
		else:
			field = ['username', 'password']
			if register(TABLE_USERINFO, data, field):
				return redirect('userManagement/login')

	return render_template('userManagement/register.html')


#登录
@userManagement.route('/login',methods=['GET','POST'])
def Login():
	field = ['id', 'username', 'password']
	if request.method == 'POST':
		data = {k:v[0] for k,v in dict(request.form).items()}
		data['password'] = hashlib.md5(data['password']+salt).hexdigest()

		if check_user(TABLE_USERINFO, data):
			result = getUser(TABLE_USERINFO, data, field)
			if result['password'] == data['password']:
				session['username'] = data['username']
				return render_template('homePage/homePage.html',username=session['username'])
			else:
				#return u'密码错误'
				error = u'密码错误'
				return render_template('userManagement/login.html',error=error)
		else:
			#return u'用户不存在'
			error = u'用户不存在'
			return render_template('userManagement/login.html',error=error)
	return render_template('userManagement/login.html')


#退出
@userManagement.route('/logout')
def logOut():
	if session:
		session.clear()
	return redirect('userManagement/login')


#删除
@userManagement.route('/delete')
def Delete():
	if not session:
		return redirect('userManagement/login')
	id = int(request.args.get('id'))
	deleteUser(TABLE_USERINFO, id)
	return redirect('userManagement/userlist')


#用户列表
@userManagement.route('/userlist')
def userList():
	if not session or session['role'] != 1:
		return redirect('/login')
	result = getList(TABLE_USERINFO, field)
	return render_template('manage/user')




