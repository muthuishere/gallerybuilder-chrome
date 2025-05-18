chrome.runtime.onInstalled.addListener(function() {
  // Create context menus during installation
  chrome.contextMenus.create({
    "id": "buildGallery",
    "title": "Build Gallery",
    "contexts": ["image"]
  });

  chrome.contextMenus.create({
    "id": "buildAllImageLinks",
    "title": "Build Gallery From All Image Links",
    "contexts": ["page"]
  });

  chrome.contextMenus.create({
    "id": "buildAllHighRes",
    "title": "Build Gallery From All High Res Images in page",
    "contexts": ["page"]
  });
});

chrome.action.onClicked.addListener(function(tab) {
	showGenerateGallery("","");
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "buildGallery") {
    if (info.mediaType === "image") {
      showGenerateGallery(encodeURI(info.srcUrl), encodeURI(info.pageUrl));
    }
  } else if (info.menuItemId === "buildAllImageLinks") {
    global.findAllImagesDataAndBuild(tab);
  } else if (info.menuItemId === "buildAllHighRes") {
    global.findAllHighresImagesDataAndBuild(tab);
  }
});

function tosingleline(f) {
  return f.toString().
    replace(/^[^\/]+\/\*!?/, '').
    replace(/\*\/[^\/]+$/, '');
}

var global =
{
  lastGalleryData: {},
  
  openResultsInGoogle: function(tab, code) {
    chrome.tabs.executeScript(tab.id, {
      code: code
    }, function(responses) {
      if (responses && responses.length > 0 && responses[0].results && responses[0].results.length > 1) {
        var oresults = responses[0].results
        var results = [...new Set(oresults)];

        chrome.tabs.create({ 'url': 'https://www.google.com', 'active': true }, function(tab) {
          var code = "document.body.innerHTML=`" + results.join("") + "`;";

          chrome.tabs.executeScript(tab.id, {
            code: code
          }, function(results) {
          });
        });
      }
    });
  },
  
  openResultsInGoogleOld: function(tab, code) {
    chrome.tabs.executeScript(tab.id, {
      code: code
    }, function(responses) {
      if (responses && responses.length > 0 && responses[0].results && responses[0].results.length > 1) {
        var results = responses[0].results

        chrome.tabs.create({ 'url': 'https://www.google.com', 'active': true }, function(tab) {
          var code = "document.body.innerHTML=`" + results + "`;";

          chrome.tabs.executeScript(tab.id, {
            code: code
          }, function(results) {
          });
        });
      }
    });
  },
  
  findAllHighresImagesDataAndBuild: function(tab) {
    var code = tosingleline(function() {/*!
    var results="";
    var myresults=[];
    var images = document.querySelectorAll("img");

    for(var i=0;i<images.length;i++){
      var curscript=images[i];
      var srcset=curscript.getAttribute("srcset");
      if(!!srcset  && srcset.indexOf(",") > -1 && srcset.indexOf(" ") > -1  ){
        
         var allSources = srcset.split(",")
       
         var lastElement = allSources[allSources.length-1].trim();
         tmp=1;
        while(lastElement.length <= 0){
            tmp=tmp+1
            lastElement = allSources[allSources.length-tmp]
        }


        var splittedRawSource = lastElement.split(" ")
         for(var j=0;j<splittedRawSource.length;j++){
          var url=splittedRawSource[j];
          if(url.indexOf("http")>-1 || url.indexOf("https")>-1 || url.indexOf("//")>-1   ){

              var bfr='<img src="'+ url +'" ></img>'
              results = results + bfr
              myresults.push(bfr)
              break;
          }
         }
      }
    }    
({
  results: myresults || []
});*/});

    global.openResultsInGoogle(tab, code);
  },
  
  findAllImagesDataAndBuild: function(tab) {
    var code = tosingleline(function() {/*!
      var images=[]
      
function isImage(link){
  
      const extensions=["jpg","png","gif","jpeg","bmp"]
      
      const isBuildableImage = (element) => link.toLowerCase().indexOf(element) > 0;

      return extensions.findIndex(isBuildableImage) >=0
}
var results=""
  var myresults=[];
for(var i=0;i<document.querySelectorAll("a").length;i++){
  var curscript=document.querySelectorAll("a")[i];
  if(curscript.hasAttribute("href") == true && isImage(curscript.getAttribute("href")) ){
    
    var bfr='<img src="'+ curscript.getAttribute("href") +'" ></img>'
              results = results + bfr
              myresults.push(bfr)
  }
}
({
  results: myresults || []
});*/});

    global.openResultsInGoogle(tab, code);
  }
}

function openInSameTab(tab, data) {
  global.lastGalleryData = data;

  chrome.tabs.update(tab.id, { 'url': chrome.runtime.getURL('generate.html?openGallery=true'), 'highlighted': true }, function(tab) {
  })
}

function openTab(data) {
  // Check if the referring URL is valid
  if (!data.referrer || data.referrer === "") {
    // If no referrer, use the openGallery=true URL like before
    global.lastGalleryData = data;
    chrome.tabs.create({ 'url': chrome.runtime.getURL('generate.html?openGallery=true'), 'highlighted': true });
    return;
  }

  // First check if the URL is valid
  if (data.referrer.indexOf("http") !== 0) {
    shownotification("Error", "Invalid Referrer URL format");
    global.lastGalleryData = data;
    chrome.tabs.create({ 'url': chrome.runtime.getURL('generate.html?openGallery=true'), 'highlighted': true });
    return;
  }

  // Open the referring page directly and then overwrite its content
  chrome.tabs.update({ 'url': data.referrer, 'active': true }, function(tab) {
    // Wait for the page to load before injecting the gallery HTML
    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, updatedTab) {
      if (tabId === tab.id && changeInfo.status === 'complete') {
        // Remove the listener to avoid multiple executions
        chrome.tabs.onUpdated.removeListener(listener);
        
        // Execute script to overwrite the page content
        chrome.tabs.executeScript(tab.id, {
          code: "document.body.innerHTML = `" + data.galleryHTML + "`;"
        }, function(results) {
          if (chrome.runtime.lastError) {
            // Handle error if script execution fails
            shownotification("Error", "Could not modify page: " + chrome.runtime.lastError.message);
          } else {
            shownotification("Success", "Gallery built on the referring page");
          }
        });
      }
    });
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //Synchronous
    var response = {};

    switch (request.action) {
      case 'build':
        openTab(request);
        break;
      case 'galleryData':
        response = global.lastGalleryData;
        break;
      default:
        console.log('Sorry, we are out of ' + request.action + '.');
    }

    sendResponse(response);
  });

function showGenerateGallery(id, pageurl) {
  if (pageurl == undefined)
    pageurl = id;

  chrome.tabs.create({ 'url': chrome.runtime.getURL('generate.html?id=' + id + "&referrerurl=" + pageurl), 'selected': true });
}

function shownotification(title, msg) {
  var opt = {
    type: "basic",
    title: title,
    message: msg,
    iconUrl: "images/gallery-builder-19.png"
  }

  chrome.notifications.create("notificationId", opt, function() { })
}

chrome.runtime.onInstalled.addListener(function(details) {
  var installData = details || {}

  if ((details.reason == "install" || details.reason == "update")) {
    chrome.tabs.create({ "url": chrome.runtime.getURL("faq/index.html"), "selected": true }, function(tab) {
    });
  }
});

