var config = require('config-lite');
var Mongolass = require('mongolass');
var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');
var mongolass = new Mongolass();
//根据id生成创建时间created_at
mongolass.plugin('addCreatedAt', {
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
//文章数据模式
exports.Post = mongolass.model('Post', {
	author: {
		type: Mongolass.Types.ObjectId
	},
	title: {
		type: "string"
	},
	content: {
		type: "string"
	},
	pv: {
		type: "number"
	}
})
//定义留言的模式
exports.Comment = mongolass.model('Comment',{
	author:{
		type:Mongolass.Types.ObjectId
	},//留言用户id
	content:{
		type:'string',
	},
	postId:{
		type:Mongolass.Types.ObjectId
	}//关联文章id
})

//根据用户名找到用户，用户名全局唯一
exports.User.index({
	username: 1
}, {
	unique: true
}).exec(); 
//按照创建时间降序查看用户的文章列表
exports.Post.index({
	author: 1,
	_id: -1
}).exec();
//通过文章id获取该文章所有id，且按照留言时间排序
exports.Comment.index({
	postId:1,
	_id:1
}).exec();
//通过文章id和留言用户id删除一条留言
exports.Comment.index({
	author:1,
	_id:1
}).exec();