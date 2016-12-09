define(["ui/loading","activity","jquery","bootstrap-table","ejs"],function(loading,Activity){
	window.productReview = function (value,row,index){
		if(row.status=='0'){
			return '<button flag="0" code="confirm" type="button" inStockId ="'+row.inStockId+'" purchaseNo="'+row.purchaseNo+'" class="btn js_btn btn-width btn-success">确认收货</button>';
		}
		if(row.status=='1'){
			return '<button flag="1" code="examine" type="button" inStockId ="'+row.inStockId+'" purchaseNo="'+row.purchaseNo+'" class="btn js_btn btn-width btn-success">审核</button>';
		}
		if(row.status=='2'){
			return '<button flag="2" code="storage" type="button" inStockId ="'+row.inStockId+'" purchaseNo="'+row.purchaseNo+'" class="btn js_btn btn-width btn-success">入库</button>';
		}
		if(row.status=='4'){
			return '<button flag="4" code="looking" type="button" inStockId ="'+row.inStockId+'" purchaseNo="'+row.purchaseNo+'" class="btn js_btn btn-width btn-success">查看</button>';
		}
		if(row.status=='3'){
			return '<button flag="3" code="review" type="button" inStockId ="'+row.inStockId+'" purchaseNo="'+row.purchaseNo+'" class="btn js_btn btn-width btn-danger btn-success notThrough">再次核对</button>';
		}
	};
	window.statusEvent = function (value,row,index){
		if(row.purchaseStatus=='6'){
			return '采购单完成';
		}else{
			return '已发货';
		}
	};
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
			this.get_listData();
			//http://pre-drp.525happy.cn/shop/stock/lis
		},
		reName:function(){
			this.swiperBox = this.rootEl.find(".js_swiper_box");
		},
		onResume:function (data){
			data = data || {};
			if(data.reload){
				location.reload();
			}
		},
		render:function(){
			var templatePath = this.tempPath + "index.html" + "?r=" + appConfig.version;
			var template = new EJS({
				url:templatePath
			});
			this.rootEl.html(template.render());
		},
		initEvents:function(){
			this.rootEl.on("click",".edit_add",function(e){
				var id = $(e.currentTarget).attr("data-id");
				this.openChild({
					url:"addNewComer"
				});
			}.bind(this));
			this.rootEl.on("click",".js_list",function(e){
				var id = $(e.currentTarget).attr("data-id");
				this.open({
					url:"list"
				});
			}.bind(this));
			/*选择类别*/
			this.choice(".category .choice",".category span",function (){
				//log('1111111111111');
			});
			/*选择订单状态*/
			this.choice(".purchasec .choice",".purchasec span",function (){
				this.$('#list').bootstrapTable('refresh');
			}.bind(this));
			
			/*收货状态*/	
			this.receivingStatus();

			/*搜索状态*/
			this.initSearchEvent();
		},
		choice:function (obj,obj2,fn){
			$(obj2).eq(0).show();
			this.rootEl.on("click",obj,function(e){
				$(obj2).removeClass('curr');
				$(e.currentTarget).find('span').addClass('curr');

				fn && fn();
			}.bind(this));
			//fn && fn();
		},
		receivingStatus:function (){
			this.rootEl.on('click','tbody tr td .js_btn',function (e){
				var purchaseNo = this.$(e.currentTarget).attr('purchaseNo');
				var flag = this.$(e.currentTarget).attr('flag');
				var inStockId = this.$(e.currentTarget).attr('inStockId');

				this.open({
					url:"review/"+flag,
					data:{purchaseNo:purchaseNo,inStockId:inStockId}
				});
			}.bind(this));
		},
		get_listData:function (){
			//http://dev-drp.525happy.cn/shop/stock/inWarehouse
			//http://pre-drp.525happy.cn/shop/purchase/list
			var url =this.API+'/shop/instock/list';
			$('#list').bootstrapTable({ url: url,
				method: 'get',
				striped: true,
				processData : false,
				contentType : false,
				queryParams:function(params){
					var data = this.searchData();
					data.limit = params.limit;
					data.offset = params.offset;
					data.flag = 2;
					return data;
				}.bind(this),//���ݲ�����
				sidePagination: "server",
				responseHandler:function(res){
					return res.data;
				},
				formatNoMatches:function(){
					return '搜索内容为空'

				},
				formatLoadingMessage:function(){

				},
				onLoadSuccess:function (){
					this.getmenuId(function (data){
						var bottonData = data.data;
						var allButton = this.$('.btn-success');
						/*控制显示*/
						if(!bottonData){return false};
						for(var i=0;i<bottonData.length;i++){
							(function (code){
								for(var k=0;k<allButton.length;k++){
									var name = $(allButton[k]).attr('code');
									if(name == code){
										$(allButton[k]).addClass('success-curr');
									}
								}
							})(bottonData[i].code)
						}
						/*set显示*/
						for(var k=0;k<allButton.length;k++){
							var isShow = allButton[k].className;
							if(isShow.indexOf('success-curr')==-1){
								var parent = $(allButton[k]).parent();
								$(allButton[k]).remove();
								parent.html('-');
							}
						}
					}.bind(this));
				}.bind(this),

			});
		},
		initSearchEvent:function (){
			this.rootEl.on('click','#search_btn',function (){
				//this.$('#list').attr('refresh','key');
				this.$('#list').bootstrapTable('refresh');
			}.bind(this));
		},
		searchData:function (){
			/*关键字搜索*/
			var data = {};
			var typeNo = this.rootEl.find('.category.btn-group .choice span');
			var oValue = this.findStatus(typeNo);
			var keywords = this.$('#keywords').val().trim();
			if(keywords){
				data[oValue]=keywords;
			}
			/*状态获取*/
			var purchaseNo = this.rootEl.find('.purchasec.btn-group .choice span');
			var statusValue = this.findStatus(purchaseNo);
			/*差一个字段传送状态*/
			if(!(statusValue==0)){
				data.status =  statusValue;
			}
			return data;
		},
		findStatus:function (typeNo){
			var isShowEl;
			for (var i = 0; i < typeNo.length; i++) {
				if (this.$(typeNo[i]).css('display') == 'block') {
					isShowEl = this.$(typeNo[i]);
				}
			}
			return isShowEl.parent().attr('value');
		},
	});
	return MyActivity;
})