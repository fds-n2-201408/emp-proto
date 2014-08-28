   Emp.page.setId('_BODY_4233970');
	var _div_24951901 = new Emp.Panel({"id":"_div_24951901","height":"50","backgroundColor":"#2A6E91","layout":"HBox","width":"100%"});
    var _div_3316256 = new Emp.Panel({"id":"_div_3316256","height":"100%","vAlign":"middle","hAlign":"left","width":"6"});
            _div_24951901.add(_div_3316256);
        var _div_2415408 = new Emp.Panel({"id":"_div_2415408","height":"100%","vAlign":"middle","hAlign":"left","width":"300"});
    var _img_28463966 = new Emp.Image({"id":"_img_28463966","height":"30","tag":"timg","width":"30","src":"/image/back.png"});
	_img_28463966.addEvent('onClick',goBack);
            _div_2415408.add(_img_28463966);
        var _label_8340548 = new Emp.Label({"id":"_label_8340548","color":"#DDDDDD","tag":"title","value":"流程追踪","fontSize":"18"});
	_label_8340548.addEvent('onClick',goBack);
            _div_2415408.add(_label_8340548);
                _div_24951901.add(_div_2415408);
        var _div_22737816 = new Emp.Panel({"id":"_div_22737816","height":"100%","vAlign":"middle","hAlign":"right","width":"100%"});
    var _img_3054732 = new Emp.Image({"id":"_img_3054732","height":"30","tag":"timg","width":"30","src":"/image/config.png"});
	_img_3054732.addEvent('onClick',goBack);
            _div_22737816.add(_img_3054732);
                _div_24951901.add(_div_22737816);
        var _div_2606615 = new Emp.Panel({"id":"_div_2606615","height":"100%","vAlign":"middle","hAlign":"left","width":"8"});
            _div_24951901.add(_div_2606615);
               Emp.page.add(_div_24951901);
		var _div_20857170 = new Emp.Panel({"id":"_div_20857170","height":"40","layout":"VBox","width":"100%"});
    var _div_3316016 = new Emp.Panel({"id":"_div_3316016","height":"100%","vAlign":"middle","layout":"HBox","hAlign":"left","width":"100%"});
    var _div_31927494 = new Emp.Panel({"id":"_div_31927494","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
            _div_3316016.add(_div_31927494);
        var _input_2923242 = new Emp.Date({"id":"_input_2923242","height":"40","width":"170","name":"date","value":"2014-01-01"});
            _div_3316016.add(_input_2923242);
        var _div_7242494 = new Emp.Panel({"id":"_div_7242494","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
            _div_3316016.add(_div_7242494);
        var _input_22688132 = new Emp.Text({"id":"_input_22688132","height":"60","width":"130","name":"search"});
            _div_3316016.add(_input_22688132);
        var _img_6877069 = new Emp.Image({"id":"_img_6877069","height":"40","width":"40","src":"/flow/search.jpg"});
            _div_3316016.add(_img_6877069);
        var _div_21438867 = new Emp.Panel({"id":"_div_21438867","height":"100%","vAlign":"middle","hAlign":"center","width":"20"});
            _div_3316016.add(_div_21438867);
                _div_20857170.add(_div_3316016);
        var _div_15563039 = new Emp.Panel({"id":"_div_15563039","height":"2","backgroundColor":"#CCCCCC","width":"100%"});
            _div_20857170.add(_div_15563039);
               Emp.page.add(_div_20857170);
		var _div_11215173 = new Emp.Panel({"id":"_div_11215173","height":"100%","layout":"VBox","width":"100%"});
    var listview = new Emp.ListView({"id":"listview","height":"100%","width":"100%","enablePullDown":"true"});
	listview.addEvent('onLoadMore',refresh);

    var _template_12058529 = new Emp.Panel({"id":"_template_12058529"});
_template_12058529.__isTemplate=true;
    var _div_32492916 = new Emp.Panel({"id":"_div_32492916","height":"60","layout":"VBox","width":"100%"});
    var _div_10064443 = new Emp.Panel({"id":"_div_10064443","height":"100%","vAlign":"middle","layout":"HBox","hAlign":"left","width":"100%"});
    var _div_5213685 = new Emp.Panel({"id":"_div_5213685","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
            _div_10064443.add(_div_5213685);
        var _div_15785035 = new Emp.Panel({"id":"_div_15785035","height":"100%","vAlign":"middle","hAlign":"left","width":"40"});
    var _img_17745814 = new Emp.Image({"id":"_img_17745814","height":"40","tag":"timg","width":"40"});
            _div_15785035.add(_img_17745814);
                _div_10064443.add(_div_15785035);
        var _div_22117813 = new Emp.Panel({"id":"_div_22117813","height":"100%","vAlign":"top","hAlign":"left","width":"15"});
    var _label_18101587 = new Emp.Label({"id":"_label_18101587","color":"#FF0000","tag":"new","fontSize":"15"});
            _div_22117813.add(_label_18101587);
                _div_10064443.add(_div_22117813);
        var _div_28896803 = new Emp.Panel({"id":"_div_28896803","height":"60","layout":"VBox","width":"100%"});
    var _div_1719741 = new Emp.Panel({"id":"_div_1719741","height":"30","layout":"HBox","width":"100%"});
    var _div_13333916 = new Emp.Panel({"id":"_div_13333916","height":"100%","vAlign":"bottom","hAlign":"left","width":"100%"});
    var _label_26634672 = new Emp.Label({"id":"_label_26634672","color":"#000000","tag":"name","fontSize":"16"});
            _div_13333916.add(_label_26634672);
                _div_1719741.add(_div_13333916);
        var _div_32818561 = new Emp.Panel({"id":"_div_32818561","height":"100%","vAlign":"middle","hAlign":"right","width":"70"});
    var _label_13804393 = new Emp.Label({"id":"_label_13804393","color":"#bbbbbb","tag":"ldate","fontSize":"14"});
            _div_32818561.add(_label_13804393);
                _div_1719741.add(_div_32818561);
                _div_28896803.add(_div_1719741);
        var _div_15106167 = new Emp.Panel({"id":"_div_15106167","height":"100%","vAlign":"middle","hAlign":"left","width":"100%"});
    var _label_16526354 = new Emp.Label({"id":"_label_16526354","color":"#bbbbbb","tag":"lmessage","fontSize":"15"});
            _div_15106167.add(_label_16526354);
                _div_28896803.add(_div_15106167);
                _div_10064443.add(_div_28896803);
                _div_32492916.add(_div_10064443);
        var _div_28404445 = new Emp.Panel({"id":"_div_28404445","height":"0.5","backgroundColor":"#AAAAAA","width":"100%"});
            _div_32492916.add(_div_28404445);
                _template_12058529.add(_div_32492916);
                listview.setTemplate(_template_12058529,"_template_12058529");
    
            _div_11215173.add(listview);
        var _div_14619292 = new Emp.Panel({"id":"_div_14619292","height":"0.5","backgroundColor":"#999999","width":"100%"});
            _div_11215173.add(_div_14619292);
               Emp.page.add(_div_11215173);
			

var items = [
	{
		timg : "/flow/hetong.png",
		name : "合同 等待放款 ￥10,231" ,
		new : "●",
		ldate : "刚刚 14:30",
		lmessage : "完成75%，预计还有1天时间",
		action : "/flowTrace/flowtrace.html"
	},
	{
		timg : "/flow/hetong.png",
		name : "合同 等待放款 ￥23,231" ,
		new : "●",
		ldate : "刚刚 14:31",
		lmessage : "您的一笔报销款与昨天已经通过审批……",
		action : "/flowTrace/flowtrace.html"
	},
	{
		timg : "/flow/loan.png",
		name : "贷款 等待授信 ￥990,231" ,
		new : "●",
		ldate : "刚刚 14:31",
		lmessage : "系统马上建设完毕，请关注。",
		action : "/flowTrace/flowtrace.html"
	},
	{
		timg : "/flow/loan.png",
		name : "贷款 发起  ￥3,000,231" ,
		new : "",
		ldate : "今天 9:45",
		lmessage : "您的一笔报销款与昨天已经通过审批……",
		action : "/flowTrace/flowtrace.html"
	},
	{
		timg : "/flow/loan.png",
		name : "贷款 央行征信  ￥3,000,231" ,
		new : "",
		ldate : "今天 9:30",
		lmessage : "客户'雷军'已经通过审批，等待联系……",
		action : "/flowTrace/flowtrace.html"
	},
	{
		timg : "/flow/check.jpg",
		name : "付款 等待放款 ￥10,231" ,
		new : "",
		ldate : "今天 9:10",
		lmessage : "今天共有10个新服务上线，请关注。",
		action : "/flowTrace/flowtrace.html"
	},
	{
		timg : "/flow/hetong.png",
		name : "合同 等待放款 ￥10,231" ,
		new : "",
		ldate : "今天 9:00",
		lmessage : "贷款'0002312'存在兑付风险，请关注",
		action : "/flowTrace/flowtrace.html"
	},
	{
		timg : "/flow/xiangmu.jpg",
		name : "项目 等待放款 ￥10,231" ,
		new : "",
		ldate : "今天 9:00",
		lmessage : "春节放假，从除夕到正月十五共20天…",
		action : "/flowTrace/flowtrace.html"
	},
	{
		timg : "/flow/xiangmu.jpg",
		name : "项目 等待放款 ￥10,231" ,
		new : "",
		ldate : "昨天",
		lmessage : "对外经贸信托还有几个事情没有处理。",
		action : "/flowTrace/flowtrace.html"
	},
	{
		timg : "/flow/check.jpg",
		name : "付款 等待放款 ￥10,231" ,
		new : "",
		ldate : "前天",
		lmessage : "测试环境即将完成。",
		action : "/flowTrace/flowtrace.html"
	},
	{
		timg : "/flow/loan.png",
		name : "贷款 等待放款 ￥10,231" ,
		new : "",
		ldate : "前天",
		lmessage : "测试环境即将完成。",
		action : "/flowTrace/flowtrace.html"
	},
	{
		timg : "/flow/xiangmu.jpg",
		name : "项目 等待放款 ￥10,231" ,
		new : "",
		ldate : "前天",
		lmessage : "中信银行的支持这个月底到期。",
		action : "/flowTrace/flowtrace.html"
	},
	{
		timg : "/flow/hetong.png",
		name : "合同 等待放款 ￥10,231" ,
		new : "",
		ldate : "前天",
		lmessage : "流程平台启动存在问题。",
		action : "/flowTrace/flowtrace.html"
	},
	{
		timg : "/flow/xiangmu.jpg",
		name : "项目 等待放款 ￥10,231" ,
		new : "",
		ldate : "前天",
		lmessage : "没事儿打个台球去？",
		action : "/flowTrace/flowtrace.html"
	},
	{
		timg : "/flow/hetong.png",
		name : "合同 等待放款 ￥10,231" ,
		new : "",
		ldate : "很早",
		lmessage : "测试脚本刚刚完成。",
		action : "/flowTrace/flowtrace.html"
	},
	{
		timg : "/flow/check.jpg",
		name : "付款 等待放款 ￥10,231" ,
		new : "",
		ldate : "很早",
		lmessage : "去美国的DEMO方案请尽快提交。",
		action : "/flowTrace/flowtrace.html"
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