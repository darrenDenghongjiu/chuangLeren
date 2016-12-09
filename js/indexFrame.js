(function(win,doc){
	var isDest = 0;
	var type = "dev"; //dev pre online
	var clientId = (type === "dev"?"40aee187-053d-448d-b975-035106ec1643":(type === "pre"?"40aee187-053d-448d-b975-035106ec1643":"3922eb23-3f48-4a5b-8767-df278b90b40e"));
	var domain = (type === "dev"?"http://dev-passport.525happy.cn/":(type === "pre"?"http://pre-passport.525happy.cn/":"http://passport.biechipang.net/"));
	var appConfig = {
		domain:domain,
		clientId:clientId,
		platform:4,
		interfaceVersion:'1.1.0',
		version:isDest?"3B99A34E98C4DBHA":Date.now(),
		dir:isDest?"dest":"src"
	};
	win.appConfig = appConfig;
	
	function loadApp(){
		var doc = document;
		var head = doc.getElementsByTagName("head")[0];
		var dir = appConfig.dir, version = appConfig.version;
		
		var PubCSS = doc.createElement('link');
		PubCSS.setAttribute("rel","stylesheet");
		PubCSS.setAttribute("type","text/css");
		PubCSS.setAttribute("href","/css/" + dir + "/frame/common.css?v=" + version);
		head.appendChild(PubCSS);
		
		var path = location.pathname.replace(/\/frame\/(.*)\/index.*/,"$1");
		var PubCSS = doc.createElement('link');
		PubCSS.setAttribute("rel","stylesheet");
		PubCSS.setAttribute("type","text/css");
		PubCSS.setAttribute("href","/css/" + dir + "/frame/" + path + "/index.css?v=" + version);
		head.appendChild(PubCSS);
		

		var AMDScript = doc.createElement('script');
		var path = location.pathname.replace(/\/frame\/(.*)\/index.*/,"$1");
		AMDScript.setAttribute("data-main","/js/" + dir + "/common/" + "config.js?v=" + version);
		AMDScript.setAttribute("src","/js/" + dir + "/" + "require.js?v=" + version);
		head.appendChild(AMDScript);
	}
	
	loadApp();
})(window,document);