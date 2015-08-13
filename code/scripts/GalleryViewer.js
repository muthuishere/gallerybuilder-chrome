var imgLoader={

workers:0,
MAX_LIMIT:40,
downloadqueue:[],
onCompleteWorker:function(){

imgLoader.workers--

if(imgLoader.downloadqueue.length > 0){
	var process = imgLoader.downloadqueue.shift(); 
	imgLoader.pushtoQueue(process.data,process.callback)
	}
	
},
generate:function(data,callback){

	var image = new Image();
	image.onload = function(){ // always fires the event.
		// ...
	
		data.description="OK"
		data.image=image
		imgLoader.onCompleteWorker()
		callback(data)
		
		
	};
	// handle failure
	image.onerror = function(){
		
		data.description="Unable to download " +data.downloadurl
		imgLoader.onCompleteWorker()
		callback(data)
		
	};
	image.src = data.downloadurl;
},
pushtoQueue:function(data,callback){

if(imgLoader.workers >= imgLoader.MAX_LIMIT){
	
	var process={}
	process.data=data
	process.callback=callback
	imgLoader.downloadqueue.push(process)
	return false;
	}


	imgLoader.generate(data,callback)
	imgLoader.workers++
	return true;
}



}
var gV={

count:0;
parentelement:null,

init:function(){

},
onImgStatuschange:function(data){

	if(data.description === "OK"){
		
			
			var elem
				if(data.imgurl != ""){
						 elem = document.createElement('a');
						elem.setAttribute('href', data.imgurl);
						elem.setAttribute('target', "_blank");
						elem.appendChild(data.image)
				}else
					elem=data.image
			
			parentelement.appendChild(elem);
		}

},
generate:function(thumburl,imgurl){

var data={}
data.thumburl=thumburl
data.imgurl=imgurl
data.downloadurl=thumburl

	 imgLoader.pushtoQueue(data,gV.onImgStatuschange)
	 


},


}