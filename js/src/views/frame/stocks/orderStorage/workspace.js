define(["activityManage","route","workCommon"],function(ActivityManage,Router,workCommon){
	var config = [{
		express:"index",
		title:"首页"
	},{
		express:"review/:id",
		title:"审核流程"
	},{
		name:"index",
		express:"*filter",
		title:"首页"
	}];
	
	return workCommon(config);
});