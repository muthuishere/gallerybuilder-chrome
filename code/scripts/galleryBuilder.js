if (undefined == GalleryBuilder) {

	var CustomFunctions = {

		getMonth : function (start, end, inc) {}

	}

	var DataTypes = {
		NUMBER : 1,
		CHARACTER : 2,
		MONTH_LONG : 3,
		MONTH_SHORT : 4,
		UNKNOWN : -1,
		mL : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		mS : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
		getMonthName : function (index, montype) {

			var mL = DataTypes.mL
				var mS = DataTypes.mS

				if (montype == DataTypes.MONTH_LONG) {

					if (index < mL.length)
						return mL[index]

				}

				if (montype == DataTypes.MONTH_SHORT) {

					if (index < mS.length)
						return mS[index]

				}

				return ""

		},
		getMonthIndex : function (str) {

			var mL = DataTypes.mL
				var mS = DataTypes.mS

				if (mL.indexOf(str) >= 0)
					return mL.indexOf(str)

					if (mS.indexOf(str) >= 0)
						return mS.indexOf(str)

		},
		checkType : function (str) {

			if (str.length == 1 && str.match(/[a-z]/i)) {
				return DataTypes.CHARACTER
			}

			var mL = DataTypes.mL
				var mS = DataTypes.mS

				if (mL.indexOf(str))
					return DataTypes.MONTH_LONG

					if (mS.indexOf(str))
						return DataTypes.MONTH_SHORT

						if (!isNaN(parseInt(str))) {
							return DataTypes.NUMBER
						}

				return DataTypes.UNKNOWN

		}
	}
	var GalleryBuilder = {

		tokens : 0,
		delimeter : "[]",

		onTextChange : function (text) {

			//find the number of parantheses
			GalleryBuilder.tokens = text.split(GalleryBuilder.delimeter).length - 1

				for (i = 0; i < GalleryBuilder.tokens; i++) {

					if (!document.querySelector("#row" + i)) {
						GalleryBuilder.createRow(i)
					}

				}
				hasrow = (document.querySelector("#row" + i) !== null);
				
				while (hasrow) {

					GalleryBuilder.deleteRow(i)

					i++
					hasrow = (document.querySelector("#row" + i) !== null)
				}

		},
		createRow : function (index) {

			var row = document.querySelector("#tblOptions").insertRow(-1);
			row.setAttribute("id", "row" + index)
			row.innerHTML = "<td style='text-align:left;max-width:150px;overflow:hidden' ><input id='start" + index + "' type='text' value='' placeholder=" Start "></td>" +
				"<td style='text-align:center'><input id='end" + index + "' type='text' value='' placeholder=" End "> </td>" +
				"<td><input id='increment" + index + "' type='text' value='' placeholder=" Increment "> </td>"

		},
		deleteRow : function (index) {

			var domainrow = document.querySelector("#row" + index);

			domainrow.parentNode.removeChild(domainrow);
		},

		onGalleryBuild : function (template) {

			var ranges = []
			for (i = 0; i < GalleryBuilder.tokens; i++) {

				var startval = document.querySelector("#start" + i).value

					var endval = document.querySelector("#end" + i).value

					var incrementval = document.querySelector("#increment" + i).value

					if (incrementval == "")
						incrementval = "1"

							

							if (DataTypes.checkType(startval) == DataTypes.UNKNOWN) {
								alert("Invalid data entered on start value " + startval)
								document.querySelector("#start" + i).focus()
								return;
							}

							if (DataTypes.checkType(endval) == DataTypes.UNKNOWN) {
								alert("Invalid data entered on end value " + endval)
								document.querySelector("#end" + i).focus()
								return;
							}

							if (DataTypes.checkType(endval) != DataTypes.checkType(startval)) {
								alert("Incorrect data types on start value  <=>   end value " + startval + "<=> " + endval)
								document.querySelector("#end" + i).focus()
								return;
							}

							if (DataTypes.checkType(incrementval) != DataTypes.NUMBER) {
								alert("Invalid data entered on incrementval value " + incrementval)
								document.querySelector("#increment" + i).focus()
								return
							}
							var range = {}
					range.index = i
					range.datatype = DataTypes.checkType(startval)

					range.start = startval
					range.end = endval
					range.increment = incrementval

					if (DataTypes.checkType(start) == DataTypes.CHARACTER) {

						range.start = startval.charCodeAt(0);
						range.end = endval.charCodeAt(0);

						//range.length= (range.endcharcode - range.startcharcode)


					}

					if (DataTypes.checkType(start) == DataTypes.MONTH_LONG || DataTypes.checkType(start) == DataTypes.MONTH_SHORT) {

						range.start = DataTypes.getMonthIndex(startval);
						range.end = DataTypes.getMonthIndex(endval);

					}
					range.length = range.end - range.start

					if (range.length < 0 && incrementval >= 0) {
						alert("Invalid data entered on incrementval value " + incrementval)
						document.querySelector("#increment" + i).focus()
						return;

					}
					ranges.push(range)

			}

			//Ranges has all the urls
			//ranges
			var results = generateurls(template,0,ranges)
			console.log(results)

		},

		generateurls : function (template, pointer, ranges) {

			var cururl = template

				var results = []

				var range = ranges[pointer]
				var currenturl = template

				currenturl = template

				var index = 0
				var curindex = range.start 
				
				var count=range.length
				
				if(range.length < 0)
					count = range.length * -1 
					
					
				while (index < range.length) {

					if (range.datatype == DataTypes.CHARACTER) {
						curval = String.fromCharCode(curindex);

					} else if (range.datatype == DataTypes.NUMBER) {
						curval = curindex

					} else if (range.datatype == DataTypes.MONTH_SHORT) {

						curval = DataTypes.getMonthName(curindex, DataTypes.MONTH_SHORT)

					} else if (range.datatype == DataTypes.MONTH_LONG) {

						curval = DataTypes.getMonthName(curindex, DataTypes.MONTH_LONG)
					}

					cururl = cururl.replace(GalleryBuilder.delimeter, curval)

						if (cururl.indexOf(GalleryBuilder.delimeter) > 0) {

							results = results.concat(generateurls(cururl, pointer + 1, ranges));
						} else
							results.push(cururl)

							curindex = curindex + range.increment
								index++
				}

		},
		init : function () {
		
		
		
		}

	}

	window.addEventListener('load', GalleryBuilder.init);

	//document.body.addEventListener("load", authHandler.init(), false);


}
