   Emp.page.setId('_BODY_20997841');
	var _div_18756971 = new Emp.Panel({"id":"_div_18756971","height":"100%","layout":"VBox","width":"100%"});
    var listview = new Emp.ListView({"id":"listview","height":"100%","width":"100%"});

    var _template_11892211 = new Emp.Panel({"id":"_template_11892211"});
_template_11892211.__isTemplate=true;
    var _div_22197579 = new Emp.Panel({"id":"_div_22197579","height":"60","layout":"VBox","width":"100%"});
    var _div_16549106 = new Emp.Panel({"id":"_div_16549106","height":"100%","vAlign":"middle","layout":"HBox","hAlign":"left","width":"100%"});
    var _div_8144651 = new Emp.Panel({"id":"_div_8144651","height":"100%","vAlign":"middle","hAlign":"center","width":"40"});
            _div_16549106.add(_div_8144651);
        var _div_18627332 = new Emp.Panel({"id":"_div_18627332","height":"100%","vAlign":"middle","hAlign":"left","width":"26"});
    var _img_6731115 = new Emp.Image({"id":"_img_6731115","height":"26","tag":"timg","width":"26"});
            _div_18627332.add(_img_6731115);
                _div_16549106.add(_div_18627332);
        var _div_17860110 = new Emp.Panel({"id":"_div_17860110","height":"100%","vAlign":"top","hAlign":"left","width":"15"});
    var _label_30489638 = new Emp.Label({"id":"_label_30489638","color":"#FF0000","tag":"new","fontSize":"15"});
            _div_17860110.add(_label_30489638);
                _div_16549106.add(_div_17860110);
        var _div_29623436 = new Emp.Panel({"id":"_div_29623436","height":"30","layout":"HBox","width":"100%"});
    var _div_428906 = new Emp.Panel({"id":"_div_428906","height":"100%","vAlign":"middle","hAlign":"left","width":"100%"});
    var _label_27976535 = new Emp.Label({"id":"_label_27976535","value":"   ","fontSize":"14"});
            _div_428906.add(_label_27976535);
        var _label_3378589 = new Emp.Label({"id":"_label_3378589","color":"#000000","tag":"name","fontSize":"16"});
            _div_428906.add(_label_3378589);
                _div_29623436.add(_div_428906);
        var _div_9858485 = new Emp.Panel({"id":"_div_9858485","height":"100%","vAlign":"middle","hAlign":"right","width":"100"});
    var _label_33334566 = new Emp.Label({"id":"_label_33334566","color":"#bbbbbb","tag":"ldate","fontSize":"14"});
            _div_9858485.add(_label_33334566);
                _div_29623436.add(_div_9858485);
                _div_16549106.add(_div_29623436);
                _div_22197579.add(_div_16549106);
        var _div_29261441 = new Emp.Panel({"id":"_div_29261441","height":"0.5","backgroundColor":"#AAAAAA","width":"100%"});
            _div_22197579.add(_div_29261441);
                _template_11892211.add(_div_22197579);
                listview.setTemplate(_template_11892211,"_template_11892211");
    
            _div_18756971.add(listview);
        var _div_23289238 = new Emp.Panel({"id":"_div_23289238","height":"0.5","backgroundColor":"#999999","width":"100%"});
            _div_18756971.add(_div_23289238);
               Emp.page.add(_div_18756971);
			

var items = [
	{
		timg : "/image/compc.jpg",
		name : "公司圈" ,
		new : "1",
		ldate : "",
		action : "/message/mailSession.html"
	},
	{
		timg : "/image/scan.png",
		name : "扫一扫" ,
		new : "",
		ldate : "",
		action : "/message/session.html"
	},
	{
		timg : "/image/salary.png",
		name : "天气预报" ,
		new : "1",
		ldate : "刚刚 14:30",
		lmessage : "8月工资单，你这个月工资十万元 USD。",
		action : "/message/mailSession.html"
	},
	{
		timg : "/image/msg.jpg",
		name : "公司福利" ,
		new : "",
		ldate : "刚刚 14:31",
		lmessage : "部门经理已经同意你的申请",
		action : "/message/session.html"
	},
		{
		timg : "/image/oa.jpg",
		name : "吐吐槽" ,
		new : "",
		ldate : "今天 9:30",
		lmessage : "办公室新近提供了一批笔记本供大家使用……",
		action : "/message/session.html"
	},
		{
		timg : "/image/cars.png",
		name : "发发呆" ,
		new : "",
		ldate : "今天 9:10",
		lmessage : "现有空余车辆2，GL8,君威。",
		action : "/message/session.html"
	}
];

listview.setItems(items);
listview.addEvent("onItemClick", function(row, tag, data) {
	log(data.action)
	Emp.page.goTo(data.action);
});
function goBack(){
	Emp.page.goBack();
}


     Emp.page.render();