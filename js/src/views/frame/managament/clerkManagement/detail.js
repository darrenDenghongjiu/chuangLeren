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
			var templatePath = this.tempPath + "detail.html" + "?r=" + appConfig.version;
			var template = new EJS({
				url:templatePath
			});
			this.rootEl.html(template.render());
		},
		initEvents:function(){
			this.rootEl.on("click",".js_detail",function(e){
				var id = $(e.currentTarget).attr("data-id");
				//debugger;
				this.open({
					url:"detail/" + id
				});
			}.bind(this));
		}
	});
	return MyActivity;
})