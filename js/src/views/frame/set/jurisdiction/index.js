define(["ui/loading","activity",'sweet-alert',"jquery","datetimepicker","ejs",'bootstrap-table','bootstrap-switch'],function(loading,Activity){
	var edit=function(ml){
		var value='<a class="edit '+(ml || '')+'" href="javascript:void(0)" title="编辑"><i class="glyphicon glyphicon-pencil blue"></i></a>';
		return value;
	};
	var remove=function(ml){
		return '<a class="remove '+(ml || '')+'" href="javascript:void(0)" title="删除"><i class="glyphicon glyphicon-trash gray"></i></a>';
	};
	var jurisdiction=function(ml){
		var value= '<a class=" jurisdiction  '+(ml|| '')+'" href="javascript:void(0)" title="权限设置"><i class="glyphicon  glyphicon-th blue" style="color: red"></i></a>';
		return value;
	};
	window.actionFormatter_enable=function(value){
		return value ==true ? '启用' : '未启用';
	}
	window.actionFormatter_ico4=function(value, row, index){
		return [edit(),jurisdiction('ml10'),remove('ml10')].join('');
	};

	var MyActivity = Activity.extend({
		init: function (options) {
			this.options = $.extend({},{
				el:null,
				tempPath:""
			},options);
			this.tempPath = this.options.tempPath;
			this.rootEl = this.options.el;
			this.bindAll("roleMaintenance",this.roleMaintenance);
			this.render();
			this.reName();
			this.initEvents();
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
			this.load()
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

		},

		load:function(){
			this.label_event();
			this.roleMaintenance.load();
			if($('.switch').length==0) $('.checkbox').wrap('<div id="enable" class="switch" data-on-label="开启" data-off-label="关闭" />').parent().bootstrapSwitch();
			 this.get_listData();
		},
		label_event:function(){
			$('#search_btn').unbind().bind("click",function(){
				$('#table').bootstrapTable('refresh', {query:{keys: $('#keywords').val()}});
			});
			$('#keywords').unbind().bind("keypress",function(){
				if(event.keyCode==13){ $('#table').bootstrapTable('refresh', {query:{keys: $('#keywords').val()}});}
			});
			$('#edit_add').unbind().bind("click",function(){
				this.roleMaintenance.show();
			}.bind(this));
			$('#delete_list').unbind().bind("click",function(){
				if($('#table .selected').length==0){
					swal({title: "", text: "请选择记录"});
					return;
				}
				var id=[];
				$('#table .selected').each(function(){
					id.push($(this).find('td').eq(1).html());
				});
				swal({title: "", text: "确认删除",showCancelButton: true,okCallBack:function () {
					this.delete_listData(id.join());
					}.bind(this)
				});


			}.bind(this));
			$('#edit_refresh').unbind().bind("click",function(){
				$('#table').bootstrapTable('refresh');
			});
			window.actionEvents = {
				'click .edit': function (e, value, row, index) {
					this.roleMaintenance.show({id:row.id,name:row.name,description:row.description,enable:row.enable});
				}.bind(this),
				'click .jurisdiction': function (e, value, row, index) {
					LWH.history.navigate('detail/'+row.id,true);
				},
				'click .remove': function (e, value, row, index) {
					swal({title: "", text: "确认删除",showCancelButton: true,okCallBack:function () {
						this.delete_listData(row.id);
					}.bind(this)
					});
				}.bind(this)
			};
		},
		roleMaintenance:{
			load:function(){
				this.roleMaintenance.el=$('.jurisdiction_list');
				this.roleMaintenance.fevent();
			},
			show:function(d){
				if(!d){
					this.roleMaintenance.el.find('.save_data').removeAttr('tid');
					$('#enable').bootstrapSwitch('setState', true);
					this.roleMaintenance.el.find('input[name=name]').val('');
					this.roleMaintenance.el.find('textarea[name=descript]').val('');
				}else{
					this.roleMaintenance.el.find('.save_data').attr('tid',d.id);
					this.roleMaintenance.el.find('input[name=name]').val(d.name);
					this.roleMaintenance.el.find('textarea[name=descript]').val(d.description);
					d.enable ? $('#enable').bootstrapSwitch('setState', true) : $('#enable').bootstrapSwitch('setState', false);
				}
				this.roleMaintenance.el.show();
			},
			fevent:function(){
				this.roleMaintenance.el.find('.jurisdiction_list_close').unbind().bind('click',function(){
					this.roleMaintenance.el.hide();
				}.bind(this));
				this.roleMaintenance.el.find('.save_data').unbind().bind('click',function(){this.roleMaintenance.submit()}.bind(this));
			},
			submit:function(){
				var name=this.roleMaintenance.el.find('input[name=name]').val();
				name=name.replace(/^\s+|\s+$/g,"");
				var description=this.roleMaintenance.el.find('textarea[name=descript]').val();
				var enabled=this.roleMaintenance.el.find('.checkbox').prop('checked') ? true:false;
				var url=this.API+'/role/add';
				if(name==''){
					swal({title: "", text: "角色名不能为空"});
					return;
				}
				var parm={
					platform:'DRP',
					name: name,
					description: description,
					enable: enabled
				};
				if(this.roleMaintenance.el.find('.save_data').attr('tid')){
					url=this.API+'/role/update'
					parm.id=this.roleMaintenance.el.find('.save_data').attr('tid');
				}
				$.ajax({
					url:url,
					data:parm,
					type:'get',
					dataType:'json',
					success:function(data){
						if(data.code=='success'){
							this.roleMaintenance.el.hide();
							$('#table').bootstrapTable('refresh');
						}else{
							swal({title: "",text:data.errorMsg});
						}
					}.bind(this),
					error:function(){
					}
				});
			}
		},

		//列表
		get_listData:function(data){
			data=data || {};
			var url = this.API+'/role/list?platform=DRP';
			$('#table').bootstrapTable({ url: url,     //请求后台的URL（*）
				method: 'get',           //请求方式（*）
				striped: true,           //是否显示行间隔色
				processData : false,
				contentType : false,
				queryParams:function(params){
					return  {
						limit: params.limit ,
						offset: params.offset,
						keys:data.keys
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
				},
				onLoadSuccess:function (){

					/*设置权限*/
					this.getmenuId(function (data){
						var bottonData = data.data;
						$('#edit_add,#delete_list,.edit ,.jurisdiction  ,.remove').hide();
						if(data.data){
							for(var i=0,o;o=data.data[i];i++){
								if(o.code=='add'){
									$('#edit_add').show();
								}else if(o.code=='update'){
									$('.edit').show();
								}else if(o.code=='delete'){
									$('.remove,#delete_list').show();
								}else if(o.code=='set_jurisdiction'){
									$('.jurisdiction').show();
								}
							}
						}
					}.bind(this));
				}.bind(this),
			});

		},
		//删除
		delete_listData:function(id){
			$.ajax({
				url:this.API+'/role/delete?roleId='+id,
				type:'get',
				dataType:'json',
				success:function(data){
					if(data.code=='success'){
						$('#table').bootstrapTable('refresh');
					}else{
						setTimeout(function () {
							swal({title: "", text: data.errorMsg});
						},100)
					}
				},
				error:function(data){

				}
			});
		}


	});
	return MyActivity;
})