


var globalGb = {
	doc:null ,
	initialized:false,
	popupdata:null,
	loggedIn:true,
	test:function(){
		
		var rawxml='<root><site authtype="form"><url>http://localhost:9999/auto.html</url> <loginurl>http://localhost:9999/auto.html</loginurl><enabled>true</enabled><elements><element><event/><xpath>//input[contains(@id,"Username") or contains(@name,"Username")]</xpath><value>example@gmail.com</value><type>text</type></element><element><event/><xpath>//input[contains(@id,"Password") or contains(@name,"Password")]</xpath><value>123456</value><type>password</type></element><element><event>click</event><xpath>//*[contains(@id,"mybutton") or contains(@name,"mybutton")]</xpath><value></value><type>button</type></element><element><event>submit</event><xpath>//*[contains(@id,"_TCSLoginUserForm") or contains(@name,"_TCSLoginUserForm")]</xpath><value></value><type>form</type></element></elements></site><site authtype="form"><url>https://github.com/login</url> <loginurl>https://github.com/login</loginurl><enabled>true</enabled><elements><element><event/><xpath>//input[contains(@id,"login") or contains(@name,"login")]</xpath><value>muthuishere@gmail.com</value><type>text</type></element><element><event/><xpath>//input[contains(@id,"password") or contains(@name,"password")]</xpath><value>Gangster1</value><type>password</type></element><element><event>click</event><xpath>//*[contains(@id,"commit") or contains(@name,"commit")]</xpath><value></value><type>button</type></element></elements></site><site authtype="form"><url>http://127.0.0.1:9999/auto.html</url> <loginurl>http://127.0.0.1:9999/auto.html</loginurl><enabled>true</enabled><elements><element><event/><xpath>//input[contains(@id,"Username") or contains(@name,"Username")]</xpath><value>user</value><type>text</type></element><element><event/><xpath>//input[contains(@id,"Password") or contains(@name,"Password")]</xpath><value>password</value><type>password</type></element><element><event>click</event><xpath>//*[contains(@id,"mybutton") or contains(@name,"mybutton")]</xpath><value></value><type>button</type></element><element><event>submit</event><xpath>//*[contains(@id,"_TCSLoginUserForm") or contains(@name,"_TCSLoginUserForm")]</xpath><value></value><type>form</type></element></elements></site></root>'
		
		localStorage["autologinxml"]=Helper.encrypt(rawxml)
		
	},

	printraw:function(){
		
		var rawxml=Helper.decrypt(localStorage["autologinxml"])
		console.log(rawxml)
	},
		

   startsWith:function (data,str) {
        return !data.indexOf(str);
    },



	logmessage:function(aMessage) {


//  alert(aMessage)

//console.log(aMessage)

	
},
	generateurls:function(expression){
	
	
	},
	buildGallery : function (details) {
		

			
				
		

		
	},
	onContextMenuClicked:function(details, tab) {
    if ( details.menuItemId !== 'builderElement' ) {
        return;
    }
    if ( tab === undefined ) {
			return;
		}
		
		console.log(details)
		
			
			
		var status=details
		var imgurl=details.srcUrl
				globalGb.popupdata={}
				globalGb.popupdata.details =details
				globalGb.popupdata.tab =tab
				chrome.windows.create({
					type: 'normal',
					 focused: true,
				url: chrome.extension.getURL('generate.html'),
				height: 550, width:850
				
				
				}, function(win) {
					
					
					
					
				});
				
				
				/*
				chrome.tabs.getSelected(null,function(tab) {
					var tablink = tab.url;
					
						if(tab.url.indexOf("chrome") >=0){
							if(null != globalGb.authclientcallback)
								globalGb.authclientcallback({"valid":false,"message":"Invalid Credentials"});	
							else{
								
								alert("Invalid page")
								
							}
							
							
						}else{
								chrome.tabs.executeScript(null, {file:"scripts/autoLoginAuth.js"}, function() {
									
								});
						}		
					});
			*/
			
			
					
			
				
					
					
		//globalGb.buildGallery(details,tab);
		console.log("Context menu clicked")
	},
	initExtension:function() { 
	
	 var menuCreateDetails = {
        id: 'builderElement',
        title: "Build Gallery",
        contexts: ['image'],
        documentUrlPatterns: ['https://*/*', 'http://*/*']
    };

   
        
        chrome.contextMenus.create(menuCreateDetails);
        chrome.contextMenus.onClicked.addListener(globalGb.onContextMenuClicked);
	
	}
	
			
	



  

	 
	
};




var Utils={

	getdomainName:function(str){
		if(str.indexOf("http") != 0 && str.indexOf("www")!=0)
			return str
		
			var    a      = document.createElement('a');
			 a.href = str;
			return a.hostname
	}

};


  var PageActionHandler = {
  
  
	setCaptureInProgress:function(tab){
		
		var domainName=Utils.getdomainName(tab.url)
		
		chrome.pageAction.setIcon({tabId:tab.id,path:"images/autologin-19-capture.png"} , function() {
		
				chrome.pageAction.setTitle({tabId :tab.id,title:"Capture in progress for" + domainName})
				
				chrome.tabs.executeScript(tab.id, {code:"initAutoLoginCapture()",allFrames :false}, function() {
						//script injected
				});
		
		})
		
	},
	setCaptureReady:function( tab){
		
		var domainName=Utils.getdomainName(tab.url)
		chrome.pageAction.setIcon({tabId :tab.id,path:"images/autologin-19.png"} , function() {
		
		
				chrome.pageAction.setTitle({tabId :tab.id,title:"Add AutoLogin for " +domainName })
				
				
				chrome.tabs.executeScript(tab.id, {code:"removeAutoLoginCapture()",allFrames :false}, function() {
				//script injected
				});
				
		
		})
		
	},
	handleClick:function(tab){
	

		chrome.pageAction.getTitle({tabId :tab.id}, function (result){
			if(result.indexOf("Add AutoLogin") >=0){
				//
				PageActionHandler.setCaptureInProgress(tab)
			}else{
				PageActionHandler.setCaptureReady(tab)
			
			}

		});

	

	
	},
	injectscripts:function(obj,index){
		
		var tabId=obj.tabId
		var scripts=obj.scripts
		var callback=obj.callback
		
		
		
		
		if(index >= scripts.length){
			obj.callback()
			
			}
		
		chrome.tabs.executeScript(tabId, {file:scripts[index]}, function() {
						//script injected
						index++
						PageActionHandler.injectscripts(obj,index)
					});
					
					
	}
  
  };

//globalGb.loadXMLDoc(chrome.extension.getURL('autologin.xml'))

globalGb.initExtension()
globalGb.printraw()

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
 
    if(tab.url !== undefined && changeInfo.status == "complete" ){
	
	 if(tab.url.indexOf("chrome") == 0 || tab.url.indexOf("data") == 0 || tab.url.indexOf("file") == 0  ){
	  
			return;
		}
  
  var  siteInfo = globalGb.retrieveSiteInfo(tab.url)
	var status=siteInfo.status
	
	//console.log("tab check",siteInfo,globalGb.loggedIn)
	
		if(  status == 0) {
		
			if(globalGb.loggedIn==false){
			/*
			chrome.tabs.insertCSS(null, {file:"scripts/autoLoginCredentials.js"}, function() {
						//script injected
					});
			*/
	chrome.tabs.executeScript(tabId, {file:"scripts/autoLoginCredentials.js"}, function(details) {
						//script injected
						console.log("Inserted autoLoginCredentials")
					});
					
	
					
						
					

				
				
			}else{
				chrome.tabs.executeScript(tabId, {file:"scripts/autoLogin.js"}, function() {
					//script injected
					console.log("Inserted autoLogin")
				});
			}
		}else if( status == 1) {
		
		//console.log("got complete")
			var jscode='var extnid="'+ chrome.extension.getURL("/") + '"';
		
		
			chrome.tabs.executeScript(tabId, {code:jscode,allFrames :false}, function() {
						//script injected
						
			
						chrome.tabs.executeScript(tabId, {file:"scripts/autoLoginCaptureIcon.js"}, function() {
					//	chrome.tabs.executeScript(tabId, {file:"scripts/autoLoginCaptureCheck.js"}, function() {
								
								chrome.tabs.executeScript(tabId, {file:"scripts/autoLoginCapture.js"}, function() {
									//script injected
								//	console.log("got autoLoginCapture" +tabId)
								});
						
						}); 
						
						
			
				});
				
				
			
		}
	}
});



chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // console.log(sender.tab ?
                // "from a content script:" + sender.tab.url :
                // "from the extension");
				
				
	 if (request.action == "captureautologin"){
	
			PageActionHandler.setCaptureReady(sender.tab)
			chrome.pageAction.show(sender.tab.id);
			 // Return nothing to let the connection be cleaned up.
		  sendResponse({});
	
	
	}else if (request.action == "getData"){
	
	
			var rawxml= Helper.decrypt(localStorage["autologinxml"] );
			
	sendResponse({"xml": rawxml});
	
	
	}else if (request.action == "injectAutoLogin"){
	
	
			chrome.tabs.executeScript(sender.tab.id, {file:"scripts/autoLogin.js"}, function() {
					//script injected
				});
			
		sendResponse({"valid":true});
	
	
	
	}else if (request.action == "getauthinfo"){
	
	
	var data={}
	data.valid=false;
	
		if( globalGb.authdetails){
				data.valid=true;
			data.realm=globalGb.authdetails.realm;
			
			if(globalGb.authdetails.isProxy){
				data.url=globalGb.authdetails.challenger.host + ":" + globalGb.authdetails.challenger.port 
			}else
				data.url=globalGb.authdetails.url
		}
			
		sendResponse(data);
	
	
	
	}else if (request.action == "basicauth"){
	
			var data=request.info;
			console.log("Basic auth details received",data)
			if(data.cancel){
				
				//remove iframe on current tab
				//send cancel event 
				
				globalGb.cancelauth(globalGb.authdetails,globalGb.authcallback)
				sendResponse({"valid":true});	
				globalGb.authclientcallback=null;
			}else{
				
				
				data.input="dialog"
				
				
				
					//globalGb.addAutoLoginElements(request.info,"form")
					
	
				globalGb.authclientcallback=sendResponse
				
				if(data.useAutologin &&  globalGb.authdetails && globalGb.authdetails.sitedata){
				
					console.log("saving autologin")
					console.log(globalGb.authdetails)
						for(k=0;k<globalGb.authdetails.sitedata.elements.length;k++){
							
							var elem=globalGb.authdetails.sitedata.elements[k]
							if(elem.type=="text"){
								
								globalGb.authdetails.sitedata.elements[k].value=data.username
							}
							if(elem.type=="password"){
								
								globalGb.authdetails.sitedata.elements[k].value=data.password
							}
							
						}
						
						console.log("Adding data")
						console.log(globalGb.authdetails.sitedata)
					globalGb.addAutoLoginElements(globalGb.authdetails.sitedata,"basic")
				}
				
				
				globalGb.sendauthcredentials(globalGb.authdetails,data,globalGb.authcallback)
				sendResponse({"valid":true});	
					
				//sendResponse({"valid":true});	
				
				
				
				
				
			}
			
			
			
	
	
	}else if (request.action == "validateCredential"){
	
			var userCredential=request.info;
			
			var savedCredential= Helper.decrypt(localStorage["credential"] );
			
	
			if(userCredential == savedCredential){
			
			globalGb.loggedIn=true
			
			sendResponse({"valid":true});
			}
				
			else{
			globalGb.loggedIn=false;
				sendResponse({"valid":false });
				}
	
	
	}else if (request.action == "addCredential"){
	
			var credential=request.info;
			
			localStorage["credential"]= Helper.encrypt(credential);
			
				sendResponse({"valid":true });
			
	
	
	}else if (request.action == "updateCredential"){
	
			var credential=request.currentCredential;
			
			var newCredential=request.newCredential;
			
			var savedCredential= Helper.decrypt(localStorage["credential"] );
			
			if(credential == savedCredential){
				localStorage["credential"]= Helper.encrypt(newCredential);
				sendResponse({"valid":"true" });
				}
			else
				sendResponse({"valid":"false" });
			
	
	
	}else if (request.action == "getPromptAtStartup"){
	
			
			promptrequired=localStorage["promptrequired"]
			
			
				sendResponse({"promptrequired":(promptrequired === 'true') });
			
	
	
	}else if (request.action == "updatePromptAtStartup"){
	
			
			
			localStorage["promptrequired"]= request.promptrequired;
			
			
			
				sendResponse({"valid":true });
			
	
	
	}else if (request.action == "updateBasicAuthSetting"){
	
		
			localStorage["usebasicauth"]= request.usebasicAuth;
			globalGb.updateBasicAuthSetting()
				sendResponse({"valid":true });
			
	
	
	}else if (request.action == "hasCredential"){
	
			
			
			var savedCredential= Helper.decrypt(localStorage["credential"] );
			
			var result=(savedCredential != "")
			
				sendResponse({"valid":result});
			
	
	}else if (request.action == "refreshData"){
	
	globalGb.loadDoc()
			
	sendResponse({});
	
	
	}else if (request.action == "cansubmit"){
	
	
	var flgResponse=globalGb.canSubmit(sender.tab.url)
	
	if(flgResponse == true)
		globalGb.updateSuccessLogin(sender.tab.url)
		
	sendResponse({actionresponse: flgResponse});
	
	
	}else if (request.action == "addAutoLoginInfo"){
	
	
	globalGb.addAutoLoginInfo(request.info)
	
		
	sendResponse({});
	
	
	}else if (request.action == "addAutoLoginFormElements"){
	
	
	globalGb.addAutoLoginElements(request.info,"form")
	
		
	sendResponse({});
	
	
	}else if (request.action == "success"){
	
	globalGb.updateSuccessLogin(sender.tab.url)
	sendResponse({actionresponse: "success"});
	}
     
  });
  
  

chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        console.log("This is a first install!");
    }else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
     
    }
});
