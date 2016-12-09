define(["activity","jquery","ejs","sweet-alert"],function(Activity){
	var MyActivity = Activity.extend({
		init: function (options) {
			this.options = $.extend({},{
				el:null,
				tempPath:""
			},options);
			this.tempPath = this.options.tempPath;
			this.rootEl = this.options.el;
			this.userId = this.getActivityData();

			this.render();
			this.cancelEidt();

			//this.reName();
		},
		reName:function(){
			this.swiperBox = this.rootEl.find(".js_swiper_box");
		},
		render:function(){
			this.getUserData(function (data){
				var templatePath = this.tempPath + "edit.html" + "?r=" + appConfig.version;
				var template = new EJS({
					url:templatePath
				});
				this.rootEl.html(template.render(data));
				this.reName();
				this.successSubmit(data.data.id);
				this.setDistributSelect(data.data.distributorId);
			}.bind(this));
		},
		getUserData:function (callBack){
			callBack = callBack || function (){};
			var url = this.API  + '/user/form';
			this.getData({
				url:url,
				data:JSON.parse(this.userId),
				success:function (data){
					callBack(data);
				}.bind(this),
				error:function (data){

				},
			});
		},
		checkAddComer:function (){
			//shopId
			//name
			//phone
			//account
			///^1\d{10}$/

		},
		//http://dev-drp.525happy.cn/shop/distributor/findlist
		getDistributorData:function (callBack){
			callBack = callBack || function (){};
			var url = this.API + '/shop/distributor/findlist';
			//distributorName
			this.getData({
				url:url,
				data:{},
				success:function (data){
					callBack(data);
				},
			});
		},
		setDistributSelect:function (userId){
			this.getDistributorData(function (data){
				var oShopId = this.$('#shopId');
				var data = data.data;
				oShopId.append('<option value="">请选择</option>');
				for(var i= 0,k;k=data[i];i++){
					oShopId.append('<option value="'+ k.distributorId+'">'+ k.distributorName+'</option>');
				}
				oShopId.val(userId);
			}.bind(this))
		},
		successSubmit:function (id){
			this.rootEl.on('click','.btn-success.submit',function (){
				var url = this.API + '/user/update';
				var searchData = this.searchData(id);
				for(var name in searchData.checkAll){
					if(!searchData.checkAll[name]){
						return;
					}
				}

				this.getData({
					url:url,
					data:searchData.data,
					success:function (data){
						if(data.code=="success"){
							this.finish({reload:true});
						}
					}.bind(this),
				});
			}.bind(this));
		},
		searchData:function (id){
			var data = {};
			var shopId = this.$('#shopId').val();
			var name = this.$('#name').val();
			var phone = this.$('#phone').val();
			var account = this.$('#account').val();

			var shopId_t = this.$('#shopId-text');
			var name_t = this.$('#name-text');
			var phone_t = this.$('#phone-text');
			var account_t = this.$('#account-text');

			var regPhone = /^1\d{10}$/;

			var checkAll = {
				shopId_ok:false,
				name_ok:false,
				phone_ok:false,
				account_ok:false,
			};
			if(shopId){
				data.distributorId = shopId;
				checkAll.shopId_ok = true;
				shopId_t.html('');
			}else{
				shopId_t.html('请选择一个分销商');
			}

			if(name){
				data.realname = name;
				checkAll.name_ok = true;
				name_t.html('');
			}else{
				name_t.html('请输入姓名');
			}

			if(phone==""){
				phone_t.html('请输入手机号');
			}else if(regPhone.test(phone)){
				data.phone = phone;
				checkAll.phone_ok = true;
				phone_t.html('');
			}else{
				phone_t.html('请输入格式正确的手机号');
			}

			if(account){
				data.username = account;
				checkAll.account_ok = true;
				account_t.html('');
			}else{
				account_t.html('请输入账户');
			}
			if(id){
				data.id = id;
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