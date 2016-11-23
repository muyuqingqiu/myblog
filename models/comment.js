var Comment = require('../lib/mongo').Comment;
var marked = require('marked');
// 将 comment 的 content 从 markdown 转换成 html
Comment.plugin('contentToHtml', {
  afterFind: function (comments) {
    return comments.map(function (comment) {
      comment.content = marked(comment.content);
      return comment;
    });
  }
});
module.exports = {
	createComment: function createComment(comment){
		return Comment.create(comment).exec();
	},
	//通过用户id和留言id删除一个留言
	delCommentById: function delCommentById(commentId,author){
		return Comment.remove({_id:commentId,author:author}).exec(); 
	},
	// 通过文章 id 获取该文章下所有留言，按留言创建时间升序
	getComments: function getComments(postId){
		return Comment.find({postId:postId})
			.populate({ path: 'author', model: 'User' })
			.sort({ _id: 1 })
			.addCreatedAt()
			.contentToHtml()
			.exec();
	},
	// 通过文章 id 获取该文章下留言数
	getCommentsCount: function getCommentsCount(postId) {
		return Comment.count({ postId: postId }).exec();
	}
}
