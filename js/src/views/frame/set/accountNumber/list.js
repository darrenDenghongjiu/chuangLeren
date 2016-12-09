define(["ui/loading","activity","jquery","ejs"],function(loading,Activity){
	var MyActivity = Activity.extend({
		init: function (options) {
			this.options = $.extend({},{
				el:null,
				tempPath:""
			},options);
			this.tempPath = this.options.tempPath;
			this.rootEl = this.options.el;
			this.render();
			this.reName();
			this.initEvents();
		},
		reName:function(){
			this.swiperBox = this.rootEl.find(".js_swiper_box");
		},
		render:function(){
			var templatePath = this.tempPath + "list.html" + "?r=" + appConfig.version;
			var template = new EJS({
				url:templatePath
			});
			this.rootEl.html(template.render());
		},
		initEvents:function(){
			this.rootEl.on("click",".js_detail",function(e){
				this.open({
					url:"index"
				});
			}.bind(this));
		}
	});
	return MyActivity;
})