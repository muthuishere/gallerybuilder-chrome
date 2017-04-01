

	chrome.runtime.onInstalled.addListener(function() {
	  // Replace all rules ...
	  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
	    // With a new rule ...
	    chrome.declarativeContent.onPageChanged.addRules([
	      {
	        // That fires when a page's URL contains a 'g' ...
	        conditions: [
	          new chrome.declarativeContent.PageStateMatcher({
	            pageUrl: { urlContains: 'docs.google.com' },
	          })
	        ],
	        // And shows the extension's page action.
	        actions: [ new chrome.declarativeContent.ShowPageAction() ]
	      }
	    ]);
	  });
	});

	
	function tryviarequest(url,callback){
		
		
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
			  
			  
			  
			// JSON.parse does not evaluate the attacker's scripts.
			var profileid=""
			if(xhr.responseText.indexOf("android:url") > 0){
				
				var metaAndRawUrl = xhr.responseText.split("android:url")[1].split(">")[0];
				
					
				metaAndRawUrl = metaAndRawUrl.substring(metaAndRawUrl.lastIndexOf("content=\"")+ "content=\"".length + 1,metaAndRawUrl.lastIndexOf("\""));
				
				
				
				var metaAndUrls = metaAndRawUrl.split("/")
				
					
						
				
						profileid=metaAndUrls[metaAndUrls.length - 1]
						

				
			}else{
				
				//console.log("error",xhr.responseText)
			}
			callback(profileid)
			
				
			
		  }
		}
		xhr.send();

	}
	function tryprofile(url){
		var res=""
		try{
		res=url.split("?")[0].replace("https://www.facebook.com","").split("/")[1]
		}catch(exception){
			res="";
		}
		if(undefined == res)
			res=""
		
		return res
	}
	
	function removeprogress(tabId){
		
		var code = 'var elem = document.querySelector("img.fb-photos-of-viewpic");elem.parentNode.removeChild(elem);' 			
			chrome.tabs.executeScript(tabId,{
				code: code
			}, function(results) {
				
			});
	}
	
	
	
	function tosingleline(f) {
	  return f.toString().
		  replace(/^[^\/]+\/\*!?/, '').
		  replace(/\*\/[^\/]+$/, '');
	}


	chrome.pageAction.onClicked.addListener(function(tab) {
		
		//Get 
		//chrome.tabs.query( {active: true}, function(tabs) {
	
		if(tab.url.indexOf("docs.google.com") <0){
		
			shownotification("Error","The feature Works only on Google Docs")
			return 
		}

		
		//Not required
		
		var code = tosingleline(function() {/*!
	
			
			function getStringbetween(str,strstart,strend){
		
		
		var start_pos = str.indexOf(strstart) +  strstart.length;
			var end_pos = str.indexOf(strend,start_pos);
			var token = str.substring(start_pos,end_pos);

			return token
			
		
		
	}
	
		
		var docid=getStringbetween(window.location.toString(),"document/d/","/")
		var token =""
		for(i=0;i<document.querySelectorAll("script").length;i++){		
		var scriptcontent=document.querySelectorAll("script")[i].textContent;
		if(scriptcontent.indexOf("_docs_flag_initialData") >=0 ){
			
		
		var start_pos = scriptcontent.indexOf("\"token\":\"") +  "\"token\":\"".length+1;
			var end_pos = scriptcontent.indexOf("\"",start_pos);
			 token = getStringbetween(scriptcontent,"\"token\":\"","\"")
			 break;

		
			
			
		
		}
		}
		 ({
              token: token || "",
		       docid: docid || ""
           });*/});



		
//kix-zoomdocumentplugin-outer

//getOffset(document.querySelectorAll(".kix-zoomdocumentplugin-outer")[0])

//407

			//471px
			//794px
			
			code = tosingleline(function() {/*!
	
	
				function getOffset( el ) {
				var rect = el.getBoundingClientRect();
				return {
					left: rect.left + window.pageXOffset,
					top: rect.top + window.pageYOffset,
					width: rect.width || el.offsetWidth,
					height: rect.height || el.offsetHeight
				};
			}
			
			var leftOffset=getOffset(document.querySelectorAll(".kix-zoomdocumentplugin-outer")[0])

			function connect(i,div1, div2, color, thickness) { // draw a line connecting elements
			
			
			
				
				
				var parentOffset= getOffset(document.querySelectorAll(".kix-appview-editor")[0])
				
				
				var off1 = getOffset(div1);
				
				off1.left = off1.left - parentOffset.left - leftOffset.left 
				off1.top = off1.top - parentOffset.top
				
				
				var off2 = getOffset(div2);
				
				off2.left = off2.left - parentOffset.left - leftOffset.left 
				off2.top = off2.top - parentOffset.top
				
				
				// bottom right
				var x1 = off1.left + off1.width - 2;
				var y1 = off1.top ;//+ off1.height;
				// top right
				var x2 = off2.left ;//+ off2.width;
				var y2 = off2.top +(off2.height/2);
				// distance
				var length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
				
				//length=length-off2.width;
				
				// center
				var cx = ((x1 + x2) / 2) - (length / 2);
				var cy = ((y1 + y2) / 2) - (thickness / 2);
				// angle
				var angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
				
				
		
			var htmlLine = "<hr class='artline' style='z-index:100;padding:0px; margin:0px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);border: 2px dashed #000; border-style: none none dotted; color: #FFFFFF;  ' />";
			
			
			
				document.querySelectorAll(".kix-appview-editor")[0].innerHTML += htmlLine;
			}

			
		
			var totallength=document.querySelectorAll(".docos-docoview").length;
			
			if(document.querySelectorAll(".kix-commentoverlayrenderer-normal").length < totallength )
				totallength=document.querySelectorAll(".kix-commentoverlayrenderer-normal").length;
			
			
			
			var flpprintlines= true;//(document.querySelectorAll(".docos-docoview").length  ==  document.querySelectorAll(".kix-commentoverlayrenderer-normal").length );
			
			if(!flpprintlines){
				alert("Unable to print , May be you are editing comments!!! \n Try again. ");
				history.go(0)
			
			}else{

			for (i=0;i<document.querySelectorAll(".kix-discussion-plugin").length;i++){
				
					document.querySelectorAll(".kix-discussion-plugin")[i].className=document.querySelectorAll(".kix-discussion-plugin")[i].className.replace("docs-ui-unprintable","");
			}
			
			for (i=0;i<totallength;i++){
				
					document.querySelectorAll(".kix-commentoverlayrenderer-normal")[i].className=document.querySelectorAll(".kix-commentoverlayrenderer-normal")[i].className.replace("docs-ui-unprintable","");
					
					
					if(flpprintlines){
							connect(i, document.querySelectorAll(".kix-commentoverlayrenderer-normal")[i],document.querySelectorAll(".docos-docoview")[i], "#000", 2);
					}
					
					var commentelement=document.querySelectorAll(".docos-docoview")[i]
					
					commentelement.style.left  = (parseInt(commentelement.style.left.replace("px","")) - leftOffset.left ) + "px"
					
					
			}
			
			
			
			
			
					window.print()
					history.go(0)
			}
			
			
				
			
			
			
			
			
			
			*/});
		   
		   
	

			chrome.tabs.executeScript(tab.id,{
				code: code
			}, function(results) {
				
						
					
					
				
				
				// Now, do something with result.title and result.description
			});

			
			

	

	})
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
      
	   /*
		
		chrome.tabs.create({"url":chrome.extension.getURL("faq/index.html") ,"selected":true},function(tab){
    
    });
	
	*/
    }
});

