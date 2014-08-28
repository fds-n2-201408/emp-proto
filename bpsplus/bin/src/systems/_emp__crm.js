   Emp.page.setId('_BODY_11415568');
	var _div_30768185 = new Emp.Panel({"id":"_div_30768185","height":"50","backgroundColor":"#2A6E91","layout":"HBox","width":"100%"});
    var _div_13545538 = new Emp.Panel({"id":"_div_13545538","height":"100%","vAlign":"middle","hAlign":"left","width":"6"});
            _div_30768185.add(_div_13545538);
        var _div_26600825 = new Emp.Panel({"id":"_div_26600825","height":"100%","vAlign":"middle","hAlign":"left","width":"300"});
    var _img_826883 = new Emp.Image({"id":"_img_826883","height":"30","tag":"timg","width":"30","src":"/image/back.png"});
	_img_826883.addEvent('onClick',goBack);
            _div_26600825.add(_img_826883);
        var _label_5888527 = new Emp.Label({"id":"_label_5888527","color":"#DDDDDD","tag":"title","value":"客户信息","fontSize":"18"});
	_label_5888527.addEvent('onClick',goBack);
            _div_26600825.add(_label_5888527);
                _div_30768185.add(_div_26600825);
        var _div_16458356 = new Emp.Panel({"id":"_div_16458356","height":"100%","vAlign":"middle","hAlign":"right","width":"100%"});
    var _img_26417474 = new Emp.Image({"id":"_img_26417474","height":"30","tag":"timg","width":"30","src":"/image/config.png"});
	_img_26417474.addEvent('onClick',goBack);
            _div_16458356.add(_img_26417474);
                _div_30768185.add(_div_16458356);
        var _div_6248065 = new Emp.Panel({"id":"_div_6248065","height":"100%","vAlign":"middle","hAlign":"left","width":"8"});
            _div_30768185.add(_div_6248065);
               Emp.page.add(_div_30768185);
		var _img_19427320 = new Emp.Image({"id":"_img_19427320","height":"100%","tag":"timg","width":"100%","src":"/image/crm_accounts.png"});
	_img_19427320.addEvent('onClick',goBack);
           Emp.page.add(_img_19427320);
			


function goBack(){
	Emp.page.goBack();
}


     Emp.page.render();