   Emp.page.setId('_BODY_24299535');
	var _div_11299103 = new Emp.Panel({"id":"_div_11299103","height":"100%","layout":"VBox","width":"100%"});
    var _div_19496672 = new Emp.Panel({"id":"_div_19496672","height":"50","backgroundColor":"#2A6E91","layout":"HBox","width":"100%"});
    var _div_21550319 = new Emp.Panel({"id":"_div_21550319","height":"100%","vAlign":"middle","hAlign":"left","width":"6"});
            _div_19496672.add(_div_21550319);
        var _div_9676270 = new Emp.Panel({"id":"_div_9676270","height":"100%","vAlign":"middle","hAlign":"left","width":"300"});
    var _img_24295645 = new Emp.Image({"id":"_img_24295645","height":"30","tag":"timg","width":"30","src":"/image/back.png"});
	_img_24295645.addEvent('onClick',goBack);
            _div_9676270.add(_img_24295645);
        var _label_13023222 = new Emp.Label({"id":"_label_13023222","color":"#DDDDDD","tag":"title","value":"移动办公","fontSize":"18"});
	_label_13023222.addEvent('onClick',goBack);
            _div_9676270.add(_label_13023222);
                _div_19496672.add(_div_9676270);
        var _div_5738359 = new Emp.Panel({"id":"_div_5738359","height":"100%","vAlign":"middle","hAlign":"right","width":"100%"});
    var _img_9177946 = new Emp.Image({"id":"_img_9177946","height":"30","tag":"timg","width":"30","src":"/image/config.png"});
	_img_9177946.addEvent('onClick',goBack);
            _div_5738359.add(_img_9177946);
                _div_19496672.add(_div_5738359);
        var _div_4022468 = new Emp.Panel({"id":"_div_4022468","height":"100%","vAlign":"middle","hAlign":"left","width":"8"});
            _div_19496672.add(_div_4022468);
                _div_11299103.add(_div_19496672);
        var listview = new Emp.ListView({"id":"listview","height":"100%","width":"100%"});

    var _template_23855560 = new Emp.Panel({"id":"_template_23855560"});
_template_23855560.__isTemplate=true;
    var _div_32058802 = new Emp.Panel({"id":"_div_32058802","height":"60","layout":"VBox","width":"100%"});
    var _div_28771366 = new Emp.Panel({"id":"_div_28771366","height":"0.5","backgroundColor":"#AAAAAA","width":"100%"});
            _div_32058802.add(_div_28771366);
        var _div_7430873 = new Emp.Panel({"id":"_div_7430873","height":"100%","vAlign":"middle","layout":"HBox","hAlign":"left","width":"100%"});
    var _div_1094018 = new Emp.Panel({"id":"_div_1094018","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
            _div_7430873.add(_div_1094018);
        var _div_32889907 = new Emp.Panel({"id":"_div_32889907","height":"100%","vAlign":"middle","hAlign":"left","width":"40"});
    var _img_4955751 = new Emp.Image({"id":"_img_4955751","height":"40","tag":"timg","width":"40"});
            _div_32889907.add(_img_4955751);
                _div_7430873.add(_div_32889907);
        var _div_9214487 = new Emp.Panel({"id":"_div_9214487","height":"100%","vAlign":"top","hAlign":"left","width":"15"});
    var _label_14187016 = new Emp.Label({"id":"_label_14187016","color":"#FF0000","tag":"new","fontSize":"15"});
            _div_9214487.add(_label_14187016);
                _div_7430873.add(_div_9214487);
        var _div_3397361 = new Emp.Panel({"id":"_div_3397361","height":"60","layout":"VBox","width":"100%"});
    var _div_23365925 = new Emp.Panel({"id":"_div_23365925","height":"30","layout":"HBox","width":"100%"});
    var _div_23585274 = new Emp.Panel({"id":"_div_23585274","height":"100%","vAlign":"bottom","hAlign":"left","width":"100%"});
    var _label_19210317 = new Emp.Label({"id":"_label_19210317","color":"#000000","tag":"name","fontSize":"16"});
            _div_23585274.add(_label_19210317);
                _div_23365925.add(_div_23585274);
        var _div_7068759 = new Emp.Panel({"id":"_div_7068759","height":"100%","vAlign":"middle","hAlign":"right","width":"100"});
    var _label_21948277 = new Emp.Label({"id":"_label_21948277","color":"#bbbbbb","tag":"ldate","fontSize":"14"});
            _div_7068759.add(_label_21948277);
                _div_23365925.add(_div_7068759);
                _div_3397361.add(_div_23365925);
        var _div_20835703 = new Emp.Panel({"id":"_div_20835703","height":"100%","vAlign":"middle","hAlign":"left","width":"100%"});
    var _label_11616535 = new Emp.Label({"id":"_label_11616535","color":"#bbbbbb","tag":"lmessage","fontSize":"15"});
            _div_20835703.add(_label_11616535);
                _div_3397361.add(_div_20835703);
                _div_7430873.add(_div_3397361);
                _div_32058802.add(_div_7430873);
                _template_23855560.add(_div_32058802);
                listview.setTemplate(_template_23855560,"_template_23855560");
    
            _div_11299103.add(listview);
        var _div_19427913 = new Emp.Panel({"id":"_div_19427913","height":"0.5","backgroundColor":"#999999","width":"100%"});
            _div_11299103.add(_div_19427913);
               Emp.page.add(_div_11299103);
			

var items = [
	{
		timg : "/image/guizhang.jpg",
		name : "规章制度" ,
		new : "1",
		ldate : "置顶 ",
		lmessage : "财务制度，借款制度有更新",
		action : "/message/mailSession.html"
	},
	{
		timg : "/image/money.png",
		name : "报销" ,
		new : "1",
		ldate : "今天 9:45",
		lmessage : "￥6343.00已到账，单号000453",
		action : "/message/session.html"
	},
	{
		timg : "/image/salary.png",
		name : "工资查询" ,
		new : "1",
		ldate : "刚刚 14:30",
		lmessage : "8月工资单，你这个月工资十万元 USD。",
		action : "/message/mailSession.html"
	},
	{
		timg : "/image/msg.jpg",
		name : "请假" ,
		new : "",
		ldate : "刚刚 14:31",
		lmessage : "部门经理已经同意你的申请",
		action : "/message/session.html"
	},
		{
		timg : "/image/oa.jpg",
		name : "办公用品" ,
		new : "",
		ldate : "今天 9:30",
		lmessage : "办公室新近提供了一批笔记本供大家使用……",
		action : "/message/session.html"
	},
		{
		timg : "/image/cars.png",
		name : "车辆" ,
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