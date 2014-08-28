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
Emp.page.setId('_BODY_20801759');
var _div_11540344 = new Emp.Panel({"id":"_div_11540344","height":"100%","layout":"VBox","width":"100%"});
var _div_13950253 = new Emp.Panel({"id":"_div_13950253","height":"50","backgroundColor":"#2A6E91","layout":"HBox","width":"100%"});
var _div_17087734 = new Emp.Panel({"id":"_div_17087734","height":"100%","vAlign":"middle","hAlign":"left","width":"6"});
_div_13950253.add(_div_17087734);
var _div_1169336 = new Emp.Panel({"id":"_div_1169336","height":"100%","vAlign":"middle","hAlign":"left","width":"100"});
var _img_23700834 = new Emp.Image({"id":"_img_23700834","height":"30","tag":"timg","width":"30","src":"/image/back.png"});
_img_23700834.addEvent('onClick',goBack);
_div_1169336.add(_img_23700834);
var _label_15258628 = new Emp.Label({"id":"_label_15258628","color":"#DDDDDD","tag":"title","value":"曹立磊","fontSize":"18"});
_label_15258628.addEvent('onClick',goBack);
_div_1169336.add(_label_15258628);
_div_13950253.add(_div_1169336);
var _div_28791834 = new Emp.Panel({"id":"_div_28791834","height":"100%","vAlign":"middle","hAlign":"right","width":"100%"});
var _img_15890653 = new Emp.Image({"id":"_img_15890653","height":"30","tag":"timg","width":"30","src":"/image/dail.png"});
_img_15890653.addEvent('onClick',function(){alert('免费通话，正常通话两种方式')});
_div_28791834.add(_img_15890653);
var _label_14496563 = new Emp.Label({"id":"_label_14496563","value":"    "});
_div_28791834.add(_label_14496563);
var _img_5019196 = new Emp.Image({"id":"_img_5019196","height":"30","tag":"timg","width":"30","src":"/image/config.png"});
_img_5019196.addEvent('onClick',goBack);
_div_28791834.add(_img_5019196);
_div_13950253.add(_div_28791834);
var _div_1791991 = new Emp.Panel({"id":"_div_1791991","height":"100%","vAlign":"middle","hAlign":"left","width":"8"});
_div_13950253.add(_div_1791991);
_div_11540344.add(_div_13950253);
var _div_19669347 = new Emp.Panel({"id":"_div_19669347","height":"100%","backgroundColor":"#DDDDDD","overflow":"y","layout":"VBox","width":"100%"});
var _div_4466087 = new Emp.Panel({"id":"_div_4466087","height":"55","layout":"VBox","width":"100%"});
var _div_271152 = new Emp.Panel({"id":"_div_271152","height":"15","vAlign":"middle","hAlign":"left","width":"100%"});
_div_4466087.add(_div_271152);
var _div_27405972 = new Emp.Panel({"id":"_div_27405972","height":"40","vAlign":"middle","layout":"HBox","hAlign":"left","width":"100%"});
var _div_10486968 = new Emp.Panel({"id":"_div_10486968","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
_div_27405972.add(_div_10486968);
var _div_26601221 = new Emp.Panel({"id":"_div_26601221","height":"100%","vAlign":"middle","hAlign":"left","width":"40"});
var _img_7484818 = new Emp.Image({"id":"_img_7484818","height":"40","tag":"timg","width":"40","src":"/image/1.jpg"});
_div_26601221.add(_img_7484818);
_div_27405972.add(_div_26601221);
var _div_1779545 = new Emp.Panel({"id":"_div_1779545","height":"100%","vAlign":"top","hAlign":"left","width":"10"});
var _label_11818906 = new Emp.Label({"id":"_label_11818906","color":"#FF0000","tag":"new","fontSize":"15"});
_div_1779545.add(_label_11818906);
_div_27405972.add(_div_1779545);
var _div_31678629 = new Emp.Panel({"id":"_div_31678629","height":"100%","backgroundColor":"#FFFFFF","vAlign":"middle","hAlign":"right","width":"5"});
var _label_14561851 = new Emp.Label({"id":"_label_14561851","color":"#bbbbbb","tag":"ldate","fontSize":"14"});
_div_31678629.add(_label_14561851);
_div_27405972.add(_div_31678629);
var _div_28562547 = new Emp.Panel({"id":"_div_28562547","height":"100%","backgroundColor":"#FFFFFF","vAlign":"middle","hAlign":"left","width":"220"});
var _label_21025824 = new Emp.Label({"id":"_label_21025824","color":"#000000","tag":"name","value":"一堆东西啊真头疼。","fontSize":"16"});
_div_28562547.add(_label_21025824);
_div_27405972.add(_div_28562547);
_div_4466087.add(_div_27405972);
_div_19669347.add(_div_4466087);
var _div_19301003 = new Emp.Panel({"id":"_div_19301003","height":"55","layout":"VBox","width":"100%"});
var _div_21266054 = new Emp.Panel({"id":"_div_21266054","height":"15","width":"100%"});
_div_19301003.add(_div_21266054);
var _div_30316875 = new Emp.Panel({"id":"_div_30316875","height":"40","vAlign":"middle","layout":"HBox","hAlign":"right","width":"100%"});
var _div_11683673 = new Emp.Panel({"id":"_div_11683673","height":"100%","backgroundColor":"#0077ec","vAlign":"middle","hAlign":"left","width":"5"});
var _label_6966380 = new Emp.Label({"id":"_label_6966380","color":"#bbbbbb","tag":"ldate","fontSize":"14"});
_div_11683673.add(_label_6966380);
_div_30316875.add(_div_11683673);
var _div_12538880 = new Emp.Panel({"id":"_div_12538880","height":"100%","backgroundColor":"#0077ec","vAlign":"middle","hAlign":"left","width":"220"});
var _label_19130651 = new Emp.Label({"id":"_label_19130651","color":"#FFFFFF","tag":"name","value":"快点来吧","fontSize":"16"});
_div_12538880.add(_label_19130651);
_div_30316875.add(_div_12538880);
var _div_10287234 = new Emp.Panel({"id":"_div_10287234","height":"100%","vAlign":"top","hAlign":"left","width":"10"});
var _label_25108779 = new Emp.Label({"id":"_label_25108779","color":"#FF0000","tag":"new","fontSize":"15"});
_div_10287234.add(_label_25108779);
_div_30316875.add(_div_10287234);
var _div_22724097 = new Emp.Panel({"id":"_div_22724097","height":"100%","vAlign":"middle","hAlign":"left","width":"40"});
var _img_7362361 = new Emp.Image({"id":"_img_7362361","height":"40","tag":"timg","width":"40","src":"/image/2.jpg"});
_div_22724097.add(_img_7362361);
_div_30316875.add(_div_22724097);
var _div_24020054 = new Emp.Panel({"id":"_div_24020054","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
_div_30316875.add(_div_24020054);
_div_19301003.add(_div_30316875);
_div_19669347.add(_div_19301003);
var _div_11685565 = new Emp.Panel({"id":"_div_11685565","height":"55","layout":"VBox","width":"100%"});
var _div_5205802 = new Emp.Panel({"id":"_div_5205802","height":"15","vAlign":"middle","hAlign":"left","width":"100%"});
_div_11685565.add(_div_5205802);
var _div_17520797 = new Emp.Panel({"id":"_div_17520797","height":"40","vAlign":"middle","layout":"HBox","hAlign":"left","width":"100%"});
var _div_31906596 = new Emp.Panel({"id":"_div_31906596","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
_div_17520797.add(_div_31906596);
var _div_20783793 = new Emp.Panel({"id":"_div_20783793","height":"100%","vAlign":"middle","hAlign":"left","width":"40"});
var _img_11575144 = new Emp.Image({"id":"_img_11575144","height":"40","tag":"timg","width":"40","src":"/image/1.jpg"});
_div_20783793.add(_img_11575144);
_div_17520797.add(_div_20783793);
var _div_28419276 = new Emp.Panel({"id":"_div_28419276","height":"100%","vAlign":"top","hAlign":"left","width":"10"});
var _label_28992906 = new Emp.Label({"id":"_label_28992906","color":"#FF0000","tag":"new","fontSize":"15"});
_div_28419276.add(_label_28992906);
_div_17520797.add(_div_28419276);
var _div_6316955 = new Emp.Panel({"id":"_div_6316955","height":"100%","backgroundColor":"#FFFFFF","vAlign":"middle","hAlign":"right","width":"5"});
var _label_2845926 = new Emp.Label({"id":"_label_2845926","color":"#bbbbbb","tag":"ldate","fontSize":"14"});
_div_6316955.add(_label_2845926);
_div_17520797.add(_div_6316955);
var _div_16420319 = new Emp.Panel({"id":"_div_16420319","height":"100%","backgroundColor":"#FFFFFF","vAlign":"middle","hAlign":"left","width":"220"});
var _label_24668550 = new Emp.Label({"id":"_label_24668550","color":"#000000","tag":"name","value":"我还真不着急","fontSize":"16"});
_div_16420319.add(_label_24668550);
_div_17520797.add(_div_16420319);
_div_11685565.add(_div_17520797);
_div_19669347.add(_div_11685565);
var _div_5759301 = new Emp.Panel({"id":"_div_5759301","height":"55","layout":"VBox","width":"100%"});
var _div_25598467 = new Emp.Panel({"id":"_div_25598467","height":"15","width":"100%"});
_div_5759301.add(_div_25598467);
var _div_32071851 = new Emp.Panel({"id":"_div_32071851","height":"40","vAlign":"middle","layout":"HBox","hAlign":"right","width":"100%"});
var _div_13208824 = new Emp.Panel({"id":"_div_13208824","height":"100%","backgroundColor":"#0077ec","vAlign":"middle","hAlign":"left","width":"5"});
var _label_4588999 = new Emp.Label({"id":"_label_4588999","color":"#bbbbbb","tag":"ldate","fontSize":"14"});
_div_13208824.add(_label_4588999);
_div_32071851.add(_div_13208824);
var _div_19228058 = new Emp.Panel({"id":"_div_19228058","height":"100%","backgroundColor":"#0077ec","vAlign":"middle","hAlign":"left","width":"220"});
var _label_3238727 = new Emp.Label({"id":"_label_3238727","color":"#FFFFFF","tag":"name","value":"你不来就没吃的了","fontSize":"16"});
_div_19228058.add(_label_3238727);
_div_32071851.add(_div_19228058);
var _div_8012292 = new Emp.Panel({"id":"_div_8012292","height":"100%","vAlign":"top","hAlign":"left","width":"10"});
var _label_8658191 = new Emp.Label({"id":"_label_8658191","color":"#FF0000","tag":"new","fontSize":"15"});
_div_8012292.add(_label_8658191);
_div_32071851.add(_div_8012292);
var _div_26208769 = new Emp.Panel({"id":"_div_26208769","height":"100%","vAlign":"middle","hAlign":"left","width":"40"});
var _img_21756913 = new Emp.Image({"id":"_img_21756913","height":"40","tag":"timg","width":"40","src":"/image/2.jpg"});
_div_26208769.add(_img_21756913);
_div_32071851.add(_div_26208769);
var _div_25803012 = new Emp.Panel({"id":"_div_25803012","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
_div_32071851.add(_div_25803012);
_div_5759301.add(_div_32071851);
_div_19669347.add(_div_5759301);
var _div_13745030 = new Emp.Panel({"id":"_div_13745030","height":"55","layout":"VBox","width":"100%"});
var _div_24025973 = new Emp.Panel({"id":"_div_24025973","height":"15","width":"100%"});
_div_13745030.add(_div_24025973);
var _div_10509730 = new Emp.Panel({"id":"_div_10509730","height":"40","vAlign":"middle","layout":"HBox","hAlign":"right","width":"100%"});
var _div_6505558 = new Emp.Panel({"id":"_div_6505558","height":"100%","backgroundColor":"#0077ec","vAlign":"middle","hAlign":"left","width":"5"});
var _label_18576789 = new Emp.Label({"id":"_label_18576789","color":"#bbbbbb","tag":"ldate","fontSize":"14"});
_div_6505558.add(_label_18576789);
_div_10509730.add(_div_6505558);
var _div_29667782 = new Emp.Panel({"id":"_div_29667782","height":"100%","backgroundColor":"#0077ec","vAlign":"middle","hAlign":"left","width":"220"});
var _label_7555149 = new Emp.Label({"id":"_label_7555149","color":"#FFFFFF","tag":"name","value":"我们点了很多好吃的。","fontSize":"16"});
_div_29667782.add(_label_7555149);
_div_10509730.add(_div_29667782);
var _div_9429906 = new Emp.Panel({"id":"_div_9429906","height":"100%","vAlign":"top","hAlign":"left","width":"10"});
var _label_10853394 = new Emp.Label({"id":"_label_10853394","color":"#FF0000","tag":"new","fontSize":"15"});
_div_9429906.add(_label_10853394);
_div_10509730.add(_div_9429906);
var _div_11110670 = new Emp.Panel({"id":"_div_11110670","height":"100%","vAlign":"middle","hAlign":"left","width":"40"});
var _img_6618272 = new Emp.Image({"id":"_img_6618272","height":"40","tag":"timg","width":"40","src":"/image/2.jpg"});
_div_11110670.add(_img_6618272);
_div_10509730.add(_div_11110670);
var _div_365717 = new Emp.Panel({"id":"_div_365717","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
_div_10509730.add(_div_365717);
_div_13745030.add(_div_10509730);
_div_19669347.add(_div_13745030);
var _div_6154019 = new Emp.Panel({"id":"_div_6154019","height":"55","layout":"VBox","width":"100%"});
var _div_15851350 = new Emp.Panel({"id":"_div_15851350","height":"15","vAlign":"middle","hAlign":"left","width":"100%"});
_div_6154019.add(_div_15851350);
var _div_25007865 = new Emp.Panel({"id":"_div_25007865","height":"40","vAlign":"middle","layout":"HBox","hAlign":"left","width":"100%"});
var _div_4375170 = new Emp.Panel({"id":"_div_4375170","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
_div_25007865.add(_div_4375170);
var _div_15722237 = new Emp.Panel({"id":"_div_15722237","height":"100%","vAlign":"middle","hAlign":"left","width":"40"});
var _img_2492997 = new Emp.Image({"id":"_img_2492997","height":"40","tag":"timg","width":"40","src":"/image/1.jpg"});
_div_15722237.add(_img_2492997);
_div_25007865.add(_div_15722237);
var _div_23881542 = new Emp.Panel({"id":"_div_23881542","height":"100%","vAlign":"top","hAlign":"left","width":"10"});
var _label_32524357 = new Emp.Label({"id":"_label_32524357","color":"#FF0000","tag":"new","fontSize":"15"});
_div_23881542.add(_label_32524357);
_div_25007865.add(_div_23881542);
var _div_1626883 = new Emp.Panel({"id":"_div_1626883","height":"100%","backgroundColor":"#FFFFFF","vAlign":"middle","hAlign":"right","width":"5"});
var _label_29720197 = new Emp.Label({"id":"_label_29720197","color":"#bbbbbb","tag":"ldate","fontSize":"14"});
_div_1626883.add(_label_29720197);
_div_25007865.add(_div_1626883);
var _div_16091690 = new Emp.Panel({"id":"_div_16091690","height":"100%","backgroundColor":"#FFFFFF","vAlign":"middle","hAlign":"left","width":"220"});
var _label_4327792 = new Emp.Label({"id":"_label_4327792","color":"#000000","tag":"name","value":"等会儿还有一个东西没提交","fontSize":"16"});
_div_16091690.add(_label_4327792);
_div_25007865.add(_div_16091690);
_div_6154019.add(_div_25007865);
_div_19669347.add(_div_6154019);
var _div_24754437 = new Emp.Panel({"id":"_div_24754437","height":"55","layout":"VBox","width":"100%"});
var _div_6426524 = new Emp.Panel({"id":"_div_6426524","height":"15","vAlign":"middle","hAlign":"left","width":"100%"});
_div_24754437.add(_div_6426524);
var _div_32439347 = new Emp.Panel({"id":"_div_32439347","height":"40","vAlign":"middle","layout":"HBox","hAlign":"left","width":"100%"});
var _div_15703075 = new Emp.Panel({"id":"_div_15703075","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
_div_32439347.add(_div_15703075);
var _div_15983947 = new Emp.Panel({"id":"_div_15983947","height":"100%","vAlign":"middle","hAlign":"left","width":"40"});
var _img_5415549 = new Emp.Image({"id":"_img_5415549","height":"40","tag":"timg","width":"40","src":"/image/1.jpg"});
_div_15983947.add(_img_5415549);
_div_32439347.add(_div_15983947);
var _div_19527995 = new Emp.Panel({"id":"_div_19527995","height":"100%","vAlign":"top","hAlign":"left","width":"10"});
var _label_11118240 = new Emp.Label({"id":"_label_11118240","color":"#FF0000","tag":"new","fontSize":"15"});
_div_19527995.add(_label_11118240);
_div_32439347.add(_div_19527995);
var _div_33192895 = new Emp.Panel({"id":"_div_33192895","height":"100%","backgroundColor":"#FFFFFF","vAlign":"middle","hAlign":"right","width":"5"});
var _label_30560827 = new Emp.Label({"id":"_label_30560827","color":"#bbbbbb","tag":"ldate","fontSize":"14"});
_div_33192895.add(_label_30560827);
_div_32439347.add(_div_33192895);
var _div_18135569 = new Emp.Panel({"id":"_div_18135569","height":"100%","backgroundColor":"#FFFFFF","vAlign":"middle","hAlign":"left","width":"220"});
var _label_29609296 = new Emp.Label({"id":"_label_29609296","color":"#000000","tag":"name","value":"老大催得紧，我也没办法。","fontSize":"16"});
_div_18135569.add(_label_29609296);
_div_32439347.add(_div_18135569);
_div_24754437.add(_div_32439347);
_div_19669347.add(_div_24754437);
var _div_31224411 = new Emp.Panel({"id":"_div_31224411","height":"55","layout":"VBox","width":"100%"});
var _div_30923589 = new Emp.Panel({"id":"_div_30923589","height":"15","vAlign":"middle","hAlign":"left","width":"100%"});
_div_31224411.add(_div_30923589);
var _div_8178548 = new Emp.Panel({"id":"_div_8178548","height":"40","vAlign":"middle","layout":"HBox","hAlign":"left","width":"100%"});
var _div_17908868 = new Emp.Panel({"id":"_div_17908868","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
_div_8178548.add(_div_17908868);
var _div_11089838 = new Emp.Panel({"id":"_div_11089838","height":"100%","vAlign":"middle","hAlign":"left","width":"40"});
var _img_25604892 = new Emp.Image({"id":"_img_25604892","height":"40","tag":"timg","width":"40","src":"/image/1.jpg"});
_div_11089838.add(_img_25604892);
_div_8178548.add(_div_11089838);
var _div_5840411 = new Emp.Panel({"id":"_div_5840411","height":"100%","vAlign":"top","hAlign":"left","width":"10"});
var _label_13080425 = new Emp.Label({"id":"_label_13080425","color":"#FF0000","tag":"new","fontSize":"15"});
_div_5840411.add(_label_13080425);
_div_8178548.add(_div_5840411);
var _div_27624560 = new Emp.Panel({"id":"_div_27624560","height":"100%","backgroundColor":"#FFFFFF","vAlign":"middle","hAlign":"right","width":"5"});
var _label_26861610 = new Emp.Label({"id":"_label_26861610","color":"#bbbbbb","tag":"ldate","fontSize":"14"});
_div_27624560.add(_label_26861610);
_div_8178548.add(_div_27624560);
var _div_21756079 = new Emp.Panel({"id":"_div_21756079","height":"100%","backgroundColor":"#FFFFFF","vAlign":"middle","hAlign":"left","width":"220"});
var _label_11777570 = new Emp.Label({"id":"_label_11777570","color":"#000000","tag":"name","value":"谁来帮帮我写点东西啊！","fontSize":"16"});
_div_21756079.add(_label_11777570);
_div_8178548.add(_div_21756079);
_div_31224411.add(_div_8178548);
_div_19669347.add(_div_31224411);
var _div_8034430 = new Emp.Panel({"id":"_div_8034430","height":"55","layout":"VBox","width":"100%"});
var _div_11642784 = new Emp.Panel({"id":"_div_11642784","height":"15","width":"100%"});
_div_8034430.add(_div_11642784);
var _div_24393018 = new Emp.Panel({"id":"_div_24393018","height":"40","vAlign":"middle","layout":"HBox","hAlign":"right","width":"100%"});
var _div_5411156 = new Emp.Panel({"id":"_div_5411156","height":"100%","backgroundColor":"#0077ec","vAlign":"middle","hAlign":"left","width":"5"});
var _label_12797930 = new Emp.Label({"id":"_label_12797930","color":"#bbbbbb","tag":"ldate","fontSize":"14"});
_div_5411156.add(_label_12797930);
_div_24393018.add(_div_5411156);
var _div_10915458 = new Emp.Panel({"id":"_div_10915458","height":"100%","backgroundColor":"#0077ec","vAlign":"middle","hAlign":"left","width":"220"});
var _label_14037916 = new Emp.Label({"id":"_label_14037916","color":"#FFFFFF","tag":"name","value":"抓紧时间，工作干不完的。","fontSize":"16"});
_div_10915458.add(_label_14037916);
_div_24393018.add(_div_10915458);
var _div_14045555 = new Emp.Panel({"id":"_div_14045555","height":"100%","vAlign":"top","hAlign":"left","width":"10"});
var _label_8229894 = new Emp.Label({"id":"_label_8229894","color":"#FF0000","tag":"new","fontSize":"15"});
_div_14045555.add(_label_8229894);
_div_24393018.add(_div_14045555);
var _div_8461394 = new Emp.Panel({"id":"_div_8461394","height":"100%","vAlign":"middle","hAlign":"left","width":"40"});
var _img_6967258 = new Emp.Image({"id":"_img_6967258","height":"40","tag":"timg","width":"40","src":"/image/2.jpg"});
_div_8461394.add(_img_6967258);
_div_24393018.add(_div_8461394);
var _div_27303042 = new Emp.Panel({"id":"_div_27303042","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
_div_24393018.add(_div_27303042);
_div_8034430.add(_div_24393018);
_div_19669347.add(_div_8034430);
var _div_25371345 = new Emp.Panel({"id":"_div_25371345","height":"55","layout":"VBox","width":"100%"});
var _div_6489514 = new Emp.Panel({"id":"_div_6489514","height":"15","vAlign":"middle","hAlign":"left","width":"100%"});
_div_25371345.add(_div_6489514);
var _div_17359949 = new Emp.Panel({"id":"_div_17359949","height":"40","vAlign":"middle","layout":"HBox","hAlign":"left","width":"100%"});
var _div_12887768 = new Emp.Panel({"id":"_div_12887768","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
_div_17359949.add(_div_12887768);
var _div_10865932 = new Emp.Panel({"id":"_div_10865932","height":"100%","vAlign":"middle","hAlign":"left","width":"40"});
var _img_20509193 = new Emp.Image({"id":"_img_20509193","height":"40","tag":"timg","width":"40","src":"/image/1.jpg"});
_div_10865932.add(_img_20509193);
_div_17359949.add(_div_10865932);
var _div_26894012 = new Emp.Panel({"id":"_div_26894012","height":"100%","vAlign":"top","hAlign":"left","width":"10"});
var _label_29473459 = new Emp.Label({"id":"_label_29473459","color":"#FF0000","tag":"new","fontSize":"15"});
_div_26894012.add(_label_29473459);
_div_17359949.add(_div_26894012);
var _div_29912539 = new Emp.Panel({"id":"_div_29912539","height":"100%","backgroundColor":"#FFFFFF","vAlign":"middle","hAlign":"right","width":"5"});
var _label_27554537 = new Emp.Label({"id":"_label_27554537","color":"#bbbbbb","tag":"ldate","fontSize":"14"});
_div_29912539.add(_label_27554537);
_div_17359949.add(_div_29912539);
var _div_24402773 = new Emp.Panel({"id":"_div_24402773","height":"100%","backgroundColor":"#FFFFFF","vAlign":"middle","hAlign":"left","width":"220"});
var _label_1600210 = new Emp.Label({"id":"_label_1600210","color":"#000000","tag":"name","value":"要不你来写？","fontSize":"16"});
_div_24402773.add(_label_1600210);
_div_17359949.add(_div_24402773);
_div_25371345.add(_div_17359949);
_div_19669347.add(_div_25371345);
var _div_17635753 = new Emp.Panel({"id":"_div_17635753","height":"55","layout":"VBox","width":"100%"});
var _div_17805316 = new Emp.Panel({"id":"_div_17805316","height":"15","width":"100%"});
_div_17635753.add(_div_17805316);
var _div_15529978 = new Emp.Panel({"id":"_div_15529978","height":"40","vAlign":"middle","layout":"HBox","hAlign":"right","width":"100%"});
var _div_25982452 = new Emp.Panel({"id":"_div_25982452","height":"100%","backgroundColor":"#0077ec","vAlign":"middle","hAlign":"left","width":"5"});
var _label_9700272 = new Emp.Label({"id":"_label_9700272","color":"#bbbbbb","tag":"ldate","fontSize":"14"});
_div_25982452.add(_label_9700272);
_div_15529978.add(_div_25982452);
var _div_25047751 = new Emp.Panel({"id":"_div_25047751","height":"100%","backgroundColor":"#0077ec","vAlign":"middle","hAlign":"left","width":"220"});
var _label_3659986 = new Emp.Label({"id":"_label_3659986","color":"#FFFFFF","tag":"name","value":"你先忙，我先去。","fontSize":"16"});
_div_25047751.add(_label_3659986);
_div_15529978.add(_div_25047751);
var _div_8115601 = new Emp.Panel({"id":"_div_8115601","height":"100%","vAlign":"top","hAlign":"left","width":"10"});
var _label_150232 = new Emp.Label({"id":"_label_150232","color":"#FF0000","tag":"new","fontSize":"15"});
_div_8115601.add(_label_150232);
_div_15529978.add(_div_8115601);
var _div_8371552 = new Emp.Panel({"id":"_div_8371552","height":"100%","vAlign":"middle","hAlign":"left","width":"40"});
var _img_6943517 = new Emp.Image({"id":"_img_6943517","height":"40","tag":"timg","width":"40","src":"/image/2.jpg"});
_div_8371552.add(_img_6943517);
_div_15529978.add(_div_8371552);
var _div_30930209 = new Emp.Panel({"id":"_div_30930209","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
_div_15529978.add(_div_30930209);
_div_17635753.add(_div_15529978);
_div_19669347.add(_div_17635753);
_div_11540344.add(_div_19669347);
var _div_18767875 = new Emp.Panel({"id":"_div_18767875","height":"0.5","backgroundColor":"#999999","width":"100%"});
_div_11540344.add(_div_18767875);
var _div_20028915 = new Emp.Panel({"id":"_div_20028915","height":"50","backgroundColor":"#FFFFFF","layout":"HBox","width":"100%"});
var _div_7919302 = new Emp.Panel({"id":"_div_7919302","height":"100%","vAlign":"middle","hAlign":"left","width":"6"});
_div_20028915.add(_div_7919302);
var _div_22848008 = new Emp.Panel({"id":"_div_22848008","height":"100%","vAlign":"middle","hAlign":"left","width":"30"});
var _img_9556866 = new Emp.Image({"id":"_img_9556866","height":"30","tag":"timg","width":"30","src":"/image/sound.png"});
_div_22848008.add(_img_9556866);
_div_20028915.add(_div_22848008);
var _div_30749303 = new Emp.Panel({"id":"_div_30749303","height":"100%","vAlign":"middle","hAlign":"right","width":"100%"});
var _input_31729842 = new Emp.Text({"id":"_input_31729842","height":"40","width":"100%","value":""});
_div_30749303.add(_input_31729842);
var _input_2878521 = new Emp.Label({"id":"_input_2878521","height":"40","width":"5","value":" "});
_div_30749303.add(_input_2878521);
_div_20028915.add(_div_30749303);
var _div_27368321 = new Emp.Panel({"id":"_div_27368321","height":"100%","vAlign":"middle","hAlign":"right","width":"30"});
var _img_15217405 = new Emp.Image({"id":"_img_15217405","height":"30","tag":"timg","width":"30","src":"/image/reply.png"});
_div_27368321.add(_img_15217405);
_div_20028915.add(_div_27368321);
var _div_7048401 = new Emp.Panel({"id":"_div_7048401","height":"100%","vAlign":"middle","hAlign":"left","width":"8"});
_div_20028915.add(_div_7048401);
_div_11540344.add(_div_20028915);
Emp.page.add(_div_11540344);



$jsd('/bpsplus/src/message/session.html',266,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);});function goBack() { 
$jsd('/bpsplus/src/message/session.html',267,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); Emp.page.goBack(); 
} 
 
Emp.page.render();
