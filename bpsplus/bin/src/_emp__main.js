   Emp.page.setId('_BODY_29330543');
	var _div_10291412 = new Emp.Panel({"id":"_div_10291412","height":"100%","vAlign":"middle","hAlign":"center","layout":"VBox","width":"100%"});
    var _input_28227440 = new Emp.Button({"id":"_input_28227440","value":"hello"});
	_input_28227440.addEvent('onClick',postback);
            _div_10291412.add(_input_28227440);
               Emp.page.add(_div_10291412);
			
 
    
    function postback(){
    	var ajax = new $M.Ajax();
		ajax.addParam({key:'person',value:'m'});
		ajax.setAction("http://192.168.10.128:8080/default/com.primeton.eos.newcomponent.newbiz.biz.ext");
		ajax.submit(function(result){backup(result)},function(error){alert(error);});
    }
    function backup(result){
    	var mm =  eval('(' + result + ')');;
    	alert(mm.back);
    }
    
    
    function mm(){
    	alert("hello conflact.");
    }
    



     Emp.page.render();