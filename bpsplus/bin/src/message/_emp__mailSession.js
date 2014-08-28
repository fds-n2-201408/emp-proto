   Emp.page.setId('_BODY_8257825');
	var _div_8145379 = new Emp.Panel({"id":"_div_8145379","height":"100%","layout":"VBox","width":"100%"});
    var _div_30870707 = new Emp.Panel({"id":"_div_30870707","height":"50","backgroundColor":"#2A6E91","layout":"HBox","width":"100%"});
    var _div_25345731 = new Emp.Panel({"id":"_div_25345731","height":"100%","vAlign":"middle","hAlign":"left","width":"6"});
            _div_30870707.add(_div_25345731);
        var _div_12200531 = new Emp.Panel({"id":"_div_12200531","height":"100%","vAlign":"middle","hAlign":"left","width":"300"});
    var _img_3191448 = new Emp.Image({"id":"_img_3191448","height":"30","tag":"timg","width":"30","src":"/image/back.png"});
	_img_3191448.addEvent('onClick',goBack);
            _div_12200531.add(_img_3191448);
        var _label_18689477 = new Emp.Label({"id":"_label_18689477","color":"#DDDDDD","tag":"title","value":"邮件推送通知","fontSize":"18"});
	_label_18689477.addEvent('onClick',goBack);
            _div_12200531.add(_label_18689477);
                _div_30870707.add(_div_12200531);
        var _div_11004759 = new Emp.Panel({"id":"_div_11004759","height":"100%","vAlign":"middle","hAlign":"right","width":"100%"});
    var _img_4961455 = new Emp.Image({"id":"_img_4961455","height":"30","tag":"timg","width":"30","src":"/image/config.png"});
	_img_4961455.addEvent('onClick',goBack);
            _div_11004759.add(_img_4961455);
                _div_30870707.add(_div_11004759);
        var _div_4413067 = new Emp.Panel({"id":"_div_4413067","height":"100%","vAlign":"middle","hAlign":"left","width":"8"});
            _div_30870707.add(_div_4413067);
                _div_8145379.add(_div_30870707);
        var _div_15127635 = new Emp.Panel({"id":"_div_15127635","height":"100%","backgroundColor":"#DDDDDD","width":"100%"});
    var listview = new Emp.ListView({"id":"listview","height":"100%","width":"100%"});

    var _template_16975711 = new Emp.Panel({"id":"_template_16975711"});
_template_16975711.__isTemplate=true;
    var _div_31010065 = new Emp.Panel({"id":"_div_31010065","height":"180","layout":"VBox","width":"100%"});
    var _div_18725136 = new Emp.Panel({"id":"_div_18725136","height":"40","layout":"HBox","width":"100%"});
    var _div_6348160 = new Emp.Panel({"id":"_div_6348160","height":"100%","vAlign":"middle","hAlign":"center","width":"80"});
    var _label_23987942 = new Emp.Label({"id":"_label_23987942","color":"#000000","tag":"lspace","fontSize":"20"});
            _div_6348160.add(_label_23987942);
                _div_18725136.add(_div_6348160);
        var _div_8850093 = new Emp.Panel({"id":"_div_8850093","height":"100%","vAlign":"middle","hAlign":"center","width":"100%"});
    var _label_30271546 = new Emp.Label({"id":"_label_30271546","color":"#111111","tag":"time","fontSize":"14"});
            _div_8850093.add(_label_30271546);
                _div_18725136.add(_div_8850093);
        var _div_21587429 = new Emp.Panel({"id":"_div_21587429","height":"100%","vAlign":"middle","hAlign":"center","width":"80"});
    var _label_29412667 = new Emp.Label({"id":"_label_29412667","color":"#000000","tag":"rspace","fontSize":"20"});
            _div_21587429.add(_label_29412667);
                _div_18725136.add(_div_21587429);
                _div_31010065.add(_div_18725136);
        var _div_14818556 = new Emp.Panel({"id":"_div_14818556","height":"100%","layout":"HBox","width":"100%"});
    var _div_14492785 = new Emp.Panel({"id":"_div_14492785","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
    var _label_8628325 = new Emp.Label({"id":"_label_8628325","color":"#000000","tag":"lspace","fontSize":"20"});
            _div_14492785.add(_label_8628325);
                _div_14818556.add(_div_14492785);
        var _div_27568962 = new Emp.Panel({"id":"_div_27568962","height":"100%","backgroundColor":"#FFFFFF","layout":"VBox","width":"100%"});
    var _div_31959573 = new Emp.Panel({"id":"_div_31959573","height":"100%","vAlign":"middle","hAlign":"left","width":"100%"});
    var _label_5209335 = new Emp.Label({"id":"_label_5209335","color":"#DDDDDD","tag":"ll","value":" ","fontSize":"18"});
            _div_31959573.add(_label_5209335);
        var _label_9790276 = new Emp.Label({"id":"_label_9790276","color":"#000000","tag":"mtitle","fontSize":"20"});
            _div_31959573.add(_label_9790276);
                _div_27568962.add(_div_31959573);
        var _div_27804206 = new Emp.Panel({"id":"_div_27804206","height":"100%","vAlign":"middle","hAlign":"left","width":"100%"});
    var _label_26279881 = new Emp.Label({"id":"_label_26279881","color":"#DDDDDD","tag":"ll","value":"  ","fontSize":"18"});
            _div_27804206.add(_label_26279881);
        var _label_8980685 = new Emp.Label({"id":"_label_8980685","color":"#DDDDDD","tag":"mcontent","fontSize":"18"});
            _div_27804206.add(_label_8980685);
                _div_27568962.add(_div_27804206);
        var _div_10544294 = new Emp.Panel({"id":"_div_10544294","height":"100%","vAlign":"middle","hAlign":"left","width":"100%"});
    var _input_17002614 = new Emp.Button({"id":"_input_17002614","height":"40","value":"回复消息"});
	_input_17002614.addEvent('onClick',function(){alert('弹出选择框，优选回复消息，可以选择回复邮件。')});
            _div_10544294.add(_input_17002614);
        var _input_13401223 = new Emp.Button({"id":"_input_13401223","height":"40","value":"语音通话"});
	_input_13401223.addEvent('onClick',function(){alert('弹出选择框，选择免费语音或者拨打电话。确认WIFI环境，通过流量免费通话。')});
            _div_10544294.add(_input_13401223);
        var _label_17014834 = new Emp.Label({"id":"_label_17014834","color":"#DDDDDD","tag":"mfrom","fontSize":"14"});
            _div_10544294.add(_label_17014834);
        var _label_17461423 = new Emp.Label({"id":"_label_17461423","color":"#DDDDDD","tag":"ll","value":" ","fontSize":"18"});
            _div_10544294.add(_label_17461423);
                _div_27568962.add(_div_10544294);
                _div_14818556.add(_div_27568962);
        var _div_7086305 = new Emp.Panel({"id":"_div_7086305","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
    var _label_14860577 = new Emp.Label({"id":"_label_14860577","color":"#000000","tag":"rspace","fontSize":"20"});
            _div_7086305.add(_label_14860577);
                _div_14818556.add(_div_7086305);
                _div_31010065.add(_div_14818556);
                _template_16975711.add(_div_31010065);
                listview.setTemplate(_template_16975711,"_template_16975711");
    
            _div_15127635.add(listview);
                _div_8145379.add(_div_15127635);
               Emp.page.add(_div_8145379);
			

var index = 1;
var items = [
	{
		time : "2014-08-15 12:40",
		mtitle : "8月份工资单",
		mcontent : "8月份工资单,本月工资共100,000 USD,扣税2,000USD.注意查看账户。……",
		mfrom : "人力资源部",
		action : ""
	},
	{
		time : "2014-08-15 12:40",
		mtitle : "瑜伽有形，健康无价……",
		mcontent : "瑜伽有形，健康无价——普元第二季瑜伽公开课，欢迎报名！……",
		mfrom : "徐艳琴",
		action : ""
	},
	{
		time : "2014-08-15 12:40",
		mtitle : "Re: Re: 请帮忙尽快把对外所有投入人员工时发给我，多谢！",
		mcontent : "你在这边的工时怎么统计出来啊？你都是报工在对外经贸信托项目？2014-08-19徐茂贵……",
		mfrom : "徐茂贵",
		action : ""
	},
	{
		time : "2014-08-15 12:40",
		mtitle : "	Re:回复: 关于 外贸信托 按钮标签封装进度 ",
		mcontent : "岳辛：    你好，信托这边的工作，春力负责标签的生成，我负责具体弹出页面，页面数据查询，……",
		mfrom : "邸学寅",
		action : ""
	},
	{
		time : "2014-08-15 12:40",
		mtitle : "8月份工资单",
		mcontent : "8月份工资单",
		mfrom : "人力资源部",
		action : ""
	},
	{
		time : "2014-08-15 12:40",
		mtitle : "	Re: Fw: 求助：5大行分行IT建设方面资料 ",
		mcontent : "绝对重量级 PPT--  焦烈焱",
		mfrom : "焦烈炎",
		action : ""
	},
	{
		time : "2014-08-15 12:40",
		mtitle : "	答复: 本周末的培训我参加不了了",
		mcontent : "收到。成燕",
		mfrom : "人力资源部",
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