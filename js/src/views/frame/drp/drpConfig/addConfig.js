define(["ui/loading",'common/util',"activity","jquery",'bootstrap-table','jquery.cookie','bootstrap-switch',"datetimepicker","ejs","sweet-alert"],
function(loading,util,Activity){
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
			this.createCity();
			this.successSubmit();
			this.cancelEidt();
		},
		reName:function(){
			this.swiperBox = this.rootEl.find(".js_swiper_box");
		},
		render:function(){
			var templatePath = this.tempPath + "addConfig.html" + "?r=" + appConfig.version;
			var template = new EJS({
				url:templatePath
			});
			this.rootEl.html(template.render());
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
						var $option = $('<option value="'+k.id+'='+k.name+'">'+ k.name+'</option>');
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
				var $option = $('<option value="'+k.id+'='+k.name+'">'+ k.name+'</option>');
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
				var $option = $('<option value="'+k.id+'='+k.name+'">'+ k.name+'</option>');
				oArea.append($option);
			}
		},
		successSubmit:function (){
			var bok = true;
			this.rootEl.on('click','.btn-success.submit',function (){
				var searchData =  this.searchData();
				//http://pre-drp.525happy.cn/shop/distributor/create
				if(!searchData){
					return;
				}
				for(var name in searchData.checkAll){
					if(!(searchData.checkAll[name])){
						return;
					}
				}
				var url = this.API + '/shop/distributor/create';
				if(bok){
					bok = false;
					this.getData({
						type:'post',
						url:url,
						data:searchData.data,
						success:function (data){
							if(data.code=='success'){
								this.finish({reload:true});
							}
						}.bind(this),
						error:function (data){
							if(data.code=="failure"){
								swal({
									title: "",
									text:data.msg,
									type:'error',
									okCallBack:function (){
										this.finish();
									}.bind(this)
								});
							}

						}.bind(this),
					});
				}
			}.bind(this));
		},
		searchData:function (){
			var data = {};
			var keywords = this.$('#keywords').val();
			var level = this.$('.change.level').val();
			var province = this.$('.city.province').val();
			var urban = this.$('.city.urban').val();
			var area = this.$('.city.area').val();

			var name_t =  this.$('#name-text');
			var level_t = this.$('#level-text');
			var city_t = this.$('#city-text');
			var checkAll = {
				name_ok:false,
				level_ok:false,
				province_ok:false,
				city_ok:false,
				district_ok:false
			};
			this.rootEl.on('focus','#keywords',function (){
				name_t.html('');
			}.bind(this));

			if(keywords){
				data.distributorName = keywords
				checkAll.name_ok = true;
			}else{
				name_t.html('请输入分销商名称！');
			}

			if(level){
				checkAll.level_ok = true;
				data.level = level;
				level_t.html('');
			}else{
				level_t.html('请选择分销商等级！');
			}

			if(province){
				var provinceData = province.split('=');
				data.provinceNo = provinceData[0];
				data.province = provinceData[1];
				checkAll.province_ok = true;
				city_t.html('');
			}else{
				city_t.html('请选择省区');
				return;
			}

			if(urban){
				var urbanData = urban.split('=');
				data.cityNo = urbanData[0];
				data.city = urbanData[1];
				checkAll.city_ok = true;
			}else{
				city_t.html('请选择市区');
				return;
			}

			if(area){
				var areaData = area.split('=');
				data.districtNo = areaData[0];
				data.district = areaData[1];
				checkAll.district_ok = true;
			}else{
				city_t.html('请选择县/区');
			}

			return {data:data,checkAll:checkAll};
		},
		cancelEidt:function (){
			this.rootEl.on('click','.cancel',function (){
				this.finish();
			}.bind(this));
		}

	});
	return MyActivity;
})