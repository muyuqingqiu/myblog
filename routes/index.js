module.exports = function(app) {
	app.use(function(req,res,next){
		res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
		next();
	})
	app.get('/', function(req, res) {
		console.log('根路径');
		res.redirect('/posts');
		return;
	});
	app.use('/posts', require('./posts'));
	app.use('/signup', require('./signup'));
	app.use('/signin', require('./signin'));
	app.use('/signout', require('./signout'));
	//404 catch-all 处理器
	app.use(function(req, res) {
		res.status(404);
		console.log('404');
		res.render('404');
	});
	//500 错误中间件
	app.use(function(err,req, res, next) {
		console.log(err.stack);
		res.status(500);
		res.render('500');
	}); 
};