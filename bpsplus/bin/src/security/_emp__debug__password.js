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
Emp.page.setId('_BODY_19163548');
var _div_26327230 = new Emp.Panel({"id":"_div_26327230","height":"100%","backgroundColor":"#000000","layout":"VBox","width":"100%"});
var _div_33029170 = new Emp.Panel({"id":"_div_33029170","height":"60","width":"100%"});
_div_26327230.add(_div_33029170);
var _div_30294498 = new Emp.Panel({"id":"_div_30294498","height":"40","hAlign":"center","width":"100%"});
var _input_4686671 = new Emp.Label({"id":"_input_4686671","color":"#FFFFFF","value":"输入密码","fontSize":"24"});
_div_30294498.add(_input_4686671);
_div_26327230.add(_div_30294498);
var _div_16638396 = new Emp.Panel({"id":"_div_16638396","height":"40","layout":"HBox","hAlign":"center","width":"100%"});
var mask1 = new Emp.Label({"id":"mask1","color":"#FFFFFF","value":"○  ","fontSize":"24"});
_div_16638396.add(mask1);
var mask2 = new Emp.Label({"id":"mask2","color":"#FFFFFF","value":"○  ","fontSize":"24"});
_div_16638396.add(mask2);
var mask3 = new Emp.Label({"id":"mask3","color":"#FFFFFF","value":"○  ","fontSize":"24"});
_div_16638396.add(mask3);
var mask4 = new Emp.Label({"id":"mask4","color":"#FFFFFF","value":"○  ","fontSize":"24"});
_div_16638396.add(mask4);
_div_26327230.add(_div_16638396);
var _div_26077293 = new Emp.Panel({"id":"_div_26077293","height":"40","width":"100%"});
_div_26327230.add(_div_26077293);
var _div_26642797 = new Emp.Panel({"id":"_div_26642797","height":"420","hAlign":"center","layout":"VBox","width":"100%"});
var _div_1594872 = new Emp.Panel({"id":"_div_1594872","height":"105","hAlign":"center","layout":"HBox","width":"100%"});
var k1 = new Emp.Image({"id":"k1","height":"80","width":"80","src":"/pass/k1.png"});
k1.addEvent('onClick',function(){passBtn('1','1')});
_div_1594872.add(k1);
var _div_1287483 = new Emp.Panel({"id":"_div_1287483","height":"105","width":"20"});
_div_1594872.add(_div_1287483);
var k2 = new Emp.Image({"id":"k2","height":"84","width":"84","src":"/pass/k2.png"});
k2.addEvent('onClick',function(){passBtn('2','2')});
_div_1594872.add(k2);
var _div_25549055 = new Emp.Panel({"id":"_div_25549055","height":"105","width":"20"});
_div_1594872.add(_div_25549055);
var k3 = new Emp.Image({"id":"k3","height":"80","width":"80","src":"/pass/k3.png"});
k3.addEvent('onClick',function(){passBtn('3','3')});
_div_1594872.add(k3);
_div_26642797.add(_div_1594872);
var _div_10663558 = new Emp.Panel({"id":"_div_10663558","height":"105","hAlign":"center","layout":"HBox","width":"100%"});
var k4 = new Emp.Image({"id":"k4","height":"80","width":"80","src":"/pass/k4.png"});
k4.addEvent('onClick',function(){passBtn('4','4')});
_div_10663558.add(k4);
var _div_31702197 = new Emp.Panel({"id":"_div_31702197","height":"105","width":"20"});
_div_10663558.add(_div_31702197);
var k5 = new Emp.Image({"id":"k5","height":"80","width":"80","src":"/pass/k5.png"});
k5.addEvent('onClick',function(){passBtn('5','5')});
_div_10663558.add(k5);
var _div_24964572 = new Emp.Panel({"id":"_div_24964572","height":"105","width":"20"});
_div_10663558.add(_div_24964572);
var k6 = new Emp.Image({"id":"k6","height":"80","width":"80","src":"/pass/k6.png"});
k6.addEvent('onClick',function(){passBtn('6','6')});
_div_10663558.add(k6);
_div_26642797.add(_div_10663558);
var _div_20614041 = new Emp.Panel({"id":"_div_20614041","height":"105","hAlign":"center","layout":"HBox","width":"100%"});
var k7 = new Emp.Image({"id":"k7","height":"80","width":"80","src":"/pass/k7.png"});
k7.addEvent('onClick',function(){passBtn('7','7')});
_div_20614041.add(k7);
var _div_15193548 = new Emp.Panel({"id":"_div_15193548","height":"105","width":"20"});
_div_20614041.add(_div_15193548);
var k8 = new Emp.Image({"id":"k8","height":"80","width":"80","src":"/pass/k8.png"});
k8.addEvent('onClick',function(){passBtn('8','8')});
_div_20614041.add(k8);
var _div_10991716 = new Emp.Panel({"id":"_div_10991716","height":"105","width":"20"});
_div_20614041.add(_div_10991716);
var k9 = new Emp.Image({"id":"k9","height":"80","width":"80","src":"/pass/k9.png"});
k9.addEvent('onClick',function(){passBtn('9','9')});
_div_20614041.add(k9);
_div_26642797.add(_div_20614041);
var _div_4922678 = new Emp.Panel({"id":"_div_4922678","height":"105","hAlign":"center","layout":"HBox","width":"100%"});
var _img_23776142 = new Emp.Image({"id":"_img_23776142","height":"80","width":"80","src":"/pass/black.png"});
_div_4922678.add(_img_23776142);
var _div_5901222 = new Emp.Panel({"id":"_div_5901222","height":"105","width":"20"});
_div_4922678.add(_div_5901222);
var k0 = new Emp.Image({"id":"k0","height":"80","width":"80","src":"/pass/k0.png"});
k0.addEvent('onClick',function(){passBtn('0','0')});
_div_4922678.add(k0);
var _div_23958443 = new Emp.Panel({"id":"_div_23958443","height":"105","width":"20"});
_div_4922678.add(_div_23958443);
var _img_16376879 = new Emp.Image({"id":"_img_16376879","height":"80","width":"80","src":"/pass/black.png"});
_div_4922678.add(_img_16376879);
_div_26642797.add(_div_4922678);
_div_26327230.add(_div_26642797);
Emp.page.add(_div_26327230);




$jsd('/bpsplus/src/security/password.html',55,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);});var f = new $M.File("/weixingpass.pas"); 
$jsd('/bpsplus/src/security/password.html',56,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); var pass = ""; 
if($jsd('/bpsplus/src/security/password.html',57,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);})||true) if (!f.exists()) { 
$jsd('/bpsplus/src/security/password.html',58,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); f.createFile(); 
$jsd('/bpsplus/src/security/password.html',60,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); var pass = "9999"; 
$jsd('/bpsplus/src/security/password.html',62,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); $M.FileUtil.writeFile(f.getFilePath(), pass); 
} else { 
$jsd('/bpsplus/src/security/password.html',66,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); pass = $M.FileUtil.readFile(f.getFilePath()); 
} 
$jsd('/bpsplus/src/security/password.html',70,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); var maskcount = 1; 
$jsd('/bpsplus/src/security/password.html',71,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); var inputstr = ""; 
$jsd('/bpsplus/src/security/password.html',72,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); function passBtn(pos, tag) { 
$jsd('/bpsplus/src/security/password.html',74,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); var scaleAnimation = new $M.ScaleAnimation({duration:100, fromX:1, toX:0.95, fromY:1, toY:0.95, pivotX:0.5, pivotY:0.5}); 
$jsd('/bpsplus/src/security/password.html',84,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); eval("k" + tag).addAnimation(scaleAnimation); 
$jsd('/bpsplus/src/security/password.html',85,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); eval("k" + tag).startAnimation(); 
$jsd('/bpsplus/src/security/password.html',87,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); inputstr += tag; 
$jsd('/bpsplus/src/security/password.html',88,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); eval("mask" + maskcount).setColor("#000000"); 
if($jsd('/bpsplus/src/security/password.html',90,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);})||true) if (maskcount < 4) { 
$jsd('/bpsplus/src/security/password.html',91,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); maskcount += 1; 
} else { 
if($jsd('/bpsplus/src/security/password.html',94,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);})||true) if (inputstr == pass) { 
$jsd('/bpsplus/src/security/password.html',95,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); $M.page.goBack(); 
} else { 
$jsd('/bpsplus/src/security/password.html',98,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); toast("密码错误！"); 
$jsd('/bpsplus/src/security/password.html',101,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); for (var m = 0; m < 10; m++) { 
$jsd('/bpsplus/src/security/password.html',102,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); eval("k" + m).clearAnimation(); 
} 
$jsd('/bpsplus/src/security/password.html',104,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); maskcount = 1; 
$jsd('/bpsplus/src/security/password.html',105,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); inputstr = ""; 
$jsd('/bpsplus/src/security/password.html',106,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); mask1.setColor("#FFFFFF"); 
$jsd('/bpsplus/src/security/password.html',107,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); mask2.setColor("#FFFFFF"); 
$jsd('/bpsplus/src/security/password.html',108,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); mask3.setColor("#FFFFFF"); 
$jsd('/bpsplus/src/security/password.html',109,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); mask4.setColor("#FFFFFF"); 
} 
} 
} 
$jsd('/bpsplus/src/security/password.html',116,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); function goBack() { 
$jsd('/bpsplus/src/security/password.html',117,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); $M.page.goBack(); 
} 
$jsd('/bpsplus/src/security/password.html',120,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); function refresh(eventype) { 
if($jsd('/bpsplus/src/security/password.html',121,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);})||true) if (eventype == "pullDown") { 
$jsd('/bpsplus/src/security/password.html',122,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); listview.resetScroller(); 
$jsd('/bpsplus/src/security/password.html',123,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); alert("没有更新"); 
} 
} 
 
Emp.page.render();
