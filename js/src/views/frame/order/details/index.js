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
			var templatePath = this.tempPath + "index.html" + "?r=" + appConfig.version;
			var template = new EJS({
				url:templatePath
			});
			this.rootEl.html(template.render());
		},
		initEvents:function(){
			//this.rootEl.on("click",'.details',function (){
				//this.open({
					//url:"detail/",
				//});
			//}.bind(this));
			
			this.rootEl.on("click",".edit_add",function(e){
				
				var id = $(e.currentTarget).attr("data-id");
				
				this.openChild({
					url:"addNewComer"
				});
				//this.finish(); /*可以回到上一个页面*/
				
			}.bind(this));
			
			this.rootEl.on("click",".js_list",function(e){
				var id = $(e.currentTarget).attr("data-id");
				this.open({
					url:"list"
				});
			}.bind(this));
		}
	});
	return MyActivity;
})