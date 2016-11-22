var Post = require('../lib/mongo').Post;
var marked = require('marked');
Post.plugin('contentToHtml',{
	afterFind: function(posts){
		return posts.map(function(post){
			post.content = marked(post.content);
			return post;
		});
	},
	afterFindOne: function(post){
		if(post){
			post.content = marked(post.content);
		}
		return post;
	}
})
module.exports = {
	create: function create(post){
		return Post.create(post).exec();
	},
	//通过id获得一片文章
	getPostById: function getPostById(postId){
		return Post
			.findOne({_id: postId})
			.populate({path:'author',model:'User'})
			.addCreatedAt()
			.contentToHtml()
			.exec();
	},
	//按创建时间降序获取所有用户文章或某个特定用户所有文章
	getPosts:function getPosts(author){
		var query = {};
		if(author){
			query.author = author;
		}
		return Post
			.find(query)
			.populate({path:'author',model:'User'})
			.sort({_id:-1})
			.addCreatedAt()
			.contentToHtml()
			.exec();
	},
	//通过文章id给pv加1
	incPv: function incPv(postId){
		return Post
			.update({_id:postId},{$inc:{pv:1}})
			.exec();
	},
	//通过文章id获得篇用于编辑的原生文章
	getRawPostById:function getRawPostById(postId){
		return Post
			.findOne({_id:postId})
			.populate({path:'author',model:'User'})
			.exec();
	},
	//通过用户id和文章id更新一篇文章
	updatePostById: function updatePostById(postId,author,data){
		return Post.update({author:author,_id:postId},{$set:data}).exec();
	},
	//通过用户id和文章id删出一篇文章
	delPostById: function delPostById(postId,author){
		return Post.remove({author:author,_id:postId}).exec();
	}
}
