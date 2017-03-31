
if (undefined == gOpt) {


	var evtHandlers = {
		panelIndex : -1,
		panelCount:0,
		init:function(){
		
		},
		showcontainer : function (flgEdit) {
			var editelem = $("#editcontainer" + evtHandlers.panelIndex)
				var updateelem = $("#updatecontainer" + evtHandlers.panelIndex)
				var txtelem = $("#editscript" + evtHandlers.panelIndex)

				
				
				if (editelem.length <= 0 || updateelem.length <= 0)
					return

					
					
					if (flgEdit) {
					
							
							$(editelem).css("display", "");
						$(updateelem).css("display", "none");
							$(txtelem).attr("disabled", "disabled")
							
					} else {
						
						$(editelem).css("display", "none");
						$(updateelem).css("display", "");
							
							$(txtelem).removeAttr("disabled")
							$(txtelem).focus();
					}

		},
		updatehandlers : function () {
			
			
			$( "#inputthumblg" ).change(function() {
				
				//Find Number of []
				gOpt.parseImgData(this.value,"THUMB")
				
		});
		
		
			$( "#inputcontentlg" ).change(function() {
				
				//Find Number of []
				gOpt.parseImgData(this.value,"CONTENT")
				
		});


		
			
			$('#modalAddMethod').on('shown.bs.modal', function() {
					
					$("#methodname").val("")
					
					var scripttempl='//This is a template for custom functions \n //index - argument to play with \n //should return a value \n \
					'
					
					$("#txtareaadd").val(scripttempl)
					
					$("#methodname").focus();
					console.log("added")
					
				})


			$("#btnsavechanges").click(function () {

			
		
					
				if(!gOpt.methodexists($("#methodname").val())){
				
					gOpt.addmethod($("#methodname").val(),$("#txtareaadd").val())
					
					
					$('#modalAddMethod').modal('hide');
				}else{
				
			
				
				//$("#methodgroup").removeClass( "has-error" ).addClass( "has-error" );
					evtHandlers.flashcss("methodgroup","has-error")
					evtHandlers.flashdiv("spanerror","Method " + $("#methodname").val() + " already exists")
				
				}
				

			});

			

				
		},
		flashdiv:function(divid,txt){
	
	document.querySelector("#"+divid).innerHTML=txt;
	
	setTimeout(function() {	
	document.querySelector("#"+divid).innerHTML=""
	}, 5000);
},
	flashcss:function(divid,classid){
	
	
			$("#" + divid).addClass( classid );
	
	/*
	$("#" + divid ).keypress(function() {
			$("#" + divid).removeClass( classid )
});

*/
	setTimeout(function() {	
			$("#" + divid).removeClass( classid )
	}, 5000);
},

		onEditClick : function (evt) {

			evtHandlers.panelIndex=$('#accordion .in').attr("data-index")
					
			evtHandlers.showcontainer(false)
		},
		onUpdateClick : function (evt) {
			//save script element
			var method=gOpt.getMethodAtIndex(evtHandlers.panelIndex)
			method.script=$("#editscript" + evtHandlers.panelIndex).val()
			
			console.log(method.script , "received")
			gOpt.update(method)
			
			evtHandlers.showcontainer(true)
		},
		onCancelClick : function (evt) {

			evtHandlers.showcontainer(true)
		},
	}
	var gOpt = {

		methods : [],
		position:{
			content:"",
			optype:null
		},
		thumbImgOperations:[],
		contentImgOperations:[],
		populateData(urlchunks){
			
			var ulrs=[];
			
			var urlTemplate=""
			
			var scriptindex=1;
			for(j=0;j<urlchunks.length;j++){
				
				var urlchunk=urlchunks[i]
				
				if(urlchunk.optype == "TEXT"){
						urlTemplate = urlTemplate + urlchunk.content
					
				}else{
					urlTemplate = urlTemplate +  "#SCRIPT" + scriptindex
					scriptindex ++;
				}
				//Get array of object associated 
			}
			
			//Now we have url template 
			
			console.log("urltemplate" + urlTemplate)
			
		},
		parseImgData:function(value,type){
			console.log(value)
			
			var curentOperations=[];
			
			
			
			
			var pairs = value.match(/\[(.*?)\]/g)
			
			if(pairs){
				
				curentOperations=[];
				
				var lastPairIndex=0
				var currentstr=value;
				
				for(i=0;i<pairs.length;i++){
					
					var beforestring = currentstr.substr(lastPairIndex, currentstr.indexOf(pairs[i]));
					
					
					lastPairIndex=currentstr.indexOf(pairs[i]) + pairs[i].length  ;
					
					var curposition=new Object();
					curposition.optype="TEXT"
					curposition.content=beforestring;
					
					curentOperations.push(curposition)
					
					var scriptpos=new Object();
					scriptpos.optype="SCRIPT"
					scriptpos.content=pairs[i];
					
					curentOperations.push(scriptpos)
					
					currentstr=currentstr.substr(lastPairIndex)
					
					console.log("beforestring" + beforestring +" pair "+  pairs[i] + " lastPairIndex" + lastPairIndex + "currentstr " + currentstr)

					lastPairIndex=0;
					//get string before pair after last pair index
						//push into array 
					//get pair
				}
				
				if(currentstr  !== ""){
				var afterString=currentstr;
				
					var curposition=new Object();
					curposition.optype="TEXT"
					curposition.content=afterString;
					
					curentOperations.push(curposition);
				}
					
			if(type="THUMB"){
				
				gOpt.thumbImgOperations=curentOperations
			}else if(type="CONTENT"){
				
			gOpt.contentImgOperations=curentOperations
			}
			
			
			console.log(curentOperations);
			gOpt.populateData(curentOperations)
			}
			console.log(pairs)
			
			
			
		},
		
		updatestorage:function(){
		
		localStorage["methods"]=JSON.stringify(gOpt.methods);
		
		
		evtHandlers.panelCount=gOpt.methods.length;
		console.log("storage updated",gOpt.methods)
		
			
		},
		getMethodAtIndex:function(index){
		
		
		if(index < gOpt.methods.length)
			return gOpt.methods[index]
		else
			return null
			
		},
		removemethodAt:function(index){
		
		
			
			 gOpt.methods.splice(index,1);
			 
			
			gOpt.updatestorage();
			
			
				
			
		},
		addmethod:function(name,script){
		
			var method={}
			method.name=name
			method.script=script
			gOpt.methods.push(method)
			gOpt.updatestorage();
			
			
			var i=gOpt.methods.length-1
			
				var data = {
					"panelId" : i,
					"index" : i,
					"panelBaseId" : method.name,
					"title" : method.name,
					"script" : method.script
				};
				gOpt.addtab(data)
				
			
		},
		methodexists:function(name){
		
		
			for (i=0;i<gOpt.methods.length;i++) {
			
					curmethod=gOpt.methods[i]
					if(curmethod.name == name){
							
							return true;
						}
			}
			
			return false
		},
		update:function(method){
		
		
			for (i=0;i<gOpt.methods.length;i++) {
			
					curmethod=gOpt.methods[i]
					if(curmethod.name == method.name){
						gOpt.methods[i].script=method.script
						//sync local storage
							gOpt.updatestorage()
							
							return;
						}
			}
			
		},
		
		test : function () {

			var method = {}
			method.name = "square"
			method.script = " //index refers the parameter  \n return index*index"
			
			var methodarray=[]
			methodarray.push(method)
			
			var method = {}
			method.name = "cube"
			method.script = " //index refers the parameter  \n return index*index*2"
			
			methodarray.push(method)
			
			
			localStorage["methods"]=JSON.stringify(methodarray);
			
		//console.log(localStorage["methods"])
		
		//console.log(JSON.parse(localStorage["methods"]))

		},
		populatemethods : function () {

		
			
			
			
			//console.log("populatemethods")
			
			for (i=0;i< gOpt.methods.length;i++) {
			
			var method=gOpt.methods[i]
				var data = {
					"panelId" : i,
					"index" : i,
					"panelBaseId" : method.name,
					"title" : method.name,
					"script" : method.script
				};
				gOpt.addtab(data)
				
			//	console.log(method,"added",data)
				
				


				$("#btnedit" + i).click(function(){
						evtHandlers.onEditClick()
				})
				
				$("#btnupdate" + i).click(function(){
				
					evtHandlers.onUpdateClick()
				})
				
				$("#btncancel" + i).click(function(){
					evtHandlers.onCancelClick()
				})
				
				
			}

		},

		addtab : function (data) {

			var template = $('#accordTemplate').html();
			Mustache.parse(template); // optional, speeds up future uses
			var rendered = Mustache.render(template, data);
			$('#accordion').append(rendered);
			

			//	$("#accordion").loadTemplate("#accordTemplate", data);

		},
		init : function () {

		/*
			if (localStorage["methods"] == undefined || localStorage["methods"] == "" ) {}
			else
				gOpt.methods = JSON.parse(localStorage["methods"]);

			var bg = chrome.extension.getBackgroundPage();

			//var data = bg.globalGb.popupdata
		//	console.log(localStorage["methods"],gOpt.methods)
			gOpt.populatemethods()
			*/
			evtHandlers.updatehandlers()
			
		}
	}
	//gOpt.test();
	gOpt.init()
}
