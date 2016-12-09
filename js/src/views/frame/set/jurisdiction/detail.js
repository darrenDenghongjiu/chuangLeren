define(["ui/loading","activity","sweet-alert","jquery","ejs"],function(loading,Activity,sweet){
	var MyActivity = Activity.extend({
		init: function (options) {
			this.options = $.extend({},{
				el:null,
				tempPath:""
			},options);
			this.custom = this.getActivityData();
			this.tempPath = this.options.tempPath;
			this.rootEl = this.options.el;
			this.render();
			this.initEvents();
		},
		render:function(){
			var templatePath = this.tempPath + "detail.html" + "?r=" + appConfig.version;
			var template = new EJS({
				url:templatePath
			});
			this.rootEl.html(template.render());
			this.load()
		},
		initEvents:function(){
			this.rootEl.on("click",".js_finish",function(e){
				this.finish({a:1});
			}.bind(this));
		},
		load:function(){
			this.get_data( this.options.args[0]);
			$('#save').attr('tid',this.options.args[0]);
			this.f_event();
			this.view(this.options.args[0]);

		},
		get_data:function(id){

		},
		f_event:function(){
			$('.edit_shop').on("click","#cancel",function(){
				this.finish();
			}.bind(this));
			$('.edit_shop').on("click","#save",function(){
				var d=[];
				$('#parent_node input').each(function(){
					if($(this).prop('checked')){
						d.push($(this).attr('tid'));
					}
				});
				this.permission_set({id:$('#save').attr('tid'),resourceIds:d.join()});
			}.bind(this));

		},

			list_load:function(d){
				$('#parent_node').html( this.parent_node(d));
				this.fevent();
			},
			fevent:function(){
				$('.add').unbind().bind('click',function(e){
					var t=$(this);
					if(e.target.nodeName.toLowerCase()=='input') return;
					if(t.hasClass('glyphicon-minus')){
						t.removeClass('glyphicon-minus');
						t.next().hide();
					}else{
						t.addClass('glyphicon-minus');
						t.next().show();
					}
				});
				$('#parent_node input').unbind().bind('click',function(e){
					this.ergodic_input($(e.target));
				}.bind(this));
			},
			ergodic_input:function(t){
				var check=true;
				if(!t.prop('checked')){
					t.parent().next().find('input').prop('checked',false);

				}else{
					t.parent().next().find('input').prop('checked',true);
					t.parents('li').each(function(){
						$(this).find('input').eq(0).prop('checked',true)
					});
				}

			},
			nodes:function(d,type){
				var html='',add='',check='',hide='style="display: none"';
				if(type) hide='';
				for(var i=0;i< d.length;i++){
					add='none',check='';
					if(d[i].checked) check='checked';
					if(d[i].list.length>0){
						add='add glyphicon glyphicon-plus';
					}
					// if(type) add='add glyphicon glyphicon-plus glyphicon-minus';
					html+='<li ><a class="'+add+'"><span>'+d[i].name+'</span><input  tid="'+d[i].id+'" type="checkbox" '+check+'></a> ';
					if(d[i].list.length>0){
						html+=this.nodes(d[i].list);
					}
					html+='</li>';
				}
				return  '<ul '+hide+'>'+html+'</ul>';
			},
			parent_node:function(d){
				var html='',add='',check='';
				for(var i=0;i< d.length;i++){
					add='none',check='';
					if(d[i].checked) check='checked';
					if(d[i].list.length>0){
						add='add glyphicon glyphicon-plus glyphicon-minus'
					}
					html+='<li class="parents" ><a class="'+add+'"><span>'+d[i].name+'</span><input tid="'+d[i].id+'" type="checkbox" '+check+'></a> ';
					if(d[i].list.length>0){
						html+=this.nodes(d[i].list,1);
					}
					html+='</li>';
				}
				return html;
			},


			view:function(id){
				$.ajax({
					url:this.API+'/role/permission/list?roleId='+id,
					type:'get',
					dataType:'json',
					success:function(data){
						if(data.code=='success'){
							this.list_load(data.data);
						}
					}.bind(this),
					error:function(){
					}
				});
			},
			//提交数据
			permission_set:function(d){
				if( $('#save').hasClass('click')) return;
				$('#save').addClass('click');
				$.ajax({
					url:this.API+'/role/permission/set',
					type:'get',
					data:{
						id: d.id,
						resourceIds: d.resourceIds
					},
					dataType:'json',
					success:function(data){
						if(data.code=='success') {
							this.finish();
						}else{
							swal({title: "", text: data.errorMsg});
							$('#save').removeClass('click');
						}
					}.bind(this),error:function(){
						$('#save').removeClass('click');
					}
				});

			}


	});
	return MyActivity;
})