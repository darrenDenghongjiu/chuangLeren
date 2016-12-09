{
	appDir: './src/',
	baseUrl: './',
	paths: {
		zepto:"lib/zepto/1.1.6/zepto",
		jquery:"lib/jquery/3.1.0/jquery",
		ejs:"lib/ejs/1.0.0/ejs",
		fastClick:"lib/fastClick/0.6.7/fastClick",
		swiper:"lib/swiper/3.3.1/swiper",
		weixin:"lib/weixin/1.0.0/weixin",
		router:"lib/router/router",
		class:"lib/class/class",
		pingpp:"lib/pingpp/2.1.5/pingpp",
		workspace:"workspace/workspace",
		activityManage:"activity/activityManage",
		activity:"activity/activity"
	},
	dir: './dest',
	fileExclusionRegExp: /^((r|build)\.js)|\.svn|_notes$/,
	optimizeCss: 'standard',
	removeCombined: true,
	modules: [{
		name: 'main'
	}]
}
