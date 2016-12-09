define(["activity","jquery","ejs","sweet-alert"],function(Activity){
	var MyActivity = Activity.extend({
		init: function (options) {
			this.options = $.extend({},{
				el:null,
				tempPath:""
			},options);
			this.tempPath = this.options.tempPath;
			this.rootEl = this.options.el;
			this.render();
			this.reName();
			this.successSubmit();
			this.setDistributSelect();
			this.cancelEidt();
			//this.reName();
		},
		reName:function(){
			this.swiperBox = this.rootEl.find(".js_swiper_box");
		},
		render:function(){
			var templatePath = this.tempPath + "addNewComer.html" + "?r=" + appConfig.version;
			var template = new EJS({
				url:templatePath
			});
			this.rootEl.html(template.render());
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
		setDistributSelect:function (){
			this.getDistributorData(function (data){
				var oShopId = this.$('#shopId');
				var data = data.data;
				oShopId.append('<option value="">请选择</option>');
				for(var i= 0,k;k=data[i];i++){
					oShopId.append('<option value="'+ k.distributorId+'">'+ k.distributorName+'</option>');
				}
			}.bind(this))
		},
		//btn-success submit
		successSubmit:function (){
			//http://dev-drp.525happy.cn/user/distributor/add
			this.rootEl.on('click','.btn-success.submit',function (){
				var url = this.API + '/user/distributor/add';
				var searchData = this.searchData();
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
					error:function (data){
						if(data.code=="failure"){
							swal({
								title: "",
								text: data.errorMsg,
								type:'error',
								okCallBack:function (){
									this.finish({reload:true});
								}.bind(this),
							});
						}
					}.bind(this),
				});
			}.bind(this));
		},
		searchData:function (){
			var data = {};
			var shopId = this.$('#shopId').val();
			var name = this.$('#name').val();
			var phone = this.$('#phone').val();
			var account = this.$('#account').val();

			var shopId_t = this.$('#shopId-text');
			var name_t = this.$('#name-text');
			var phone_t = this.$('#phone-text');
			var account_t = this.$('#account-text');
			var regAcount = /^\w{1,20}$/;

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
				if(regAcount.test(account)){
					data.username = account;
					checkAll.account_ok = true;
					account_t.html('');
				}else{
					account_t.html('分销商账户只允许英文，数字，下划线');
				}

			}else{
				account_t.html('请输入账户');
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