var http = require('http');
var fs = require('fs');		
var util = require('util');
var url = require('url');
var log = util.log; 
var server = new http.Server();	
var port = 9090;
server.listen(port,'localhost');			
//监听请求；
server.on('request',function (request,response){
	var filename = null;
	//解析过来的url；
	var fileUrl = url.parse(request.url);
	var rootPath = fileUrl.pathname;
	
	if(rootPath){
		if((rootPath == '/') || (rootPath =='/index.html')){
			 //规定index页面
			 filename = 'index.html';
		}
		//不需要 / 所以去掉
		filename = filename || fileUrl.pathname.substring(1);  // 去掉前导'/'
		//判断类型
		//如果第一个不写return 会自动找第二个;
		var type = (function (_type){
			switch(_type){
				case 'html':
				case 'htm': return 'text/html; charset=utf-8';
				case 'js': return 'application/javascript; charset=utf-8';
				case 'css': return 'text/css; charset=UTF-8';
				case 'txt': return 'text/plain; charset=UTF-8';
				case 'manifest': return 'text/cache-manifest; charset=utf-8';
				default: return 'application/octet-stream';
				//默认是下载
			}
		})(filename.substring(filename.lastIndexOf('.')+1));
		//找出文件类型；
		
		//读取文件；两个参数；
		//一个是文件， 一个是fn fn回调两个参数 一个参数 err ，一个读取的内容
		fs.readFile(filename,function (err,content){
			if(err){
				response.writeHead(404, {'Content-type' : 'text/plain; charset=utf-8'});
				response.write(err.message);
			}else{
				log(type);
				response.writeHead(200, 
				{
					'Content-type' : type,
					"Access-Control-Allow-Origin":'*',
					"Access-Control-Allow-Methods":'GET, PUT, POST, DELETE, HEAD, OPTIONS',
				});
				response.write(content)
			}
			response.end();
		});
		
	}
	
});

//建立服务：
//监听请求；
//找出请求文件的名字 并规定index.html;
//通过文件类型规定头部参数 type 类型
//最后读取文件并且把请求到的内容输出，然后结束相应；
