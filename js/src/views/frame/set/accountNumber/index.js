define(["ui/loading","activity","jquery","ejs",'bootstrap-switch','bootstrap-table'],function(loading,Activity){
	var MyActivity = Activity.extend({
		init: function (options) {
			this.options = $.extend({},{
				el:null,
				tempPath:""
			},options);
			this.tempPath = this.options.tempPath;
			this.rootEl = this.options.el;
			this.render();
			this.initEvents();
		},
		render:function(){
			var templatePath = this.tempPath + "index.html" + "?r=" + appConfig.version;
			var template = new EJS({
				url:templatePath
			});
			this.rootEl.html(template.render());
			this.load();
		},
		initEvents:function(){
			this.rootEl.on("click",".edit_add",function(e){
				var id = $(e.currentTarget).attr("data-id");
				this.open({
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
		},
		load:function(){
			this.label_event();
			this.accountManagement.load();
			this.changePasswords.load();
			$('.switch').bootstrapSwitch();
			this.role_select(function(d){
				this.draw_label(d);
			}.bind(this));
			this.get_listData();
		},
		label_event:function(){
			$('#gj_btn').unbind().bind("click",function(){
				this.get_labelData();
			}.bind(this));

			$('#search_btn').unbind().bind("click",this.search_key);
			$('#keywords').unbind().bind("keypress",function(){
				if(event.keyCode==13){
					this.search_key()
				}
			}.bind(this));
			$('#edit_add').on("click",function(){
				this.accountManagement.show()
			}.bind(this));
			$('#delete_list').unbind().bind("click",function(){
				if($('#table .selected').length==0){
					popup.popup({txt:'请选择一个商品',btn:1});
					return;
				}
				var id=[];
				$('#table .selected').each(function(){
					id.push($(this).find('td').eq(1).html());
				});
				popup.popup({txt:'确认删除？',btn:2,yes:function(){
					that.shop_list.data_interface.delete_listData(id.join());
				}});
			});
			$('#edit_refresh').unbind().bind("click",function(){
				$('#table').bootstrapTable('refresh');
			});
			window.actionEvents = {
				'click .edit': function (e, value, row, index) {
					this.accountManagement.show(row)
				}.bind(this),
				'click .changePassword': function (e, value, row, index) {
					this.changePasswords.show(row)
				}.bind(this),
				'click .remove': function (e, value, row, index) {
					popup.popup({txt:'确认删除？',btn:2,yes:function(){
						that.shop_list.data_interface.delete_listData(row.id);

					}});
				}
			};
		},
		search_key:function(){
			var d={};
			if($('#keywords').val()){
				d.keyword=$('#keywords').val();
			}
			if($('#label_list').css('display')=='block'){
				$('#label_list  div[type=column] .curr').attr('tid') ?  d.roleId=$('#label_list  div[type=column] .curr').attr('tid') :'';
				$('#label_list  div[type=status] .curr').attr('tid') ? d.enabled=$('#label_list  div[type=status] .curr').attr('tid') : '';
			}
			$('#table').bootstrapTable('refresh', {query:d});
		},
		draw_label:function(d){
			var html='', html1='<option value="0000">-请选择-</option>';
			var  html2='';
			for(var i=0,o;o=d[i];i++){
				html+='<span class="label btn btn-default" tid="'+ o.id+'">'+ o.name+'</span>';
				html1+=' <div class="input-group input-group_box" tid="'+o.id+'"> '+ o.name+' <button type="button" class="btn  btn-danger glyphicon glyphicon-remove tagList_1" tid="'+o.id+'"></button></div>';
				html2+='<li><span>'+o.name+'</span><input value="'+ o.id+'" class="pull-right" type="checkbox"></li>';
			}
			// $('.more_label .input-group').remove();
			// $('.more_label').prepend(html1);

			$('#role_select_list').html(html2);
			$('#role_select_list li').on('click',function(){
				var t= $(this).find('input');
				if(t.prop('checked')){
					t.prop('checked',false);
				}else{
					t.prop('checked',true);
				}
			});

			$('#label_list div').eq(0).append(html);

			$('#label_list .btn').unbind().bind('click',function(t){
				if( $(t.target).hasClass('curr')){
					$(t.target).removeClass('curr');
				}else{
					if($(t.target).parent().attr('type')=='column'){
						$('#label_list div[type=column] .curr').removeClass('curr');
					}else{
						$('#label_list div[type=status] .curr').removeClass('curr');
					}
					$(t.target).addClass('curr');
				}
				this.search_key();
			}.bind(this));
		},
		accountManagement:{
			load:function(){
				this.fevent();
			},
			fevent:function(){
				$('.accountManagement .accountManagement_close').on('click',this.hide);
				$('.accountManagement .save_data').unbind().bind('click',function(e){this.submit(e)}.bind(this));
				$('.accountManagement #add_role span').on('click',function(e){
					var t=$(e.target);
					if(t.text()=='添加'){
						t.html('确定');
						$('#role_select_list,#add_role .close').show();
					}else{
						t.html('添加');
						$('#role_select_list,#add_role .close').hide();
						this.add_role();
					}
				}.bind(this));
				$('#add_role .close').on('click',function(){
					$('.accountManagement #add_role .btn-success').html('添加');
					$('#role_select_list,#add_role .close').hide();
					$('#role_select_list input').prop('checked',false);
					$('.more_label .input-group').each(function(){
						$('#role_select_list input[value='+$(this).attr('tid')+']').prop('checked',true);
					});
				});

				$('.more_label').on('click','.input-group button',function(){
					$(this).parent().remove();
					$('#role_select_list input[value='+$(this).attr('tid')+']').prop('checked',false);
				});
			},
			add_role:function(){
				var html='';
				$('#role_select_list li').each(function(){
					if($(this).find('input').prop('checked')){
						html+=' <div class="input-group input-group_box" tid="'+ $(this).find('input').val()+'"> '+ $(this).find('span').html()+' <button type="button" class="btn  btn-danger glyphicon glyphicon-remove tagList_1" tid="'+ $(this).find('input').val()+'"></button></div>';
					}
				});
				$('.more_label .input-group').remove();
				$('.more_label ').append(html);
			},
			show:function(data){
				$('.accountManagement').show();
				this.setVals(data);
			},
			hide:function(){
				$('.accountManagement').hide();
				$('.role_select_list').hide();
			},
			setVals:function(data){
				data=data || {};
				if(data.username) {
					$('input[name=account]').attr('disabled','disabled');
					$('#password').hide();
				}
				else{
					$('input[name=account]').removeAttr('disabled');
					$('#password').show();
				}
				$('input[name=account]').val(data.username || '');
				$('input[name=password]').val('');
				$('input[name=name]').val(data.realname || '');
				$('input[name=email]').val(data.email || '');
				$('#role_select').val(data.roleids || '0000');
				$('.more_label .input-group').remove();

				var roleids=data.roleids.split(','),html='',rolenames=data.rolenames.split(',');
				$('#role_select_list input').prop('checked',false);
				for(var i =0; i<roleids.length;i++){
					html+=' <div class="input-group input-group_box" tid="'+ roleids[i]+'"> '+ rolenames[i]+' <button type="button" class="btn  btn-danger glyphicon glyphicon-remove tagList_1" tid="'+  roleids[i]+'"></button></div>';;
					$('#role_select_list input[value='+roleids[i]+']').prop('checked',true);
				}
				$('.more_label .input-group').remove();
				$('.more_label ').append(html);

				data.enabled ? $('#status').bootstrapSwitch('setState', true) :$('#status').bootstrapSwitch('setState', false);
				data.id ?  $('.accountManagement .save_data').attr('tid',data.id) : $('.accountManagement .save_data').removeAttr('tid') ;
			},
			submit:function(e){
				var tid=$(e.target).attr('tid');
				var tip='',roleId=[];
				var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
				var username=$('.accountManagement input[name=account]').val();
				var realname=$('.accountManagement input[name=name]').val();
				var email=$('.accountManagement input[name=email]').val();
				var password=$('.accountManagement input[name=password]').val();
				if(!username){
					tip='请输入账号！'
				}else if(!password &&  $('#password').css('display')=='block'){
					tip='请输入密码！'
				}else if(password.length<6 &&  $('#password').css('display')=='block'){
					tip='密码不能少于6位！'
				}else if(!Util.ifNotNull(realname)){
					tip='请输入姓名！'
				}else if(!re.test(email) && !email){
					tip='请输入正确的邮箱！'
				}
				$('.more_label  .input-group').each(function(){
					roleId.push($(this).attr('tid'));
				});
				if(tip){
					popup.popup({txt:tip,btn:1});
					return
				}
				var data={
					username:username,
					realname: realname,
					email:email,
					roleId:roleId.join() ,
					enabled: $('#status input').prop('checked') ? 1 :0
				};

				if(tid){
					data.id=tid;
					this.updata_user(data,function(){
						this.hide();
						$('#table').bootstrapTable('refresh');
					}.bind(this));
				}else{
					data.password= $('.accountManagement input[name=password]').val();
					this.add_user(data,function(){
						this.hide();
						$('#table').bootstrapTable('refresh');
					}.bind(this));
				}
			},
			add_user:function(d,callback){
				$.ajax({
					url:this.API+'/portal/user/add',
					data:{
						platform:'DRP',
						username: d.username,
						password: d.password,
						realname: d.realname,
						email: d.email,
						roleId: d.roleId,
						enabled: d.enabled,
					},
					type:'get',
					dataType:'json',
					success:function(data){
						if(data.code=='success'){
							callback(data.data);
						}else{
							popup.popup({txt:data.errorMsg ,btn:1});
						}
					}
				});
			},
			updata_user:function(d,callback){
				$.ajax({
					url:this.API+'/portal/user/update',
					data:{
						id: d.id,
						username: d.username,
						realname: d.realname,
						email: d.email,
						roleId: d.roleId,
						enabled: d.enabled
					},
					type:'get',
					dataType:'json',
					success:function(data){
						if(data.code=='success'){
							callback(data.data);
						}else{
							popup.popup({txt:data.errorMsg,btn:1});
						}
					}
				});
			}
		},
		changePasswords:{
			load:function(){
				this.fevent();
			},
			fevent:function(){
				$('.changePasswords .changePasswords_close').on('click',this.hide);
				$('.changePasswords .save_data').on('click',function(e){this.submit(e)}.bind(this));
			},
			show:function(data){
				$('.changePasswords').show();
				if(data) this.setVals(data);
			},
			hide:function(){
				$('.changePasswords').hide();
			},
			setVals:function(data){
				$('.changePasswords .account').html(data.username);
				$('.changePasswords .save_data').attr('tid',data.id);
				$('.changePasswords input').val('');
			},
			submit:function(e){
				var p=$('.changePasswords input[name=password]').val();
				var p1=$('.changePasswords input[name=password1]').val();
				var tip='';
				if(!(p)){
					tip='密码不能为空!';
				}else if(p.length<6){
					tip='密码不能少于6位！';
				}else if(p!=p1){
					tip='两次密码输入不一样!';
				}
				if(tip){
					popup.popup({txt:tip,btn:1});
					return
				}
				this.updata_password({userId: $(e.target).attr('tid'),
					password:p,
					username: $('.changePasswords .account').html(),
					isNotice:$('#email_tip input').prop('checked') ? true : false
				},function(d){
					$('.changePasswords').hide();
					popup.popup({txt:'账号：'+d +' 密码更新成功',btn:1});
				});
			},
			updata_password:function(d,callback){
				$.ajax({
					url:Util.config.url+'/portal/user/password/reset',
					data:{
						id: d.userId,
						password:d.password,
						isNotice:d.isNotice
					},
					type:'get',
					dataType:'json',
					success:function(data){
						if(data.code=='success'){
							callback(d.username);
						}else{
							popup.popup({txt:data.errorMsg || data.msg,btn:1});
						}
					}
				});
			}
		},
		//标签
		get_labelData:function(callback){
			if($('#gj_btn').hasClass('click') ){
				$('#label_list').slideUp();
				$('#gj_btn').html('高级搜索').removeClass('click');
			}else{
				$('#label_list').slideDown();
				$('#label_list').slideDown();
				$('#gj_btn').html('关闭').addClass('click').attr('ready',1);
				return;

			}
		},
		//角色列表
		role_select:function(callback){
			$.ajax({
				url:this.API+'/portal/role/base/list?platform=DRP',
				type:'get',
				dataType:'json',
				success:function(data){
					if(data.code=='success'){
						callback(data.data);
					}
				},
				error:function(){
				}
			});
		},
		//列表
		get_listData:function(data){
			data=data || {};
			var url = this.API+'/user/list?platform=DRP'
			$('#table').bootstrapTable({ url: url,     //请求后台的URL（*）
				method: 'get',           //请求方式（*）
				striped: true,           //是否显示行间隔色
				processData : false,
				contentType : false,
				queryParams:function(params){
					return  {
						limit: params.limit ,
						offset: params.offset,
						keyword:params.keyword
					}
				},//传递参数（*）
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
		//删除
		delete_listData:function(id){
			$.ajax({
				url:this.API+'/portal/user/delete?userId='+id,
				type:'get',
				dataType:'json',
				success:function(data){
					if(data.code=='success'){
						$('#table').bootstrapTable('refresh');
					}
				},
				error:function(){
				}
			});
		}

	});
	return MyActivity;
})