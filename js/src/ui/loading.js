define(["jquery"],function(){
	var div;
	if(!div){
		div = $('<div class="js_loading"></div>').appendTo('body');
	}
	return {
		show:function(){
			div.show();
		},
		hide:function(){
			div.hide();
		}
	}
});
