   Emp.page.setId('_BODY_11910536');
	var _div_28204633 = new Emp.Panel({"id":"_div_28204633","height":"100%","vAlign":"middle","hAlign":"center","layout":"VBox","width":"100%"});
    var _input_11807238 = new Emp.Button({"id":"_input_11807238","value":"hello"});
	_input_11807238.addEvent('onClick',postback);
            _div_28204633.add(_input_11807238);
               Emp.page.add(_div_28204633);
			

    
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



     Emp.page.render();