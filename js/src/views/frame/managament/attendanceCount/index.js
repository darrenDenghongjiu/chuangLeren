define(["activity","jquery","datetimepicker","ejs","bootstrap-table"],function(Activity){
	window.actionFormatter_date=function(value){
		return formatDate(value,"yyyy-mm-dd hh:nn:ss");
	}
	window.actionFormatter_btn=function(value){
		return '<button type="button" class="viewDetail btn btn-width btn-success">查看详情</button>';
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
			this.createSelect();
		},
		onResume:function(data){
			
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
			this.table_list();
		},
		initEvents:function(){
			this.rootEl.on("click",".js_detail",function(e){
				var id = $(e.currentTarget).attr("data-id");
				this.open({
					url:"detail/" + id,
					data:{
						a:[1,2,3]
					}
				});
			}.bind(this));
			this.rootEl.on("click",".js_list",function(e){
				var id = $(e.currentTarget).attr("data-id");
				this.open({
					url:"list"
				});
			}.bind(this));


			
			
			/*高级搜索*/
			this.search();
			/*查看详情*/
			this.viewDetail();
		},
		/*高级搜索*/
		search:function (){

			this.rootEl.on("click","#search_btn",function(){
				 $('#table').bootstrapTable('refresh');
			});
			$('#keywords').unbind().bind("keypress",function(){
				if(event.keyCode==13){ $('#table').bootstrapTable('refresh');}
			});
			/*汉化插件*/
			$.datetimepicker.setLocale('ch');
			/*调用加载*/

			$('#datetimepicker').datetimepicker({timepicker:false,
				format:"Y-m-d",});
			$('#datetimepicker1').datetimepicker({timepicker:false,
				format:"Y-m-d",})


			this.rootEl.on('change','#datetimepicker1',function (){
				var startTime = $('#datetimepicker').val();
				$('#datetimepicker1').datetimepicker({minDate:startTime});
				this.$('#table').attr('refresh','key');
				this.$('#table').bootstrapTable('refresh');
			}.bind(this));

			this.rootEl.on('change','#datetimepicker',function (){
				var startTime = $('#datetimepicker1').val();
				$('#datetimepicker').datetimepicker({maxDate:startTime});
				this.$('#table').attr('refresh','key');
				this.$('#table').bootstrapTable('refresh');
			}.bind(this));

			var  oDatetimepicker = $('.datetimepicker');
			this.rootEl.on("click",".dropdown-search",function(e){
				 this.$('.dropdown-search').hide();
				 this.$('.dropdown-close').hide();

				oDatetimepicker.show();
				oDatetimepicker.animate({height:30},100,function (){
					this.$('.dropdown-close').show();
				}.bind(this));

			}.bind(this));

			this.rootEl.on("click",".dropdown-close",function(e){
				this.$('.dropdown-close').hide();
				oDatetimepicker.animate({height:0},100,function (){
					oDatetimepicker.hide();
					this.$('.dropdown-search').show();
				}.bind(this));
			}.bind(this));
			this.rootEl.on('change','.change.store',function (){
				this.$('#table').bootstrapTable('refresh');
			}.bind(this));
		},
		/*查看详情*/
		viewDetail:function (){
			 window.actionEvents={
				 'click .viewDetail':function(e, value, row, index){
					 this.showDetail(row);
				 }.bind(this)
			 }
		},
		showDetail:function(row){
			this.rootEl.find('.clerkManager .record').remove();
			var templatePath = this.tempPath + "layer.html" + "?r=" + appConfig.version;
			var template = new EJS({
				url:templatePath
			});


			this.showDetailData({userId:row.userId,recordTime: formatDate(row.recordTime,"yyyy-mm-dd")},function(data){
				this.rootEl.find('.clerkManager').append(template.render(data.data));
			}.bind(this));


			this.rootEl.on('click','.record .close ,.record .btn',function(){
				this.rootEl.find('.record').hide();
			}.bind(this));
		},
		showDetailData:function(d,callBack){
			var url = this.API + '/shop/sign/attendance/detail';
			this.getData({
				url:url,
				data:d,
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
		table_list:function(){
			var url = this.API+'/shop/sign/attendance/list';
			$('#table').bootstrapTable({ url: url,     //请求后台的URL（*）
				method: 'get',           //请求方式（*）
				striped: true,           //是否显示行间隔色
				processData : false,
				contentType : false,
				queryParams:function(params){
					var data = this.getSearchData();
					data.limit = params.limit;
					data.offset = params.offset;
					return  data;
				}.bind(this),//传递参数（*）
				sidePagination: "server",      //分页方式：client客户端分页，server服务端分页（*）
				responseHandler:function(res){
					return res.data;
				},
				formatNoMatches:function(){
					return '没有搜索结果'
				},
				formatLoadingMessage:function(){
					return '正在努力加载中...';
				}
			});
		},
		getSearchData:function (){
			var data = {};
			var keyword = $('#keywords').val();
			var shopId = $('.change.store').val();
			var startTime = $('#datetimepicker').val();
			var endTime = $('#datetimepicker1').val();

			if(keyword){
				data.keyword = keyword;
			}
			if(shopId){
				data.shopId = shopId;
			}
			if(startTime){
				data.startTime = startTime;
			}
			if(endTime){
				data.endTime = endTime;
			}
			return data;
		},
		createSelect:function (){
			/*http://dev-drp.525happy.cn/shop/name/list*/
			this.getShopData(function (data){
				var changeStore = this.$('.change.store');
				if(!data || !data.data){
					return;
				}
				changeStore.append('<option value="0">全部</option>');
				for(var i= 0,k;k=data.data[i];i++){
					changeStore.append('<option value="'+ k.shopId+'">'+ k.shopName+'</option>');
				}
			}.bind(this))

		},
		getShopData:function (callBack){
			/*http://dev-drp.525happy.cn/shop/name/list*/
			callBack = callBack || function (){};
			var url = this.API + '/shop/name/list';
			this.getData({
				url:url,
				success: function (data) {
					if(data.code=='success'){
						callBack(data);
					}
				}.bind(this)
			});
		}
	});
	return MyActivity;
})