define(["ui/loading","common/util","activity","sweetAlert","jquery","bootstrap-table","datetimepicker","ejs"],function(loading,util,Activity){
	window.actionState=function(value, row, index){
		if(row.status==0){
			return '待审核';
		}
		if(row.status==2){
			return '<span class="curr">审核未通过</span>';
		}
	};
	window.actionExpressNo = function (value, row, index){
		if(row.status==0){
			return '<button code="review" type="button" class="btn btn-width real btn-success">审核</button>';
		}
		if(row.status==2){
			return '<button code="looking" type="button"  class="btn btn-width error btn-success">查看</button>';
		}
	};
	window.deleteExpressNo = function (value, row, index){
		if(row.status==2){
			return '<button  code="remove" _value="'+row.purchaseId+'" class="btn btn-width delete btn-default" type="button"><span class="glyphicon glyphicon-trash gray"></span></button>';
		}
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
		onResume:function (data){
			/*拿到下级的参数*/
		},
		initEvents:function(){
			
			//this.finish(); /*可以回到上一个页面*/
			$.datetimepicker.setLocale('ch');
			$('#datetimepicker').datetimepicker({
				timepicker:false,
				format:"Y-m-d",
			});
			$('#datetimepicker1').datetimepicker({
				timepicker:false,
				format:"Y-m-d",
			});

			$('#datetimepicker').datetimepicker({
				onChangeDateTime:function (){
					var startTime = $('#datetimepicker').val();
					$('#datetimepicker1').datetimepicker({minDate:startTime})
				}
			});
			$('#datetimepicker1').datetimepicker({
				onChangeDateTime:function (){
					var startTime = $('#datetimepicker1').val();
					$('#datetimepicker').datetimepicker({maxDate:startTime})
				}
			});
			/*类别搜索*/
			this.initSearchEvent();
			
			/*去订单详情*/
			this.goOrders();
			
			/*initReviewEvent*/
			this.initReviewEvent();
			
			/*订单审核状态*/
			this.reviewStatus();
			/*初始化数据*/
			this.get_listData();
			this.initSearch();
			this.deleteOrderEvents();


		},
		initSearchEvent:function (){
			this.rootEl.on("click",".category .choice",function(e){
				this.$('#keywords').val('');
				this.$('.category .choice span').removeClass('curr');
				this.$(e.currentTarget).find('span').addClass('curr');
				//this.$(e.currentTarget).find('span').show();

			}.bind(this));
		},
		goOrders:function (){
			/*编号去详情*/
			this.rootEl.on("click","tbody tr td.js_number",function(e){
				var look = $(e.currentTarget).attr('look');
				if(look){
					return;
				}
				var oHtml = $(e.currentTarget).html();
				this.open({
					url:'review/'+1,
					data:{
						purchaseNo:oHtml,
					}
				});
			}.bind(this));


			this.rootEl.on("click","tbody tr td.js_review button.error",function(e){
				var oNumber = $(e.currentTarget).parent().parent().find('.js_number').html();
				var oHtml = $(e.currentTarget).html();
				if(oHtml=="查看"){
					this.open({
						url:"review/"+1,
						data:{
							purchaseNo:oNumber,
						}
					});
				}
			}.bind(this));
		},
		initReviewEvent:function (){
			/*审核去详情*/
			this.rootEl.on("click","tbody tr td.js_review button.real",function(e){
			var oNumber = $(e.currentTarget).parent().parent().find('.js_number').html();
			var oHtml = $(e.currentTarget).html();
				if(oHtml=="审核"){
					this.open({
						url:"review/"+2,
						data:{
							purchaseNo:oNumber,
						}
					});
				}
			}.bind(this));
			
		},
		reviewStatus:function (){
			this.rootEl.on('click','.review.btn-group .choice',function (e){
				this.$('.review.btn-group .choice span').removeClass('curr');
				this.$(e.currentTarget).find('span').addClass('curr');
				this.$('#list').attr('refresh','key');
				this.$('#list').bootstrapTable('refresh');
			}.bind(this));
		},
		get_listData:function (){
			var url =this.API+'/shop/purchase/list';
			$('#list').bootstrapTable({ url: url,
				method: 'get',
				striped: true,
				processData : false,
				contentType : false,
				queryParams:function(params){
					var data = this.searchData();
					data.limit = params.limit;
					data.offset = params.offset;
					data.flag = 3;
					return  data;
				}.bind(this),//���ݲ�����
				sidePagination: "server",
				responseHandler:function(res){
					return res.data;
				},
				formatNoMatches:function(){
					return '搜索内容为空'

				},
				formatLoadingMessage:function(){
					//return '����Ŭ��������...';
				},
				onLoadSuccess:function (){
					/*设置权限*/
					this.getmenuId(function (data){
						var bottonData = data.data;
						var allButton = this.$('.btn-width');
						/*控制显示*/
						if(bottonData) {
							for (var i = 0; i < bottonData.length; i++) {
								(function (code) {
									for (var k = 0; k < allButton.length; k++) {
										var name = $(allButton[k]).attr('code');
										if (name == code) {
											$(allButton[k]).addClass('success-curr');
										}
									}
								})(bottonData[i].code)
							}
							/*set显示*/
							for (var k = 0; k < allButton.length; k++) {
								var isShow = allButton[k].className;
								if (isShow.indexOf('success-curr') == -1) {
									if($(allButton[k]).html()=='查看'){
										$(allButton[k]).parent().parent().find('td').eq(0).attr('look',true);
									}
									var parent = $(allButton[k]).parent();
									$(allButton[k]).remove();
									parent.html('-');
								}
							}
						}
					}.bind(this));
				}.bind(this),
			});
		},
		searchData:function (){
			/*关键字搜索*/
			var data = {};
			var typeNo = this.rootEl.find('.category.btn-group .choice span');
			var isShowEl;
			for (var i = 0; i < typeNo.length; i++) {
				if (this.$(typeNo[i]).css('display') == 'block') {
					isShowEl = this.$(typeNo[i]);
				}
			}
			var oValue = isShowEl.parent().attr('value');
			var keywords = this.$('#keywords').val();
			/*时间获取*/
			var startTime= this.$('#datetimepicker').val();
			var endTime = this.$('#datetimepicker1').val();
			startTime = util.formatDate(new Date(startTime),"yyyy-mm-dd");
			endTime = util.formatDate(new Date(endTime),"yyyy-mm-dd");
			if(!(startTime.indexOf('NaN')!=(-1))) {
				data.startTime = startTime;
			}
			if(!(endTime.indexOf('NaN')!=(-1))) {
				data.endTime = endTime;
			}
			if(keywords){
				data[oValue]=keywords.trim();
			}
			/*状态获取*/
			var status = this.rootEl.find('.review.btn-group .choice span');
			var isStatus;
			for (var i = 0; i < status.length; i++) {
				if (this.$(status[i]).css('display') == 'block') {
					isStatus = this.$(status[i]);
				}
			}
			if(isStatus.attr('_value')){
				if(isStatus.attr('_value') == 0){
					data.status = 0;
				}
			}

			if(isStatus.attr('_value')==2){
				data.status = 2;
			}
			return data;
		},
		initSearch:function (){
			this.rootEl.on('click','#search_btn',function (){
				this.$('#list').attr('refresh','key');
				this.$('#list').bootstrapTable('refresh');
			}.bind(this));
			/*时间搜索*/
			this.rootEl.on('change','#datetimepicker1',function (){
				this.$('#list').attr('refresh','key');
				this.$('#list').bootstrapTable('refresh');
			}.bind(this));

			this.rootEl.on('change','#datetimepicker',function (){
				this.$('#list').attr('refresh','key');
				this.$('#list').bootstrapTable('refresh');
			}.bind(this));
		},
		deleteOrderEvents:function(){
			this.rootEl.on('click','.delete .delete',function (e){

				///shop/purchase/del?purchaseId
				/*请求删除接口*/
				var url = this.API + '/shop/purchase/del';
				var _value = this.$(e.currentTarget).attr('_value');
				this.getData({
					url:url,
					data:{purchaseId:_value},
					success:function (data){
						if(data.code=='success') {
							swal({
								title: '',
								text: '操作成功',
								type: 'success',
							});
							this.$(e.currentTarget).parent().parent().remove();
						}
					}.bind(this),
					error:function (data){

					}
				})
			}.bind(this));
		},
	});
	return MyActivity;
})