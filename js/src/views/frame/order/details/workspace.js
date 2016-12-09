define(["activityManage","route"],function(ActivityManage,Router){
	var config = [{
		express:"index",
		title:"首页"
	},{
		express:"addNewComer",
		title:"添加新店员"
	},{
		express:"list",
		title:"列表页"
	},{
		name:"index",
		express:"*filter",
		title:"首页"
	}];
	
	var obj = {},name,express,title;
	obj.routes = {};
	for(var i = 0,o;o=config[i];i++){
		express = o.express;
		title = o.title;
		name = o.express.split('/')[0];
		if(o.name=='index')  name = "index";
		obj.routes[express] = name;
		obj[name] = (function(name,title){
			return function(){
				var key = name;
				for(var i = 0;i<arguments.length;i++){
					key += "-" + arguments[i];
				}
				ActivityManage.trigger(name,key,title,arguments);
			}
		})(name,title)
	}
	var Workspace = Router.Router.extend(obj);
	Workspace.config = config;
	return Workspace;
});