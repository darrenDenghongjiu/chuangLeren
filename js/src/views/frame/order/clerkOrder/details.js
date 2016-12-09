define(["ui/loading","activity","jquery","datetimepicker","ejs"],function(loading,Activity){
	var MyActivity = Activity.extend({
		init: function (options) {
			this.options = $.extend({},{
				el:null,
				tempPath:""
			},options);
			//this.id = this.options.args[0];
			//this.aid = this.options.args[1];
			this.tempPath = this.options.tempPath;
			this.rootEl = this.options.el;
			this.render();
			this.reName();
			this.initEvents();
			//this.options
			log(this.options);
		},
		reName:function(){
			this.swiperBox = this.rootEl.find(".js_swiper_box");
		},
		render:function(){
			var templatePath = this.tempPath + "details.html" + "?r=" + appConfig.version;
			var template = new EJS({
				url:templatePath
			});
			this.rootEl.html(template.render());
		},
		initEvents:function(){

			
			//this.finish(); /*可以回到上一个页面*/
			
	
			
			/*查看这个人或者总计的数量*/
		},
	});
	return MyActivity;
})