define(["activityManage","route","workCommon"],function(ActivityManage,Router,workCommon){
	var config = [{
		express:"index",
		title:"首页"
	},{
		name:"index",
		express:"*filter",
		title:"首页"
	}];
	return workCommon(config);
});