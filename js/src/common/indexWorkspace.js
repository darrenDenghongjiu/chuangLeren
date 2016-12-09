define(["route"],function(Router){
	var result = function(options){
		options = $.extend({},{
			onChange:function(){},
			config:[{
				express:"userCenter",
				title:"用户中心",
				child:[
					{
						express:"sign",
						title:"打卡签到",
					},{
						express:"changeLogin",
						title:"修改登录密码"
					}]
			},{
				express:"order",
				title:"店铺订单",
				child:[
					{
						express:"totalOrder",
						title:"合计订单"
					},{
						express:"clerkOrder",
						title:"具体店员订单"
					},
					/*
					 {
					 express:"details",
					 title:"订单详情"
					 }
					 */
				]
			},{
				express:"purchase",
				title:"采购",
				child:[
					{
						express:"purchaseManagement",
						title:"采购单管理"
					},{
						express:"addOrder",
						title:"添加采购单"
					},
					{
						express:"orderReview",
						title:"采购单审核"
					}
				]
			},{
				express:"stocks",
				title:"库存",
				child:[
					{
						express:"storeInventory",
						title:"店铺库存"
					},{
						express:"orderStorage",
						title:"采购单入库",
					}
				]
			},{
				express:"managament",
				title:"门店管理",
				child:[
					{
						express:"attendanceCount",
						title:"考勤统计",
					},{
						express:"clerkManagement ",
						title:"店员管理",
					},{
						express:"createShop ",
						title:"创建店铺",
					}
				]
			},{
				express:"set",
				title:"设置",
				child:[
					/*	{
					 express:"accountNumber",
					 title:"账号",
					 },*/
					{
						express:"jurisdiction ",
						title:"权限",
					}
				]
			},{
				name:"index",
				express:"*filter",
				title:""
			}
			]
		},options);
		var temp=[],nowData='';
		for(var i in options.config){
			nowData={express:options.config[i].express,title:options.config[i].title};
			if(options.config[i].name) nowData.name=options.config[i].name;
			temp.push(nowData);
			if(options.config[i].child){
				for(var j in options.config[i].child){
					nowData={express:options.config[i].child[j].express,title:options.config[i].child[j].title};
					if(options.config[i].child[j].name) nowData.name=options.config[i].child[j].name;
					temp.push(nowData);
					if(options.config[i].child[j]){
						for(var k in options.config[i].child[j].child){
							nowData={express:options.config[i].child[j].child[k].express,title:options.config[i].child[j].child[k].title};
							if(options.config[i].child[j].child[k].name) nowData.name=options.config[i].child[j].child[k].name;
							temp.push(nowData);
						}
					}
				}
			}
		}
		var obj = {},name,express,title;
		obj.routes = {};
		for(var i = 0,o;o = temp[i];i++){
			name = o.express.split('/')[0];
			if(o.name=='index')  name=temp[0].express;
			express = o.express;
			title = o.title;
			obj.routes[express] = name;
			obj[name] = (function(name,title){
				return function(){
					options.onChange(name,options.config,temp,arguments);
				}
			})(name,title)
		}
		var Workspace = Router.Router.extend(obj);
		Workspace.config = options.config;
		Workspace.load=new Workspace();
		Router.history.start();
	}
	return result;
})
