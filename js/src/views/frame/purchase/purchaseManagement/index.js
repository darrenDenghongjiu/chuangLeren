define(["ui/loading","common/util","activity","datetimepicker","sweetAlert","ejs","bootstrap-table"],function(loading,util,Activity){
	window.statusEvents = function (value,row,index){
		if(row.status=='0'){
			return '待审核';
		}
		if(row.status=='1'){
			return '待发货';
		}
		if(row.status=='2'){
			return '审核不通过';
		}
		if(row.status=='5'){
			return '已发货';
		}
		if(row.status=='6'){
			return '采购单完成';
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
			this.datetimeSearch();
			this.statusSearch();

		},
		reName:function(){
			this.swiperBox = this.rootEl.find(".js_swiper_box");
		},
		render:function(data){
			var templatePath = this.tempPath + "index.html" + "?r=" + appConfig.version;
			var template = new EJS({
				url:templatePath
			});
			this.rootEl.html(template.render(data));
			this.get_listData()

		},
		initEvents:function(){

			/*
			this.rootEl.on("click",".js_list",function(e){
				var id = $(e.currentTarget).attr("data-id");
				this.open({
					url:"list"
				});
			}.bind(this));

			*/
			$.datetimepicker.setLocale('ch');
			$('#datetimepicker').datetimepicker({
				timepicker:false,
				format:"Y-m-d",
			});
			$('#datetimepicker1').datetimepicker({
				timepicker:false,
				format:"Y-m-d",
			});
			/*
			$('#end_time').datetimepicker({
				format:'yyyy-mm-dd hh:ii',
				language:  'zh-CN',
				minView:2,
				autoclose: 1
			}).on("changeDate",function(ev){
				var enddate=$("#end_time").val();
				setEndTime(enddate);
			});
			*/

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

			this.initSearchEvent();
			/**/
			this.goDetails();
			/**/
		},
		initSearchEvent:function (){

			this.rootEl.on("click",".category .choice",function(e){
				this.$('#keywords').val('');
				$('.category .choice span').hide();
				$(e.currentTarget).find('span').show();
				var isShow = $(e.currentTarget).find('span').css('display');
			}.bind(this));

			this.rootEl.on("click","#search_btn",function(e){
				//console.log(this.$('.errorMsg span').html('请输入关键字'));
				/*刷新取数据关键字*/
				this.$('#list').attr('refresh','key');
				this.$('#list').bootstrapTable('refresh');
			}.bind(this));

			this.rootEl.on("input","#keywords",function(e){
				this.$('.errorMsg span').html('')
			}.bind(this));
			/*1111*/
		},
		goDetails:function (){
			this.rootEl.on("click","tbody tr td.js_number",function(e){
				var oHtml = $(e.currentTarget).html();
				this.open({
					url:'details',
					data:{
						purchaseNo:oHtml,
					}
				});
			}.bind(this));
		},
		get_listData:function(){
			var url =this.API+'/shop/purchase/list';
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
				data[oValue]=keywords;
			}
			/*状态获取*/
			var status = this.$('select.form-control').val();
			if(status){
				data.status = status;
			}
			return data;
		},
		datetimeSearch:function (){
			this.rootEl.on('change','#datetimepicker1',function (){
				this.$('#list').attr('refresh','key');
				this.$('#list').bootstrapTable('refresh');
			}.bind(this));

			this.rootEl.on('change','#datetimepicker',function (){
				this.$('#list').attr('refresh','key');
				this.$('#list').bootstrapTable('refresh');
			}.bind(this));
		},
		statusSearch:function (){
			this.rootEl.on('change','select.form-control',function (e){
				this.$('#list').attr('refresh','key');
				this.$('#list').bootstrapTable('refresh');
			}.bind(this));
		}

	});
	return MyActivity;
})