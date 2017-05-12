var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var formidable = require('express-formidable');
var util = require('util');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('config-lite');
var pkg = require('./package');
//创建app对象
var app = express();
//路由
var routes = require('./routes');
// view engine setup 视图路径与模板选择
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//托管静态资源文件
app.use(express.static(path.join(__dirname, 'public')));
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//cookie
app.use(cookieParser());
//session中间件
app.use(session({
	name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
	secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
	cookie: {
		maxAge: config.session.maxAge // 过期时间，过期后 cookie 中的 session id 自动删除
	},
	store: new MongoStore({ // 将 session 存储到 mongodb
		url: config.mongodb // mongodb 地址
	})
}));
// flash 中间价，用来显示通知
app.use(flash());
//处理表单及文件上传的中间件
//app.use(formidable({
//	uploadDir: path.join(__dirname,'public/images'), //上传文件目录
//	keepExtensions:true //保留后缀
//}));
//设置视图页面默认信息
app.locals.blog = {
	name: pkg.name,
	description: pkg.description
};
app.use(function(req,res,next){
	res.locals.user = req.session.user;
	res.locals.success = req.flash('success').toString();
	res.locals.errors = req.flash('error').toString();
	next();
});

// 路由
routes(app);
app.listen(config.port, function () {
	console.log(`${pkg.name} listening on port ${config.port}`);
});
