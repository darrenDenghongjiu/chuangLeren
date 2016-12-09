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
			this.rootEl.on("click",".edit_add",function(e){
				var id = $(e.currentTarget).attr("data-id");
				
				this.openChild({
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
			//employee_no
			/*员工签到*/
			this.employeeSign();
		},
		employeeSign:function (){
			this.rootEl.on('click','.confirm1',function (){
			//	debugger;
				var oVal = this.rootEl.find('.form-control').val();
				var reg = /^[a-zA-Z0-9]+$/;
				
				if(oVal){
					if(oVal.length<10){
						if(reg.test(oVal)){
							var url = '/shop/sign/staffSign';
							this.getData({
								url:this.API + url,
								data:{
									employeeNo:oVal,
								},
								success:function(data){

									if(data.code=='success'){
										swal({
											title: "",
											text: "签到成功",
											type: "success",
										});
									}
								},
								error:function (data){
									if(data.code=='failure'){
										swal({
											title: "",
											text: "请输入正确的工号",
											type: "error",
										});
									}
								}
							});
						}else{
							swal({
								title: "",
								text: "只能输入字母和数字",
								type: "warning",
							});
						}
					}else{
						/*长度过长*/
						swal({
							title: "",
							text: "你的输入字数过多",
							type: "warning",
						});
						
					}
				}
				
			}.bind(this));
			
		}
		
	});
	return MyActivity;
});
