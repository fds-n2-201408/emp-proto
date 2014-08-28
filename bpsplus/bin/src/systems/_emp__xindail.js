   Emp.page.setId('_BODY_23108111');
	var _div_19034981 = new Emp.Panel({"id":"_div_19034981","height":"50","backgroundColor":"#2A6E91","layout":"HBox","width":"100%"});
    var _div_12974016 = new Emp.Panel({"id":"_div_12974016","height":"100%","vAlign":"middle","hAlign":"left","width":"6"});
            _div_19034981.add(_div_12974016);
        var _div_17599169 = new Emp.Panel({"id":"_div_17599169","height":"100%","vAlign":"middle","hAlign":"left","width":"300"});
    var _img_6927783 = new Emp.Image({"id":"_img_6927783","height":"30","tag":"timg","width":"30","src":"/image/back.png"});
	_img_6927783.addEvent('onClick',goBack);
            _div_17599169.add(_img_6927783);
        var _label_1376197 = new Emp.Label({"id":"_label_1376197","color":"#DDDDDD","tag":"title","value":"网贷通告","fontSize":"18"});
	_label_1376197.addEvent('onClick',goBack);
            _div_17599169.add(_label_1376197);
                _div_19034981.add(_div_17599169);
        var _div_10753522 = new Emp.Panel({"id":"_div_10753522","height":"100%","vAlign":"middle","hAlign":"right","width":"100%"});
    var _img_10284878 = new Emp.Image({"id":"_img_10284878","height":"30","tag":"timg","width":"30","src":"/image/config.png"});
	_img_10284878.addEvent('onClick',goBack);
            _div_10753522.add(_img_10284878);
                _div_19034981.add(_div_10753522);
        var _div_19071434 = new Emp.Panel({"id":"_div_19071434","height":"100%","vAlign":"middle","hAlign":"left","width":"8"});
            _div_19034981.add(_div_19071434);
               Emp.page.add(_div_19034981);
		var _div_21665326 = new Emp.Panel({"id":"_div_21665326","height":"100%","overflow":"y","width":"100%"});
    var _img_30005224 = new Emp.Image({"id":"_img_30005224","height":"100%","tag":"timg","width":"100%","src":"/image/xindai_report.jpg"});
	_img_30005224.addEvent('onClick',goBack);
            _div_21665326.add(_img_30005224);
               Emp.page.add(_div_21665326);
			


function goBack(){
	Emp.page.goBack();
}


     Emp.page.render();