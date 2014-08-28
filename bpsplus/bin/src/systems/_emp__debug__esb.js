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
Emp.page.setId('_BODY_23387747');
var _div_21247826 = new Emp.Panel({"id":"_div_21247826","height":"50","backgroundColor":"#2A6E91","layout":"HBox","width":"100%"});
var _div_25957171 = new Emp.Panel({"id":"_div_25957171","height":"100%","vAlign":"middle","hAlign":"left","width":"6"});
_div_21247826.add(_div_25957171);
var _div_21007232 = new Emp.Panel({"id":"_div_21007232","height":"100%","vAlign":"middle","hAlign":"left","width":"300"});
var _img_8823287 = new Emp.Image({"id":"_img_8823287","height":"30","tag":"timg","width":"30","src":"/image/back.png"});
_img_8823287.addEvent('onClick',goBack);
_div_21007232.add(_img_8823287);
var _label_15964901 = new Emp.Label({"id":"_label_15964901","color":"#DDDDDD","tag":"title","value":"ESB监控","fontSize":"18"});
_label_15964901.addEvent('onClick',goBack);
_div_21007232.add(_label_15964901);
_div_21247826.add(_div_21007232);
var _div_20859525 = new Emp.Panel({"id":"_div_20859525","height":"100%","vAlign":"middle","hAlign":"right","width":"100%"});
var _img_9334190 = new Emp.Image({"id":"_img_9334190","height":"30","tag":"timg","width":"30","src":"/image/config.png"});
_img_9334190.addEvent('onClick',goBack);
_div_20859525.add(_img_9334190);
_div_21247826.add(_div_20859525);
var _div_12777822 = new Emp.Panel({"id":"_div_12777822","height":"100%","vAlign":"middle","hAlign":"left","width":"8"});
_div_21247826.add(_div_12777822);
Emp.page.add(_div_21247826);
var _div_8493330 = new Emp.Panel({"id":"_div_8493330","height":"100%","backgroundColor":"#DDDDDD","width":"100%"});
var listview = new Emp.ListView({"id":"listview","height":"100%","width":"100%"});

var _template_12454219 = new Emp.Panel({"id":"_template_12454219"});
_template_12454219.__isTemplate=true;
var _div_13905888 = new Emp.Panel({"id":"_div_13905888","height":"350","layout":"VBox","width":"100%"});
var _div_9644521 = new Emp.Panel({"id":"_div_9644521","height":"40","layout":"HBox","width":"100%"});
var _div_27564002 = new Emp.Panel({"id":"_div_27564002","height":"100%","vAlign":"middle","hAlign":"center","width":"80"});
var _label_15701778 = new Emp.Label({"id":"_label_15701778","color":"#000000","tag":"lspace","fontSize":"20"});
_div_27564002.add(_label_15701778);
_div_9644521.add(_div_27564002);
var _div_27739962 = new Emp.Panel({"id":"_div_27739962","height":"100%","vAlign":"middle","hAlign":"center","width":"100%"});
var _label_20274110 = new Emp.Label({"id":"_label_20274110","color":"#111111","tag":"time","fontSize":"14"});
_div_27739962.add(_label_20274110);
_div_9644521.add(_div_27739962);
var _div_1711281 = new Emp.Panel({"id":"_div_1711281","height":"100%","vAlign":"middle","hAlign":"center","width":"80"});
var _label_5363636 = new Emp.Label({"id":"_label_5363636","color":"#000000","tag":"rspace","fontSize":"20"});
_div_1711281.add(_label_5363636);
_div_9644521.add(_div_1711281);
_div_13905888.add(_div_9644521);
var _div_19433032 = new Emp.Panel({"id":"_div_19433032","height":"100%","layout":"HBox","width":"100%"});
var _div_25689410 = new Emp.Panel({"id":"_div_25689410","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
var _label_17046455 = new Emp.Label({"id":"_label_17046455","color":"#000000","tag":"lspace","fontSize":"20"});
_div_25689410.add(_label_17046455);
_div_19433032.add(_div_25689410);
var _div_12041770 = new Emp.Panel({"id":"_div_12041770","height":"100%","backgroundColor":"#FFFFFF","layout":"VBox","width":"100%"});
var _div_19253556 = new Emp.Panel({"id":"_div_19253556","height":"100%","vAlign":"middle","hAlign":"left","width":"100%"});
var _label_29138045 = new Emp.Label({"id":"_label_29138045","color":"#DDDDDD","tag":"ll","value":" ","fontSize":"18"});
_div_19253556.add(_label_29138045);
var _img_29755853 = new Emp.Image({"id":"_img_29755853","height":"100%","tag":"disPic","width":"100%"});
_div_19253556.add(_img_29755853);
_div_12041770.add(_div_19253556);
var _div_11372590 = new Emp.Panel({"id":"_div_11372590","height":"66","vAlign":"middle","hAlign":"left","width":"100%"});
var _label_13086839 = new Emp.Label({"id":"_label_13086839","color":"#DDDDDD","tag":"ll","value":"  ","fontSize":"18"});
_div_11372590.add(_label_13086839);
var _label_1204829 = new Emp.Label({"id":"_label_1204829","color":"#DDDDDD","tag":"mcontent","fontSize":"18"});
_div_11372590.add(_label_1204829);
_div_12041770.add(_div_11372590);
var _div_16244293 = new Emp.Panel({"id":"_div_16244293","height":"20","vAlign":"middle","hAlign":"right","width":"100%"});
var _label_18987744 = new Emp.Label({"id":"_label_18987744","color":"#DDDDDD","tag":"mfrom","fontSize":"14"});
_div_16244293.add(_label_18987744);
var _label_24372327 = new Emp.Label({"id":"_label_24372327","color":"#DDDDDD","tag":"ll","value":" ","fontSize":"18"});
_div_16244293.add(_label_24372327);
_div_12041770.add(_div_16244293);
_div_19433032.add(_div_12041770);
var _div_26749443 = new Emp.Panel({"id":"_div_26749443","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
var _label_15618228 = new Emp.Label({"id":"_label_15618228","color":"#000000","tag":"rspace","fontSize":"20"});
_div_26749443.add(_label_15618228);
_div_19433032.add(_div_26749443);
_div_13905888.add(_div_19433032);
_template_12454219.add(_div_13905888);
listview.setTemplate(_template_12454219,"_template_12454219");

_div_8493330.add(listview);
Emp.page.add(_div_8493330);




$jsd('/bpsplus/src/systems/esb.html',64,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);});var index = 1; 
$jsd('/bpsplus/src/systems/esb.html',65,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); var items = [{time:"2014-08-15 12:40", disPic:"/image/esb_tab.jpg", mcontent:"新上线服务 80个 ，其中新增服务40个，新版本服务20个，替换服务20个。", mfrom:"工商银行 ESB管理组", action:""}, {time:"2014-08-15 12:40", disPic:"/image/esb_stick.jpg", mcontent:"同期相比今年服务接入量更大，目前问题主要集中在crm部分。", mfrom:"工商银行 服务治理组", action:""}, {time:"2014-08-15 12:40", disPic:"/image/esb_lins.jpg", mcontent:"整体来看各省服务调用量均类同，其中北京，山东，上海名列前茅", mfrom:"工商银行 业务统计组", action:""}]; 
$jsd('/bpsplus/src/systems/esb.html',88,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); listview.setItems(items); 
$jsd('/bpsplus/src/systems/esb.html',89,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); listview.addEvent("onItemClick", function (row, tag, data) { 
$jsd('/bpsplus/src/systems/esb.html',90,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); Emp.page.goTo(data.action, {name:data.name}); 
}); 
$jsd('/bpsplus/src/systems/esb.html',92,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); function goBack() { 
$jsd('/bpsplus/src/systems/esb.html',93,this,((typeof(arguments)!="undefined"?arguments:null)),function(__text){return eval(__text);}); Emp.page.goBack(); 
} 
 
Emp.page.render();
