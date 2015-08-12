var gallerybuilderOptions = {    
    gallerybuilderXMLList: null,
	changedDomains:new Array(),
	hasPassword:true,
	validated:false,

	createXMLElement:function(node,elemName){
	
	var xmldoc=gallerybuilderOptions.gallerybuilderXMLList;
	
	newel=xmldoc.createElement(elemName);
		
		
		newtext=xmlDoc.createTextNode('');
		newel.appendChild(newtext);
		node.appendChild(newel);


	},
	
	setXMLElementval:function(node,elemName,val){
		
		try{
		
		if(node.getElementsByTagName(elemName) == null)
			return false;

		
		
		
			node.getElementsByTagName(elemName)[0].firstChild.nodeValue=val;
			return true;
		}catch(exception){
				
		}
	},
	setXMLPathval : function (node, xpath, val) {

		try {

			if (node.getElementsByTagName("element") == null)
				return false;

			var elems = node.getElementsByTagName("element");

			for (k = 0; k < elems.length; k++) {

				if (gallerybuilderOptions.getXMLElementval(elems[k], "xpath") == xpath) {

					gallerybuilderOptions.setXMLElementval(elems[k], "value", val)
					return true;
					
				}

			}

		} catch (exception) {
			
			console.log(exception)
		}
		return false;
	},	
	validateViewOptions:function(event){
	 
	 document.querySelector("#validatepwdstatus").innerHTML=""
	 var curpwd=document.getElementById("txtaskpassword").value;

	
	
	 
	 
	 	chrome.extension.sendMessage({action: "validateCredential",info:curpwd}, function(response) {
				
				if(response.valid){
				
					//Click menu
					gallerybuilderOptions.validated=true
					gallerybuilderOptions.menuSitesClicked("");
					
					
				
				}else{
				
						document.querySelector("#validatepwdstatus").innerHTML="* Invalid Credentials"
				
					
				
				}
				
				});
				
		
		
		
	
	},

	infoChanged:function(event){
	
	document.querySelector("#sitechangedstatus").innerHTML="";
	
	document.querySelector("a#btnUpdate").setAttribute("class","button") ;
	
		var xpath=event.target.getAttribute("xpath") 	
			
	 var domainrow=event.target.parentNode.parentNode;
	  gallerybuilderOptions.changedDomains.push(domainrow.getAttribute("domainname"));
	  var gallerybuilderObject=gallerybuilderOptions.searchdomain(domainrow.getAttribute("domainname"),domainrow.getAttribute("authtype"))
	  
	event.target.className += ' inputChanged';
	if(event.target.getAttribute("type")=="text"){
	
		gallerybuilderOptions.setXMLPathval(gallerybuilderObject,xpath,event.target.value)
	
	}else if(event.target.getAttribute("type")=="password"){
		
		gallerybuilderOptions.setXMLPathval(gallerybuilderObject,xpath,event.target.value)
	
	//gallerybuilderOptions.setXMLElementval(gallerybuilderObject,"password",event.target.value)
	
	}else if(event.target.getAttribute("type")=="checkbox"){
	
	if(event.target.checked)
	  gallerybuilderOptions.setXMLElementval(gallerybuilderObject,"enabled","true")
	 else
		gallerybuilderOptions.setXMLElementval(gallerybuilderObject,"enabled","false")
	}
	
	},
	menuSitesClicked:function(event){
	
	//On Sites clicked
	
	document.querySelector("#navigation").style.visibility="visible"
	document.querySelector("#mnusitesparent").setAttribute("class", "current");
	document.querySelector("#mnuchangepasswordparent").removeAttribute("class");
	
	document.querySelector("#divSites").style.display="";
	document.querySelector("#divpasswordask").style.display="none";
	document.querySelector("#divpasswordchange").style.display="none";
	
	gallerybuilderOptions.loadOptions();
	
	},
	changePassword:function(pwd){
	
		chrome.extension.sendMessage({action: "addCredential",info:document.querySelector("#txtnewpassword").value}, function(response) {
					
					if(response.valid){
						
							gallerybuilderOptions.flashdiv("statusSuccess","Successfully changed Password");
								
								gallerybuilderOptions.viewSettings();
								
						
					}else{
						//show sites
							
								gallerybuilderOptions.flashdiv("statusError","Error in Updating Password Password");
								document.querySelector("#txtnewpassword").focus(); 
								return;
					}
						
					
					
					});
					
	
	},
	flashdiv:function(divid,txt){
	
	document.querySelector("#"+divid).innerHTML=txt;
	
	setTimeout(function() {	
	document.querySelector("#"+divid).innerHTML=""
	}, 5000);


	},
	onBtnCancelChangePasswordClicked:function(event){
	gallerybuilderOptions.viewSettings();
	},
	onBtnChangePasswordClicked:function(event){
	
	
	if(document.querySelector("#txtnewpassword").value != document.querySelector("#txtrepeatnewpassword").value){
	
			gallerybuilderOptions.flashdiv("statusError","Both Passwords should be same");
			document.querySelector("#txtnewpassword").focus(); 
			return;
	
	}
	
	if(gallerybuilderOptions.hasPassword==true){
	
		chrome.extension.sendMessage({action: "validateCredential",info:document.querySelector("#txtoldpassword").value}, function(response) {
					
					if(response.valid){
						
						gallerybuilderOptions.changePassword(document.querySelector("#txtnewpassword").value)
						
					}else{
						//show sites
					gallerybuilderOptions.flashdiv("statusError","Invalid Old Password");
								
								document.querySelector("#txtoldpassword").focus(); 
								return;
					}
						
					
					
					});
	
	
	}else{
		
		gallerybuilderOptions.changePassword(document.querySelector("#txtnewpassword").value)
	
	}
	// if old password is visible
	
	
	},
	menuChangePasswordClicked:function(event){
	
	//On Sites clicked
	
	document.querySelector("#navigation").style.visibility="visible"
	document.querySelector("#mnuchangepasswordparent").setAttribute("class", "current");
	document.querySelector("#mnusitesparent").removeAttribute("class");
	
	document.querySelector("#divSites").style.display="none";
	document.querySelector("#divpasswordask").style.display="none";
	document.querySelector("#divpasswordchange").style.display="";
	gallerybuilderOptions.loadSettings();
	
	
	},
	showPasswordPane:function(){
	
	//On Sites clicked
	
	
	document.querySelector("#navigation").style.visibility="hidden"
	
	
	document.querySelector("#divSites").style.display="none";
	document.querySelector("#divpasswordask").style.display="";
	document.querySelector("#divpasswordchange").style.display="none";
	
	 document.querySelector("input#txtaskpassword").addEventListener('keypress', function(event){
		 if (event.which == 13 || event.keyCode == 13) {
            gallerybuilderOptions.validateViewOptions();
            return false;
        }
        return true;
		 }, false);
		 
		 
	var buttonaskPassword = document.querySelector('input#btnaskpassword');
		 buttonaskPassword.addEventListener('click', gallerybuilderOptions.validateViewOptions, false);
		  document.querySelector("input#txtaskpassword").focus();
		 
	},
	init:function(){
	
	
				chrome.extension.sendMessage({action: "hasCredential"}, function(response) {
				
				if(response.valid){
				
					//Show Password panel
					gallerybuilderOptions.hasPassword=true;
					gallerybuilderOptions.validated=false;
					gallerybuilderOptions.showPasswordPane();
				}else{
					//show sites
					gallerybuilderOptions.hasPassword=false;
					gallerybuilderOptions.menuSitesClicked("");
				}
					
				
				
				});
				
	
	
	document.querySelector('a#mnusites').addEventListener('click', gallerybuilderOptions.menuSitesClicked, false);
	document.querySelector('a#mnuchangepassword').addEventListener('click', gallerybuilderOptions.menuChangePasswordClicked, false);
	
		 
		 
	},
	 loadChangePassword: function () {
	
			document.querySelector('#btnchangepassword').addEventListener('click', gallerybuilderOptions.onBtnChangePasswordClicked, false);
			document.querySelector('#btncancelchangepassword').addEventListener('click', gallerybuilderOptions.onBtnCancelChangePasswordClicked, false);
			document.querySelector("#tblchangepwd").style.display="";
			document.querySelector("#tblsettings").style.display="none";
			 
			 if(gallerybuilderOptions.hasPassword == false ){
					document.querySelector("#rowoldpassword").style.display="none";
		
				}else{
				
				document.querySelector("#rowoldpassword").style.display="";
				}
	
	 },
	 viewSettings: function () {
	  
			document.querySelector("#tblchangepwd").style.display="none";
			document.querySelector("#tblsettings").style.display="";
			
			},
	  loadSettings: function () {
	  
			document.querySelector("#tblchangepwd").style.display="none";
			document.querySelector("#tblsettings").style.display="";
			
			//on change check box
			
			document.querySelector('#btnshowchangepwd').addEventListener('click', function(){
					gallerybuilderOptions.loadChangePassword();
			}, false);
			
			
			
			chrome.extension.sendMessage({action: "getPromptAtStartup"}, function(response) {
				
						if(response.promptrequired == true)
							document.querySelector('#chkpromptgallerybuilder').setAttribute("CHECKED","CHECKED")
						else	
							document.querySelector('#chkpromptgallerybuilder').removeAttribute("CHECKED")
				
						});
						
			var usebasicauth= (localStorage["usebasicauth"] === 'true')
			
			if(usebasicauth)
				document.querySelector('#chkpromptBasicAuth').setAttribute("CHECKED","CHECKED")
			else
				document.querySelector('#chkpromptBasicAuth').removeAttribute("CHECKED")
							

			document.querySelector('#chkpromptBasicAuth').addEventListener('click', function(event){
					
					
					chrome.extension.sendMessage({action: "updateBasicAuthSetting",usebasicAuth:event.target.checked}, function(response) {
				
				
				
						});
					
			}, false);
			
				
			document.querySelector('#chkpromptgallerybuilder').addEventListener('click', function(event){
					
					
					chrome.extension.sendMessage({action: "updatePromptAtStartup",promptrequired:event.target.checked}, function(response) {
				
				
				
						});
					
			}, false);
			
			
			//remove password
			
	
	  },
    loadOptions: function () {

	
	
	document.querySelector('#tblOptions').style.display="";
			document.querySelector('#btnUpdate').style.display="";
        var rawxml = Helper.decrypt(localStorage["gallerybuilderxml"]);
		
		document.querySelector("a#btnUpdate").setAttribute("class", "buttondisable");
       var tblCreated= gallerybuilderOptions.loadDocumentAndCreateTable(rawxml);
        //tblOptions
		//Add
		if(tblCreated){
		
		//Add event listeners to remove
        var removeElements = document.querySelectorAll('a.remove');
        for (var i = 0, removeElement; removeElement = removeElements[i]; i++) {
            //work with element
            removeElement.addEventListener('click', gallerybuilderOptions.removegallerybuilder, false);

        }
		
		var inputElements = document.querySelectorAll('input.inp');
        for (var i = 0, inputElement; inputElement = inputElements[i]; i++) {
            //work with element
			
            inputElement.addEventListener('change', gallerybuilderOptions.infoChanged, false);
			 
		
        }
		
		 document.querySelector("input.inp").addEventListener('keypress', function(event){
		
			 
			 
			 if(event.target.className.indexOf("inputChanged") <0){
				document.querySelector("a#btnUpdate").setAttribute("class","button") ;
				event.target.className += ' inputChanged';
				}
	
	
		 if (event.which == 13 || event.keyCode == 13) {
			 gallerybuilderOptions.infoChanged(event)
           gallerybuilderOptions.updategallerybuilder()
            return false;
        }
        return true;
		 }, false);
		
		
		 var buttonUpdate = document.querySelector('a#btnUpdate');
		 buttonUpdate.addEventListener('click', gallerybuilderOptions.updategallerybuilder, false);
		
		}else{
		//remove table and buttons
		
			document.querySelector('#sitechangedstatus').innerHTML="<h3>No Sites Available for Auto Login</h3>"
			document.querySelector('#tblOptions').style.display="none";
			document.querySelector('#btnUpdate').style.display="none";
			
		}
		

    },
	
    removegallerybuilder: function (event) {

	//find domain 
	//remove from gallerybuilderxmllist
	
	document.querySelector("#sitechangedstatus").innerHTML="";
	
	document.querySelector("a#btnUpdate").setAttribute("class","button") ;
	 var docxml=gallerybuilderOptions.gallerybuilderXMLList ;
	 
	 var domainrow=event.target.parentNode.parentNode.parentNode;
	
	 var domainname=domainrow.getAttribute("domainname");
	 
	 
	 var gallerybuilderObject=gallerybuilderOptions.searchdomain(domainname,domainrow.getAttribute("authtype"))
	
	 
	 if(null != gallerybuilderObject)
		gallerybuilderObject.parentNode.removeChild(gallerybuilderObject);
				
	 
	 domainrow.parentNode.removeChild(domainrow);
	 
        return false;
		
		
    },
	
searchdomain:function(domainname,authtype){
		

		var docxml=gallerybuilderOptions.gallerybuilderXMLList;
			
		


		var sites = docxml.getElementsByTagName("site"), i=sites.length;
		  
		 if(i <=0)
		 return null;

		while (i--) {
					
				
				iurl=gallerybuilderOptions.getXMLElementval(sites[i],"url");
				if(gallerybuilderOptions.getdomainName(iurl)  == domainname &&  authtype == sites[i].getAttribute("authtype")  ){
							
							return sites[i];
							
								 
				}
								  

				}
				
				return null;

				

	},
	
	updateinputBoxStyle:function(){
	
	var inputElements = document.querySelectorAll('input.inp');
        for (var i = 0, inputElement; inputElement = inputElements[i]; i++) {
            //work with element
			inputElement.className=inputElement.className.replace("inputChanged" ,"")
        }
		
	
	},
	updategallerybuilder:function(event){
	
		if(document.querySelector("a#btnUpdate").getAttribute("class") == "buttondisable" )
			return;
	
	   var oSerializer = new XMLSerializer();
        var rawxml = oSerializer.serializeToString(gallerybuilderOptions.gallerybuilderXMLList);
	
        localStorage["gallerybuilderxml"] = Helper.encrypt(rawxml);
	
		
			chrome.extension.sendMessage({action: "refreshData"}, function(response) {
				
				gallerybuilderOptions.updateinputBoxStyle();
				
				
				gallerybuilderOptions.flashdiv("statusSuccess","Successfully Updated Information");
				document.querySelector("a#btnUpdate").setAttribute("class", "buttondisable");
				
				});
				
		

	  return false;
	},
    getXMLElementval: function (node, elemName) {

        try {
            val = node.getElementsByTagName(elemName)[0].firstChild.nodeValue;
            return val
        } catch (exception) {
            return "";
        }
    },
    loadDocumentAndCreateTable: function (rawxml) {

		flgTblCreated=false;


        var parser = new DOMParser();
        var docxml = parser.parseFromString(rawxml, "text/xml");


        var dummyresp = '';

        gallerybuilderOptions.gallerybuilderXMLList = docxml;
        var jsonresp = new Array();
		gallerybuilderOptions.cleanTable();

     //   try {

            //gallerybuilderOptions.logmessage(docxml );
            var divs = docxml.getElementsByTagName("site"),
                i = divs.length;
           
            if (i == 0)
                return flgTblCreated;


            while (i--) {

                var gallerybuilderInfo = {};
                gallerybuilderInfo.url = gallerybuilderOptions.getXMLElementval(divs[i], "url");
				gallerybuilderInfo.authtype=divs[i].getAttribute("authtype")

                gallerybuilderInfo.loginurl = gallerybuilderOptions.getXMLElementval(divs[i], "loginurl");
				gallerybuilderInfo.username="";
				
					gallerybuilderInfo.fields=[]
				  
				  var elems = divs[i].getElementsByTagName("element");
				  
				  for( k=0;k< elems.length ;k++){
					  
					  var field={}
					 field.xpath= gallerybuilderOptions.getXMLElementval(elems[k],"xpath");
					 field.type= gallerybuilderOptions.getXMLElementval(elems[k],"type");
					
					 field.value= gallerybuilderOptions.getXMLElementval(elems[k],"value");
					 field.event= gallerybuilderOptions.getXMLElementval(elems[k],"event");
					  if(field.type === "password"){
						 gallerybuilderInfo.password= field.value
						  gallerybuilderInfo.pwdxpath= field.xpath
					 }
					 
					  if(field.type === "text"  ){
					  
						if( gallerybuilderInfo.username !== ""){
						
								if(field.value != "" && (field.xpath.indexOf("user") >=0 ||  field.xpath.indexOf("email") >=0 || field.xpath.indexOf("login") >=0 )){
									gallerybuilderInfo.username= field.value
									gallerybuilderInfo.userxpath= field.xpath
								
								}
								
						}else{
						 gallerybuilderInfo.username= field.value
						  gallerybuilderInfo.userxpath= field.xpath
						  }
					 }
					gallerybuilderInfo.fields.push(field)
				  }
				  
				 
                gallerybuilderInfo.enabled = gallerybuilderOptions.getXMLElementval(divs[i], "enabled");
				
					gallerybuilderInfo.domain=gallerybuilderOptions.getdomainName( gallerybuilderInfo.url)
					
                if (null == gallerybuilderInfo.enabled || "" == gallerybuilderInfo.enabled)
                    gallerybuilderInfo.enabled = "true"
				
					gallerybuilderOptions.createRow(gallerybuilderInfo)				
					flgTblCreated=true;
                jsonresp.push(gallerybuilderInfo);
				
            }

            //dummyresp = JSON.stringify(jsonresp);

            

            //gallerybuilderOptions.logmessage(dummyresp);

            
       /* } catch (exception) {

            console.log("decode issue" + exception)
            
        } */

   return flgTblCreated;
    },

   
	getdomainName:function(str){
		
		if(str.indexOf("http") != 0 && str.indexOf("www")!=0)
			return str
		
			var    a      = document.createElement('a');
			 a.href = str;
			return a.hostname
	},
	cleanTable:function(){
	
	
			
			
           
 
            for (var i = document.querySelector("#tblOptions").rows.length; i > 1; i--) {
						document.querySelector("#tblOptions").deleteRow(i - 1);
					} 
            
			
			
	
	},
	createRow:function(gallerybuilderInfo){
	
	
			var gallerybuilderChecked=""
			if(gallerybuilderInfo.enabled == "true"){
				gallerybuilderChecked="CHECKED"
			}
			
			 var row = document.querySelector("#tblOptions").insertRow(-1);
row.setAttribute("domainname",gallerybuilderInfo.domain)
row.setAttribute("authtype",gallerybuilderInfo.authtype)

var authtype="WebPage Authentication"
var imagename="lock.png"
if(gallerybuilderInfo.authtype == "basic"){
	authtype="Basic Authentication"
	imagename="shield.png"
}
	
row.innerHTML =	 "<td style='text-align:left;max-width:150px;overflow:hidden' title='"+gallerybuilderInfo.domain+"'>"+ gallerybuilderInfo.domain+"</td>"+
	"<td style='text-align:center'><img src='images/"+ imagename+"' title='"+authtype+"' class='btnDelete'/> </td>"+
        "<td><input class='inp' type='text' xpath='"+gallerybuilderInfo.userxpath  +"' value='"+gallerybuilderInfo.username +"'/></td>"+
		"<td><input class='inp' type='password' xpath='"+gallerybuilderInfo.pwdxpath  +"'  value='"+gallerybuilderInfo.password +"'/></td>"+
		"<td><input class='inp' type='checkbox' value='1' "+gallerybuilderChecked +"  /></td>"+
        "<td> <a  class='remove' href='#'><img src='images/delete.png' class='btnDelete'/></a> </td>";
	
	}

};


 
 
 





window.addEventListener('load', gallerybuilderOptions.init);



/*


var myString = '<div style="position:fixed;border:2px solid;border-radius:25px;background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#7abcff), color-stop(44%,#60abf8), color-stop(100%,#4096ee)); ;color:-webkit-gradient(linear, left top, left bottom, color-stop(0%,#4c4c4c), color-stop(12%,#595959), color-stop(25%,#666666), color-stop(39%,#474747), color-stop(50%,#2c2c2c), color-stop(51%,#000000), color-stop(60%,#111111), color-stop(76%,#2b2b2b), color-stop(91%,#1c1c1c), color-stop(100%,#131313));right:202px;top:0px;height:200px;width:200px">   <table id="" style="width:100%" > <tbody> <tr> <th>Enter Master Password to activate gallerybuilder:</th></tr><tr> <th> <input type="password" id="txtaskpassword" /> </th> </tr><tr>   <th> <input type="button" id="btnaskpassword" value="Activate" /> </th>   </tr> </tbody> </table> </div>'

var container=document.createElement("div");
container.innerHTML=myString
document.body.appendChild(container)

*/