

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
    "onclick" : function(e){

		console.log(e);
		if (e.mediaType === "image") {

			console.log(e.pageUrl);
       		 showGenerateGallery(encodeURI(e.srcUrl),encodeURI(e.pageUrl));
    }

	}
  });


var global=
{

	lastGalleryData:{},

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


			console.log("created tab" ,tab )

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
				
						
					
					console.log("Script executed",results)
				
				
				// Now, do something with result.title and result.description
			});




		});


}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
   

var response={};

	switch (request.action) {
  case 'build':
    
	openTab(request)
    break;
	case 'galleryData':
    
		response=global.lastGalleryData
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

