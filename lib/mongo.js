var config = require('config-lite');
var Mongolass = require('mongolass');
var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');
var mongolass = new Mongolass();
//根据id生成创建时间created_at
mongolass.plugin('addCreateAt', {
	afterFind: function(results) {
		results.forEach(function(item) {
			item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
		})
		return results;
	},
	afterFindOne: function(result) {
		if(result) {
			result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
		}
		return result;
	}
})

//连接数据库
mongolass.connect(config.mongodb);
//定义用户数据的模式
exports.User = mongolass.model('User', {
	username: {
		type: 'string'
	},
	password: {
		type: 'string'
	},
	avatar: {
		type: 'string'
	},
	gender: {
		type: 'string',
		enum: ['m', 'f', 'x']
	},
	bio: {
		type: 'string'
	}
});
exports.User.index({
	username: 1
}, {
	unique: true
}).exec(); //根据用户名找到用户，用户名全局唯一