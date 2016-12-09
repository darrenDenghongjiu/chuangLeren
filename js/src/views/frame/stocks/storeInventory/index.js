define(["ui/loading","activity","jquery",'bootstrap-table',"ejs"],function(loading,Activity){
	window.bandAndFormat = function (value,row,index){
			return (row.productName +' '+row.skuName);
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
			this.initTable();
			this.queryCondotion();
			this.keySearch();
			//http://dev-drp.525happy.cn/shop/instock/product/list
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
		//http://dev-drp.525happy.cn/shop/queryCondotion/init

		queryCondotion:function (){
			var url = this.API + '/shop/queryCondotion/init';
			this.getData({
				url:url,
				data:{flag:1},
				success:function (data){
					this.brandSelect(data);
				}.bind(this),
				error:function (){
					
				}

			});
		},
		brandSelect:function (data){
			var oStore = this.$('.change.store');
			var arrType = data.data;
			var brandType = this.$('.condition.brandType');
			var oType = this.$('.change.type');
			var oBrand = this.$('.condition.brand');
			var changeBrand = this.$('.change.brand');


			this.rootEl.on('change','.change.store',function (e){
				var _value = $(e.currentTarget).val();
				var index = $(e.currentTarget)[0].selectedIndex;
				var ele = $('option:selected',e.currentTarget);
				var data = ele.data("data");
				if(!_value){
					brandType.css({opacity:0});
					oBrand.css({opacity:0});
					return;
				}
				brandType.css({opacity:1});
				changeBrand.html('');
				changeBrand.append('<option value="">请选择</option>');
				type(data);
			}.bind(this));

			this.rootEl.on('change','.change.type',function (e){
				var _value = $(e.currentTarget).val();
				if(!_value){
					oBrand.css({opacity:0});
					return;
				}
				oBrand.css({opacity:1});
				var index = $(e.currentTarget)[0].selectedIndex;
				var ele = $('option:selected',e.currentTarget);
				var data = ele.data("data");
				brand(data)
			}.bind(this));

			/*门店数据*/
			oStore.append('<option value="">请选择</option>');
			for(var i= 0,k;k=arrType[i];i++){
				var $option = $('<option value="'+ k.shopId+'">'+ k.shopName+'</option>');
				$option.data("data", k.types);
				oStore.append($option);
			}
			
			/*品牌类型数据*/
			function type(data){
				oType.html('');
				oType.append('<option value="">请选择</option>');
				for(var i=0;i<data.length;i++){
					var $option = $('<option value="'+data[i].typeId+'">'+data[i].typeName+'</option>');
					$option.data("data",data[i].brands);
					oType.append($option);
				}
			}
			/*商品品牌数据*/
			function brand(data){
				changeBrand.html('');
				changeBrand.append('<option value="">请选择</option>');
				for(var i=0;i<data.length;i++){
					var $option = $('<option value="'+data[i].brandId+'">'+data[i].brandName+'</option>');
					changeBrand.append($option);
				}
			}
			/**/
			//http://pre-drp.525happy.cn/shop/queryCondotion/init?flag=1
			/*
			var oType = this.$('.change.type');
			var arrType = data.data;
			oType.append('<option value="">'+'请选择'+'</option>');
			for(var i = 0,o; o=arrType[i]; i++){
				oType.append('<option value="'+ o.typeId+'">'+ o.typeName+'</option>');
			}
			var oBrand = this.$('.change.brand');

			var conditionBrand = this.$('.condition.brand');

			this.rootEl.on('change','.change.type',function (e){
				var _value = e.currentTarget.value;
					for(var i = 0,o; o=arrType[i]; i++){
						if(o.typeId==_value){
							oBrand.html('');
							if(!(o.brands[0])){
								conditionBrand.css({opacity:0});
								return;
							}
							oBrand.append('<option value="">'+'请选择'+'</option>');
							for(var j= 0, k;k= o.brands[j];j++){
								oBrand.append('<option value="'+ k.brandId+'">'+ k.brandName+'</option>');
							}
							conditionBrand.css({opacity:1});
						}
					}
			}.bind(this));
			*/
		},
		initTable:function (){
			this.get_listData();
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
			/*初始化页面数据*/

		},
		get_listData:function (){
			var url =this.API+'/shop/stock/list';
			$('#list').bootstrapTable({ url: url,
				method: 'get',
				striped: true,
				processData : false,
				contentType : false,
				queryParams:function(params){
					var data = this.searchData();
					data.limit = params.limit;
					data.offset = params.offset;
					return data;
				}.bind(this),
				sidePagination: "server",
				responseHandler:function(res){
					//console.log(res);
					return res.data;
				},
				formatNoMatches:function(){
					return '搜索内容为空'

				},
				formatLoadingMessage:function(){
					//return '����Ŭ��������...';
				}
			});
		},
		keySearch:function (){
			//search_btn
			this.rootEl.on('click','#search_btn',function (){

				this.$('#list').attr('refresh','key');
				this.$('#list').bootstrapTable('refresh');
			}.bind(this));

			this.rootEl.on('change','.change',function (){
				this.$('#list').attr('refresh','key');
				this.$('#list').bootstrapTable('refresh');
			}.bind(this));
			//change
		},
		searchData:function (){
			var data = {};
			var keywords = this.$('#keywords').val().trim();
			if(keywords){
				data.productName = keywords;
			}
			var shopId = this.$('.change.store').val();
			if(shopId){
				data.shopId = shopId;
			}
			var type = this.$('.change.type').val();

			if(type){
				data.typeId = type;
			}
			var brand = this.$('.change.brand').val();

			if(brand){
				data.brandId = brand;
			}
			return data;
		}
	});
	return MyActivity;
})