define(["activity","sweetAlert","jquery","bootstrap-table","ui/formatter","ejs"],function(Activity){

	var MyActivity = Activity.extend({
		init: function (options) {
			this.options = $.extend({},{
				el:null,
				tempPath:""
			},options);
			this.tempPath = this.options.tempPath;
			/*获取浏览器的数据*/
			this.prductData = JSON.parse(this.getActivityData());
			this.rootEl = this.options.el;
			this.render();
			this.reName();
			this.initEvents();
			this.get_listData();
			/**/
		},
		reName:function(){
			this.swiperBox = this.rootEl.find(".js_swiper_box");
		},
		render:function(){
			var templatePath = this.tempPath + "addOrders.html" + "?r=" + appConfig.version;
			var template = new EJS({
				url:templatePath
			});
			this.rootEl.html(template.render());
		},
		initEvents:function(){
			
			/*保存订单*/
			this.saveOrder();
			/*取消订单*/
			this.cecalOrder();
			/*改变数量*/
			this.changeAmount();
		},
		saveOrder:function (){
			this.rootEl.on("click",".btn-success.save_data",function(e){
				if(this.prductData.data){
					saveData = this.prductData.data;
				}else{
					saveData = this.prductData;
				}

				/*处理有数据的商品*/
				var havePrice;
				var saveDataArr = [];
				this.$('tbody .countAmount').each(function (index,name){
						havePrice = this.$(name).html();
						/*检查是否有采购*/
					    if(!(isNaN(havePrice*1))){
							/*查出skuid*/
							var skuId = this.$(name).siblings('.skuId').html();
							/*查出采购数量*/
							var quantity = this.$(name).siblings('.amount').find('input').val();
							for(var i=0;i<saveData.length;i++){
								if(skuId==saveData[i].skuId){
									delete saveData[i].delete;
									delete saveData[i].amount
									saveData[i]['quantity'] = quantity*1;
									saveDataArr.push(saveData[i]);
								}
							}
						}
				}.bind(this));
				log(saveDataArr);
				var url = this.API + '/shop/purchase/save';
				if(saveDataArr[0]) {
					this.getData({
						url: url,
						type:'post',
						data:{purchaseJson: JSON.stringify(saveDataArr)},
						success: function (data) {
							if(data.code=='success'){
								//swal('添加订单成功','','success');
								swal({
									title:'',
									text:'添加订单成功',
									type:'success',
									okCallBack:function (){
										parent.window.location.hash = '#purchase/purchaseManagement';
									}
								});

							}
						},
						error: function (data) {
							log(data);
							if(data.code=='failure'){
								swal({
									title:'',
									text:'添加订单失败',
									type:'error',
								});
							}
						}
					})
				}else{
					swal({
						title:'',
						text:'请输入数量',
						type:'warning',
					});
				}
				//swal('添加订单成功','','success')
			}.bind(this));


		},
		cecalOrder:function (){
			this.rootEl.on("click",".cancel",function(e){
				this.finish();
			}.bind(this));
		},
		get_listData:function (){
			var $table = this.rootEl.find('#contList');
			//$table.bootstrapTable('load');
			var resNewData;
			/*下面的存储方式变了判断*/
			if(this.prductData.data){
				resNewData= this.prductData.data;
			}else{
				resNewData = this.prductData;
			}
			/*设置两个input框*/
			for(var i=0;i<resNewData.length;i++){
				resNewData[i]['amount'] = '<input  class="form-control enter" _value="'+resNewData[i].stock+'" type="text" placeholder="输入数量" />';
				resNewData[i]['delete'] = '<button class="btn btn-default" type="button" >'
					+'<span class="glyphicon glyphicon-trash gray"></span></button>';
			}
			/*添加数据*/
			$table.bootstrapTable({'data':resNewData});

			$table.bootstrapTable('mergeCells', {
				index: 0,
				field: 'discount',
				//colspan: 2,
				rowspan: resNewData.length,
			});
			if(resNewData[0]){
				this.$('tbody .discount').html(resNewData[0].discount+'%');
			}

			/*删除某一个*/
			this.rootEl.on('click','tbody td.remove .btn',function (e){
				var skuid = this.rootEl.find(e.currentTarget).parent().parent().find('.skuId').html();
				for(var i=0;i<resNewData.length;i++){
					if(resNewData[i].skuId==skuid){
						resNewData.splice(i,1);
						this.removeItem('addOrders');
						this.setItem('addOrders',resNewData);
					}
				}
				$(e.currentTarget).parent().parent().remove();
				//console.log();
				var discount = $('td.discount');
				//console.log(discount.length);
				if(!discount.length){
					swal({
						title:'',
						text:'你的采购单商品已经清空了！',
						confirmButtonText:'返回',
						okCallBack:function (){
							this.finish();
						}.bind(this)
					});
				}
				$(discount[0]).css({display:'table-cell'});
				$(discount[0]).attr('rowspan',discount.length);

			}.bind(this));

		},
		changeAmount:function (){
			this.rootEl.on('input','.form-control.enter',function (e){
				//this.value=this.value.replace(/\D/g,'');
				var valueData = this.$(e.currentTarget).val().replace(/\D/g,'');
				this.$(e.currentTarget).val(valueData);
				var _value = this.$(e.currentTarget).attr('_value');
				var realValue = this.$(e.currentTarget).val();
				var countAmount = this.$(e.currentTarget).parents('td').siblings('.countAmount');
				var realPay = this.$(e.currentTarget).parents('td').siblings('.realPay');
				var resNewData;
				/*下面的存储方式变了判断*/
				if(this.prductData.data){
					resNewData= this.prductData.data;
				}else{
					resNewData = this.prductData;
				}

				var realPrice = this.$(e.currentTarget).parents('td').siblings('.price').html();
				/*总计价格*/
				countAmount.html((realValue*realPrice).toFixed(2));
				realPay.html((realValue*realPrice*(resNewData[0].discount/100)).toFixed(2));
				if(realValue*1>_value*1){
					/*实际数量*/
					this.$(e.currentTarget).val(_value);
					//countAmount.html(realValue*realPrice);

					/*总计价格*/
					realValue = this.$(e.currentTarget).val();
					countAmount.html((realValue*realPrice).toFixed(2));
					realPay.html((realValue*realPrice*(resNewData[0].discount/100)).toFixed(2));

					var $table = $('#table'),
						$button = $('#button');
					return;
				}
			}.bind(this));
		}
	});
	return MyActivity;
})