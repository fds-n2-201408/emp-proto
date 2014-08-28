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
Emp.page.setId('_BODY_10693301');
var _div_4780602 = new Emp.Panel({"id":"_div_4780602","height":"50","backgroundColor":"#2A6E91","layout":"HBox","width":"100%"});
var _div_18270794 = new Emp.Panel({"id":"_div_18270794","height":"100%","vAlign":"middle","hAlign":"left","width":"6"});
_div_4780602.add(_div_18270794);
var _div_20639749 = new Emp.Panel({"id":"_div_20639749","height":"100%","vAlign":"middle","hAlign":"left","width":"300"});
var _img_6543851 = new Emp.Image({"id":"_img_6543851","height":"30","tag":"timg","width":"30","src":"/image/back.png"});
_img_6543851.addEvent('onClick',goBack);
_div_20639749.add(_img_6543851);
var _label_24632507 = new Emp.Label({"id":"_label_24632507","color":"#DDDDDD","tag":"title","value":"贷款申请","fontSize":"18"});
_label_24632507.addEvent('onClick',goBack);
_div_20639749.add(_label_24632507);
_div_4780602.add(_div_20639749);
var _div_3974880 = new Emp.Panel({"id":"_div_3974880","height":"100%","vAlign":"middle","hAlign":"right","width":"100%"});
var _img_32498490 = new Emp.Image({"id":"_img_32498490","height":"30","tag":"timg","width":"30","src":"/image/config.png"});
_img_32498490.addEvent('onClick',goBack);
_div_3974880.add(_img_32498490);
_div_4780602.add(_div_3974880);
var _div_3081790 = new Emp.Panel({"id":"_div_3081790","height":"100%","vAlign":"middle","hAlign":"left","width":"8"});
_div_4780602.add(_div_3081790);
Emp.page.add(_div_4780602);
var _div_21157553 = new Emp.Panel({"id":"_div_21157553","height":"60","layout":"VBox","width":"100%"});
var _div_18690400 = new Emp.Panel({"id":"_div_18690400","height":"100%","vAlign":"middle","layout":"HBox","hAlign":"left","width":"100%"});
var _div_26522347 = new Emp.Panel({"id":"_div_26522347","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
_div_18690400.add(_div_26522347);
var _div_24017063 = new Emp.Panel({"id":"_div_24017063","height":"100%","vAlign":"middle","hAlign":"left","width":"40"});
var _img_28521540 = new Emp.Image({"id":"_img_28521540","height":"40","width":"40","src":"/flow/progress1.png"});
_div_24017063.add(_img_28521540);
_div_18690400.add(_div_24017063);
var _div_2923733 = new Emp.Panel({"id":"_div_2923733","height":"100%","vAlign":"top","hAlign":"left","width":"15"});
var _label_15492105 = new Emp.Label({"id":"_label_15492105","color":"#FF0000","tag":"new","fontSize":"15"});
_div_2923733.add(_label_15492105);
_div_18690400.add(_div_2923733);
var _div_26985674 = new Emp.Panel({"id":"_div_26985674","height":"60","layout":"VBox","width":"100%"});
var _div_26526257 = new Emp.Panel({"id":"_div_26526257","height":"30","layout":"HBox","width":"100%"});
var _div_22621468 = new Emp.Panel({"id":"_div_22621468","height":"100%","vAlign":"bottom","hAlign":"left","width":"100%"});
var _label_27306959 = new Emp.Label({"id":"_label_27306959","color":"#000000","tag":"name","value":"完成7步，剩余2步，预计1天内完成。","fontSize":"16"});
_div_22621468.add(_label_27306959);
_div_26526257.add(_div_22621468);
_div_26985674.add(_div_26526257);
var _div_24096026 = new Emp.Panel({"id":"_div_24096026","height":"100%","vAlign":"middle","hAlign":"left","width":"100%"});
var _label_13472513 = new Emp.Label({"id":"_label_13472513","color":"#bbbbbb","tag":"lmessage","value":"徐茂贵，刘春力，邸学寅等人通过审批。","fontSize":"15"});
_div_24096026.add(_label_13472513);
_div_26985674.add(_div_24096026);
_div_18690400.add(_div_26985674);
_div_21157553.add(_div_18690400);
var _div_7233929 = new Emp.Panel({"id":"_div_7233929","height":"2","backgroundColor":"#CCCCCC","width":"100%"});
_div_21157553.add(_div_7233929);
Emp.page.add(_div_21157553);
var _div_12940512 = new Emp.Panel({"id":"_div_12940512","height":"100%","layout":"VBox","width":"100%"});
var listview = new Emp.ListView({"id":"listview","height":"100%","width":"100%","enablePullDown":"true"});
listview.addEvent('onLoadMore',refresh);
var _template_16429665 = new Emp.Panel({"id":"_template_16429665"});
_template_16429665.__isTemplate=true;
var _div_13970147 = new Emp.Panel({"id":"_div_13970147","height":"60","layout":"VBox","width":"100%"});
var _div_15913164 = new Emp.Panel({"id":"_div_15913164","height":"100%","vAlign":"middle","layout":"HBox","hAlign":"left","width":"100%"});
var _div_23737825 = new Emp.Panel({"id":"_div_23737825","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
_div_15913164.add(_div_23737825);
var _div_32993154 = new Emp.Panel({"id":"_div_32993154","height":"100%","vAlign":"middle","hAlign":"left","width":"40"});
var _img_28959664 = new Emp.Image({"id":"_img_28959664","height":"40","tag":"timg","width":"40"});
_div_32993154.add(_img_28959664);
_div_15913164.add(_div_32993154);
var _div_18052408 = new Emp.Panel({"id":"_div_18052408","height":"100%","vAlign":"top","hAlign":"left","width":"15"});
var _label_7657232 = new Emp.Label({"id":"_label_7657232","color":"#FF0000","tag":"new","fontSize":"15"});
_div_18052408.add(_label_7657232);
_div_15913164.add(_div_18052408);
var _div_13858916 = new Emp.Panel({"id":"_div_13858916","height":"60","layout":"VBox","width":"100%"});
var _div_25505352 = new Emp.Panel({"id":"_div_25505352","height":"30","layout":"HBox","width":"100%"});
var _div_10596644 = new Emp.Panel({"id":"_div_10596644","height":"100%","vAlign":"bottom","hAlign":"left","width":"100%"});
var _label_24433833 = new Emp.Label({"id":"_label_24433833","color":"#000000","tag":"name","fontSize":"16"});
_div_10596644.add(_label_24433833);
_div_25505352.add(_div_10596644);
var _div_20293131 = new Emp.Panel({"id":"_div_20293131","height":"100%","vAlign":"middle","hAlign":"right","width":"100"});
var _label_19413380 = new Emp.Label({"id":"_label_19413380","color":"#bbbbbb","tag":"ldate","fontSize":"14"});
_div_20293131.add(_label_19413380);
_div_25505352.add(_div_20293131);
_div_13858916.add(_div_25505352);
var _div_30950182 = new Emp.Panel({"id":"_div_30950182","height":"100%","vAlign":"middle","hAlign":"left","width":"100%"});
var _label_18905040 = new Emp.Label({"id":"_label_18905040","color":"#bbbbbb","tag":"lmessage","fontSize":"15"});
_div_30950182.add(_label_18905040);
var _label_10091607 = new Emp.Label({"id":"_label_10091607","color":"#FF0000","tag":"call","hAlign":"right","fontSize":"15"});
_div_30950182.add(_label_10091607);
_div_13858916.add(_div_30950182);
_div_15913164.add(_div_13858916);
_div_13970147.add(_div_15913164);
var _div_25552730 = new Emp.Panel({"id":"_div_25552730","height":"0.5","backgroundColor":"#AAAAAA","width":"100%"});
_div_13970147.add(_div_25552730);
_template_16429665.add(_div_13970147);
listview.setTemplate(_template_16429665,"_template_16429665");
_div_12940512.add(listview);
var _div_1565495 = new Emp.Panel({"id":"_div_1565495","height":"0.5","backgroundColor":"#999999","width":"100%"});
_div_12940512.add(_div_1565495);
Emp.page.add(_div_12940512);






Emp.page.render();
