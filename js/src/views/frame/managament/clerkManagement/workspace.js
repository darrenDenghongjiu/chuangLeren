define(["activityManage","route","workCommon"],function(ActivityManage,Router,workCommon){
	var config = [{
		express:"index",
		title:"首页"
	},{
		express:"addNewComer",
		title:"添加新店员"
	},{
			express:"edit",
			title:"编辑"
		},{
		express:"addNewComer/*where",
		title:"编辑店员"
	},{
		express:"list",
		title:"列表页"
	},{
		name:"index",
		express:"*filter",
		title:"首页"
	}];
	return workCommon(config);
});