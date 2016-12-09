define(["activityManage","route","workCommon"],function(ActivityManage,Router,workCommon){
	var config = [{
		express:"index",
		title:"首页"
	},{
		//express:"details/:id/:aid",
		express:"details",
		title:"订单详情页"
	},{
		name:"index",
		express:"*filter",
		title:"首页"
	}];
	return workCommon(config);
});