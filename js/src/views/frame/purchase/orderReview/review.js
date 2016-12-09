define(["ui/loading","activity","sweetAlert","jquery","datetimepicker","ejs"],function(loading,Activity){


	var MyActivity = Activity.extend({
		init: function (options) {
			this.options = $.extend({},{
				el:null,
				tempPath:""
			},options);
			this.tempPath = this.options.tempPath;
			this.prductData = JSON.parse(this.getActivityData());
			this.rootEl = this.options.el;
			this.initTalble();
			this.returnPrev();
			this.pageId = this.options.args[0]*1;

		},
		initTalble:function (){
			this.getOrderDetils(function (data){
				if(data.data.logistics.expressMsg){
					var expressMsg = JSON.parse(data.data.logistics.expressMsg);
					data.data.logistics.expressMsg = null;
					data.data.logistics.expressMsg = expressMsg;
				}
				data.data.pageId = this.pageId;
				this.render(data.data);
				this.reName();
				this.initEvents();
			}.bind(this))
		},
		reName:function(){
			this.swiperBox = this.rootEl.find(".js_swiper_box");
		},
		render:function(data){
			var templatePath = this.tempPath + "review.html" + "?r=" + appConfig.version;
			var template = new EJS({
				url:templatePath
			});
			this.rootEl.html(template.render(data));
		},
		initEvents:function(){
			/*订单审核*/
			this.reviewEvent();

			/*获取订单详情*/
			this.getOrderData();
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
					//console.log(data);
				},
			});
		},
		reviewEvent:function (){
			/*审核通过*/
			this.rootEl.on('click','.btn-success.save_data',function (e){
				//http://dev-drp.525happy.cn/shop/purchase/check
				var url = this.API + '/shop/purchase/check';
				var remarktext = this.$('.txtarea textarea').val();
				if(remarktext){
					this.prductData.remark = remarktext.trim();
				}

				this.prductData.status = 1;
				/*当前接口标记*/
				this.prductData.flag = 3;
				this.getData({
					url:url,
					data:this.prductData,
					success:function (data){
						if(data.code=="success"){
							swal({
								title: "",
								text: "审核成功",
								type: "success",
								okCallBack:function (){
									parent.window.location.hash = '#purchase/purchaseManagement';
								}.bind(this),
							});
						}
					}.bind(this),
					error:function (data){
						if(data.code=="failure"){
							swal({
								title: "",
								text: "审核失败",
								type: "error",
							});
						}
					}.bind(this)
				});
				return;

			}.bind(this));
			
			/*审核不通过*/
			this.rootEl.on('click','.btn-danger.cancel',function (e){
				//http://dev-drp.525happy.cn/shop/purchase/check
				var url = this.API + '/shop/purchase/check';
				var remarktext = this.$('.txtarea textarea').val();
				if(remarktext){
					this.prductData.remark = remarktext.trim();
				}
				this.prductData.status = 2;
				/*当前接口标记*/
				this.prductData.flag = 3;
				//console.log(this.prductData);
				this.getData({
					url:url,
					data:this.prductData,
					success:function (data){
						if(data.code=="success"){
							swal({
								title: "",
								text: "操作成功,点击跳转至采购单管理",
								type: "success",
								okCallBack:function (){
									parent.window.location.hash = '#purchase/purchaseManagement';
								}.bind(this)
							});
						}
					}.bind(this),
					error:function (data){
						if(data.code=="failure"){
							swal({
								title: "",
								text: "操作失败",
								type: "error",
							});
						}
					}.bind(this)
				});
				return;
			}.bind(this));
			
		},
		getOrderData:function (){
			var url = this.API + '/shop/purchase/get';
			this.getData({
				url:url,
				data:this.prductData,
				success:function (data){
					log(data);
				},
				error:function(data){
					log(data);
				}
			})
		},
		returnPrev:function (){
			this.rootEl.on('click','.confirm div',function (){
				this.finish();
			}.bind(this))
		}
	});
	return MyActivity;
})