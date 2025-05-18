if (undefined == builder) {

	var Helper = {
		getParameterByName: function(name) {
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
			var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
				results = regex.exec(location.search);
			return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		},
		
		startsWith: function(str, pattern) {
			if(!str)
				return false;
				
			return str.indexOf(pattern) === 0
		},
		
		padNumber: function(num, size) {
			var s = num+"";
			while (s.length < size) s = "0" + s;
			return s;
		},

		incrementCharacterByJump: function(c, jumpCount) {
			return String.fromCharCode(c.charCodeAt(0) + jumpCount);
		},

		incrementNumber: function(str, jumpCount) {
			//Check padded 0 count
			var padCount = 0;

			if(Helper.startsWith(str+"", "0")) {
				//find padded value 
				padCount = str.length;
			}

			var nextVal = "" + (parseInt(str) + jumpCount);
			return Helper.padNumber(nextVal, padCount);
		}
	};

	var builder = {
		methods: [],
		retrycount: 0,
		MAX_RETRY_COUNT: 6,
		
		thumbImgUrls: [],
		contentImgUrls: [],
		
		generateScript: function(data, callback) {
			var retscript = "";
			
			for (var count = 0; count < data.length; count++) {
				var imgdata = data[count];
				retscript = retscript + '<img src="' + imgdata + '" ></img>';
			}
			
			callback(retscript);
		},
		
		populateUrlTemplate: function(urlchunks) {
			builder.clearImageUrls();
			builder.generateScript(urlchunks, (script) => {});
			builder.fillimageUrls(urlchunks);
		},

		parseImgData: function(value, opType) {
			var curentOperations = [];
			
			builder.clearImageUrls(opType);
			
			var pairs = value.match(/\[(.*?)\]/g);
			
			if(pairs) {
				curentOperations = [];
				
				var lastPairIndex = 0;
				var mypair = 0;
				var dummyurls = [];
				
				for(var t = 0; t < pairs.length; t++) {
					mypair = pairs[t];
					
					//split operation vs value 
					var subparts = mypair.substring(1, mypair.length - 1).split("-");
					
					var curop = {};
					
					curop.index = t;
					curop.objectptr = {};
					curop.start = subparts[0];
					
					if(subparts.length > 1) {	
						curop.end = subparts[1];
					} else {
						curop.end = subparts[0];
					}
					
					//Continue with the main operation
					curentOperations.push(curop);
					
					var startindex = value.indexOf(mypair, lastPairIndex);
					var textlen = subparts[0].length;
					
					lastPairIndex = startindex + textlen + 3; //+1 for [  - ]
				}
				
				// Set matchcount based on the range for numeric values
				var matchcount = 10;
				
				if(pairs.length == 1) {
					var curop = curentOperations[0];
					
					var stepper = "";
					
					// Check if we need to pad with zeros
					if(Helper.startsWith(curop.start+"", "0")) {
						stepper = "0";
					}
					
					// For numeric ranges, calculate the proper count
					if(!isNaN(curop.start) && !isNaN(curop.end)) {
						var startNum = parseInt(curop.start);
						var endNum = parseInt(curop.end);
						matchcount = Math.abs(endNum - startNum) + 1; // +1 to include both start and end values
					}
					
					for(var t = 0; t < matchcount; t++) {
						var filledVal = value.replace(pairs[0], curop.start);
						
						dummyurls.push(filledVal);
						
						//Check datatype 
						if(!isNaN(curop.start) && !isNaN(curop.end)) {
							if(parseInt(curop.start) < parseInt(curop.end)) {
								curop.start = Helper.incrementNumber(curop.start+"", 1);
							} else if(parseInt(curop.start) > parseInt(curop.end)) {
								// Handle decreasing ranges if needed
								curop.start = Helper.incrementNumber(curop.start+"", -1);
							} else {
								// Start and end are the same, so we're done
								break;
							}
						} else {
							curop.start = Helper.incrementCharacterByJump(curop.start+"", 1);
						}
					}
				} else {
					dummyurls.push(value);
				}
				
				//Populate the array with the results
				builder.fillimageUrls(dummyurls, opType);
			} else {
				var dummyurls = [];
				dummyurls.push(value);
				builder.fillimageUrls(dummyurls, opType);
			}
		},
		
		getContentImageUrl: function(index, t_content) {
			var imgUrl = t_content;
				
			if(builder.contentImgUrls && builder.contentImgUrls.length > 0 && builder.contentImgUrls.length > index)
				imgUrl = '<a href="' + builder.contentImgUrls[index] + '" target="_blank">' + t_content + '</a>';
			
			return imgUrl;	
		},
		
		clearImageUrls: function(operationType) {
			var className = ".lstThumbnails";
			if(operationType == "CONTENT") {
				className = ".lstContentImages";
			}
			document.querySelector(className).innerHTML = "";
		},
		
		fillimageUrls: function(imgUrls, operationType) {
			var className = ".lstThumbnails";
			if(operationType == "CONTENT") {
				className = ".lstContentImages";
				builder.contentImgUrls = imgUrls;
			} else {
				builder.thumbImgUrls = imgUrls;
			}

			var listContainer = document.querySelector(className);
			
			for(var t = 0; t < imgUrls.length; t++) {
				var listItem = document.createElement('a');
				listItem.href = "#";
				listItem.className = "list-group-item lstpreview";
				listItem.textContent = imgUrls[t];
				listItem.addEventListener('click', function(event) {
					event.preventDefault();
					document.querySelector(".imgpreview").src = event.target.textContent;
				});
				
				listContainer.appendChild(listItem);
			}
		},
		
		init: function() {
			document.addEventListener('DOMContentLoaded', function() {
				var openGallery = Helper.getParameterByName("openGallery");
				if(openGallery != null && openGallery != "" && openGallery == "true") {
					var request = {};
					request.action = "galleryData";

					chrome.runtime.sendMessage(request, function(response) {
						document.body.innerHTML = response.galleryHTML;
					});
						
					return;
				}
				
				// Always set to empty string regardless of URL parameters
				document.getElementById("inputthumblg").value = "";
				document.getElementById("referrer").value = "";
				document.getElementById("inputcontentlg").value = "";
				
				// Clear the Images In Page input if it exists
				if (document.getElementById("inputImagesInPage")) {
					document.getElementById("inputImagesInPage").value = "";
				}

				document.getElementById("inputthumblg").addEventListener('change', function() {
					setTimeout(() => {
						builder.parseImgData(this.value, "THUMB");
					}, 100);
				});

				document.getElementById("inputcontentlg").addEventListener('change', function() {
					builder.parseImgData(this.value, "CONTENT");
				});
			
				document.querySelector(".btnbuild").addEventListener('click', function() {
					//Get array of thumbnails & content lstContentImages
					//if its available send to back ground 
					var request = {};
					request.action = "build";
					request.referrer = document.getElementById("referrer").value;
					
					var galleryHTML = "";
					for(var t = 0; t < builder.thumbImgUrls.length; t++) {
						galleryHTML = galleryHTML + builder.getContentImageUrl(t, '<img src="' + builder.thumbImgUrls[t] + '" ></img>');
					}

					if(request.referrer == "") {
						document.body.innerHTML = galleryHTML;
						return;
					}

					request.galleryHTML = galleryHTML;

					chrome.runtime.sendMessage(request, function(response) {
						window.close();
					});
				});
			
				// Setup tabs without jQuery
				setupTabs();
				
				 // Don't parse any initial URL as we're starting with empty fields
				builder.clearImageUrls("THUMB");
				builder.clearImageUrls("CONTENT");
			});
		}
	};

	// Handle tab switching without jQuery
	function setupTabs() {
		var tabLinks = document.querySelectorAll('.nav-tabs a');
		
		for(var i = 0; i < tabLinks.length; i++) {
			tabLinks[i].addEventListener('click', function(e) {
				e.preventDefault();
				
				// Remove active class from all tabs
				document.querySelectorAll('.nav-tabs li').forEach(function(tab) {
					tab.classList.remove('active');
				});
				
				// Hide all tab panes
				document.querySelectorAll('.tab-pane').forEach(function(pane) {
					pane.classList.remove('active');
				});
				
				// Add active class to clicked tab
				this.parentElement.classList.add('active');
				
				// Show corresponding tab pane
				var tabId = this.getAttribute('href').substring(1); // Remove the # from href
				document.getElementById(tabId).classList.add('active');
			});
		}
	}

	// Initialize the builder
	builder.init();
}
