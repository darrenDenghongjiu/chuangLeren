define(["activityManage","route","workCommon"],function(ActivityManage,Router,workCommon){
	var config = [{
		express:"index",
		title:"首页"
	},{
		//express:"details/:id/:aid",
		express:"addNewComer",
		title:"添加管理员"
	},{
		express:"edit",
		title:"编辑"
		},{
		name:"index",
		express:"*filter",
		title:"首页"
	}];
	return workCommon(config);
});