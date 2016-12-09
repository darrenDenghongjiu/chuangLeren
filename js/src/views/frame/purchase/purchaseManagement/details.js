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
			this.prductData = JSON.parse(this.getActivityData());
			this.initTalble();
			this.returnPrev();
		},
		initTalble:function (){
			this.getOrderDetils(function (data){
				if(data.data.logistics.expressMsg){
					var expressMsg = JSON.parse(data.data.logistics.expressMsg);
					data.data.logistics.expressMsg = null;
					data.data.logistics.expressMsg = expressMsg;
				}
				this.render(data.data);
				this.reName();
				this.initEvents();
			}.bind(this))
		},
		reName:function(){
			this.swiperBox = this.rootEl.find(".js_swiper_box");
		},
		render:function(data){
			var templatePath = this.tempPath + "details.html" + "?r=" + appConfig.version;
			var template = new EJS({
				url:templatePath
			});
			this.rootEl.html(template.render(data));
		},
		initEvents:function(){

			//this.finish(); /*可以回到上一个页面*/
			/*查看这个人或者总计的数量*/
		},
		getOrderDetils:function (callBack){
			var url = this.API + '/shop/purchase/get';
			this.getData({
				url:url,
				data:this.prductData,
				success:function (data){
					if(data.code=="success"){
						callBack(data);
					}
				},
				error:function (data){
					
				},
			});
		},
		returnPrev:function (){
			this.rootEl.on('click','.confirm div',function (){
				this.finish();
			}.bind(this))
		}
	});
	return MyActivity;
})