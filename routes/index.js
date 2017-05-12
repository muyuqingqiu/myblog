var cors = require('cors');
module.exports = function(app) {
	app.use(function(req,res,next){
		res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
		next();
	})
	app.get('/', function(req, res) {
		console.log('根路径');
		return res.redirect('/posts');
	});
	app.use('/posts', require('./posts'));
	app.use('/signup', require('./signup'));
	app.use('/signin', require('./signin'));
	app.use('/signout', require('./signout'));
	app.use('/api',require('./api'));
	app.use('/api',cors());
	app.use(function(req, res) {
		console.log('404')
		return res.status(404).render('404',{
			err:'404 not found!'
		});
	});
	//500 错误中间件
	app.use(function(err,req, res, next) {
		console.log(err.stack);
		return res.status(500).render('500');
	}); 
};