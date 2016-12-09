define(["activity","jquery","ejs","sweet-alert"],function(Activity){
	var MyActivity = Activity.extend({
		init: function (options) {
			this.options = $.extend({},{
				el:null,
				tempPath:""
			},options);
			this.tempPath = this.options.tempPath;
			this.rootEl = this.options.el;
			this.getActivityData=JSON.parse(this.getActivityData());
			this.render();
			this.reName();
			this.initEvents();
		},
		reName:function(){
			this.swiperBox = this.rootEl.find(".js_swiper_box");
		},
		render:function(){
			var templatePath = this.tempPath + "addNewComer.html" + "?r=" + appConfig.version;
			var template = new EJS({
				url:templatePath
			});
			this.viewData(function(data){
				this.rootEl.html(template.render({data:this.getActivityData.length=='' ? '':this.getActivityData,role:data.data,shopList:this.getActivityData}));
			}.bind(this));
		},
		initEvents:function(){
			this.rootEl.on("click",".cancel ",function(e){
				this.finish();
			}.bind(this));
		    this.bok = true;
			this.rootEl.on("click",".submit ",this.submit.bind(this));
			/*选择店员*/
			this.rootEl.on("click",".choice",function(e){
				$('.role .curr').removeClass('curr');
				$(e.currentTarget).addClass('curr');
				$('.role span').hide();
				$(e.currentTarget).find('span').show();
			}.bind(this));
		},
		submit:function (){

			var tip='';
			var index='';
			var shopId=this.rootEl.find('#shopId').val();
			var name=this.rootEl.find('#name').val();
			var phone=this.rootEl.find('#phone').val();
			var account=this.rootEl.find('#account').val();
			var role=this.rootEl.find('.role .curr').attr('tid');
			var reg=/^1[34578]\d{9}$/;
			var regAcount = /^\w{1,20}$/;
			if(shopId=='请选择'){
				tip='请选择店铺！';
				index=0;
			}else if(name==''){
				tip='姓名不能为空！';
				index=1;
			}else if(phone==''){
				tip='手机号码不能为空！';
				index=2;
			}else if(!reg.test(phone)){
				tip='手机号码格式不正确！';
				index=2;
			}else if(account==''){
				tip='登录账号不能为空！';
				index=3;
			}else if(account && !regAcount.test(account)){
				tip='登录账号只允许数字，字母，下划线！';
				index=3;
			}/*else if(!role){
				tip='前选择权限！';
				index=4;
			}*/

			$('.error_tip').html('');
			if(tip){
				$('.error_tip').eq(index).html(tip);
				return;
			}
			var url=this.API +'/user/add';
			var d={
				username:account,
				realname:name,
				phone:phone,
				roleId:role,
				shopId:shopId,
			};
			if(this.rootEl.find('.submit').attr('tid')){
				url=this.API +'/user/update';
				d.id=this.rootEl.find('.submit').attr('tid');
			}
			if(!this.bok){
				return;
			}
			this.bok = false;
			this.getData({
				url: url,
				data:d,
				success:function (data){
					this.bok = true;
					this.finish(1);
				}.bind(this),
				error:function(data){
					this.bok = true;
					swal({
						title: "",
						text:data.errorMsg,
						timer:2000
					});
				}.bind(this)
			});
		},
		viewData:function(callback){
			this.getData({
				url: this.API +'/role/base/list',
				success:function (data){
					callback(data);
				}.bind(this),
				error:function(data){
				}.bind(this)
			});
		}
	});
	return MyActivity;
})