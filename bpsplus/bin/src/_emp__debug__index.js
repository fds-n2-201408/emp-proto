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
Emp.page.setId('_BODY_17968560');
var _div_7711615 = new Emp.Panel({"id":"_div_7711615","height":"45","backgroundColor":"#2A6E91","vAlign":"middle","hAlign":"center","layout":"HBox","width":"100%"});
var _div_21904334 = new Emp.Panel({"id":"_div_21904334","height":"100%","vAlign":"middle","hAlign":"center","width":"100"});
var dev = new Emp.Label({"id":"dev","color":"#FFFFFF","value":"微行","fontSize":"18"});
_div_21904334.add(dev);
_div_7711615.add(_div_21904334);
var _div_23721919 = new Emp.Panel({"id":"_div_23721919","height":"100%","vAlign":"middle","hAlign":"right","width":"100%"});
var _img_541773 = new Emp.Image({"id":"_img_541773","height":"26","tag":"timg","width":"26","src":"/image/search.png"});
_img_541773.addEvent('onClick',goMain);
_div_23721919.add(_img_541773);
var other = new Emp.Label({"id":"other","value":"     ","fontSize":"18"});
_div_23721919.add(other);
var _img_21947584 = new Emp.Image({"id":"_img_21947584","height":"26","tag":"timg","width":"26","src":"/image/configs.png"});
_img_21947584.addEvent('onClick',goPass);
_div_23721919.add(_img_21947584);
var other = new Emp.Label({"id":"other","value":"     ","fontSize":"18"});
_div_23721919.add(other);
var _img_11973928 = new Emp.Image({"id":"_img_11973928","height":"26","tag":"timg","width":"26","src":"/image/account.png"});
_img_11973928.addEvent('onClick',showDailog);
_div_23721919.add(_img_11973928);
_div_7711615.add(_div_23721919);
var _div_19891890 = new Emp.Panel({"id":"_div_19891890","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
var test = new Emp.Label({"id":"test","value":"","fontSize":"18"});
_div_19891890.add(test);
_div_7711615.add(_div_19891890);
Emp.page.add(_div_7711615);
var mmls = new Emp.Panel({"position":"absolute","id":"mmls","height":"10","backgroundColor":"#000000","tag":"n","width":"100%","display":"false"});
Emp.page.add(mmls);
var confluence = new Emp.Panel({"id":"confluence","height":"40","vAlign":"middle","hAlign":"center","layout":"HBox","width":"100%"});
var test = new Emp.Panel({"id":"test","height":"100%","vAlign":"middle","hAlign":"center","width":"100%"});
test.addEvent('onClick',clickTest1);
var dev = new Emp.Label({"id":"dev","color":"#0077EC","value":"信息","fontSize":"18"});
test.add(dev);
var _input_16371022 = new Emp.Label({"id":"_input_16371022","color":"#FF0000","value":"18","fontSize":"12"});
test.add(_input_16371022);
confluence.add(test);
var _div_1439188 = new Emp.Panel({"id":"_div_1439188","height":"100%","vAlign":"middle","hAlign":"center","width":"100%"});
_div_1439188.addEvent('onClick',clickTest2);
var test = new Emp.Label({"id":"test","value":"创造","fontSize":"18"});
_div_1439188.add(test);
var _input_30336715 = new Emp.Label({"id":"_input_30336715","color":"#FF0000","value":"●","fontSize":"14"});
_div_1439188.add(_input_30336715);
confluence.add(_div_1439188);
var _div_9589708 = new Emp.Panel({"id":"_div_9589708","height":"100%","vAlign":"middle","hAlign":"center","width":"100%"});
_div_9589708.addEvent('onClick',clickTest3);
var other = new Emp.Label({"id":"other","value":"企业通讯录","fontSize":"18"});
_div_9589708.add(other);
confluence.add(_div_9589708);
Emp.page.add(confluence);
var _div_9274024 = new Emp.Panel({"id":"_div_9274024","height":"3","width":"100%"});
var mark = new Emp.Panel({"position":"absolute","id":"mark","height":"3","backgroundColor":"#0077EC","width":"120","display":"true"});
_div_9274024.add(mark);
Emp.page.add(_div_9274024);
var _div_25784080 = new Emp.Panel({"id":"_div_25784080","height":"0.5","backgroundColor":"#AAAAAA","width":"100%"});
Emp.page.add(_div_25784080);
var mainSilde = new Emp.SlidePage({"id":"mainSilde"});
mainSilde.addUrl("/message/message.html")
mainSilde.addUrl("/create/create.html")
mainSilde.addUrl("/contracts/contracts.html")
Emp.page.add(mainSilde);
var configdialog = new Emp.CustomDialog({"id":"configdialog","height":"100%","width":"100%","canceledOnTouchOutside":"true"});
var _div_33086494 = new Emp.Panel({"id":"_div_33086494","height":"100%","backgroundColor":"#FFFFFF","vAlign":"top","hAlign":"center","width":"100%"});
var _input_20667004 = new Emp.Label({"id":"_input_20667004","value":"我的弹出窗口"});
_div_33086494.add(_input_20667004);
var _input_28415222 = new Emp.Button({"id":"_input_28415222","value":"close"});
_input_28415222.addEvent('onClick',closeDailog);
_div_33086494.add(_input_28415222);
configdialog.setView(_div_33086494);





$jsd('/bpsplus/src/index.html',58,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);});mainSilde.addEvent("onChange", function (o, n) { 
if($jsd('/bpsplus/src/index.html',59,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);})||true) if (n == "0") { 
$jsd('/bpsplus/src/index.html',61,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); dev.setColor("#0077EC"); 
$jsd('/bpsplus/src/index.html',62,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); test.setColor("#000000"); 
$jsd('/bpsplus/src/index.html',63,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); other.setColor("#000000"); 
$jsd('/bpsplus/src/index.html',64,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); move(120, 0); 
} 
if($jsd('/bpsplus/src/index.html',66,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);})||true) if (n == "1") { 
$jsd('/bpsplus/src/index.html',68,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); dev.setColor("#000000"); 
$jsd('/bpsplus/src/index.html',69,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); test.setColor("#0077EC"); 
$jsd('/bpsplus/src/index.html',70,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); other.setColor("#000000"); 
if($jsd('/bpsplus/src/index.html',71,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);})||true) if (o == "0") { 
$jsd('/bpsplus/src/index.html',72,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); move(0, 120); 
} else { 
$jsd('/bpsplus/src/index.html',75,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); move(240, 120); 
} 
} 
if($jsd('/bpsplus/src/index.html',78,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);})||true) if (n == "2") { 
$jsd('/bpsplus/src/index.html',80,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); dev.setColor("#000000"); 
$jsd('/bpsplus/src/index.html',81,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); test.setColor("#000000"); 
$jsd('/bpsplus/src/index.html',82,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); other.setColor("#0077EC"); 
$jsd('/bpsplus/src/index.html',83,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); move(120, 240); 
} 
}); 
$jsd('/bpsplus/src/index.html',86,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); function clickTest1() { 
$jsd('/bpsplus/src/index.html',87,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); mainSilde.setSelectedIndex("0"); 
} 
$jsd('/bpsplus/src/index.html',89,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); function clickTest2() { 
$jsd('/bpsplus/src/index.html',90,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); mainSilde.setSelectedIndex("1"); 
} 
$jsd('/bpsplus/src/index.html',92,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); function clickTest3() { 
$jsd('/bpsplus/src/index.html',93,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); mainSilde.setSelectedIndex("2"); 
} 
$jsd('/bpsplus/src/index.html',96,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); function move(fx, tx) { 
$jsd('/bpsplus/src/index.html',97,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); mark.clearAnimation(); 
$jsd('/bpsplus/src/index.html',98,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); var an1 = new $M.TranslateAnimation({fromX:fx, toX:tx, toY:0, fromY:0, duration:250}); 
$jsd('/bpsplus/src/index.html',105,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); mark.addAnimation(an1); 
$jsd('/bpsplus/src/index.html',106,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); mark.startAnimation(); 
} 
$jsd('/bpsplus/src/index.html',108,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); function start() { 
if($jsd('/bpsplus/src/index.html',109,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);})||true) if (mmls.getTag() == "d") { 
$jsd('/bpsplus/src/index.html',110,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); mmls.setTag("n"); 
$jsd('/bpsplus/src/index.html',111,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); mmls.setDisplay(false); 
} else { 
$jsd('/bpsplus/src/index.html',113,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); mmls.setDisplay(true); 
$jsd('/bpsplus/src/index.html',114,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); mmls.setTag("d"); 
} 
} 
$jsd('/bpsplus/src/index.html',118,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); function showDailog() { 
$jsd('/bpsplus/src/index.html',119,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); configdialog.show(); 
} 
$jsd('/bpsplus/src/index.html',121,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); function closeDailog() { 
$jsd('/bpsplus/src/index.html',122,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); configdialog.close(); 
} 
$jsd('/bpsplus/src/index.html',124,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); function scanCode() { 
$jsd('/bpsplus/src/index.html',125,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); Utils.startBarCodeScanner(function (content) { 
$jsd('/bpsplus/src/index.html',125,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); alert(content); 
}); 
} 
$jsd('/bpsplus/src/index.html',127,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); function goPass() { 
$jsd('/bpsplus/src/index.html',128,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); Emp.page.goTo("/security/password.html"); 
} 
$jsd('/bpsplus/src/index.html',130,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); function goMain() { 
$jsd('/bpsplus/src/index.html',131,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); Emp.page.goTo("/main.html"); 
} 
 
Emp.page.render();
