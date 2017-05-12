var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var UserModel = require('../models/users');
var checkLogin = require('../middlewares/check').checkLogin;
var PostModel = require('../models/posts');
var CommentModel = require('../models/comment');
//GET /posts 所有用户或者特定用户的文章页
// eg:GET/posts?author=xxx
router.get('/', function(req, res, next) {
	var author = req.query.author;
	PostModel.getPosts(author)
		.then(function(posts) {
			return res.render('posts', {
				posts: posts,
				title: '主页',
				pageTestScript: 'qa/tests-posts.js'
			});
		})
		.catch(next);

})
//GET /posts/create 发表文章页
router.get('/create', checkLogin, function(req, res, next) {
	return res.render('createPost');
})
//POST /posts 发表一篇文章
router.post('/', checkLogin, function(req, res, next) {
	var author = req.session.user._id;
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		var title = fields.title;
		var content = fields.content;
		//校验参数
		try {
			if(!title.length) {
				throw new Error("请填写标题");
			}
			if(!content.length) {
				throw new Error("请填写内容");
			}
		} catch(e) {
			req.flash('error', e.message);
			return res.redirect('back');
		}
		var post = {
			author: author,
			title: title,
			content: content,
			pv: 0
		};
		PostModel.create(post)
			.then(function(result) {
				//此psot是插入mongodb后的值，包含_id
				post = result.ops[0];
				req.flash('success', '发表成功');
				return res.redirect(`/posts/${post._id}`);
			})
			.catch(next);
	});

})
//GET /posts/:postId 单独一篇文章页
router.get('/:postId', function(req, res, next) {
	var postId = req.params.postId; //获取get的参数
	Promise.all([
			PostModel.getPostById(postId), //获取文章信息
			CommentModel.getComments(postId), //获取留言  
			PostModel.incPv(postId) //pv加1
		]).then(function(result) {
			var post = result[0];
			var comments = result[1];
			if(!post) {
				return res.render('404', {
					err: '该文章不存在！'
				})
			}
			return res.render('post', {
				post: post,
				comments: comments
			})
		})
		.catch(next);
})
// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function(req, res, next) {
	var postId = req.params.postId;
	var author = req.session.user._id;
	PostModel.getRawPostById(postId)
		.then(function(post) {
			if(!post) {
				throw new Error('该文章不存在');
			}
			if(author.toString() !== post.author._id.toString()) {
				throw new Error('权限不足');
			}
			return res.render('edit', {
				post: post
			})
		})
		.catch(next);
});

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function(req, res, next) {
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		var title = fields.title;
		var content = fields.content;
		var postId = req.params.postId;
		var author = req.session.user._id;
		try {
			if(!title.length) {
				throw new Error('标题长度应大于0');
			}
			if(!content.length) {
				throw new Error('内容长度应大于0');
			}
		} catch(e) {
			req.flash('error', e.message);
			return res.redirect('back');
		}
		var post = {
			title: title,
			content: content
		};
		PostModel.updatePostById(postId, author, post)
			.then(function(result) {
				if(result) {
					req.flash('success', '更新成功');
					return res.redirect(`/posts/${postId}`);
				}
			})
	})

});
// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function(req, res, next) {
	var postId = req.params.postId;
	var author = req.session.user._id;
	PostModel.delPostById(postId, author)
		.then(function(result) {
			req.flash('success', '删除成功');
			return res.redirect('/posts');
		})
});
// POST /posts/:postId/comment 创建一条留言
router.post('/:postId/comment', checkLogin, function(req, res, next) {
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		var content = fields.content;
		var postId = req.params.postId;
		var author = req.session.user._id;
		try {
			if(!content) {
				throw new Error('留言内容不能为空!');
			}
		} catch(e) {
			req.flash('error', e.message);
			return res.redirect('back');
		}
		var comment = {
			content: content,
			postId: postId,
			author: author
		}
		CommentModel.createComment(comment)
			.then(function(result) {
				req.flash('success', '留言成功');
				return res.redirect(`/posts/${postId}`);
			})
			.catch(next);

	})
});
// GET /posts/:postId/comment/:commentId/remove 删除一条留言
router.get('/:postId/comment/:commentId/remove', checkLogin, function(req, res, next) {
	return res.send(req.flash());
});
module.exports = router;