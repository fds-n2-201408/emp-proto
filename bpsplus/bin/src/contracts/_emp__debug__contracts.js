var top = this;

var arguments = [];
var window= top;

arguments.callee = {};
var DEBUG_FUNC_INDEX = 1;

var del = ["arguments","top","window","Emp","empBridge","util","DEBUG_FUNC_INDEX","del","BridgeUtil","ResultUtil"];

function jsDebug(){
	
}

jsDebug.debugCommand = null;
jsDebug.currResource = null;
jsDebug.breakpoints = null;
jsDebug.functionStack = [];
jsDebug.currResource = null;
jsDebug.currLine = null;
jsDebug.isExpression = false;

/**
 * 
 */
jsDebug.getErrorStack = function(func) {
	var stack = [];
	while (func) {
		var funcStr = func.toString();
		var funcOffset = funcStr.indexOf(")");
		var funcHead = funcStr.substring(0, funcOffset + 1);
		var args = func.arguments;
		var argArr = [];
		for (var i = 0; i < args.length; i++) {
			argArr.push(args[i]);
		}
		stack.push(funcHead + json2string(argArr, 12));
		func = func.caller;
	}
	return stack.join("\n");
}

/**
 * 
 */
var parseVars = function(line) {
	var varNames = [];
	if (line && line.length > 0) {
		var endOffset = line.indexOf(";");
		if (endOffset > 0) {
			line = line.substring(0, endOffset);
		}
		var lineArr = line.split(",");
		for (var i = 0; i < lineArr.length; i++) {
			var varStr = lineArr[i];
			var varEndOffset = varStr.indexOf("=");
			if (varEndOffset > 0) {
				varNames.push(varStr.substring(0, varEndOffset));
			} else {
				varNames.push(varStr);
			}
		}
	}
	return varNames;
}

/**
 * 
 */
jsDebug.updateStack = function(args, resource, scope, line, evalFunc) {
	if (args && args.callee) {
		var func = args.callee;
		func.__resource = resource;
		func.__line = line;
		func.__evalFunc = evalFunc;
		func.__scope = scope;
		for (var i = jsDebug.functionStack.length - 1; i > -1; i--) {
			if (func == jsDebug.functionStack[i]) {
				jsDebug.functionStack = jsDebug.functionStack.slice(0, i + 1);
				return;
			}
		}
		jsDebug.functionStack.push(func);
	} else {
		jsDebug.functionStack = [];
	}

}

/**
 * 
 */
var getFuncData = function(args, evalFunc) {
	
		var vars = [];
		var func = args.callee;
		if (func) {
			var funcStr = func.toString().replace(/\n/g, "");
			var argStart = funcStr.indexOf("(");
			var argEnd = funcStr.indexOf(")");
			if (argStart > 0 && argEnd > 0) {
				var argStr = funcStr.substring(argStart + 1, argEnd);
				vars = argStr.split(",");
			}
			var nameArr = funcStr.split("var ");
			for (var i = 1; i < nameArr.length; i++) {
				var line = nameArr[i];
				vars = vars.concat(parseVars(line));
			}
		}
		var data = {};
		
		for (var i = 0; i < vars.length; i++) {
			var key = vars[i];
			if (key && key.length > 0) {
				key = key.replace(/\n|\r|\t| /g, "");
				if (/^[A-Za-z0-9_\$]*$/.test(key)) {
					try {
						var result = evalFunc(key);
						if (result == undefined) {
							data[key] = {"value":"undefined","type":"string"};
						} else if (result == null) {
							data[key] = {"value":"null","type":"string"};
						} else {
							data[key] = {"value":evalFunc(key),"type":typeof(evalFunc(key))};
						}
					} catch (e) {

					}
				}
			}
		}
		return data;
}

var getWindowData = function(args,evalFunc){
	var data = {};
	for (var i in top) { 
	    data[i] = {value:top[i],type:typeof(top[i])};
	}
//	return {"x":{"value":top.x,"type":typeof(top.x)}};

	return {"window":{value:top,type:typeof(top)}};
}


/**
 * find if arguments is stepreturn context
 */
jsDebug.isStepReturn = function(args) {
	if (args) {
		var func = args.callee;
		for (var i = jsDebug.functionStack.length - 2; i > -1; i--) {
			if (func == jsDebug.functionStack[i]) {
				return true;
			}
		}
		return false;
	} else {
		return true;
	}
}

/**
 * find if arguments is stepover context
 */
jsDebug.isStepOver = function(args) {
	if (args) {
		var func = args.callee;
		for (var i = jsDebug.functionStack.length - 1; i > -1; i--) {
			if (func == jsDebug.functionStack[i]) {
				return true;
			}
		}
		return false;
	} else {
		return true;
	}
}

/**
 * 
 */
jsDebug.error = function(e, resource, line,callFunc) {
	try {
		var funcStr = callFunc + "";
			if(funcStr.indexOf("function anonymous")>=0){
				funcStr = undefined;
			}
		var postData = {
			"ERROR" : encodeURI(e),
			"COMMAND" : "ERROR",
			"RESOURCE" : resource,
			"LINE" : line,
			"ERRORFUNC":funcStr,
			"ISIE":isIE
		}
		empBridge.debug(obj2string(postData));
	} catch (e) {

	}
}

/**
 * 
 */
jsDebug.stepReturn = function(func) {
	try {
		var data = jsDebug.getFuncData(func.arguments, func.__evalFunc);
		jsDebug.updateStack(func.arguments, func.__resource, func.__scope,
				func.__line, func.__evalFunc);
		if (func.__scope != top) {
			data["this"] = func.__scope;
		}
		var postData = {
			"STACK" : data,
			"COMMAND" : jsDebug.debugCommand,
			"RESOURCE" : func.__resource,
			"LINE" : func.__line
		}
		var res = empBridge.debug(obj2string(postData));
		jsDebug.parseResult(res,func.__evalFunc);
		
	} catch (e) {
	}
}


jsDebug.evalExpression = function(expression, evalFunc) {
	try {
	//	jsDebug.xmlHttp.open("POST", "/jsdebug.debug?" + new Date(), false);
		var postData = {
			"STACK" : {},
			"COMMAND" : "EXPRESSION",
			"EXPRESSION" : expression
		}
		try {
			jsDebug.isExpression = true;
			var ret = evalFunc(expression);
			if(typeof(ret)=="undefined"){
				ret = "undefined";
			}else if(ret==null){
				ret = "null";
			}
			postData["RESULT"] = ret;
		} catch (e) {
			postData["ERROR"] = e;
		}
		jsDebug.isExpression = false;
		var res = empBridge.debug(obj2string(postData));
		jsDebug.parseResult(res,evalFunc);
	} catch (e) {

	}
}

jsDebug.evalValue = function(expression, evalFunc){
	try {
//		jsDebug.xmlHttp.open("POST", "/jsdebug.debug?" + new Date(), false);
		var postData = {
			"STACK" : {},
			"COMMAND" : "VALUE",
			"EXPRESSION" : expression
		}
		try {
			jsDebug.isExpression = true;
			var ret = evalFunc(expression);
			var data = {};
			if(typeof(ret)=="undefined"){
				ret = "undefined";
			}else if(ret==null){
				ret = "null";
			}else{
				for(var prop in ret){
					try{
						if(prop!="postData"&&!contains(del,prop)){
						var value = ret[prop];
						var type = typeof(value);
						if(type=="function"){
							continue;
						}
						var stringValue = "";
						if(value){
							stringValue = value.toString();
						}
						if(value==null){
							stringValue = "null";
							type = "null";
						}else if(value==undefined){
							stringValue = "undefined";
							type = "undefined";
						}
						data[prop] = {"value":stringValue,"type":typeof(value)};
						}
					}catch(e){

					}
				}
			}
			postData["RESULT"] = data;
		} catch (e) {
			postData["ERROR"] = e;
		}
		jsDebug.isExpression = false;
		var submitString = "{}";
		try{
			submitString = json2string(postData);
		}catch(e){

		}
		var res = empBridge.debug(obj2string(postData));
		jsDebug.parseResult(res,evalFunc);
	} catch (e) {
		alert(e);
	}
}

/**
 * 
 */
jsDebug.parseResult = function(result, evalFunc) {
	if (result) {
		if (result.indexOf("{") == 0) {
			try {
				eval("var retObj = " + result);
				if( retObj["COMMAND"]){
					if(retObj["COMMAND"]=="EXPRESSION"){
						jsDebug.evalExpression(retObj["EXPRESSION"], evalFunc);
					}else if(retObj["COMMAND"]=="VALUE"){
						jsDebug.evalValue(retObj["EXPRESSION"], evalFunc);
					}else{
						jsDebug.isExpression = false;
						jsDebug.debugCommand = retObj["COMMAND"];
						if (jsDebug.debugCommand == "BREAKPOINT") {
							jsDebug.breakpoints = retObj["BREAKPOINTS"];
						}
					}
				}
                return retObj;
			} catch (e) {
			}
		} else {
			 alert("Debug error:" + result);
		}
	} else {

	}
}



function json2string(obj, depth) {
	depth = depth || 0;
	if (typeof obj == "function") {
		return "\"function\"";
	}  else if (obj && typeof obj.pop == 'function' && obj instanceof Array) {
		return array2string(obj, depth + 1);
	} else if (typeof obj == "object") {
		return obj2string(obj, depth + 1);
	} else {
		if (typeof obj == "string") {
			return "\"" + obj.replace(/"/gm, "'").replace(/\n|\r/gm, "")
					+ "\"";
		} else if (typeof obj == "number") {
			if (isFinite(obj)) {
				return obj;
			} else {
				return "\"out of number\"";
			}
		} else {
			//return util.jsonToString(obj).replace(/"/gm, "\\\"").replace(/\n|\r/gm, "");
		}
	}
}

function obj2string(obj, depth) {
	depth = depth || 0;
		var arr = [];
		for (var prop in obj) {
			try {
				if (obj.hasOwnProperty(prop) && typeof(obj[prop]) != "function") {
					if (depth < 9) {
						arr.push("\"" + prop + "\":"
								+ json2string(obj[prop], depth + 1));
					} else {
						arr.push("\"" + prop + "\":\"...\"")
					}
				}
			} catch (e) {

			}
		}
		return "{" + arr.join(",") + "}";
}

function complexObj2String(obj){
	var arr = [];
	for (var prop in obj) {
		try {
			if (typeof(obj[prop]) != "function") {
				var value = (obj[prop] + "").replace(/"/gm, "'").replace(/\n|\r/gm, "");
				arr.push("\"" + prop + "\":\""
						+ value + "\"");
			}
		} catch (e) {

		}
	}
	return "{" + arr.join(",") + "}";
}
function array2string(array, depth) {
	depth = depth || 0;
	var arr = [];
	for (var i = 0; i < array.length; i++) {
		arr.push(json2string(array[i], depth + 1));
	}
	return "[" + arr.join(",") + "]";
}

function mergeJsonObject(jsonbject1, jsonbject2)  
{  
    var resultJsonObject={};  
    for(var attr in jsonbject1){  
        resultJsonObject[attr]=jsonbject1[attr];  
    }  
    for(var attr in jsonbject2){  
        resultJsonObject[attr]=jsonbject2[attr];  
    }  

    return resultJsonObject;  
};  

function convertStringToJSON(str){
    var stu = eval('('+str+')');
    return stu;
}

function contains(a,obj){
	var i = a.length;
	while(i--){
		if(a[i]===obj){
			return true;
		}
	}
	return false;
}

jsDebug.getBreakPoint = function(async) {
	var postData = {"COMMAND":"RESUME"}; 
    var res = empBridge.debug(obj2string(postData));
    var retObj = util.stringToJson(res);
    jsDebug.breakpoints = retObj["BREAKPOINTS"];
    return;

	async = async?false:true;
	log(":"+async);
	try{
//	var jsonResume = "{\"COMMAND\":\"RESUME\"}";
		var postData = {"COMMAND":"RESUME"}; 
	if(async){
		var id;
	    log("");
		id = setInterval(jsDebug.getBreakPoint,1000);
	}else{
		log("");
	    var res = empBridge.debug(obj2string(postData));
	    var retObj = util.stringToJson(res);
	    jsDebug.breakpoints = retObj["BREAKPOINTS"];
	}
	} catch(e){
		
	}
}

jsDebug.getBreakPoint();

jsDebug.debug =  function(resource,line,scope,args,evalFunc){
	var isNewStack = false;
	if(args&&args["_funcIndex"]==undefined){
		if(args.callee.caller && args.callee.caller.arguments){
			if(args.callee.caller.arguments["__funcIndex"]==undefined){
				args["__funcIndex"] = DEBUG_FUNC_INDEX++;
				isNewStack = true;
			}else{
				args["__funcIndex"] = args.callee.caller.arguments["__funcIndex"];
			}
		}
	}
	
	if (jsDebug.isExpression) {
		return;
	}
	
	
	try {
		jsDebug.currResource = resource;
		jsDebug.currLine = line;
		if (jsDebug.debugCommand == null) {
			jsDebug.debugCommand = "START";
		}
		if (jsDebug.debugCommand == "TERMINATE") {
			throw "exit";
		}
		if(!jsDebug.breakpoints){
			jsDebug.getBreakPoint(true);
		}
		if (!(jsDebug.breakpoints && jsDebug.breakpoints[resource + line])) {
			if (jsDebug.debugCommand == "STEPRETURN"
					|| jsDebug.debugCommand == "STEPOVER") {
				var parentFunc = jsDebug.functionStack[jsDebug.functionStack.length
						- 2];
				var currFunc = jsDebug.functionStack[jsDebug.functionStack.length
						- 1];
				if(currFunc && (currFunc==args.callee)){
					if(jsDebug.debugCommand == "STEPRETURN"){
						return;
					}
					// do nothing
				}else{
					if (parentFunc && (args.callee.caller == parentFunc)) {
						jsDebug.stepReturn(parentFunc);
						jsDebug.debug(resource, line, scope, args, evalFunc);
						if(jsDebug.debugCommand == "STEPRETURN"){
							return;
						}
					}else{
//						if(args.callee){
//							return;
//						}
					}
				}

			}
			if (jsDebug.debugCommand == "STEPRETURN") {
				if (!jsDebug.isStepReturn(args)) {
					if(args.callee){
						return;
					}
				}
			} else if (jsDebug.debugCommand == "STEPOVER") {
				if (!jsDebug.isStepOver(args)) {
					if(args.callee){
						return;
					}
				}
			} else if (jsDebug.debugCommand == "RESUME") {
				return;
			} else if (jsDebug.debugCommand == "STEPINTO") {

			} else {
				return;
			}
		} else {
			jsDebug.debugCommand = "BREAKPOINT";
		}
		
		var data = getFuncData(args,evalFunc);
		var windowData = getWindowData(args,evalFunc);
		var stack = mergeJsonObject(windowData,data);
		
		jsDebug.updateStack(args, resource, scope, line, evalFunc);
		
		var postData = {
				"STACK" : stack,
				"COMMAND" : jsDebug.debugCommand,
				"RESOURCE" : resource,
				"LINE" : line,
				"NEWSTACK":true
		};
		var postDataStr = json2string(postData,0);
		
	    var res = empBridge.debug(postDataStr);
		
		jsDebug.parseResult(res, evalFunc);
		
	} catch (e) {

	}

};

var $jsd = jsDebug.debug;
Emp.page.setId('_BODY_26005481');
var _div_27658064 = new Emp.Panel({"id":"_div_27658064","height":"100%","layout":"HBox","width":"100%"});
var _div_19543246 = new Emp.Panel({"id":"_div_19543246","height":"100%","width":"10"});
_div_27658064.add(_div_19543246);
var _div_32567601 = new Emp.Panel({"id":"_div_32567601","height":"100%","layout":"VBox","width":"100%"});
var _div_23785194 = new Emp.Panel({"id":"_div_23785194","width":"100%","class":"overflow:hidden"});
var listview = new Emp.ListView({"id":"listview","height":"100%","width":"100%","enablePullDown":"true"});
listview.addEvent('onItemLongClick',openSession);
listview.addEvent('onLoadMore',refresh);
var _template_11668595 = new Emp.Panel({"id":"_template_11668595"});
_template_11668595.__isTemplate=true;
var _div_21984577 = new Emp.Panel({"id":"_div_21984577","height":"56","layout":"VBox","width":"100%"});
var _div_26935584 = new Emp.Panel({"id":"_div_26935584","height":"5","width":"100%"});
_div_21984577.add(_div_26935584);
var _div_23522851 = new Emp.Panel({"id":"_div_23522851","height":"45","layout":"hBox","width":"100%"});
var _div_10241743 = new Emp.Panel({"id":"_div_10241743","height":"100%","vAlign":"middle","hAlign":"left","width":"100"});
var _label_32296104 = new Emp.Label({"id":"_label_32296104","tag":"ltitle","fontSize":"14"});
_div_10241743.add(_label_32296104);
var _img_24135764 = new Emp.Image({"id":"_img_24135764","height":"40","tag":"pimg","width":"40"});
_div_10241743.add(_img_24135764);
var _label_10264379 = new Emp.Label({"id":"_label_10264379","value":"  ","fontSize":"16"});
_div_10241743.add(_label_10264379);
var _label_10088798 = new Emp.Label({"id":"_label_10088798","tag":"name","fontSize":"16"});
_div_10241743.add(_label_10088798);
_div_23522851.add(_div_10241743);
var _div_11895511 = new Emp.Panel({"id":"_div_11895511","height":"100%","vAlign":"middle","layout":"HBox","hAlign":"left","width":"100%"});
var _label_10557593 = new Emp.Label({"id":"_label_10557593","color":"#888888","tag":"phonenum","fontSize":"18"});
_div_11895511.add(_label_10557593);
var _label_5633419 = new Emp.Label({"id":"_label_5633419","value":"  ","fontSize":"16"});
_div_11895511.add(_label_5633419);
var _label_23826807 = new Emp.Label({"id":"_label_23826807","color":"#bbbbbb","tag":"dep","fontSize":"14"});
_div_11895511.add(_label_23826807);
_div_23522851.add(_div_11895511);
_div_21984577.add(_div_23522851);
var _div_18565764 = new Emp.Panel({"id":"_div_18565764","height":"5","width":"100%"});
_div_21984577.add(_div_18565764);
var _div_12147494 = new Emp.Panel({"id":"_div_12147494","height":"0.5","backgroundColor":"#AAAAAA","width":"100%"});
_div_21984577.add(_div_12147494);
_template_11668595.add(_div_21984577);
listview.setTemplate(_template_11668595,"_template_11668595");
_div_23785194.add(listview);
_div_32567601.add(_div_23785194);
_div_27658064.add(_div_32567601);
var _div_17767990 = new Emp.Panel({"id":"_div_17767990","height":"100%","width":"24"});
var a2zlist = new Emp.ListView({"id":"a2zlist","height":"100%","width":"100%"});
var _template_1545971 = new Emp.Panel({"id":"_template_1545971"});
_template_1545971.__isTemplate=true;
var _div_12019735 = new Emp.Panel({"id":"_div_12019735","height":"19","vAlign":"middle","hAlign":"center","layout":"VBox","width":"100%"});
var _label_18006386 = new Emp.Label({"id":"_label_18006386","color":"#bbbbbb","tag":"a2z","fontSize":"16"});
_div_12019735.add(_label_18006386);
_template_1545971.add(_div_12019735);
a2zlist.setTemplate(_template_1545971,"_template_1545971");
_div_17767990.add(a2zlist);
_div_27658064.add(_div_17767990);
Emp.page.add(_div_27658064);








$jsd('/bpsplus/src/contracts/contracts.html',52,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);});var items = [{ltitle:"", pimg:"/image/account.png", name:"我", phonenum:"18610380209", dep:"[华北技术二部]", action:"/contracts/contractDetail.html"}, {ltitle:"C", pimg:" ", name:"", phonenum:"", dep:"", action:""}, {ltitle:"", pimg:"/image/1.jpg", name:"曹立磊", phonenum:"18611735102", dep:"[华北技术二部]", action:"/contracts/contractDetail.html"}, {ltitle:"", pimg:"/image/2.jpg", name:"曹宗伟", phonenum:"18611735102", dep:"[产品部]", action:"/contracts/contractDetail.html"}, {ltitle:"", pimg:"/image/5.jpg", name:"曹小琪", phonenum:"18611735102", dep:"[华东技术一部]", action:"/contracts/contractDetail.html"}, {ltitle:"D", pimg:" ", name:"", phonenum:"", dep:"", action:""}, {ltitle:"", pimg:"/image/4.png", name:"邸学寅", phonenum:"18611735102", dep:"[华北技术二部]", action:"/contracts/contractDetail.html"}, {ltitle:"F", pimg:" ", name:"", phonenum:"", dep:"", action:""}, {ltitle:"", pimg:"/image/5.jpg", name:"范星星", phonenum:"18611735102", dep:"[华北技术二部]", action:"/contracts/contractDetail.html"}, {ltitle:"", pimg:"/image/8.jpg", name:"范鑫鹏", phonenum:"18611735102", dep:"[华北技术二部]", action:"/contracts/contractDetail.html"}, {ltitle:"H", pimg:" ", name:"", phonenum:"", dep:"", action:""}, {ltitle:"", pimg:"/image/6.jpg", name:"黄林", phonenum:"18611735102", dep:"[华北技术二部]", action:"/contracts/contractDetail.html"}, {ltitle:"", pimg:"/image/7.png", name:"胡福来", phonenum:"18611735102", dep:"[通用事业部]", action:"/contracts/contractDetail.html"}, {ltitle:"", pimg:"/image/7.png", name:"郝振明", phonenum:"18611735102", dep:"[华北技术二部]", action:"/contracts/contractDetail.html"}, {ltitle:"", pimg:"/image/9.jpg", name:"郝艳峰", phonenum:"18611735102", dep:"[产品部]", action:"/contracts/contractDetail.html"}, {ltitle:"L", pimg:" ", name:"", phonenum:"", dep:"", action:""}, {ltitle:"", pimg:"/image/5.jpg", name:"刘春力", phonenum:"18611735102", dep:"[华北技术二部]", action:"/contracts/contractDetail.html"}, {ltitle:"", pimg:"/image/6.jpg", name:"刘晶", phonenum:"18611735102", dep:"[华北技术二部]", action:"/contracts/contractDetail.html"}, {ltitle:"S", pimg:" ", name:"", phonenum:"", dep:"", action:""}, {ltitle:"", pimg:"/image/4.png", name:"宋岳辛", phonenum:"18611735102", dep:"[华北技术二部]", action:"/contracts/contractDetail.html"}, {ltitle:"X", pimg:" ", name:"", phonenum:"", dep:"", action:""}, {ltitle:"", pimg:"/image/5.jpg", name:"徐茂贵", phonenum:"18611735102", dep:"[华北技术二部]", action:"/contracts/contractDetail.html"}]; 
$jsd('/bpsplus/src/contracts/contracts.html',230,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); listview.setItems(items); 
$jsd('/bpsplus/src/contracts/contracts.html',231,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); listview.addEvent("onItemClick", function (row, tag, data) { 
$jsd('/bpsplus/src/contracts/contracts.html',232,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); Emp.page.goTo(data.action, {name:data.name}); 
}); 
$jsd('/bpsplus/src/contracts/contracts.html',236,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); var a2zitem = [{a2z:"↑"}, {a2z:"☆"}, {a2z:"A"}, {a2z:"B"}, {a2z:"C"}, {a2z:"D"}, {a2z:"E"}, {a2z:"F"}, {a2z:"G"}, {a2z:"H"}, {a2z:"I"}, {a2z:"J"}, {a2z:"K"}, {a2z:"L"}, {a2z:"M"}, {a2z:"N"}, {a2z:"O"}, {a2z:"P"}, {a2z:"Q"}, {a2z:"R"}, {a2z:"S"}, {a2z:"T"}, {a2z:"U"}, {a2z:"V"}, {a2z:"W"}, {a2z:"X"}, {a2z:"Y"}, {a2z:"Z"}, {a2z:"#"}]; 
$jsd('/bpsplus/src/contracts/contracts.html',325,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); a2zlist.setItems(a2zitem); 
$jsd('/bpsplus/src/contracts/contracts.html',328,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); function refresh(eventype) { 
if($jsd('/bpsplus/src/contracts/contracts.html',329,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);})||true) if (eventype == "pullDown") { 
$jsd('/bpsplus/src/contracts/contracts.html',330,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); listview.resetScroller(); 
$jsd('/bpsplus/src/contracts/contracts.html',331,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); alert("没有更新"); 
} 
} 
$jsd('/bpsplus/src/contracts/contracts.html',335,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); function openSession() { 
$jsd('/bpsplus/src/contracts/contracts.html',336,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); Emp.page.goTo("/message/session.html"); 
} 
$jsd('/bpsplus/src/contracts/contracts.html',339,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); function searchList() { 
$jsd('/bpsplus/src/contracts/contracts.html',340,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); alert("查找联系人"); 
} 
 
Emp.page.render();
