define(function(){
	 var getDomain=function(){
		var api;
		var drp;
		var local=location.host;

		/*开发*/
		if(local=='dev-drpadm.525happy.cn'){
			drp = 'http://dev-drp.525happy.cn';
			api = 'http://dev-api.525happy.cn';
		}
		/*测试*/
		if(local=='pre-drpadm.525happy.cn'){
			drp = 'http://pre-drp.525happy.cn';
			api = 'https://pre-api.525happy.cn';
		}
		/*线上*/
		if(local=='drpadm.biechipang.net'){
			drp = 'https://drp.biechipang.net';
			api = 'https://api.biechipang.net';
		}

		return {api:api, drp: drp};
	}
	return getDomain();
});

