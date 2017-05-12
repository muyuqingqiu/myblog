var express = require('express');
var router = express.Router();
var path = require('path');
var config = require('config-lite');
var sha1 = require('sha1');
var formidable = require('formidable');
var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;
// GET /signup 注册页
router.get('/', checkNotLogin, function(req, res, next) {
	return res.render('signup');
});
// POST /signup 用户注册
router.post('/', checkNotLogin, function(req, res, next) {
	var form = new formidable.IncomingForm();
	form.uploadDir = config.dirs.imageDir;
	form.keepExtensions = true;
	form.parse(req, function(err, fields, files) {
		var username = fields.username;
		var gender = fields.gender;
		var bio = fields.bio;
		if(files.avatar) {
			var avatar = files.avatar.path.split(path.sep).pop();
		}
		var password = fields.password;
		var repassword = fields.repassword;
		//校验参数
		try {
			if(!(username.length >= 1 && username.length <= 10)) {
				throw new Error('名字请限制在1-10个字符内');
			}
			if(['m', 'f', 'x'.indexOf(gender)] === -1) {
				throw new Error('性别只能是m,或x');
			}
			if(!(bio.length >= 1 && bio.length <= 30)) {
				throw new Error('个人简介请限制在1-30个字符内');
			}
			if(!files.avatar) {
				throw new Error('请上传头像');
			}
			if(password.length < 6) {
				throw new Error('密码至少6个字符');
			}
			if(password !== repassword) {
				throw new Error('两次密码输入不一致');
			}
		} catch(e) {
			req.flash('error', e.message);
			return res.redirect('/signup');
		}
		//明文密码加密
		password = sha1(password);
		//待写入的用户信息
		var user = {
			username: username,
			password: password,
			gender: gender,
			bio: bio,
			avatar: avatar
		}
		console.log(user)
		//用户信息写入
		UserModel.create(user)
			.then(function(result) {
				//此user是插入mongodb后的值，包含_id
				user = result.ops[0];
				//将用户信息存入session
				delete user.password;
				req.session.user = user;
				//写入flash
				req.flash('success', '注册成功');
				//跳转到首页
				return res.redirect('/posts');
			})
			.catch(function(e) {
				//用户名被占用则跳回注册页，而不是错误页
				if(e.message.match('E11000 duplicate key')) {
					req.flash('error', e.message);
					return res.redirect('./signup');
				}
				next(e);
			})
	})

});

module.exports = router;