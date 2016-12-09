define(['common/util','popup'],function (Util,popup) {
    var that;
     function ueditor_custom(options){
         this.options= $.extend({},{},options);
         that=this;
         this.tempNode='';
         this.classNum=0;
    }
    ueditor_custom.prototype={
        init:function(){
            $('#formBox').remove();
            this.generate();




        },
        generate:function(){
            setTimeout(function(){
                $('.edui-btn-image').unbind();
            },200);
            this.tempNode=$('<input type="file" name="ueditorUploadImg" class="ue_img ueditor_input'+this.classNum+'" style="opacity: 0">');
            $('.edui-icon-image.edui-icon').css('overflow','hidden').html(that.tempNode).css('opacity','1');
            this.fevent();
        },
        fevent:function(){
            $('.ue_img').unbind().bind('change',function(e){
                that.setContent(e);
            });
        },
        setContent:function(e) {
            if(!/image\/\w+/.test(e.target.files[0].type)){
                popup.popup({btn:1,txt:'文件必须为图片'});
                return false;
            }
            var ue = UM.getEditor('editor');
            ue.execCommand('insertHtml','<img  class="maxImg ueditor_img'+this.classNum+'"  src="'+window.URL.createObjectURL(e.target.files[0])+'" >');
            this.createForm(this.classNum);
            this.classNum++;
            this.tempNode=$('<input type="file" name="ueditorUploadImg" class="ueditor_input'+this.classNum+'" style="opacity: 0">');
            this.generate();
        },
        createForm:function(){
            if($('#formBox').length==0){
                var formBox='<div id="formBox" style="display: none"></div>';
                $('body').append(formBox);
            }
            var formHtml='<form enctype="multipart/form-data" class="ueditor_img'+this.classNum+'"></form>';
            $('#formBox').append(formHtml);
            $('.ueditor_img'+that.classNum).append(that.tempNode);
        },
        comparison_data:function(){
            var arr=UM.getEditor('editor').getContent().match(/ueditor_img[0-9]/g);
            var flag=true;
            $('#formBox form').each(function(){
                flag=true;
               for(var i=0;i<arr.length;i++){
                  if(arr[i]==$(this).attr('class')){
                      flag=false;
                      break;
                  }
               }
                if(flag){
                    $(this).remove();
                }
            });
        },
        upload_img_tempdata:{
            length:0,
            getArr:[],
        },
        UE_content:'',
        modify_Img:function(callback){
            if(that.upload_img_tempdata.length==$('#formBox form').length){
                var txt,data;
                data=UM.getEditor('editor').getContent().match(/ueditor_img[0-9]/g);
                this.UE_content=UM.getEditor('editor').getContent();
                var name='',psrc='';
                var i=0;
               this.UE_content=this.UE_content.replace(/<img\s*class\s*=["']([^"']+)?["'](.*?)\s*src\s*=["']([^"']+)?["']\s*\>?/ig,function(name,cn,ot,src){
                   console.log(name, name.indexOf('bcp_buy'))
                    if(cn ){
                        if(cn=='maxImg' || cn=='bcp_buy' ){//不被替换
                            return '<img class="'+cn+'" '+(ot||'')+' src="'+src+'" ';
                        }else{
                            for(var i=0;i<that.upload_img_tempdata.getArr.length;i++){
                                if(cn.indexOf(that.upload_img_tempdata.getArr[i].name)!=-1){
                                    return '<img class="'+cn+'" '+(ot||'')+' src="'+that.upload_img_tempdata.getArr[i].src+'" ';
                                }
                            }
                        }
                    }
                });
                callback(that.UE_content);
            }
        },
        upload_img:function(callback){
            if($('#formBox form').length==0){
                callback();
                return false;
            }
            for(var i=0;i<$('#formBox form').length;i++){
                (function(i){
                var formData=new FormData($("#formBox form")[i]);
                    $.ajax({
                        url:Util.config.url+'/bcp/baike/article/upload/imge',
                        data:formData,
                        processData : false,
                        contentType : false,
                        type:'post',
                        success:function(data){
                            console.log(data,i);
                            if(data.code=='success'){
                            that.upload_img_tempdata.length++;
                            that.upload_img_tempdata.getArr.push({name:$("#formBox form")[i].className,src:data.data});
                            that.modify_Img(callback);
                            }else{
                                alert(data.msg);
                            }
                        }
                    });
                })(i)
            }
        },
        getContent:function(callback){
             that.upload_img_tempdata.length=0;
             that.upload_img_tempdata.getArr=[];
            if( $('#formBox').length==0){
                callback();
            }else{
                 that.upload_img(callback);
            }
        }
    }

    window.custorm_ued =new ueditor_custom();
    custorm_ued.init();
    return custorm_ued;

});
