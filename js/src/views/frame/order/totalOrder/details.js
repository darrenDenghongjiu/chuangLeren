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
			this.getPrevData = this.getActivityData();
			this.initPageData();
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
		initPageData:function (){
			this.getOrderData(function (data){
				this.render(data);
				this.reName();
				this.initEvents();
			    //this.getOrderData();
			}.bind(this));
		},
		getOrderData:function (callBack){
			callBack = callBack || function (){};
			var url = this.API + '/order/detail/get';
			var getPrevData = JSON.parse(this.getPrevData);
			this.getData({
				url:url,
				data:getPrevData,
				success:function (data){
					if(data.code=='success'){
						callBack(data);
					}
				},
				error:function (data){
					//console.log(data);
				}
			})
		},
		initEvents:function(){
			this.rootEl.on('click','.confirm',function(){
				this.finish();
			}.bind(this))
			//this.finish(); /*可以回到上一个页面*/
			/*查看这个人或者总计的数量*/
		},
	});
	return MyActivity;
})