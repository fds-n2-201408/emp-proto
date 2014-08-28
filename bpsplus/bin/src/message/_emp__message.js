   Emp.page.setId('_BODY_20578315');
	var _div_14214731 = new Emp.Panel({"id":"_div_14214731","height":"100%","layout":"VBox","width":"100%"});
    var listview = new Emp.ListView({"id":"listview","height":"100%","width":"100%"});

    var _template_28456767 = new Emp.Panel({"id":"_template_28456767"});
_template_28456767.__isTemplate=true;
    var _div_21580177 = new Emp.Panel({"id":"_div_21580177","height":"60","layout":"VBox","width":"100%"});
    var _div_8187660 = new Emp.Panel({"id":"_div_8187660","height":"100%","vAlign":"middle","layout":"HBox","hAlign":"left","width":"100%"});
    var _div_3289182 = new Emp.Panel({"id":"_div_3289182","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
            _div_8187660.add(_div_3289182);
        var _div_17141587 = new Emp.Panel({"id":"_div_17141587","height":"100%","vAlign":"middle","hAlign":"left","width":"40"});
    var _img_300741 = new Emp.Image({"id":"_img_300741","height":"40","tag":"timg","width":"40"});
            _div_17141587.add(_img_300741);
                _div_8187660.add(_div_17141587);
        var _div_21399168 = new Emp.Panel({"id":"_div_21399168","height":"100%","vAlign":"top","hAlign":"left","width":"15"});
    var _label_19422970 = new Emp.Label({"id":"_label_19422970","color":"#FF0000","tag":"new","fontSize":"15"});
            _div_21399168.add(_label_19422970);
                _div_8187660.add(_div_21399168);
        var _div_24358727 = new Emp.Panel({"id":"_div_24358727","height":"60","layout":"VBox","width":"100%"});
    var _div_33067610 = new Emp.Panel({"id":"_div_33067610","height":"30","layout":"HBox","width":"100%"});
    var _div_5265888 = new Emp.Panel({"id":"_div_5265888","height":"100%","vAlign":"bottom","hAlign":"left","width":"100%"});
    var _label_20750088 = new Emp.Label({"id":"_label_20750088","color":"#000000","tag":"name","fontSize":"16"});
            _div_5265888.add(_label_20750088);
                _div_33067610.add(_div_5265888);
        var _div_15532108 = new Emp.Panel({"id":"_div_15532108","height":"100%","vAlign":"middle","hAlign":"right","width":"100"});
    var _label_28221415 = new Emp.Label({"id":"_label_28221415","color":"#bbbbbb","tag":"ldate","fontSize":"14"});
            _div_15532108.add(_label_28221415);
                _div_33067610.add(_div_15532108);
                _div_24358727.add(_div_33067610);
        var _div_25436835 = new Emp.Panel({"id":"_div_25436835","height":"100%","vAlign":"middle","hAlign":"left","width":"100%"});
    var _label_33429979 = new Emp.Label({"id":"_label_33429979","color":"#bbbbbb","tag":"lmessage","fontSize":"15"});
            _div_25436835.add(_label_33429979);
                _div_24358727.add(_div_25436835);
                _div_8187660.add(_div_24358727);
                _div_21580177.add(_div_8187660);
        var _div_22260249 = new Emp.Panel({"id":"_div_22260249","height":"0.5","backgroundColor":"#AAAAAA","width":"100%"});
            _div_21580177.add(_div_22260249);
                _template_28456767.add(_div_21580177);
                listview.setTemplate(_template_28456767,"_template_28456767");
    
            _div_14214731.add(listview);
        var _div_29647213 = new Emp.Panel({"id":"_div_29647213","height":"0.5","backgroundColor":"#999999","width":"100%"});
            _div_14214731.add(_div_29647213);
               Emp.page.add(_div_14214731);
			

var items = [
	{
		timg : "/image/email1.png",
		name : "邮件消息推送" ,
		new : "4",
		ldate : "刚刚 14:30",
		lmessage : "8月工资单，你这个月工资十万元 USD。",
		action : "/message/mailSession.html"
	},
	{
		timg : "/image/bps.png",
		name : "流程中心" ,
		new : "2",
		ldate : "今天 9:45",
		lmessage : "您的一笔报销款与昨天已经通过审批……",
		action : "/flowTrace/taskList.html"
	},
	{
		timg : "/image/1.jpg",
		name : "曹立磊" ,
		new : "2",
		ldate : "刚刚 14:31",
		lmessage : "系统马上建设完毕，请关注。",
		action : "/message/session.html"
	},
	{
		timg : "/image/oal.jpg",
		name : "移动办公" ,
		new : "4",
		ldate : "刚刚 14:31",
		lmessage : "您的一笔报销款与昨天已经通过审批……",
		action : "/mdo/mdo.html"
	},
	{
		timg : "/image/crmm.jpg",
		name : "CRM通知" ,
		new : "2",
		ldate : "今天 9:30",
		lmessage : "客户'雷军'已经通过审批，等待联系……",
		action : "/systems/crm.html"
	},
	{
		timg : "/image/esbs.jpg",
		name : "ESB监控" ,
		new : "2",
		ldate : "今天 9:10",
		lmessage : "今天共有10个新服务上线，请关注。",
		action : "/systems/esb.html"
	},
	{
		timg : "/image/xindais.jpg",
		name : "网贷通知" ,
		new : "1",
		ldate : "今天 9:00",
		lmessage : "贷款'0002312'存在兑付风险，请关注",
		action : "/systems/xindail.html"
	},
	{
		timg : "/image/company.jpg",
		name : "公司通知" ,
		new : "1",
		ldate : "今天 9:00",
		lmessage : "春节放假，从除夕到正月十五共20天…",
		action : "/systems/broadcast.html"
	},
	{
		timg : "/image/4.png",
		name : "刘春力" ,
		new : "",
		ldate : "昨天",
		lmessage : "对外经贸信托还有几个事情没有处理。",
		action : "/message/session.html"
	},
	{
		timg : "/image/2.jpg",
		name : "高鹏飞" ,
		new : "",
		ldate : "前天",
		lmessage : "测试环境即将完成。",
		action : "/message/session.html"
	},
	{
		timg : "/image/3.png",
		name : "刘晶" ,
		new : "",
		ldate : "前天",
		lmessage : "测试环境即将完成。",
		action : "/message/session.html"
	},
	{
		timg : "/image/4.png",
		name : "黄林" ,
		new : "",
		ldate : "前天",
		lmessage : "中信银行的支持这个月底到期。",
		action : "/message/session.html"
	},
	{
		timg : "/image/5.jpg",
		name : "邸学寅" ,
		new : "",
		ldate : "前天",
		lmessage : "流程平台启动存在问题。",
		action : "/message/session.html"
	},
	{
		timg : "/image/6.jpg",
		name : "朱江" ,
		new : "",
		ldate : "前天",
		lmessage : "没事儿打个台球去？",
		action : "/message/session.html"
	},
	{
		timg : "/image/7.png",
		name : "赵丽玲" ,
		new : "",
		ldate : "很早",
		lmessage : "测试脚本刚刚完成。",
		action : "/message/session.html"
	},
	{
		timg : "/image/8.jpg",
		name : "焦烈炎" ,
		new : "",
		ldate : "很早",
		lmessage : "去美国的DEMO方案请尽快提交。",
		action : "/message/session.html"
	},
		{
		timg : "/image/9.jpg",
		name : "司建伟" ,
		new : "",
		ldate : "很早",
		lmessage : "周六要进行一次中层培训。",
		action : "/message/session.html"
	},
	{
		timg : "/image/10.jpg",
		name : "周立" ,
		new : "",
		ldate : "很早",
		lmessage : "给晋商银行的材料尽快准备。",
		action : "/message/session.html"
	}
];

listview.setItems(items);
listview.addEvent("onItemClick", function(row, tag, data) {
	log(data.action)
	Emp.page.goTo(data.action);
});


     Emp.page.render();