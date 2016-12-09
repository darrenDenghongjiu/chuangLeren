define(["ui/loading","activity","jquery","ejs","bootstrap-table","sweet-alert"],function(loading,Activity){
	window.actionFormatter_createTime=function(value){
		return formatDate(value,"yyyy-mm-dd hh:nn:ss");
	}
	window.actionFormatter_edit=function(row){
		return '<a code="edit" class="edit addCode" href="javascript:void(0)" title="编辑">\
			<i class="glyphicon glyphicon-pencil blue"></i>\
			</a>\
			<a code="reset" class="changePassword addCode"  href="javascript:void(0)" title="重置密码">\
			<i class="glyphicon  glyphicon-erase" style="color: red"></i>\
			</a>\
			<a code="remove" class="remove addCode" href="javascript:void(0)" title="删除">\
			<i class="glyphicon glyphicon-trash gray"></i>\
			</a>';
	}
	window.actionFormatter_btn=function(row){
		return '<button type="button" class="viewQrc btn btn-width btn-success">查看二维码</button>';
	}
	var MyActivity = Activity.extend({
		init: function (options) {
			this.options = $.extend({},{
				el:null,
				tempPath:""
			},options);
			this.tempPath = this.options.tempPath;
			this.rootEl = this.options.el;
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
			this.shop_list(function(data){
				this.shopData = data.data;
				this.rootEl.html(template.render(data.data));
				this.table_list();
			}.bind(this))

		},
		initEvents:function(){
			this.rootEl.on('change','select[name=type]',function(){
				$('#table').bootstrapTable('refresh');
			});
			this.rootEl.on("click",".edit_refresh",function(e){
				$('#table').bootstrapTable('refresh');
			}.bind(this));

			window.actionEvents1={
				'click .viewQrc':function(e, value, row, index){
					this.rootEl.find('.qrc').css('display','table');
					this.rootEl.find('.qrc img').attr('src',row.qrcode);
				}.bind(this)
			}
			this.rootEl.on("click",".qrc",function(e){
				this.rootEl.find('.qrc').css('display','none');
			}.bind(this));

			window.actionEvents={
				'click .edit':function(e, value, row, index){
					this.open({
						url:"addNewComer",
						data:row
					});
				}.bind(this),
				'click .changePassword':function(e, value, row, index){
					this.rootEl.find('.changePasswords').css('display','table');
					this.rootEl.find('.changePasswords .account').html(row.username);
					this.rootEl.find('.changePasswords .red').html('');
					this.rootEl.find('.changePasswords  input').val('');
					this.rootEl.find('.changePasswords .btn').attr('tid',row.id);
				}.bind(this),
				'click .remove':function(e, value, row, index){
					swal({
						title: "",
						text: "确认删除该账号？",
						showCancelButton: true,
						okCallBack:function (){
							this.getData({
								url: this.API +'/user/delete',
								data:{
									userId:row.id,
								},
								success:function (data){
									$('#table').bootstrapTable('refresh');
								}.bind(this),
								error:function(data){
									setTimeout(function(){
										swal({
											title: "",
											text:data.errorMsg,
											timer:2000
										});
									},100);
								}.bind(this)
							});
						}.bind(this)
					});


				}.bind(this)
			}

			this.rootEl.on("click",".changePasswords .changePasswords_close",function(e){
				this.rootEl.find('.changePasswords').css('display','none');
			}.bind(this));

			this.rootEl.on("click",".changePasswords .save_data",function(e){
				this.setPassword();
			}.bind(this));

			this.rootEl.on("click",".edit_refresh",function(e){
				$('#table').bootstrapTable('refresh');
			}.bind(this));

			this.rootEl.on("click",".edit_add",function(e){
				var id = $(e.currentTarget).attr("data-id");
				//debugger;
				this.open({
					url:"addNewComer",
					data:this.shopData
				});
				//this.finish(); /*可以回到上一个页面*/
				
			}.bind(this));
			
			this.rootEl.on("click",".js_list",function(e){
				var id = $(e.currentTarget).attr("data-id");
				this.open({
					url:"list"
				});
			}.bind(this));

		},
		setPassword:function(){
			var p=this.rootEl.find('.changePasswords input[name=password]').val();
			var p1=this.rootEl.find('.changePasswords input[name=password1]').val();
			var tip='';
			if(p.length==0){
				tip='密码不能为空！'
			}else if(p.length<6){
				tip='密码不能少于6位！'
			}else if(p!=p1){
				tip='两次密码输入的不一样！'
			}
			if(tip){
				this.rootEl.find('.changePasswords .red').html(tip);
				return;
			}
			var url = this.API + '/user/password/reset';
			this.getData({
				url:url,
				data:{
					id:this.rootEl.find('.changePasswords .btn').attr('tid'),
					password:p
				},
				success:function (data){
					if(data.code=='success'){
						this.rootEl.find('.changePasswords').css('display','none');
						swal({title: "", text: "密码修改成功",timer:2000,});
					}
				}.bind(this),
				error:function (data){
					this.rootEl.find('.changePasswords .red').html(data.errorMsg);
				}.bind(this)
			});
		},
		shop_list:function(callback){
			var url = this.API + '/shop/name/list';
			this.getData({
				url:url,
				success:function (data){
					if(data.code=='success'){
						callback(data);
					}
				},
				error:function (data){
					//console.log(data);
				}
			});
		},
		table_list:function(){
			var url = this.API+'/user/list';
			$('#table').bootstrapTable({ url: url,     //请求后台的URL（*）
				method: 'get',           //请求方式（*）
				striped: true,           //是否显示行间隔色
				processData : false,
				contentType : false,
				queryParams:function(params){
					var datas={
						limit: params.limit ,
						offset: params.offset,
						shopId: this.rootEl.find('select[name=type]').val()
					}
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

							 for(var k=0;k<allButton.length;k++){
								 var isShow = allButton[k].className;
								 if(isShow.indexOf('success-curr')==-1){
									 var parent = $(allButton[k]).parent();
									 //$(allButton[k]).remove();
								 }
							 }
						}

						var addedit = this.$('td.addedit')[0];
						if(addedit){
							var h=0;
							for(var i=0; i<addedit.children.length;i++){
								if(addedit.children[i].className.indexOf('success-curr')==-1){
									h++;
									if(h==3){
										for(var k=0;k<allButton.length;k++){
											var isShow = allButton[k].className;
											if(isShow.indexOf('success-curr')==-1){
												var parent = $(allButton[k]).parent();
												if(parent[0]) {
													if (parent[0].tagName == 'TD') {
														parent.html("");
														parent.html('-');
													}
												}
											}
										}
									}
								}
							}
						}

					}.bind(this));
				}.bind(this),
			});
		}
	});
	return MyActivity;
})