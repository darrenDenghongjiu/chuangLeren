define(["ui/loading","activity","jquery","ejs","sweet-alert"],function(loading,Activity){
	var MyActivity = Activity.extend({
		init: function (options) {
			this.options = $.extend({},{
				el:null,
				tempPath:""
			},options);
			this.tempPath = this.options.tempPath;
			this.rootEl = this.options.el;
			this.getActivityData = this.getActivityData();
			this.render();
			this.reName();
			this.initEvents();
		},
		reName:function(){
			this.swiperBox = this.rootEl.find(".js_swiper_box");
		},
		render:function(){
			var templatePath = this.tempPath + "detail.html" + "?r=" + appConfig.version;
			var template = new EJS({
				url:templatePath
			});
			this.rootEl.html(template.render(this.getActivityData));
			this.selectCity();
			/*页面加载完毕*/
			var allButton = this.$('.addCode');
			var bottonData = JSON.parse(this.getActivityData);
			if(bottonData.storeData){
				bottonData = bottonData.storeData;
			}
			for (var i = 0; i < bottonData.length; i++) {
				(function (code) {
					for (var k = 0; k < allButton.length; k++) {
						var name = $(allButton[k]).attr('code');
						if (name == code) {
							$(allButton[k]).addClass('success-curr');
						}
					}
				})(bottonData[i].code);
			}
			/*set显示*/
			for (var k = 0; k < allButton.length; k++) {
				var isShow = allButton[k].className;
				if (isShow.indexOf('success-curr') == -1) {
					var parent = $(allButton[k]).parent();
					$(allButton[k]).remove();
				}
			}
			this.defaultClass(this.getActivityData);
		},
		initEvents:function(){
			this.rootEl.on("click",".cancel ",function(e){
				this.finish();
			}.bind(this));

			this.rootEl.on("click",".submit ",this.submit.bind(this));

			if(this.getActivityData){
				var d=JSON.parse(this.getActivityData);
				if(d.type==1){
					$('#fxs').show();
					this.distributorList(function(){
						$('#fxs select').val(d.distributorId);
					});
					//return;
				}
			}

			/*选择店员*/
			this.rootEl.on("click",".shopType .btn",function(e){

				var el=$(e.currentTarget);
				/*类型有了不能改变*/
				if(el.attr('btntype')){
					return;
				}
				$('.shopType .btn .curr').removeClass('curr');
				$('.shopType .btn span').hide();
				el.find('span').addClass('curr').show();

				if (el.index() == 1) {
					$('#fxs').show();
					this.distributorList()
				} else {
					$('#fxs').hide();
				}
			}.bind(this));
		},
		submit:function (){
			// JSON.parse(this.getActivityData);
			var tip='';
			var index='';
			var type=this.rootEl.find('.shopType .curr').attr('value');
			var shopName=this.rootEl.find('#shopName').val();
			var areaSize=this.rootEl.find('#areaSize').val();
			var address=this.rootEl.find('#address').val();
			var shopMgrName=this.rootEl.find('#shopMgrName').val();
			var shopMgrPhone=this.rootEl.find('#shopMgrPhone').val();
			var provinceId =$('#citySelect select').eq(0).val();
			var province = $($("#citySelect select")[0]).find("option:selected").text();
			var city=$('#citySelect select').eq(1).val();
			var district=$('#citySelect select').eq(2).val();
			var reg=/^1[34578]\d{9}$/;
			if(!type){
				tip='选择专柜分类！';
				index=0;
			}else if($('#fxs').css('display')=='block' && $('#fxs select').val()=='请选择'){
				tip='当前没有可选择的经销商';
				index=1;
			}else if(shopName==''){
				tip='请输入专柜名！';
				index=2;
			}else if(areaSize==''){
				tip='请输入输入专柜面积！';
				index=3;
			}else if(areaSize*1>1000000){
				tip='面积过大，请小于10万';
				index=3;
			}else if(province=='请选择'){
				tip='请输入选择省份！';
				index=4;
			}else if(city=='请选择'){
				tip='请输入选择城市！';
				index=4;
			}else if(district=='请选择'){
				tip='请输入选择区域！';
				index=4;
			}else if(address==''){
				tip='请输入专柜详细地址！';
				index=5;
			}else if(shopMgrName==''){
				tip='请输入输入姓名 ！';
				index=6;
			}else if(shopMgrPhone==''){
				tip='手机号码不能为空！';
				index=7;
			}else if(!reg.test(shopMgrPhone)){
				tip='手机号码格式不正确！';
				index=7;
			}
			$('.error_tip').html('');

			if(tip){
				$('.error_tip').eq(index).html(tip);
				/*swal({
					title: "",
					text:tip,
					timer:2000
				});*/
				return;
			}
			var url=this.API +'/shop/post';
			var d={
				type:type,
				shopName:shopName,
				areaSize:areaSize,
				province:$('#citySelect select').eq(0).val(),
				city:$('#citySelect select').eq(1).val(),
				district:$('#citySelect select').eq(2).val(),
				address:address,
				shopMgrName:shopMgrName,
				shopMgrPhone:shopMgrPhone,
			};
			if(JSON.parse(this.getActivityData).storeData){
				url=this.API +'/shop/update';
				d.shopId=$('.submit').attr('tid');
			}
			if($('#fxs').css('display')=='block'){
				d.distributorId=$('#fxs select').val();
			}
			this.getData({
				url: url,
				data:d,
				success:function (data){

					this.finish(1);
				}.bind(this),
				error:function(data){
					swal({
						title: "",
						text:data.msg,
						timer:2000
					});
				}.bind(this)
			});
		},
		selectCity:function(){
			this.getCityData(function(data){
				this.tempCityData=data;
				this.setProvinceHtml(this.tempCityData,0,0);
				if(this.getActivityData){
					var d=JSON.parse(this.getActivityData);
					if(d.province){
						//debugger;
						$('#citySelect select').eq(0).val(d.province);
						var el=$('#citySelect select');
						var list = this.tempCityData[el.eq(0).find('option:selected').index()-1];
						if(list){
							this.setCityHtml(list.cityList,0);
							$('#citySelect select').eq(1).val(d.city);
							var listArea = list.cityList[el.eq(1).find('option:selected').index()-1];
							this.setAreaHtml(listArea.areaList,0);
						}
						$('#citySelect select').eq(2).val(d.district);
					}
				}

				this.rootEl.on('change','#citySelect select',function(e){
					var el=$(e.currentTarget);
					switch (el.index()){
						case 0:
							this.setCityHtml(this.tempCityData[el.find('option:selected').index()-1].cityList,0);
							break;
						case 1:
							this.setAreaHtml(this.tempCityData[$('#citySelect select').eq(0).find('option:selected').index()-1].cityList[$('#citySelect select').eq(1).find('option:selected').index()-1].areaList,0);
							break;
					}
				}.bind(this));

			}.bind(this))


		},
		setProvinceHtml:function(data,CityNum,AreaNum){
			var province='<option >请选择</option>';
			for(var i= 0,o;o=data[i];i++){
				province+='<option>'+ o.name+'</option>';
			}
			$('#citySelect select').eq(0).html(province);
			this.setCityHtml(data[CityNum].cityList,AreaNum);
		},
		setCityHtml:function(data,AreaNum){
			var city='<option >请选择</option>';
			for(var j= 0,p;p= data[j];j++){
				city+='<option >'+ p.name+'</option>';
			}
			$('#citySelect select').eq(1).html(city);
			this.setAreaHtml(data[AreaNum].areaList)
		},
		setAreaHtml:function(data){
			var area='<option >请选择</option>';
			for(var k= 0,q;q= data[k];k++){
				area+='<option >'+ q.name+'</option>';
			}
			$('#citySelect select').eq(2).html(area);
		},
		getCityData:function(callback){
			var url = this.openAPI+  '/dictionary/geography';
			this.getData({
				url:url,
				data:{version:'1.2.0'},
				success:function (data){
					callback(data.data.provinceList)
				}.bind(this),
				error:function(data){
					swal({
						title: "",
						text:data.msg,
						timer:2000
					});
				}.bind(this)
			});
		},
		distributorList:function(callback){
			if($('#fxs select option').length>1) return;
			this.getData({
				url: this.API+'/shop/distributor/findlist',
				success:function (data){
					if(data.data.length==0) return;
					var html='';
					for(var i in data.data){
						html+='<option value="'+data.data[i].distributorId+'">'+data.data[i].distributorName+'</option>';
					}
					$('#fxs select').html(html);
					if(callback) callback();

				}.bind(this),
				error:function(data){
					swal({
						title: "",
						text:data.msg,
						timer:2000
					});
				}.bind(this)
			});
		},
		defaultClass:function (data){
			var data = JSON.parse(data);
				if(data){
					if(!data.type){
						this.$('span.default').removeClass('cancel');
						this.$('span.default').addClass('curr');
						this.$('#fxs').hide();
					}
				}
		},
	});
	return MyActivity;
})