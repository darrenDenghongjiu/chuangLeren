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

	var path = location.pathname.replace(/\/frame\/(.*)\/index.*/,"$1");



	requirejs.config({
		shim:{
			'bootstrap.min': ['jquery'],
			'bootstrap-table': ['jquery'],
			'bootstrap-editable': ['jquery'],
			'bootstrap-table-editable': ['jquery','bootstrap-table'],
			'bootstrap-switch': ['jquery'],
			'route': ['jquery'],
			'jquery.form': ['jquery'],
			'jquery.zclip': ['jquery'],
			'jquery.cookie': ['jquery'],
			'umeditor.config':['jquery'],
			'umeditor.min':['jquery'],

		},
		baseUrl: "/js/"+ appConfig.dir,
		paths: {
			jquery: "lib/jquery/2.2.3/jquery.min",
			'jquery.cookie': "lib/jquery.cookie/1.4.1/jquery.cookie",
			'jquery.form': "lib/jquery.form/3.23/jquery.form",
			'jquery.zclip': "lib/jquery.zclip/1.1.1/jquery.zclip.min",
			'bootstrap.min': "lib/bootstrap/3.3.5/bootstrap",
			'bootstrap-editable': "lib/bootstrap-editable/1.5.1/bootstrap-editable",
			'bootstrap-table': "lib/bootstrap-table/1.10.1/bootstrap-table",
			'bootstrap-table-editable': "lib/bootstrap-table-editable/1.0.0/bootstrap-table-editable",
			'bootstrap-switch': "lib/bootstrap-switch/3.3.2/bootstrap-switch.min",
			'sweet-alert':'lib/sweet/sweet-alert.min',
			vue: "lib/vue/1.0.21/vue.min",
			route: "lib/route/1.0.0/route",
			route_config: "common/route_config",
			py: "lib/py/1.0.0/py",
			navData: "data/nav",
			ejs: "lib/ejs/1.0.0/ejs",
			popup: "ui/popup",
			loading: "ui/loading",
			food_select: "ui/food_select",
			label_select: "ui/label_select",
			city_select: "ui/city_select",
			viewOrginal: "ui/viewOrginal",
			fromatter: "ui/fromatter",
			swiper:"lib/swiper/3.0.4/swiper.min",
			class:"lib/class/class",
			'umeditor.config':'lib/um/umeditor.config',
			'umeditor.min':'lib/um/umeditor.min',
			'umeditor.custom':'lib/um/umeditor.custom',
			'datetimepicker':'lib/bootstrap-datetimepicker/2.5.3/jquery.datetimepicker.full',
			'jquery-mousewheel':'lib/jquery.mousewheel/3.1.13/jquery.mousewheel',
			'sweetAlert':'lib/sweet/sweet-alert.min',
			workCommon:"views/frame/common/workCommon",
			workspace:"views/frame/" + path + "/workspace",
			activityManage:"activity/activityManage",
			activity:"activity/activity"
		},
		urlArgs: "v=" +  appConfig.version
	});

	if(location.pathname!='/login.html'){
		require(["workspace","route"],function(Workspace,Router){
			$.ajaxSetup({
				timeout: 300000,
				xhrFields: {
					withCredentials:true
				}
			});
			var workspace = new Workspace();
			Router.history.start();
		});
	}