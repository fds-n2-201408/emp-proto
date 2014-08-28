   Emp.page.setId('_BODY_10693301');
	var _div_4780602 = new Emp.Panel({"id":"_div_4780602","height":"50","backgroundColor":"#2A6E91","layout":"HBox","width":"100%"});
    var _div_18270794 = new Emp.Panel({"id":"_div_18270794","height":"100%","vAlign":"middle","hAlign":"left","width":"6"});
            _div_4780602.add(_div_18270794);
        var _div_20639749 = new Emp.Panel({"id":"_div_20639749","height":"100%","vAlign":"middle","hAlign":"left","width":"300"});
    var _img_6543851 = new Emp.Image({"id":"_img_6543851","height":"30","tag":"timg","width":"30","src":"/image/back.png"});
	_img_6543851.addEvent('onClick',goBack);
            _div_20639749.add(_img_6543851);
        var _label_24632507 = new Emp.Label({"id":"_label_24632507","color":"#DDDDDD","tag":"title","value":"贷款申请","fontSize":"18"});
	_label_24632507.addEvent('onClick',goBack);
            _div_20639749.add(_label_24632507);
                _div_4780602.add(_div_20639749);
        var _div_3974880 = new Emp.Panel({"id":"_div_3974880","height":"100%","vAlign":"middle","hAlign":"right","width":"100%"});
    var _img_32498490 = new Emp.Image({"id":"_img_32498490","height":"30","tag":"timg","width":"30","src":"/image/config.png"});
	_img_32498490.addEvent('onClick',goBack);
            _div_3974880.add(_img_32498490);
                _div_4780602.add(_div_3974880);
        var _div_3081790 = new Emp.Panel({"id":"_div_3081790","height":"100%","vAlign":"middle","hAlign":"left","width":"8"});
            _div_4780602.add(_div_3081790);
               Emp.page.add(_div_4780602);
		var _div_21157553 = new Emp.Panel({"id":"_div_21157553","height":"60","layout":"VBox","width":"100%"});
    var _div_18690400 = new Emp.Panel({"id":"_div_18690400","height":"100%","vAlign":"middle","layout":"HBox","hAlign":"left","width":"100%"});
    var _div_26522347 = new Emp.Panel({"id":"_div_26522347","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
            _div_18690400.add(_div_26522347);
        var _div_24017063 = new Emp.Panel({"id":"_div_24017063","height":"100%","vAlign":"middle","hAlign":"left","width":"40"});
    var _img_28521540 = new Emp.Image({"id":"_img_28521540","height":"40","width":"40","src":"/flow/progress1.png"});
            _div_24017063.add(_img_28521540);
                _div_18690400.add(_div_24017063);
        var _div_2923733 = new Emp.Panel({"id":"_div_2923733","height":"100%","vAlign":"top","hAlign":"left","width":"15"});
    var _label_15492105 = new Emp.Label({"id":"_label_15492105","color":"#FF0000","tag":"new","fontSize":"15"});
            _div_2923733.add(_label_15492105);
                _div_18690400.add(_div_2923733);
        var _div_26985674 = new Emp.Panel({"id":"_div_26985674","height":"60","layout":"VBox","width":"100%"});
    var _div_26526257 = new Emp.Panel({"id":"_div_26526257","height":"30","layout":"HBox","width":"100%"});
    var _div_22621468 = new Emp.Panel({"id":"_div_22621468","height":"100%","vAlign":"bottom","hAlign":"left","width":"100%"});
    var _label_27306959 = new Emp.Label({"id":"_label_27306959","color":"#000000","tag":"name","value":"完成7步，剩余2步，预计1天内完成。","fontSize":"16"});
            _div_22621468.add(_label_27306959);
                _div_26526257.add(_div_22621468);
                _div_26985674.add(_div_26526257);
        var _div_24096026 = new Emp.Panel({"id":"_div_24096026","height":"100%","vAlign":"middle","hAlign":"left","width":"100%"});
    var _label_13472513 = new Emp.Label({"id":"_label_13472513","color":"#bbbbbb","tag":"lmessage","value":"徐茂贵，刘春力，邸学寅等人通过审批。","fontSize":"15"});
            _div_24096026.add(_label_13472513);
                _div_26985674.add(_div_24096026);
                _div_18690400.add(_div_26985674);
                _div_21157553.add(_div_18690400);
        var _div_7233929 = new Emp.Panel({"id":"_div_7233929","height":"2","backgroundColor":"#CCCCCC","width":"100%"});
            _div_21157553.add(_div_7233929);
               Emp.page.add(_div_21157553);
		var _div_12940512 = new Emp.Panel({"id":"_div_12940512","height":"100%","layout":"VBox","width":"100%"});
    var listview = new Emp.ListView({"id":"listview","height":"100%","width":"100%","enablePullDown":"true"});
	listview.addEvent('onLoadMore',refresh);

    var _template_16429665 = new Emp.Panel({"id":"_template_16429665"});
_template_16429665.__isTemplate=true;
    var _div_13970147 = new Emp.Panel({"id":"_div_13970147","height":"60","layout":"VBox","width":"100%"});
    var _div_15913164 = new Emp.Panel({"id":"_div_15913164","height":"100%","vAlign":"middle","layout":"HBox","hAlign":"left","width":"100%"});
    var _div_23737825 = new Emp.Panel({"id":"_div_23737825","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
            _div_15913164.add(_div_23737825);
        var _div_32993154 = new Emp.Panel({"id":"_div_32993154","height":"100%","vAlign":"middle","hAlign":"left","width":"40"});
    var _img_28959664 = new Emp.Image({"id":"_img_28959664","height":"40","tag":"timg","width":"40"});
            _div_32993154.add(_img_28959664);
                _div_15913164.add(_div_32993154);
        var _div_18052408 = new Emp.Panel({"id":"_div_18052408","height":"100%","vAlign":"top","hAlign":"left","width":"15"});
    var _label_7657232 = new Emp.Label({"id":"_label_7657232","color":"#FF0000","tag":"new","fontSize":"15"});
            _div_18052408.add(_label_7657232);
                _div_15913164.add(_div_18052408);
        var _div_13858916 = new Emp.Panel({"id":"_div_13858916","height":"60","layout":"VBox","width":"100%"});
    var _div_25505352 = new Emp.Panel({"id":"_div_25505352","height":"30","layout":"HBox","width":"100%"});
    var _div_10596644 = new Emp.Panel({"id":"_div_10596644","height":"100%","vAlign":"bottom","hAlign":"left","width":"100%"});
    var _label_24433833 = new Emp.Label({"id":"_label_24433833","color":"#000000","tag":"name","fontSize":"16"});
            _div_10596644.add(_label_24433833);
                _div_25505352.add(_div_10596644);
        var _div_20293131 = new Emp.Panel({"id":"_div_20293131","height":"100%","vAlign":"middle","hAlign":"right","width":"100"});
    var _label_19413380 = new Emp.Label({"id":"_label_19413380","color":"#bbbbbb","tag":"ldate","fontSize":"14"});
            _div_20293131.add(_label_19413380);
                _div_25505352.add(_div_20293131);
                _div_13858916.add(_div_25505352);
        var _div_30950182 = new Emp.Panel({"id":"_div_30950182","height":"100%","vAlign":"middle","hAlign":"left","width":"100%"});
    var _label_18905040 = new Emp.Label({"id":"_label_18905040","color":"#bbbbbb","tag":"lmessage","fontSize":"15"});
            _div_30950182.add(_label_18905040);
        var _label_10091607 = new Emp.Label({"id":"_label_10091607","color":"#FF0000","tag":"call","hAlign":"right","fontSize":"15"});
            _div_30950182.add(_label_10091607);
                _div_13858916.add(_div_30950182);
                _div_15913164.add(_div_13858916);
                _div_13970147.add(_div_15913164);
        var _div_25552730 = new Emp.Panel({"id":"_div_25552730","height":"0.5","backgroundColor":"#AAAAAA","width":"100%"});
            _div_13970147.add(_div_25552730);
                _template_16429665.add(_div_13970147);
                listview.setTemplate(_template_16429665,"_template_16429665");
    
            _div_12940512.add(listview);
        var _div_1565495 = new Emp.Panel({"id":"_div_1565495","height":"0.5","backgroundColor":"#999999","width":"100%"});
            _div_12940512.add(_div_1565495);
               Emp.page.add(_div_12940512);
			


var items = [
	{
		timg : "/flow/hightlghtR.png",
		name : "等待放款" ,
		new : "",
		ldate : "刚刚 14:30",
		lmessage : "等待 宋岳辛 审批，可以直接联系。",
		call : "联系",
		action : "/mdo/mdo.html"
	},
	{
		timg : "/flow/hightlghtG.png",
		name : "公司VP审批" ,
		new : "",
		ldate : "刚刚 14:31",
		lmessage : "周立 同意，注意风险控制。",
		action : "/mdo/mdo.html"
	},
	{
		timg : "/flow/hightlghtG.png",
		name : "财务审批" ,
		new : "",
		ldate : "刚刚 14:31",
		lmessage : "曹立磊 财务指标没有问题。",
		action : "/message/session.html"
	},
	{
		timg : "/flow/hightlghtG.png",
		name : "相关部门会签" ,
		new : "",
		ldate : "今天 9:45",
		lmessage : "刘晶 高鹏飞 黄林等七人同意了该请求。",
		action : "/message/session.html"
	},
	{
		timg : "/flow/hightlghtG.png",
		name : "部门审批" ,
		new : "",
		ldate : "今天 9:30",
		lmessage : "刘春力 同意",
		action : "/systems/crm.html"
	},
	{
		timg : "/flow/hightlghtG.png",
		name : "填写合同" ,
		new : "",
		ldate : "今天 9:10",
		lmessage : "您填写了 贷款申请 申请了￥13,332。",
		action : "/systems/esb.html"
	},
	{
		timg : "/flow/hightlghtG.png",
		name : "开始" ,
		new : "",
		ldate : "今天 9:00",
		lmessage : "流程已启动等待下一步操作。",
		action : "/systems/xindail.html"
	}
];

listview.setItems(items);
listview.addEvent("onItemClick", function(row, tag, data) {
	log(data.action);
	Emp.page.goTo(data.action);
});
function goBack(){
	Emp.page.goBack();
}
<!-- 下拉刷新 -->
function refresh(eventype){
	if(eventype == "pullDown" ){
		listview.resetScroller();
		alert("没有更新");
	}
};


     Emp.page.render();