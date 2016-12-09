define(["ui/loading",'common/util',"activity","jquery",'bootstrap-table','jquery.cookie','bootstrap-switch',"datetimepicker","ejs","sweet-alert"],
function(loading,util,Activity){
	window.editAndChange = function (value,row,index){
		return '<a code="edit" class="edit addCode" userId="'+row.id+'" href="javascript:void(0)" title="编辑"><i class="glyphicon glyphicon-pencil blue"></i></a><a  userId="'+row.id+'" code="reset" class="changePassword addCode" realname="'+row.realname+'" href="javascript:void(0)" title="重置密码"><i class="glyphicon  glyphicon-erase" style="color: red"></i></a><a code="remove" userId="'+row.id+'" class="remove addCode" href="javascript:void(0)" title="删除"><i class="glyphicon glyphicon-trash gray"></i></a>';
	};
	var MyActivity = Activity.extend({
		init: function (options) {
			this.options = $.extend({},{
				el:null,
				tempPath:""
			},options);
			this.tempPath = this.options.tempPath;
			this.rootEl = this.options.el;
			this.reName();
			this.render();
			this.get_listData();
			this.resetPassword();
			this.openAddComer();
			this.removeDistributor();
			this.editUser();
			this.refreshEvent();

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
	    get_listData:function (){
			//http://pre-drp.525happy.cn/user/distributor/list
			var url =this.API+'/user/distributor/list';
			$('#list').bootstrapTable({ url: url,
				method: 'get',
				striped: true,
				processData : false,
				contentType : false,
				queryParams:function(params){
					var data = {};
					data.limit = params.limit;
					data.offset = params.offset;
					return  data;
				}.bind(this),//?????????
				sidePagination: "server",
				responseHandler:function(res){
					return res.data;
				},
				formatNoMatches:function(){
					return '搜索内容为空！';
				},
				formatLoadingMessage:function(){
					//return '?????????????...';
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
									$(allButton[k]).remove();
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
		},
		resetPassword:function (){
			this.$('.changePasswords').hide();
			this.rootEl.on('click','.changePassword',function (e){
				//debugger;
				var realname = this.$(e.currentTarget).attr('realname');
				this.$('.col-xs-4.save_data').attr('tid',$(e.currentTarget).attr('userId'));
				this.$('.pull-left.ml10.account').html(realname);

				this.$('.changePasswords').show();
			}.bind(this));

			this.rootEl.on('click','.changePasswords_close',function (){
				this.$('.changePasswords .red').html('');
				this.$('.changePasswords').hide();
			}.bind(this));

			this.rootEl.on('click','.save_data',function (){

					this.setPassword();
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
					id:this.rootEl.find('.col-xs-4.save_data').attr('tid'),
					password:p
				},
				success:function (data){
					if(data.code=='success'){
						this.rootEl.find('.changePasswords').css('display','none');
						swal({title: "", text: "密码修改成功",timer:2000,});
						this.rootEl.find('.changePasswords .red').html('');
					}
				}.bind(this),
				error:function (data){
					this.rootEl.find('.changePasswords .red').html(data.errorMsg);
				}.bind(this)
			});
		},
		openAddComer:function (){
			this.rootEl.on('click','.btn.btn-default.edit_add',function (e){
				this.open({
					url:'addNewComer',
				});
			}.bind(this));
		},
		removeDistributor:function (){
			this.rootEl.on('click','a.remove',function (e){
				swal({
					title:'',
					text: '你确定要删除吗？',
					type:'warning',
					showCancelButton:true,
					okCallBack:function (){
						var userId = this.$(e.currentTarget).attr('userId');;
						var url = this.API + '/user/delete';
						this.getData({
							url:url,
							data:{userId:userId},
							success:function (data){
								if(data.code=='success'){
									this.$(e.currentTarget).parent().parent().remove();
								}
							}.bind(this),
						});
					}.bind(this),
					cancelCallBack:function (){
						//console.log(55555);
					}
				});

			}.bind(this));
		},
		onResume:function (data){
			data = data || {};
			if(data.reload){
				location.reload();
			}
		},
		//http://pre-drp.525happy.cn/user/form  edit
		editUser:function (){
			this.rootEl.on('click','a.edit',function (e){
				var userId = this.$(e.currentTarget).attr('userId');
				this.open({
					url:'edit',
					data:{id:userId}
				});
			}.bind(this));
		},
		refreshEvent:function (){
			this.rootEl.on("click",".edit_refresh",function(e){
				$('#list').bootstrapTable('refresh');
			}.bind(this));
		},
	});
	return MyActivity;
})