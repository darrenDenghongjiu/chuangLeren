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
		//'bootstrap-datetimepicker': ['jquery','bootstrap.min'],
		//'bootstrap-datetimepicker.zh-CN': ['jquery','bootstrap-datetimepicker'],
		'bootstrap-switch': ['jquery'],
		'route': ['jquery'],
		'jquery.form': ['jquery'],
		'jquery.zclip': ['jquery'],
		'jquery.cookie': ['jquery'],
		'umeditor.config':['jquery'],
		'umeditor.min':['jquery']
	},
	baseUrl: "/js/" + appConfig.dir,
	paths: {
		jquery: "lib/jquery/2.2.3/jquery.min",
		route: "lib/route/1.0.0/route",
		ejs: "lib/ejs/1.0.0/ejs",
		class:"lib/class/class",
	    'bootstrap-switch':'lib/bootstrap-switch/3.3.2/bootstrap-switch.min',
		'umeditor.config':'lib/um/umeditor.config',
		'umeditor.min':'lib/um/umeditor.min',
		'umeditor.custom':'lib/um/umeditor.custom',
		'datetimepicker':'lib/bootstrap-datetimepicker/2.5.3/jquery.datetimepicker.full',
		'jquery-mousewheel':'lib/jquery.mousewheel/3.1.13/jquery.mousewheel',
		workCommon:"views/frame/common/workCommon",
		workspace:"views/frame/" + path + "/workspace",
		activityManage:"activity/activityManage",
		activity:"activity/activity"
	},
	urlArgs: "v=" +  appConfig.version
});

require(["workspace","route"],function(Workspace,Router){
	var workspace = new Workspace();
	Router.history.start();
});