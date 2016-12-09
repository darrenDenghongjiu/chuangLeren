define(["ui/loading","jquery"],function(loading){
	window.activityEvents = {};
	window.activityData = {};
	var refer = current = "";
	var hash = {};
	var finishData = null;
	ActivityManage = {
		trigger:function(name,url,title,args){
			if(url === current){return}
			if(hash[current]){
				hash[current].$el.hide();
			}
			if(url != "index" && window.parent != window){
				/*var parentHref = window.parent.location.href.replace(/\!\!.*\!\!/,"");
				window.parent.history.replaceState({},window.parent.document.title,parentHref + "!!" + encodeURIComponent("#" + url) + "!!")*/
				var parentHash = window.parent.location.hash.replace(/\!\!.*\!\!/,"");
				window.parent.location.hash = parentHash + "!!" + encodeURIComponent("#" + url) + "!!";
			}
			if(!!hash[url]){
				var curr = hash[url];
				curr.$el.show();
				curr.elObj.onResume(finishData);
				finishData = null;
				refer = current;
				current = url;
				document.title = title;
				return;
			}
			finishData = null;
			ActivityManage.startActivity(name,url,title,args);
		},
		startActivity:function(name,url,title,args){
			//$("body").removeClass("bg_white");
			/*window.activityEvents[name] = [];
			if(current){
				var arr = window.activityEvents[current.name];
				for(var i = 0,o;o = arr[i];i++){
					$(window).off(o.evName,o[o.functionName]);
				}
				window.activityEvents[current.name] = [];
			}
			loading.show();*/
			
			var path = location.pathname.replace(/\/frame\/(.*)\/index.*/,"$1");
			require(["views/frame/" + path + "/" + name],function(Activity){
				var $el = $('<div class="view"></div>');
				$("#viewContainer").append($el);
				//loading.hide();
				var elObj = new Activity({
					tempPath:"/template/frame/" + path + "/",
					el:$el,
					args:args
				});
				ActivityManage.setCurrentAcitivity(name,url,title,$el,elObj);
			});
		},
		setCurrentAcitivity:function(name,url,title,$el,elObj){
			document.title = title || "";
			refer = current;
			current = url;
			hash[url] = {
				name:name,
				url:url,
				$el:$el,
				elObj:elObj
			};
		},
		getCurrentAcitivity:function(){
			return hash[current];
		},
		finish:function(data){
			if(current){
				hash[current].$el.off();
				hash[current].$el.remove();
				hash[current].elObj = null;

				delete hash[current];
			}
			finishData = data;
			history.go(-1);
		}
	}
	return ActivityManage;
})