define(["ui/loading",'common/util',"activity","jquery",'bootstrap-table','jquery.cookie','bootstrap-switch',"datetimepicker","ejs","sweet-alert"],
function(loading,util,Activity){
	window.setArea = function (value,row,index){
		if(row){
			return (row.province+'-'+row.city+'-'+row.district);
		}

	};
	window.editDistributor = function (value,row,index){
		return '<a code="edit" class="edit addCode" distributorId="'+row.distributorId+'" href="javascript:void(0)" title="编辑"><i class="glyphicon glyphicon-pencil blue"></i></a><a code="remove" distributorId="'+row.distributorId+'" class="remove addCode" href="javascript:void(0)" title="删除"><i class="glyphicon glyphicon-trash gray"></i></a>';
	};
	window.discountEvent = function (vlaue,row,index){
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
			this.reName();
			this.render();
			this.get_listData();
			this.createCity();
			this.changeLevel();
			this.openAddConfig();
			this.removeDistributor();
			this.editDistributor();
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
		onResume:function (data){
			data = data || {};
			if(data.reload){
				location.reload();
			}
		},
		createCity:function (){
			this.createProvince();
		},
		getcityData:function (callBack){
			callBack = callBack || function (){};
			var url = this.openAPI + '/dictionary/geography';
			this.getData({
				url:url,
				data:{version:'1.2.0'},
				success:function (data){
					if(data.code=='success'){
						callBack(data);
					}
				}
			});
		},
		createProvince:function (){
			this.getcityData(function (data){
				var oProvince = this.$('.province');
				oProvince.append('<option value="">请选择省份</option>');
				var provinceList = data.data.provinceList;
				if(provinceList){
					for(var i= 0,k; k=provinceList[i];i++){
						var $option = $('<option value="'+k.id+'">'+ k.name+'</option>');
						$option.data('data', k.cityList);
						oProvince.append($option);
					}
				}
			}.bind(this));
			this.urbanEvents();
		},
		urbanEvents:function (){
			this.rootEl.on('change','.province',function (e){
				this.$('.urban').html('');
				this.$('.area').html('');
				var ele = $('option:selected',e.currentTarget);
				var data = ele.data('data');
				this.createUrban(data);
			}.bind(this));
		},
		createUrban:function (data){
			var oUrban = this.$('.urban');
			var oArea = this.$('.area');
			oUrban.append('<option value="">请选择城市</option>');
			oArea.append('<option value="">请选择地区</option>');
			if(!data){
				return;
			}
			for(var i= 0,k;k=data[i];i++){
				var $option = $('<option value="'+k.id+'">'+ k.name+'</option>');
				$option.data('data', k.areaList);
				oUrban.append($option);
			}
			this.areaEvents();
		},
		areaEvents:function (){
			this.rootEl.on('change','.urban',function (e){
				this.$('.area').html('');
				var ele = $('option:selected',e.currentTarget);
				var data = ele.data('data');
				this.createArea(data);
			}.bind(this));
		},
		createArea:function (data){
			var oArea= this.$('.area');
			oArea.append('<option value="">请选择地区</option>');
			if(!data){
				return;
			}
			for(var i= 0,k;k=data[i];i++){
				var $option = $('<option value="'+k.id+'">'+ k.name+'</option>');
				oArea.append($option);
			}
		},
		//http://dev-drp.525happy.cn/shop/distributor/list
		get_listData:function (){
			var url =this.API+'/shop/distributor/list';
			$('#list').bootstrapTable({ url: url,
				method: 'get',
				striped: true,
				processData : false,
				contentType : false,
				queryParams:function(params){
					var data = this.searchData();
					data.limit = params.limit;
					data.offset = params.offset;
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
									if(h==2){
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
		searchData:function (){
			var data = {};
			var keywords = this.$('#keywords').val();
			var level = this.$('.change.level').val();
			var province = this.$('.city.province').val();
			var urban = this.$('.city.urban').val();
			var area = this.$('.city.area').val();

			if(keywords){
				data.distributorName = keywords
			}
			if(level){
				data.level = level;
			}
			if(province){
				data.provinceNo = province;
			}
			if(urban){
				data.cityNo = urban;
			}
			if(area){
				data.districtNo = area;
			}
			return data;
		},
		changeLevel:function (){
			this.rootEl.on('change','.change.level',function (){
				this.$('#list').bootstrapTable('refresh');
			}.bind(this));
			this.rootEl.on('change','.city',function (){
				this.$('#list').bootstrapTable('refresh');
			}.bind(this));

			this.rootEl.on('click','#search_btn',function (e){
				if(!(this.$('#keywords').val())){
					this.$('.chec-text').html('搜索内容不能为空')
					return;
				}
				this.$('#list').bootstrapTable('refresh');
			}.bind(this));
			this.rootEl.on('focus','#keywords',function (e){
				this.$('.chec-text').html('')
			}.bind(this));
		},
		openAddConfig:function (){
			this.rootEl.on('click','.btn.btn-default.edit_add',function (e){
				this.open({
					url:'addConfig',
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
							var distributorId = this.$(e.currentTarget).attr('distributorid');
							var url = this.API + '/shop/distributor/del';
							this.getData({
								url:url,
								data:{distributorId:distributorId},
								success:function (data){
									if(data.code=='success'){
										this.$(e.currentTarget).parent().parent().remove();
									}
								}.bind(this),
								error:function (){

								},
							});
						}.bind(this),
						cancelCallBack:function (){
							//console.log(55555);
						}
					});
			}.bind(this));
		},
		editDistributor:function (){
			this.rootEl.on('click','a.edit',function (e){
				var distributorId = this.$(e.currentTarget).attr('distributorid');
				this.open({
					url:'edit',
					data:{distributorId:distributorId}
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