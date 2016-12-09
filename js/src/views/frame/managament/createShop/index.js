define(["ui/loading","activity","jquery","ejs","bootstrap-table","sweet-alert"],function(loading,Activity){
	window.actionFormatter_typeName=function(value){
		return value==0 ? '直营' :'分销';
	}
	window.actionFormatter_edit=function(row){
		return '<a class="edit addCode" code="edit" href="javascript:void(0)" title="编辑">\
			<i class="glyphicon glyphicon-pencil blue"></i>\
			</a>';
	}
	window.discountEvnet = function (value,row,index){
		return row.discount+'%';
	};
	var MyActivity = Activity.extend({
		init: function (options) {
			this.options = $.extend({},{
				el:null,
				tempPath:""
			},options);
			this.tempPath = this.options.tempPath;
			this.rootEl = this.options.el;
			this.storeData = {};
			this.shopData='';
			this.render();
			this.reName();
			this.initEvents();
		},
		onResume:function(type){
			if(type){
				$('#table').bootstrapTable('refresh');
			}
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
			this.rootEl.on('click','#shopType .btn',function(){
				$('#shopType .btn span').hide().removeClass('curr');
				$(this).find('span').show().addClass('curr');
				$('#table').bootstrapTable('refresh');
			});
			this.rootEl.on('click','#search_btn',function(){
				$('#table').bootstrapTable('refresh');
			});
			this.rootEl.on('keypress','#keywords',function(){
				if(event.keyCode==13){ $('#table').bootstrapTable('refresh');}
			});


			window.actionEvents={
				'click .edit':function(e, value, row, index){
					//编辑需要多一组数据
					row.storeData = this.storeData;
					this.open({
						url:'detail',
						data:row
					});
				}.bind(this),
			}

			this.rootEl.on("click",".changePasswords .changePasswords_close",function(e){
				this.rootEl.find('.changePasswords').css('display','none');
			}.bind(this));

			this.rootEl.on("click",".edit_add",function(e){
				var id = $(e.currentTarget).attr("data-id");

				this.open({
					url:"detail",
					data:this.storeData,
				});
				//this.finish(); /*可以回到上一个页面*/
			}.bind(this));

			this.rootEl.on("click",".edit_refresh",function(e){
				$('#table').bootstrapTable('refresh');
			}.bind(this));
			
			this.rootEl.on("click",".js_list",function(e){
				var id = $(e.currentTarget).attr("data-id");
				this.open({
					url:"list"
				});
			}.bind(this));

		},

		table_list:function(){
			var url = this.API+'/shop/list';
			$('#table').bootstrapTable({
				url: url,     //请求后台的URL（*）
				method: 'get',           //请求方式（*）
				striped: true,           //是否显示行间隔色
				processData : false,
				contentType : false,
				queryParams:function(params){
					var datas={
						limit: params.limit ,
						offset: params.offset,
					};
					$('#keywords').val() ? datas.shopName=$('#keywords').val() : '';
					$('#shopType .curr').attr('value') ? datas.type=$('#shopType .curr').attr('value') : '';
					return  datas;
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
				},
				onLoadSuccess:function (){
					/*设置权限*/
					this.getmenuId(function (data){
						var bottonData = data.data;
						var allButton = this.$('.addCode');
						this.storeData = bottonData;
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
									var parent = $(allButton[k]).parent();
									$(allButton[k]).remove();
									if (!(parent[0].tagName == 'DIV')) {
										parent.html('-');
									}
								}
							}
						}else{
							for (var k = 0; k < allButton.length; k++) {
								var isShow = allButton[k].className;
								if (isShow.indexOf('success-curr') == -1) {
									var parent = $(allButton[k]).parent();
									$(allButton[k]).remove();
									if (!(parent[0].tagName == 'DIV')) {
										parent.html('-');
									}
								}
							}
						}
					}.bind(this));
				}.bind(this)
			});
		}
	});
	return MyActivity;
})