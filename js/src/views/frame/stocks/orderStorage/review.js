define(["ui/loading","activity","jquery",'sweetAlert',"ejs"],function(loading,Activity){
	var MyActivity = Activity.extend({
		init: function (options) {
			this.options = $.extend({},{
				el:null,
				tempPath:""
			},options);
			this.tempPath = this.options.tempPath;
			this.rootEl = this.options.el;
			this.purchaseNo = JSON.parse(this.getActivityData());
			this.flag = this.options.args[0];
			this.initData();
		},
		initData:function (){
			this.getPurchaseNoList(function (data){
				this.render(data);
				this.reName();
				this.returnPrev();
				this.initEvents();
				this.storageQuantity();
			}.bind(this));
		},
		reName:function(){
			this.swiperBox = this.rootEl.find(".js_swiper_box");
		},
		render:function(data){
			var templatePath = this.tempPath + "review.html" + "?r=" + appConfig.version;
			var template = new EJS({
				url:templatePath
			});
			data.flag = this.flag;
			this.rootEl.html(template.render(data));
		},
		initEvents:function(){
			//http://dev-drp.525happy.cn/shop/stock/inWarehouse
		},
		getPurchaseNoList:function (callBack){
			///shop/instock/product/list
			//http://dev-drp.525happy.cn/shop/instock/product/select
			var url;
			if(this.flag==1 || this.flag==2 || this.flag==4){
				/*审核 || 入库*/
				url = this.API + '/shop/instock/product/select';
			}else{
				/*确认收货*/
				url = this.API + '/shop/instock/product/list';
			}
			this.getData({
				url:url,
				data:this.purchaseNo,
				success:function (data){
					if(data.code=='success'){
						callBack(data);
					}
				},
				error:function (data){
					//console.log(data);
				}
			});
		},
		returnPrev:function (){
			//looking;
			this.rootEl.on('click','.looking',function (){
				this.finish();
			}.bind(this));
			/*cancelReceipt*/
			this.rootEl.on('click','.cancelReceipt',function (e){
					this.finish({reload:true});
			}.bind(this));
			/*confirmReceipt*/
			this.rootEl.on('click','.confirmReceipt',function (e){
				var dataJson;
				var newArr = [];
				var group = this.$('tbody tr');
				var arrValue = this.$('input.form-control.enter');
				group.each(function (index,name){
					var purchaseproductid = this.$(name).attr('purchaseproductid');
					var purchaseno = this.$(name).attr('purchaseno');
					var inStockId = this.$(name).attr('inStockId');
					var storagequantity = arrValue.eq(index).val().trim();
					if(storagequantity*1>=1){
						newArr.push({
							purchaseProductId:purchaseproductid,
							purchaseNo:purchaseno,
							inStockQuantity:storagequantity,
							inStockId:inStockId
						});
					}
				}.bind(this));
				if(!(newArr[0])){
					swal({
						title:'',
						text:'请输入数量!',
						type:'warning'
					});
					return;
				}
				var url;
				var data3 = {};
				if(this.flag == 3){
					/*再次审核*/
					url = this.API + '/shop/instock/check';
					data3.status = 2;
					data3.inStockId = this.$(e.currentTarget).attr('inStockId');
					dataJson = data3;
				}else{
					/*确认收货*/
					url = this.API + '/shop/instock/confirmReceipt';
					dataJson = {confirmReceiptJson:JSON.stringify(newArr)};
				}

				this.getData({
					url:url,
					data:dataJson,
					success:function (data){
						if(data.code=='success'){
							swal({
								title:'',
								text:'操作成功!',
								type:'success',
								okCallBack:function (){
									this.finish({reload:true});
								}.bind(this),
							});
						}
					}.bind(this),
					error:function (data){
						//console.log(data);
					}
				});
			}.bind(this));

			//save_data review
			this.rootEl.on('click','.review',function (e){
				//2:收货审核通过
				//3:收货审核不通过
				var url = this.API + '/shop/instock/check';
				var _value = this.$(e.currentTarget).attr('_value');
				var inStockId = this.purchaseNo.inStockId;
				this.getData({
					url:url,
					data:{
						status:_value,
						inStockId:inStockId,
					},
					success:function (data){
						if(data.code=="success"){
							swal({
								title:'',
								text:'操作成功!',
								type:'success',
								okCallBack:function (){
									this.finish({reload:true});
								}.bind(this),
							});
						}
					}.bind(this),
					error:function (data){
						if(data.code=="failure"){
							swal({
								title:'',
								text:'操作失败!',
								type:'error',
								okCallBack:function (){
									this.finish();
								}.bind(this),
							});
						}
					}.bind(this),
				});
			}.bind(this));

			//save_data.stroge
			this.rootEl.on('click','.save_data.stroge',function (e){
				//http://dev-drp.525happy.cn/shop/stock/inWarehouse
				var url = this.API + '/shop/stock/inWarehouse';
				var inStockId = this.$(e.currentTarget).attr('instockid');
				this.getData({
					url: url,
					data: {
						inStockId: inStockId,
					},
					success: function (data) {
						swal({
							title:'',
							text:'操作成功!',
							type:'success',
							okCallBack:function (){
								this.finish({reload:true});
							}.bind(this),
						});
					}.bind(this),
					error:function (){
						this.finish({reload:true});
					},
				});
			}.bind(this));
		},
		storageQuantity:function (){
			this.rootEl.on('input','.form-control.enter',function (e){
				var aMount = this.$(e.currentTarget).attr('_value');
				var currValue = this.$(e.currentTarget).val();
				if(currValue*1>aMount*1){
					this.$(e.currentTarget).val(aMount);
				}
			}.bind(this));
		},
		
	});
	return MyActivity;
})