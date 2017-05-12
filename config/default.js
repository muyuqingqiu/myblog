var path = require('path');
module.exports = {
	port: 8081,
	session: {
		secret: 'myblog',
		key: 'myblog',
		maxAge:2592000000
	},
	mongodb:'mongodb://localhost:27017/myblog',
	dirs:{
		baseDir:path.join(__dirname,'./../'),
		imageDir:path.join(__dirname,'./../public/images')
	}
} 
