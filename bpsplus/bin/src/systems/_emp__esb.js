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
			

var index = 1;
var items = [
	{
		time : "2014-08-15 12:40",
		disPic : "/image/esb_tab.jpg",
		mcontent : "新上线服务 80个 ，其中新增服务40个，新版本服务20个，替换服务20个。",
		mfrom : "工商银行 ESB管理组",
		action : ""
	},
	{
		time : "2014-08-15 12:40",
		disPic : "/image/esb_stick.jpg",
		mcontent : "同期相比今年服务接入量更大，目前问题主要集中在crm部分。",
		mfrom : "工商银行 服务治理组",
		action : ""
	},
	{
		time : "2014-08-15 12:40",
		disPic : "/image/esb_lins.jpg",
		mcontent : "整体来看各省服务调用量均类同，其中北京，山东，上海名列前茅",
		mfrom : "工商银行 业务统计组",
		action : ""
	}
];
listview.setItems(items);
listview.addEvent("onItemClick", function(row, tag, data) {
	Emp.page.goTo(data.action, {name : data.name});
});
function goBack(){
	Emp.page.goBack();
}


     Emp.page.render();