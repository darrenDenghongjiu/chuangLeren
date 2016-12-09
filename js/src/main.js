if(!Function.prototype.bind){
	Function.prototype.bind = function(context){
		if(arguments.length<2&&context==void 0){
			return this;
		}
		var _method=this,args=[].slice.call(arguments,1);
		return function(){
			return _method.apply(context,args.concat.apply(args,arguments));
		}
	}
}

requirejs.config({
		shim:{
			'bootstrap.min': ['jquery'],
			'bootstrap-table': ['jquery'],
			'bootstrap-editable': ['jquery'],
			'bootstrap-table-editable': ['jquery','bootstrap-table'],
			'bootstrap-datetimepicker': ['jquery','bootstrap.min'],
			'bootstrap-datetimepicker.zh-CN': ['jquery','bootstrap-datetimepicker'],
			'bootstrap-switch': ['jquery'],
			'route': ['jquery'],
			'jquery.form': ['jquery'],
			'jquery.zclip': ['jquery'],
			'jquery.cookie': ['jquery'],
			'umeditor.config':['jquery'],
			'umeditor.min':['jquery']
		},
		baseUrl: "./js/" + appConfig.dir,
		paths: {
			'jquery': "lib/jquery/2.2.3/jquery.min",
			'jquery.cookie': "lib/jquery.cookie/1.4.1/jquery.cookie",
			'jquery.form': "lib/jquery.form/3.23/jquery.form",
			'jquery.zclip': "lib/jquery.zclip/1.1.1/jquery.zclip.min",
			'bootstrap.min': "lib/bootstrap/3.3.5/bootstrap",
			'bootstrap-editable': "lib/bootstrap-editable/1.5.1/bootstrap-editable",
			'bootstrap-table': "lib/bootstrap-table/1.10.1/bootstrap-table",
			'bootstrap-table-editable': "lib/bootstrap-table-editable/1.0.0/bootstrap-table-editable",
			'bootstrap-switch': "lib/bootstrap-switch/3.3.2/bootstrap-switch.min",
			'bootstrap-datetimepicker':"lib/bootstrap-datetimepicker/2.0.0/bootstrap-datetimepicker.min",
			'bootstrap-datetimepicker.zh-CN':"lib/bootstrap-datetimepicker/2.0.0/bootstrap-datetimepicker.zh-CN",
			vue: "lib/vue/1.0.21/vue.min",
			route: "lib/route/1.0.0/route",
			py: "lib/py/1.0.0/py",
			ejs: "lib/ejs/1.0.0/ejs",
			swiper:"lib/swiper/3.0.4/swiper.min",
			'umeditor.config':'lib/um/umeditor.config',
			'umeditor.min':'lib/um/umeditor.min',
			'umeditor.custom':'lib/um/umeditor.custom',
			frameWorkspace:"workspace/workspace",
			indexWorkspace:"./common/indexWorkspace"
		},
		urlArgs: "v=" +  appConfig.version
	});
require(["indexWorkspace","route","common/url.config",'ejs','jquery.cookie'],function(indexWorkspace,Router,url){


 var  main={
        init:function(){
            this.rootEl=$('.container-fluid');
            this.load();
            $('.user_info #userName').html($.cookie('drpUsername'));
            $('.user_info #login_out').on('click',function(){
                this.login_out();
            }.bind(this));
            if($.cookie('drpLayout')!=1){
                location.replace('login.html');
                return
            }
        },
		flag:13,
        load:function(){
            var that=this;
            this.getnavData(function(o,config,temp,last){
                this.draw.top_nav(o,config,temp,last);
                if(this.flag!=12)this.draw.setIframeSrc(this.flag);
                this.flag++;

            }.bind(this));

        },
        getnavData:function(callback){
          /*  new indexWorkspace({
                onChange:function(o,config,temp,last){
                    callback(o,config,temp,last);
                }
            })
*/
            $.ajax({
                url:url.drp+'/resource/all/list?platform=DRP',
                type:'get',
                dataType:'json',
                xhrFields: {
                    withCredentials:true
                },
                success:function(data){
                    if(data.code=='success'){
                        var datas=this.dataChange(data.data);
                        datas.push({
                            name:"index",
                            express:"*filter",
                            title:""
                        });
                        new indexWorkspace({
                            config:datas,
                            onChange:function(o,config,temp,last){
                                callback(o,config,temp,last);
                            }.bind(this)
                        })
                    }
                }.bind(this),
                error:function(){
                }
            });
        },
     dataChange:function(data){
         var temp1=[],temp2='',temp3='',clild='';
         for(var i= 0,o;o=data[i];i++){
              if(o.list.length>0){
                  temp2=[];
                  for(var j= 0,p;p= o.list[j];j++){
                      if(p.list.length>0){
                          temp3=[];
                          for(var k= 0,q;q= o.list[k];k++) {
                              temp3.push({
                                  "id": q.id,
                                  "parentId": q.parentId,
                                  "title":q.name,
                                  "ico": q.ico,
                                  "express": q.url,
                                  "checked": q.checked,
                                  "enabled": q.enabled
                              });
                          }
                          temp2.push({"id": p.id,"parentId":p.parentId,"title": p.name,"ico": p.ico,"express": p.url,"checked": p.checked,"enabled":p.enabled,child:temp3});
                      }else{
                          temp2.push({"id": p.id,"parentId":p.parentId,"title": p.name,"ico": p.ico,"express": p.url,"checked": p.checked,"enabled":p.enabled});
                      }
                  }
                  temp1.push({"id": o.id,"parentId":o.parentId,"title": o.name,"ico": o.ico,"express": o.url,"checked": o.checked,"enabled":o.enabled,child:temp2});
              }else{
                  temp1.push({"id": o.id,"parentId":o.parentId,"title": o.name,"ico": o.ico,"express": o.url,"checked": o.checked,"enabled":o.enabled});
              }
         }
         return temp1;
     },
        login_out:function(){



            $.ajax({
                url:url.drp+'/shop/login/layout?platform=DRP',
                type:'get',
                dataType:'json',
                xhrFields: {
                    withCredentials:true
                },
                success:function(data){
                    if(data.code=='success'){
                        var domain='.525happy.cn';
                        /*"adm.biechipang.net"*/
                        if(location.host === "drpadm.biechipang.net"){
                            domain = ".biechipang.net";
                        }
                        $.removeCookie('drpLayout',{domain:domain});
                        $.removeCookie('drpLoginId',{domain:domain});
                        $.removeCookie('drpUId',{domain:domain});
                        $.removeCookie('drpUsername',{domain:domain});
                        location.replace('login.html');
                    }
                },
                error:function(){
                }
            });


        },
        draw:{
            Data_comparison:function(a,b,last){
                var data='';
             if(last) a= last.split('/')[0];
                for(var i in b){
                    if(a==b[i].express){
                        data=b[i].child ||  b[i];
                        break;
                    }
                }
                return data;
            },
            top_nav:function(o,config,temp,last){
                var that=this;
                var template = new EJS({
                    url:"template/nav/top.html"
                });
                var html= template.render(config);
                $('#bs-example-navbar-collapse-1').html(html);
                if(last[0]) o= last[0].split('/')[0];
                if((/!/).test(o)){
                    o=o.split('!!')[0];
                }
                $('#bs-example-navbar-collapse-1 li[target='+o+']').addClass('curr');
                $('#bs-example-navbar-collapse-1 li').unbind().bind('click',function(e){
                    if($(this).attr('enabled')=='false') return;
                    var vue=$(this).attr('target');
                    //debugger
                  //  Router.history.navigate('#'+vue,true);
                    $('#bs-example-navbar-collapse-1 li').removeClass('curr');
                    $(this).addClass('curr');
                    that.temDate=that.Data_comparison(vue,config);
                    that.left_nav(vue);
                });
                that.temDate=that.Data_comparison(o,config,last[0]);
                this.left_nav(o,last[0]);
            },
            temDate:'',
            left_nav:function(o,last){
                var that=this;
                var template = new EJS({url:"template/nav/left.html"});
                var html= template.render(this.temDate);
                $('.sidebar').html(html);
                var curr=last ? last.split('/')[1] : o;
                if((/!/).test(curr)){
                    curr=curr.split('!!')[0];
                }
                $('.left_menu_li[target='+curr+']').addClass('curr');
                $('.left_menu_li .nav_txt').unbind().bind('click',function(){
                   // if($(this).parent().hasClass('curr')) return;
                    $('.left_menu_li').removeClass('curr');
                    $(this).parent().addClass('curr');

                    if($(this).parent().find('li').length>0){

                    }else{
                        if(location.hash.indexOf('#'+$('.navbar-nav .curr').attr('target')+'/'+$(this).parent().attr('target'))>-1){
							main.flag=12;
                            that.setIframeSrc(12);

                        }else{
							main.flag=13;
                     Router.history.navigate('#'+ $('.navbar-nav .curr').attr('target')+'/'+$(this).parent().attr('target'),true);
                        }

                    }
                });

                    var curr=last ? last.split('/')[2] : o;
                    if((/!/).test(curr)){
                        curr=curr.split('!!')[0];
                    }
                    $('.left_menu_li.curr li[target='+curr+']').addClass('curr');
                    $('.left_menu_li li').unbind().bind('click',function(){
                        //if($(this).hasClass('curr')) return;
                        Router.history.navigate('#'+ $('.navbar-nav .curr').attr('target')+'/'+$('.left_menu_li.curr').attr('target')+'/'+$(this).attr('target'),true);
                    });
            },
            setIframeSrc:function(flag){
                var three='';
                var src=$('.navbar-nav .curr').attr('target')+'/'+$('.left_menu_li.curr').attr('target')+three+'/index.html';
                if($('.left_menu_li.curr li').length>0){
                    if($('.left_menu_li.curr .curr').length==0) {
                        src='404.html';
                        if(flag!=1){
                            return;
                        }
                    };
                    three=$('.left_menu_li.curr .curr').attr('target');
                }


               if(!$('.left_menu_li.curr').attr('target')){
                   src='404.html';
                   if(flag!=1){
                       return;
                   }
               }
                var parm='';
                if( /!!/.test(location.hash)){
					if(flag != 12 ){
                    	parm=decodeURIComponent(location.hash.replace(/.*\!\!(.*)\!\!.*/,"$1"));
						 $('#iframe_con').attr('src','frame/'+src+parm);
					}else{
						 location.href=location.href.split('!!')[0];
						  $('#iframe_con').attr('src','frame/'+src);
						}
                }else{
                    location.href=location.href.split('!!')[0];
					 if($('#iframe_con').attr('src').indexOf(src)>-1 && $('#iframe_con').attr('src')!=''){
						if(flag != 12 ){
							  parm = "";
						  if(/!!/.test(location.hash)){
								parm=decodeURIComponent(location.hash.replace(/.*\!\!(.*)\!\!.*/,"$1"));
							}
							 $('#iframe_con')[0].contentWindow.location.hash=parm;
							//debugger;
						}else{
							$('#iframe_con').attr('src','frame/'+src);
						}
					 }else{
					 	$('#iframe_con').attr('src','frame/'+src);
						 }
                }


            }
        }
    }
    main.init();




});