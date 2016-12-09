define(["ui/loading","activity","sweetAlert","jquery","ejs"],function(loading,Activity){
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
			this.initEvents();
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
		initEvents:function(){
			
			this.rootEl.on("click",".js_list",function(e){
				var id = $(e.currentTarget).attr("data-id");
				this.open({
					url:"list"
				});
			}.bind(this));
			
			/*修改密码*/
			this.changeCode();
		},
		changeCode:function (){
			var oOriginal = this.rootEl.find('.original');
			var  oCode =  this.rootEl.find('.code');
			var oComfirmCode = this.rootEl.find('.comfirmCode');
			var errorMsg = this.rootEl.find('.errorMsg');

			this.rootEl.on("click",".btn-success",function (){

				var isOriginal = this.checkCode(oOriginal.val(),errorMsg,'原始密码不能为空');
				if(!isOriginal){
					return;
				}
				var isCode = this.checkCode(oCode.val(),errorMsg,'新密码不能为空');

				if(!isCode){
					return;
				}
				if(oOriginal.val() == oCode.val()){
					errorMsg.html('新的密码和老的密码不能一样');
					return;
				}
				var isComfirm = this.checkCode(oComfirmCode.val(),errorMsg,'确认密码不能为空');

				if(!isComfirm ){
					return;
				}
				if(!(oComfirmCode.val() == oCode.val())){
					errorMsg.html('新的密码和确认密码必须一致');
					return;
				}
				//parent.location.href

				this.getData({
					url:this.API + '/user/modifyPassword',
					data:{
						oldPassword:oOriginal.val(),
						newPassword:oComfirmCode.val()
					},
					success:function (data){
						if(data.code="success"){
							swal({
								title: "",
								text: "修改成功，请点击登陆",
								type: "success",
								showCancelButton: false,
								okCallBack:function (){
									window.parent.location.href = '/login.html';
								},
							});
						}

					},
					error:function (data){
						if(data.code="failure"){
							errorMsg.html(data.errorMsg);
						}
					}
				});

			}.bind(this));



			//http://dev-stoadm.525happy.cn/index.html
			this.rootEl.on("click",".changePasswords_close",function (){
				window.parent.location.href = '/index.html';
			});

		},
		checkCode:function  (str,errorMsg,words){
			var reg = /^[a-zA-Z0-9]+$/;
			if(!str){
				errorMsg.html(words);
				return;
			}else{
				if(str.length<6){
					errorMsg.html('长度不能小于6');
					return;
				}
				if(!reg.test(str)){
					errorMsg.html('只允许字母和数字');
					return;
				}
			}
			return true;
		}
	});
	return MyActivity;
})