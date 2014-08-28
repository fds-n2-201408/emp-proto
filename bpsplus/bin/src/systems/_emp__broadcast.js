   Emp.page.setId('_BODY_1155323');
	var _div_23064054 = new Emp.Panel({"id":"_div_23064054","height":"50","backgroundColor":"#2A6E91","layout":"HBox","width":"100%"});
    var _div_16758344 = new Emp.Panel({"id":"_div_16758344","height":"100%","vAlign":"middle","hAlign":"left","width":"6"});
            _div_23064054.add(_div_16758344);
        var _div_1601287 = new Emp.Panel({"id":"_div_1601287","height":"100%","vAlign":"middle","hAlign":"left","width":"300"});
    var _img_2188237 = new Emp.Image({"id":"_img_2188237","height":"30","tag":"timg","width":"30","src":"/image/back.png"});
	_img_2188237.addEvent('onClick',goBack);
            _div_1601287.add(_img_2188237);
        var _label_2051258 = new Emp.Label({"id":"_label_2051258","color":"#DDDDDD","tag":"title","value":"公司公告","fontSize":"18"});
	_label_2051258.addEvent('onClick',goBack);
            _div_1601287.add(_label_2051258);
                _div_23064054.add(_div_1601287);
        var _div_15092608 = new Emp.Panel({"id":"_div_15092608","height":"100%","vAlign":"middle","hAlign":"right","width":"100%"});
    var _img_23519427 = new Emp.Image({"id":"_img_23519427","height":"30","tag":"timg","width":"30","src":"/image/config.png"});
	_img_23519427.addEvent('onClick',goBack);
            _div_15092608.add(_img_23519427);
                _div_23064054.add(_div_15092608);
        var _div_19800813 = new Emp.Panel({"id":"_div_19800813","height":"100%","vAlign":"middle","hAlign":"left","width":"8"});
            _div_23064054.add(_div_19800813);
               Emp.page.add(_div_23064054);
		var _div_32963152 = new Emp.Panel({"id":"_div_32963152","height":"100%","overflow":"y","width":"100%"});
    var _img_28030167 = new Emp.Image({"id":"_img_28030167","height":"100%","tag":"timg","width":"100%","src":"/image/long.png"});
	_img_28030167.addEvent('onClick',goBack);
            _div_32963152.add(_img_28030167);
               Emp.page.add(_div_32963152);
			


function goBack(){
	Emp.page.goBack();
}


     Emp.page.render();