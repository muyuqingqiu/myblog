module.exports = function(grunt){
	//加载插件
	[
		'grunt-cafe-mocha',
		'grunt-contrib-jshint',
		'grunt-exec'
	].forEach(function(task){
		grunt.loadNpmTasks(task);
	});
	//插件配置
	grunt.initConfig({
		cafemocha: {
			all:{sec:'qa/tests-*.js',options:{ui:'tdd'}}
		},
		jshint: {
			app:['app.js','public/javascripts/**/*.js','lib/**/*.js'],
			qa:['Gruntfile.js','public/qa/**/*.js','qa/**/*.js']
		}
	});
	//注册任务
	grunt.registerTask('default',['cafemocha','jshint']);
}
