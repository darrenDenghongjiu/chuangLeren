define(["ui/loading","activity","jquery",'sweetAlert',"bootstrap-table",'ui/formatter',"ejs"],function(loading,Activity){
	window.stateFormatter =function(value, row, index){
		//console.log(row);

		if(parseFloat(row.stock)) {

		}else{
			if (index || index==0) {
				return {
					disabled: true,
				}
			}
		}
		return value;
	}
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
			this.creatProductType();
			this.initSearch();
			this.discount = '';
			this.dataCount = {};
			this.getMultiPageData();
			this.MultiPageData = {};
			this.page = {};
			this.newPage = {};
			this.newArr= [];
		},
		getMultiPageData:function (){

		},
		onResume:function (){
			/*必须从新加载 数据有可能改变*/;

			//location.reload();
			this.$('#list').bootstrapTable('refresh');
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
			this.rootEl.on("click",".js_list",function(e){
				var id = $(e.currentTarget).attr("data-id");
				this.open({
					url:"list"
				});
			}.bind(this));
			/*添加采购单*/
			this.addOrders();
			//http://dev-drp.525happy.cn/shop/queryCondotion/init?flag=1
		},
		productType:function(callBack){
			var url = this.API + '/shop/queryCondotion/init';
			this.getData({
				url:url,
				data:{flag:0},
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
		creatProductType:function (data){
			this.productType(function (data){
				/*类型创建*/
				var selectType = this.$('.form-control.type');

				var selectBrand = this.$('.form-control.brand');
				selectType.append('<option value="">全部</option>');
				var data = data.data;
				for(var i= 0, o;o=data[i];i++){
					selectType.append('<option value="'+o.typeId+'">'+ o.typeName+'</option>');
				}
				/*类型商品品牌创建*/
				this.rootEl.on('change','.form-control.type',function (e){
					this.$('#list').bootstrapTable('refresh');
					selectBrand.html('');
					var _value = this.$(e.currentTarget).val();
					if(!_value){
						selectBrand.parent().parent().removeClass('curr');
					}
					for(var i= 0, o;o=data[i];i++){
						if(o.typeId == _value){
							brands = o.brands;
							selectBrand.append('<option value="">全部</option>');
							selectBrand.parent().parent().addClass('curr');
							for(var j= 0, k;k=brands[j];j++){
								selectBrand.append('<option value="'+ k.brandId+'">'+ k.brandName+'</option>');
							}
						}
					}
				}.bind(this));
			}.bind(this));
		},
		addOrders:function (){
			this.rootEl.on("click",".confirmOrder",function(e){
				var newData = [];
				var newPage = this.newPage;
				for(var name in newPage){
					delete newPage[name]['0'];
					newData.push(newPage[name]);
				}

				if(!newData[0]){
					swal({
						title:'',
						text:'请选择你要添加的商品',
						type:'warning',
					});
					return;
				}else{
					newData[0].discount = this.discount;
					this.open({
						url:'addOrders',
						data:{
							data:newData,
						}
					});
				}
		}.bind(this));
		},
	addSkuId:function (){
			/*添加自定属性给每个input*/
			var getData = this.$('#list').bootstrapTable('getData');
			var aInput =  this.$('tbody input');
			for(var i = 0,k;k=getData[i];i++ ){
				this.$(aInput[i]).attr('_value', k.skuId);
			}
	},
	addCurrData:function (){
		this.MultiPageData = {};
		var pageData = this.$('#list').bootstrapTable('getAllSelections');
		console.log(pageData);
		/*先赋值*/
		for(var i= 0,k;k=pageData[i];i++){
			if(k.stock!=0){
				this.MultiPageData[k.skuId] = k;
			}
		}
		return this.MultiPageData;
	 },
	 sortArr:function (page){
		this.newPage = {};
		for(var name in page ){
			var nextPage = page[name];
			for(var next in nextPage){
				this.newPage[next] = nextPage[next];
			}
		}
		return  this.newPage;
	},
	settingCurrCheck:function (newPage,skuId){
		for(var name in newPage){
			if(name == skuId){
				var findAInput = this.$('tbody input');
				var prevName = name;
				/*找出选中的*/
				// $table.bootstrapTable('check', 1);
				//$table.bootstrapTable('check', 1);
				//$table.bootstrapTable('uncheck', 1)
				findAInput.each(function (index,name){
					var oValue = this.$(name).attr('_value');
					if(prevName == oValue){
						this.$(name).parent().parent().addClass('selected');
						this.$(name).each(function (index,name){
							var currIndex = this.$(name).attr('data-index');
							this.$('#list').bootstrapTable('check',currIndex*1);
						}.bind(this));
					}
				}.bind(this));
			}
		}
	},
	getCountPage:function () {

			/*获取当前key*/
			var key = this.$('.page-number.active a').html();
			this.page[key] = this.addCurrData();
			this.newPage = this.sortArr(this.page);
			var newPage = this.newPage;
			/*限制个数*/
			var str = '';
			for(var name in newPage){
				str +=(name+JSON.stringify(newPage[name])+'=');
			}
			if((str.split('=').length-1)>50){
				swal({
					title:'',
					text:'不能超过50',
					type:'warning'
				});
				this.newPage = {};
				var n = 0;
				for(var name in newPage){
					n++
					if(n<=50) {
						this.newPage[name] = newPage[name];
					}
				}
			}
	},
	getCurrPageData:function (){
		var getData = this.$('#list').bootstrapTable('getData');
		var newPage = this.newPage;
		for(var i= 0,k;k=getData[i];i++){
			this.settingCurrCheck(newPage,k.skuId);
		}
	},
	get_listData:function (){
			var url =this.API+'/shop/purchase/products';
			/*http://dev-drp.525happy.cn/shop/purchase/products*/
			var n = 0;
			$('#list').bootstrapTable({
				url: url,
				method: 'get',
				striped: true,
				processData : false,
				contentType : false,
				queryParams:function(params){
					var data = this.searchData();
					data.limit = params.limit;
					data.offset = params.offset;
					return  data;
				}.bind(this),
				sidePagination: "server",
				responseHandler:function(res){
					this.discount = res.data.discount;
					return res.data;
				}.bind(this),
				formatNoMatches:function(){
					return '搜索内容为空';
				},
				formatLoadingMessage:function(){
					//alert(12233);

				}.bind(this),
				onLoadSuccess:function (){
					this.addSkuId();
					/*设置*/
					this.getCurrPageData();

					/*设置权限*/
					this.getmenuId(function (data){
						var bottonData = data.data;
						var confirmOrder = this.$('.confirmOrder');
						var code = confirmOrder.attr('code');
						if(bottonData){
							if(code== bottonData[0].code){
								confirmOrder.addClass('success-curr');
							}
						}
					}.bind(this));
				}.bind(this),
				onCheck:function (data){
					this.getCountPage();
				}.bind(this),
				onCheckAll:function (){
					this.getCountPage();
				}.bind(this),
				onUncheck:function (){
					this.getCountPage();
				}.bind(this),
				onUncheckAll:function (){
					this.getCountPage();
				}.bind(this),
			});
		},
		searchData:function (){
			var isRefresh = this.$('#list').attr('refresh');
			/*关键字搜索*/
			var data = {};
			var keywords = $('#keywords').val();
			var type = $('.form-control.type').val();
			var brand = $('.form-control.brand').val();
			if(type){
				data.typeId = type;
			}
			if(brand){
				data.brandId = brand;
			}
			if(keywords){
				data.productName = keywords.trim();
			}
			return data;
		},
		initSearch:function (){
			this.rootEl.on('click','#search_btn',function (){
				this.$('#list').bootstrapTable('refresh');
			}.bind(this));
			this.rootEl.on('change','.form-control.brand',function (){
				this.$('#list').bootstrapTable('refresh');
			}.bind(this));
		}
	});
	return MyActivity;
})