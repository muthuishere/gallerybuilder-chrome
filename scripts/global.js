

	chrome.runtime.onInstalled.addListener(function() {
	  // Replace all rules ...
	  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
	    // With a new rule ...
	    chrome.declarativeContent.onPageChanged.addRules([
	      {
	        // That fires when a page's URL contains a 'g' ...
	        conditions: [
	          new chrome.declarativeContent.PageStateMatcher({
	            pageUrl: { urlContains: '.' },
	          })
	        ],
	        // And shows the extension's page action.
	        actions: [ new chrome.declarativeContent.ShowPageAction() ]
	      }
	    ]);
	  });
	});


chrome.pageAction.onClicked.addListener(function(tab) {
	showGenerateGallery("","");
});

/*
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({'url': chrome.extension.getURL('generate.html'), 'selected': true});
});
*/

chrome.contextMenus.create({
    "title": "Build Gallery",
    "contexts": [ "image"],
    "onclick" : function(e,curtab){

		if (e.mediaType === "image") {

				//if image data is picasa wait for creati
				global.findpicasaData(e.srcUrl,curtab)
			
       		 showGenerateGallery(encodeURI(e.srcUrl),encodeURI(e.pageUrl));
    }

	}
  });


  	function tosingleline(f) {
	  return f.toString().
		  replace(/^[^\/]+\/\*!?/, '').
		  replace(/\*\/[^\/]+$/, '');
	}

	
var global=
{

	lastGalleryData:{},
	oldlastPicasaData:{
		user:"110869310839069006742",
		album:"6411340037031931505",
		auth:"Gv1sRgCLfnmeqay9PJKg"
		
	},
	lastPicasaData:{
		user:"",
		album:"",
		auth:""
		
	},
	findpicasaData:function(imgUrl,tab){
		
		
		if(imgUrl.indexOf(".googleusercontent.com") < 0){
			return;
		}
			var code = tosingleline(function() {/*!
	
						
						var credentials={}
			function stripforAfter(txt,htmlcontent){
				
						var content=htmlcontent
						content=content.split(txt)[1]
						content=content.split(",")[0]
						
						content=content.replace(/[^a-zA-Z0-9&=]/g, "")
						return content
						
						
			}
			for(var i=0;i<document.querySelectorAll("script").length;i++){
				var curscript=document.querySelectorAll("script")[i];
				if(curscript.hasAttribute("src") == false && curscript.innerHTML.indexOf("userID") > 0  && curscript.innerHTML.indexOf("album") > 0 ){
					
					
					
					
						
						
						credentials.user=stripforAfter("userID",curscript.innerHTML)
						
						credentials.album=stripforAfter("album",curscript.innerHTML)
						credentials.auth=""
						
						if(credentials.album.indexOf("&") > 0 && credentials.album.indexOf("authkey") > 0 && credentials.album.indexOf("=") > 0){
								var buffer=credentials.album.split("&")
								credentials.album=buffer[0]
								credentials.auth=buffer[1].split("=")[1]
							
							}
						
						
						
							
					
				}
			}
		 ({
              credentials: credentials || ""
           });*/});



		   
	
			
	
			chrome.tabs.executeScript(tab.id,{
				code: code
			}, function(results) {
				
				if(results && results.length >0){
					
					
					
					
					global.lastPicasaData.user=results[0].credentials.user,
							global.lastPicasaData.album=results[0].credentials.album
							global.lastPicasaData.auth=results[0].credentials.auth
		
		
		
				}
				
						
					
				});
		
	}






}


function openInSameTab(tab,data){


	//chrome.tabs.create();
//chrome.tabs.remove(integer or array of integer tabIds, function callback)
global.lastGalleryData=data;

chrome.tabs.update(tab.id, {'url': chrome.extension.getURL('generate.html?openGallery=true'), 'highlighted': true}, function(tab){


})


}
function openTab(data){


		chrome.tabs.create({'url': data.referrer, 'active': true},function(  tab) {


			//console.log("created tab" ,tab )

			
			if(tab.url == "about:blank"){

			
				openInSameTab(tab,data)

				return 
			}
			
			
			if(tab.url.indexOf("http") != 0){

				shownotification("Error","Invalid Referrer found ");
				openInSameTab(tab,data)

				return 
			}
			//Execute script now
			var code ="document.body.innerHTML='" + data.galleryHTML +"';";

			chrome.tabs.executeScript(tab.id,{
				code: code
			}, function(results) {
				
						
					
					
				
				
				// Now, do something with result.title and result.description
			});




		});


}



	var xmlDoc;
	
	function ajaxreq(url,callback){
		
		
		var imageResponse={}
		imageResponse.thumbimgurls=[]
		imageResponse.contentimgurls=[]
		imageResponse.error=""
		
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.setRequestHeader('Content-Type', 'text/xml');
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
			  
			  if (xhr.status === 200) {
					
					xmlDoc = xhr.responseXML;
						
						for(var k=0;k<xmlDoc.getElementsByTagName("entry").length;k++){
							
							var entry=xmlDoc.getElementsByTagName("entry")[k];
								var img={};
								
								var contentimg=entry.getElementsByTagName("content")[0].getAttribute("src");//"https://lh3.googleusercontent.com/-BIofpbwoBqQ/WOS3lfGSnlI/AAAAAAAChjU/O7LA5tBTsCk7R9HruJG9CGeyeIg63GukgCHM/page_1.jpg"

								  var arr=contentimg.split("/")
									arr[arr.length-1]="s3200/"+arr[arr.length-1]
									
									contentimg=arr.join("/")
									
	
								imageResponse.contentimgurls.push(contentimg);
								imageResponse.thumbimgurls.push(entry.getElementsByTagName("thumbnail")[0].getAttribute("url"));
								
								
								
							
						}
		
			
			
				} else {
					
					
					imageResponse.error=xhr.statusText
					console.log("Error", xhr.statusText)
				}
	 
			  
			callback(imageResponse)
			
				
			
		  }
		}
		xhr.send();

	}
	
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
   

   
   
   
	switch (request.action) {
  	
	case 'fetchpicasa':
			
			var url="https://picasaweb.google.com/data/feed/api/user/"+request.user+"/albumid/"+ request.album
			
			if(request.auth !== ""){
				url= url  +"?authkey=" + request.auth
				global.lastPicasaData.auth=request.auth
			}
				
				console.log(url)
			global.lastPicasaData.user=request.user
			global.lastPicasaData.album=request.album
			
	
			
			ajaxreq(url,function(imageResponse){
				
				
				if(imageResponse.contentimgurls.length > 0){
					
					
					sendResponse({"status":0,"contentimgurls":imageResponse.contentimgurls,"thumbimgurls":imageResponse.thumbimgurls});
					}
				else
					sendResponse({"status":-1,"msg":imageResponse.error});

			
				
			});
		return true;
		
    break;	
 

}


//Synchronous
var response={};




	switch (request.action) {
  case 'build':
    
	openTab(request);
	
    break;
	case 'galleryData':
    
		response=global.lastGalleryData;
		
    break;
	case 'lastpicasadata':
    
		
		sendResponse(global.lastPicasaData);
		break;	
	
		
 
  default:
    console.log('Sorry, we are out of ' + request.action + '.');
	
	
	
}

	sendResponse(response);

   
      
  });


function showGenerateGallery(id,pageurl){

		if(pageurl == undefined)
			pageurl=id;


		
		
		
			chrome.tabs.create({'url': chrome.extension.getURL('generate.html?id='+id + "&referrerurl="+pageurl), 'selected': true});
}
	

function shownotification(title,msg){
	
	var opt = {
  type: "basic",
  title: title,
  message: msg,
  iconUrl: "images/gallery-builder-19.png"
}

chrome.notifications.create("notificationId", opt, function(){})

}

chrome.runtime.onInstalled.addListener(function(details){
	 
	 
	  
	  var installData=details || {}
	  
	 
	
    if((details.reason == "install"  || details.reason == "update" ) ){
      
	
		
		chrome.tabs.create({"url":chrome.extension.getURL("faq/index.html") ,"selected":true},function(tab){
    
    });
	
	
    }
});

