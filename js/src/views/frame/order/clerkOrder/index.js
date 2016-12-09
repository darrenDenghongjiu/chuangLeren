define(["ui/loading",'common/util',"activity","jquery",'jquery.cookie','bootstrap-switch',"datetimepicker","ejs"],
function(loading,util,Activity){
	var MyActivity = Activity.extend({
		init: function (options) {
			this.options = $.extend({},{
				el:null,
				tempPath:""
			},options);
			this.tempPath = this.options.tempPath;
			this.rootEl = this.options.el;
			this.render();
			this.initTable();
			this.initEvents();
			this.bootstrapSwitch();
			this.renderStoreList();
			/*店铺列表*/

			this.saveData = {};
		},
		initTable:function (res){

			var inx;
			if(res){
				inx = res;
			}
			this.totalOrderGet(function(data,res){
				/*加载时注意顺序*/
				this.renderTable(data.data.rows);
				this.reName();
				this.showNameEvent();
				/*重新设置状态*/
				this.$('#checkbox').bootstrapSwitch('setState', false);
				var oPage = this.$('.pull-right.pagination')[0];
				var totalCount = data.data.totalCount;
				totalCount = Math.ceil(totalCount/10);
				inx && (inx = inx.index);
				this.setpage({obj:oPage,countPage:totalCount,pageIndex:inx || 1});
			}.bind(this),inx);
		},
		bootstrapSwitch:function(){
			this.$('#checkbox').bootstrapSwitch();
			/*设置状态*/
		},
		initDetails:function (arr){
			this.orderDetailsGet(function (data){
				if(arr.length>1) {
					/*全部显示*/
					this.$('.js_hide').each(function (index, name) {
						this.$(name).find('td').html(data.data[0].commodities);
					}.bind(this));
				}else{
					/*单项显示*/
					var orderId = data.data[0].orderId;
					this.$('.js_hide').each(function (index, name) {
						if (this.$(name).attr('_value') == orderId) {
							this.$(name).find('td').html(data.data[0].commodities);
						}
					}.bind(this));
				}
			}.bind(this),arr);
		},
		reName:function(){
			this.swiperBox = this.rootEl.find(".js_swiper_box");
		},
		render:function(data){
			var templatePath = this.tempPath + "index.html" + "?r=" + appConfig.version;
			var template = new EJS({
				url:templatePath
			});
			this.rootEl.html(template.render(data));
		},
		renderTable:function (data){
			var templatePath = this.tempPath + "table.html" + "?r=" + appConfig.version;
			var template = new EJS({
				url:templatePath
			});
			this.rootEl.find('.table-bordered').html(template.render(data));
		},
		renderStoreList:function (){
			this.storeList(function (data){
				var templatePath = this.tempPath + "stroelist.html" + "?r=" + appConfig.version;
				var template = new EJS({
					url:templatePath
				});
				//console.log(data.data.push({id:75,realname:'darren'}));
				this.rootEl.find('.col-xs-4.condition').html(template.render(data));
				/*这里可以传其它参数*/
			}.bind(this));
		},
		initEvents:function(){

			//this.finish(); /*可以回到上一个页面*/

			$.datetimepicker.setLocale('ch');
			this.$('#datetimepicker').datetimepicker();
			this.$('#datetimepicker1').datetimepicker();
			this.$('#datetimepicker2').datetimepicker();
			this.$('#datetimepicker3').datetimepicker();
			this.$('#datetimepicker4').datetimepicker();
			this.$('#datetimepicker5').datetimepicker();





			$('#datetimepicker').datetimepicker({
				onChangeDateTime:function (){
					var startTime = $('#datetimepicker').val();
					$('#datetimepicker1').datetimepicker({minDate:startTime})
				}
			});
			$('#datetimepicker1').datetimepicker({
				onChangeDateTime:function (){
					var startTime = $('#datetimepicker1').val();
					$('#datetimepicker').datetimepicker({maxDate:startTime})
				}
			});


			$('#datetimepicker2').datetimepicker({
				onChangeDateTime:function (){
					var startTime = $('#datetimepicker2').val();
					$('#datetimepicker3').datetimepicker({minDate:startTime})
				}
			});
			$('#datetimepicker3').datetimepicker({
				onChangeDateTime:function (){
					var startTime = $('#datetimepicker3').val();
					$('#datetimepicker2').datetimepicker({maxDate:startTime})
				}
			});

			$('#datetimepicker4').datetimepicker({
				onChangeDateTime:function (){
					var startTime = $('#datetimepicker4').val();
					$('#datetimepicker5').datetimepicker({minDate:startTime})
				}
			});
			$('#datetimepicker5').datetimepicker({
				onChangeDateTime:function (){
					var startTime = $('#datetimepicker5').val();
					$('#datetimepicker4').datetimepicker({maxDate:startTime})
				}
			});









			this.dataSearchEvent();
			
			/*查看这个人或者总计的数量*/
			this.changeAmount();
			/*高级搜索*/
			this.advanceSearchEvent();
			/*类别搜索*/
			this.initSearchEvent();
			/*orderoptions*/
			this.orderoptions({obj:'.receipt .choice'});
			this.orderoptions({obj:'.payoff .choice'});
			this.orderoptions({obj:'.purchasestatus .choice'});
			/*去订单详情页面*/
			this.godetails();
			/*showNameEvent*/


			/*初始化插件*/
			/*初始化开关插件*/


		},
		changeAmount:function (){
			/*测试数据*/
			var newJson = {
				total:{
						totalOrder:100,
						money:2000,
					},
				'小A':{
					totalOrder:60,
					money:1200,
				},
				'小B':{
					totalOrder:40,
					money:800,
				},
			}
			
			var oTotalOrder = this.$('.amount .first span');
			var oTotalMoney = this.$('.amount .money span');
			
			this.rootEl.on("change",".condition .form-control",function(e){
				log(e.currentTarget.value);
				var oValue = e.currentTarget.value;
				if(oValue){
					oTotalOrder.html(newJson[oValue].totalOrder);
					oTotalMoney.html(newJson[oValue].money);
				}
			});
		},
		advanceSearchEvent:function (){
			this.rootEl.on("click",".dropdown-search.dropdown-toggle",function(e){
				this.$('.dropdown-search.dropdown-toggle').hide();
				this.$('.dropdown-close').show();
				this.$('.advancesearch').show();
				this.$('.advancesearch').animate({height:260},500);
			}.bind(this));

			this.rootEl.on("click",".dropdown-close",function(e){
				this.$('.dropdown-close').hide();
				this.$('.advancesearch').animate({height:0},500,function (){
					this.$('.advancesearch').hide();
					this.$('.dropdown-search.dropdown-toggle').show();
				}.bind(this));
			}.bind(this));
		},
		initSearchEvent:function (){
			this.rootEl.on("click",".category .choice",function(e){
				this.$('.category .choice span').hide();
				this.$(e.currentTarget).find('span').show();
				log(e.currentTarget);
			}.bind(this));

			/*类别搜索*/

			this.rootEl.on('click','#search_btn',function (e){
				var  keywords = this.$('#keywords');
				if(keywords.val()==""){
					this.$('.errorMsg span').html('请输入关键字');
					this.$('.errorMsg span').show();
					return;
				}
				this.getDataJson();
			}.bind(this));

			this.rootEl.on('input','#keywords',function (e){
				this.$('.errorMsg span').hide();
			}.bind(this));


			
		},
		orderoptions:function (obj){
			this.rootEl.on("click",obj.obj,function(e){
				this.$(obj.obj+ ' span').addClass('cancel');
				this.$(obj.obj+ ' span').removeClass('curr');
				this.$(e.currentTarget).find('span').removeClass('cancel');
				this.$(e.currentTarget).find('span').addClass('curr');
				/*获取所有的数据集合*/
				this.getDataJson();
			}.bind(this));
		},
		dataSearchEvent:function (){
			//datetimepicker1
			this.rootEl.on('blur','.datetime',function (e){
				this.getDataJson();
			}.bind(this));
		},
		getDataJson:function (){
				/*获取所有的状态*/
			    var saveData = {index:1};
				var  keywords = this.$('#keywords');
				//收货方式：
				var shippingType = this.$('.receipt span.curr').attr('_value');
				/*支付类型*/
				var payType = this.$('.payoff span.curr').attr('_value');
				/*采购单状态*/
				var status = this.$('.purchasestatus .curr').attr('_value');

				/*关键字*/
				saveData.keys = keywords.val();
				saveData.shippingType =  shippingType;
				saveData.payType =  payType;
				saveData.status = status;
				/*下单时间*/
				var createStartTime= this.$('#datetimepicker').val();
				var createEndTime = this.$('#datetimepicker1').val();
				createStartTime = util.formatDate(new Date(createStartTime),"yyyy-mm-dd hh:nn:ss");
				createEndTime = util.formatDate(new Date(createEndTime),"yyyy-mm-dd hh:nn:ss");
				if(!(createStartTime.indexOf('NaN')!=(-1))) {
					saveData.createStartTime = createStartTime;
				}
				if(!(createEndTime.indexOf('NaN')!=(-1))) {
					saveData.createEndTime = createEndTime;
				}
				/*付款时间*/
				var payStartTime= this.$('#datetimepicker2').val();
				var payEndTime = this.$('#datetimepicker3').val();
				payStartTime = util.formatDate(new Date(payStartTime),"yyyy-mm-dd hh:nn:ss");
				payEndTime = util.formatDate(new Date(payEndTime),"yyyy-mm-dd hh:nn:ss");
				if(!(payStartTime.indexOf('NaN')!=(-1))) {
					saveData.payStartTime = payStartTime;
				}
				if(!(payEndTime.indexOf('NaN')!=(-1))) {
					saveData.payEndTime = payEndTime;
				}

				/*发货时间*/
				var deliveryStartTime = this.$('#datetimepicker4').val();
				var deliveryEndTime = this.$('#datetimepicker5').val();
				deliveryStartTime  = util.formatDate(new Date(deliveryStartTime ),"yyyy-mm-dd hh:nn:ss");
				deliveryEndTime = util.formatDate(new Date(deliveryEndTime),"yyyy-mm-dd hh:nn:ss");
				if(!(deliveryStartTime .indexOf('NaN')!=(-1))) {
					saveData.deliveryStartTime = deliveryStartTime;
				}
				if(!(deliveryEndTime.indexOf('NaN')!=(-1))) {
					saveData.deliveryEndTime = deliveryEndTime;
				}
				this.saveData = saveData;
				this.initTable(saveData);
		},
		godetails:function (){
			this.rootEl.on("click",'tbody tr td.js_number',function(e){
				var _value = this.$(e.currentTarget).attr('_value');
				this.open({
					url:'details',
					data:{id:_value}
				});
			}.bind(this));
		},
		showNameEvent:function (){
			/*用属性控制*/
			this.$('tbody tr.productName td.js_number').attr('rowspan',1);
			
			this.$('tbody tr.productName').each(function (index,obj){
				$(obj).on('click',function (e){
					var js_number = (e.target || e.srcElement).className;

					if(js_number=="js_number"){
						//return false;
					}

					var isTrue = this.$('tbody tr.js_hide').eq(index).css('display');
					if(isTrue=='none'){
						this.$('tbody tr.js_hide').eq(index).show();
						this.$('tbody tr.productName td.js_number').eq(index).attr('rowspan',2);
						var arr = [];
						arr.push(this.$('tbody tr.js_hide').eq(index).attr('_value'));
						this.initDetails(arr);
					}else{
						this.$('tbody tr.js_hide').eq(index).hide();
						this.$('tbody tr.productName td.js_number').eq(index).attr('rowspan',1);
					}
				}.bind(this));
			}.bind(this));
			
			/*http://www.bootcss.com/p/bootstrap-switch/ api 接口文档链接*/
			
			this.$('#checkbox').on('switch-change', function (e, data) {
				  var value = data.value;
				  if(value){
					 this.$('tbody tr.js_hide').show();
					 this.$('tbody tr.productName td.js_number').attr('rowspan',2);
					  var arr = [];
					  this.$('.js_hide').each(function (index,name){
							arr.push(this.$(name).attr('_value'));
					  }.bind(this));
					  this.initDetails(arr);
				  }else{
					 this.$('tbody tr.js_hide').hide();
					 this.$('tbody tr.productName td.js_number').attr('rowspan',1);
				  }
			}.bind(this));
		},
		totalOrderGet:function (callback,res){
			/*员工订单*/

			var inx;
			if(res){
				inx = res.index;
			}
			var offset =  (inx-1) || 0;
			console.log(res);
			//http://dev-drp.525happy.cn/order/sell/list
			var url = '/order/list';
			//orderNo
			var resData;
			if(res){
				res.offset = offset*10;
				res.limit = 10;
				resData = res;
			}else{
				resData = {offset:offset*10,limit:10};
			}
			this.getData({
				url:this.API + url,
				data:resData,
				success:function (data){
					if(data.code=="success"){
						callback(data);
					}
				}.bind(this),
				error:function (data){
				//	console.log(data);
				}
			});
		},
		orderDetailsGet:function (callback,arr){
			var url  = this.API + '/order/commodities';
			var _array= arr;
			this.getData({
				url:url,
				data:{orderIds:_array.join(",")},
				success:function (data){
					callback(data);
				},
				error:function (data){
					//console.log(data);
				},
			});
		},
		storeList:function (callBack){

			var url = this.API + '/user/shop/list';
			this.getData({
				url:url,
				data:{},
				success:function (data){
					callBack(data);
				},
				error:function (data){
					alert(2);
					console.log(data);
				}
			});
		},
		setpage:function (json){
		var oPage = json.obj;

		var nPageCount =json.countPage;
		var indexpage = json.pageIndex;
		var listArr = [];
		listArr.push('<ul class="pagination">');

		if (indexpage == 1) {
			listArr.push('<li class="page-pre"><a href="javascript:void(0)">‹</a></li>');
		} else {
		    listArr.push('<li class="page-pre"><a href="javascript:void(0)">‹</a></li>');
		}

		function setList(){
			if(i==indexpage){
				listArr.push('<li class="page-number active"><a href="javascript:void(0)">'+i+'</a></li>');
			}else{
				listArr.push('<li class="page-number"><a href="javascript:void(0)">'+i+'</a></li>');
			}
		}
		if(nPageCount<10){
			for(var i=1;i<=nPageCount;i++){
				setList();
			}
		}else{
			if(indexpage<5){
				for(var i=1;i<=5;i++){
					setList();
				}
				listArr.push('<li><a href="javascript:void(0)">...</a></li><li><a href="javascript:void(0)">'+nPageCount+'</a></li>');
			}else if(indexpage>nPageCount-4){
				listArr.push('<li><a href="javascript:void(0)">'+1+'</a></li><li><a href="javascript:void(0)">...</a></li>');
				for(var i=nPageCount-5;i<=nPageCount;i++){
					setList();
				}
			}else{
				listArr.push('<li><a href="javascript:void(0)">'+1+'</a></li><li><a href="javascript:void(0)">...</a></li>');
				for(var i=indexpage-2;i<=indexpage+2;i++){
					setList();
				}
				listArr.push('<li><a href="javascript:void(0)">...</a></li><li><a href="javascript:void(0)">'+nPageCount+'</a></li>');
			}

		}

		if (indexpage == nPageCount) {
		 	listArr.push('<li class="page-next unclick"><a href="javascript:void(0)">›</a></li>');
		} else {
		   listArr.push('<li class="page-next"><a href="javascript:void(0)">›</a></li>');
		}
		listArr.push('</ul>');
		oPage.innerHTML = listArr.join(' ');

		(function (){
			var aLi = document.querySelectorAll('ul.pagination li');
			var inx = indexpage;
			aLi[0].onclick = function (){
				if(inx==1){
					return;
				}
				inx--;
				/*类型搜索分页需要*/
				this.saveData.index = inx;
				this.initTable(this.saveData);
				this.setpage({obj:oPage,countPage:nPageCount,pageIndex:inx});
				return;
			}.bind(this);

			for(var i=1;i<aLi.length-1;i++){
				(function (index){
					aLi[i].onclick = function (e){
						var oEle = e.target|| e.srcElement;
						inx = parseInt(oEle.innerHTML);
						//console.log(this.saveData);
						this.saveData.index = inx;
						this.initTable(this.saveData);
						if(!inx){return};
						this.setpage({obj:oPage,countPage:nPageCount,pageIndex:inx});
					}.bind(this);
				}.bind(this))(i);
			}

			aLi[aLi.length-1].onclick = function (){
				if(inx==nPageCount){
					return;
				}
				inx++;
				this.saveData.index = inx;
				this.initTable(this.saveData);
				this.setpage({obj:oPage,countPage:nPageCount,pageIndex:inx});
				return;
			}.bind(this);
		}.bind(this))();
	}
	});
	return MyActivity;
})