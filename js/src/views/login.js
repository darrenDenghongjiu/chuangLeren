require(["common/util","common/url.config",'jquery.cookie','sweet-alert'],function(Util,url){
    var login={
        init:function(){
            if(($.cookie('drpUsername') && $.cookie('drpUId') && $.cookie('drpLoginId')) && $.cookie('drpLayout')==1) {
                location.href='index.html';
                return
            }
            this.fevent();
        },
        fevent:function(){
            var that=this
            $('#submit').on('click',this.submit.bind(this));
            $('#reset').on('click',this.reset);
            $('body').unbind().bind("keypress",function(){
                if(event.keyCode==13){  that.submit(); }
            }.bind(this));
        },
        submit:function(){
            var tip='';
            if(!($('input[name=username]').val())){
                tip='用户名不能为空';
            }else if(!($('input[name=password]').val())){
                tip='密码不能为空';
            }
            if(tip){
               $('.tip_error').html(tip);
                return
            }
            this.submit_data();
        },
        submit_data:function(){
            
			var logUrl = '/shop/login/login';
            $.ajax({
                url:url.drp+logUrl,
                data:{
                    remeberMe:$('#checkbox').prop('checked') ? 'yes':'no',
                    userName:$('input[name=username]').val(),
                    password:$('input[name=password]').val()
                },
                type:'post',
                dataType:'json',
                success:function(data){
					if(data.code=="failure"){
						swal({
							title: "",
							text: data.errorMsg,
							type: "error",
						});
					}
                    if(data.code=='success'){
                        location.href='index.html';
                    }else{
                        $('.tip_error').html(data.msg);
                    }
                },
                complete:function(){
					/*所有的请求返回值*/
                },
                error:function(data){
					log(3333333333);
                }
            });
        },
        reset:function(){
            $('input[name=username],input[name=password]').val('');
        }
    }

    login.init();
});