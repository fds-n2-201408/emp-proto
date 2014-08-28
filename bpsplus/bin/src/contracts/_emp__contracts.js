   Emp.page.setId('_BODY_26005481');
	var _div_27658064 = new Emp.Panel({"id":"_div_27658064","height":"100%","layout":"HBox","width":"100%"});
    var _div_19543246 = new Emp.Panel({"id":"_div_19543246","height":"100%","width":"10"});
            _div_27658064.add(_div_19543246);
        var _div_32567601 = new Emp.Panel({"id":"_div_32567601","height":"100%","layout":"VBox","width":"100%"});
    var _div_23785194 = new Emp.Panel({"id":"_div_23785194","width":"100%","class":"overflow:hidden"});
    var listview = new Emp.ListView({"id":"listview","height":"100%","width":"100%","enablePullDown":"true"});
	listview.addEvent('onItemLongClick',openSession);
	listview.addEvent('onLoadMore',refresh);

    var _template_11668595 = new Emp.Panel({"id":"_template_11668595"});
_template_11668595.__isTemplate=true;
    var _div_21984577 = new Emp.Panel({"id":"_div_21984577","height":"56","layout":"VBox","width":"100%"});
    var _div_26935584 = new Emp.Panel({"id":"_div_26935584","height":"5","width":"100%"});
            _div_21984577.add(_div_26935584);
        var _div_23522851 = new Emp.Panel({"id":"_div_23522851","height":"45","layout":"hBox","width":"100%"});
    var _div_10241743 = new Emp.Panel({"id":"_div_10241743","height":"100%","vAlign":"middle","hAlign":"left","width":"100"});
    var _label_32296104 = new Emp.Label({"id":"_label_32296104","tag":"ltitle","fontSize":"14"});
            _div_10241743.add(_label_32296104);
        var _img_24135764 = new Emp.Image({"id":"_img_24135764","height":"40","tag":"pimg","width":"40"});
            _div_10241743.add(_img_24135764);
        var _label_10264379 = new Emp.Label({"id":"_label_10264379","value":"  ","fontSize":"16"});
            _div_10241743.add(_label_10264379);
        var _label_10088798 = new Emp.Label({"id":"_label_10088798","tag":"name","fontSize":"16"});
            _div_10241743.add(_label_10088798);
                _div_23522851.add(_div_10241743);
        var _div_11895511 = new Emp.Panel({"id":"_div_11895511","height":"100%","vAlign":"middle","layout":"HBox","hAlign":"left","width":"100%"});
    var _label_10557593 = new Emp.Label({"id":"_label_10557593","color":"#888888","tag":"phonenum","fontSize":"18"});
            _div_11895511.add(_label_10557593);
        var _label_5633419 = new Emp.Label({"id":"_label_5633419","value":"  ","fontSize":"16"});
            _div_11895511.add(_label_5633419);
        var _label_23826807 = new Emp.Label({"id":"_label_23826807","color":"#bbbbbb","tag":"dep","fontSize":"14"});
            _div_11895511.add(_label_23826807);
                _div_23522851.add(_div_11895511);
                _div_21984577.add(_div_23522851);
        var _div_18565764 = new Emp.Panel({"id":"_div_18565764","height":"5","width":"100%"});
            _div_21984577.add(_div_18565764);
        var _div_12147494 = new Emp.Panel({"id":"_div_12147494","height":"0.5","backgroundColor":"#AAAAAA","width":"100%"});
            _div_21984577.add(_div_12147494);
                _template_11668595.add(_div_21984577);
                listview.setTemplate(_template_11668595,"_template_11668595");
    
            _div_23785194.add(listview);
                _div_32567601.add(_div_23785194);
                _div_27658064.add(_div_32567601);
        var _div_17767990 = new Emp.Panel({"id":"_div_17767990","height":"100%","width":"24"});
    var a2zlist = new Emp.ListView({"id":"a2zlist","height":"100%","width":"100%"});

    var _template_1545971 = new Emp.Panel({"id":"_template_1545971"});
_template_1545971.__isTemplate=true;
    var _div_12019735 = new Emp.Panel({"id":"_div_12019735","height":"19","vAlign":"middle","hAlign":"center","layout":"VBox","width":"100%"});
    var _label_18006386 = new Emp.Label({"id":"_label_18006386","color":"#bbbbbb","tag":"a2z","fontSize":"16"});
            _div_12019735.add(_label_18006386);
                _template_1545971.add(_div_12019735);
                a2zlist.setTemplate(_template_1545971,"_template_1545971");
    
            _div_17767990.add(a2zlist);
                _div_27658064.add(_div_17767990);
               Emp.page.add(_div_27658064);
			


var items = [
	{
		ltitle: "",
		pimg: "/image/account.png",
		name : "我",
		phonenum : "18610380209",
		dep: "[华北技术二部]",
		action : "/contracts/contractDetail.html"
	},
	{
		ltitle: "C",
		pimg: " ",
		name : "",
		phonenum : "",
		dep: "",
		action : ""
	},
	{
		ltitle: "",
		pimg: "/image/1.jpg",
		name : "曹立磊",
		phonenum : "18611735102",
		dep: "[华北技术二部]",
		action : "/contracts/contractDetail.html"
	},
	{
		ltitle: "",
		pimg: "/image/2.jpg",
		name : "曹宗伟",
		phonenum : "18611735102",
		dep: "[产品部]",
		action : "/contracts/contractDetail.html"
	},
	{
		ltitle: "",
		pimg: "/image/5.jpg",
		name : "曹小琪",
		phonenum : "18611735102",
		dep: "[华东技术一部]",
		action : "/contracts/contractDetail.html"
	},
	{
		ltitle: "D",
		pimg: " ",
		name : "",
		phonenum : "",
		dep: "",
		action : ""
	},
	{
		ltitle: "",
		pimg: "/image/4.png",
		name : "邸学寅",
		phonenum : "18611735102",
		dep: "[华北技术二部]",
		action : "/contracts/contractDetail.html"
	},
	{
		ltitle: "F",
		pimg: " ",
		name : "",
		phonenum : "",
		dep : "",
		action : ""
	},
	{
		ltitle: "",
		pimg: "/image/5.jpg",
		name : "范星星",
		phonenum : "18611735102",
		dep: "[华北技术二部]",
		action : "/contracts/contractDetail.html"
	},
	{
		ltitle: "",
		pimg: "/image/8.jpg",
		name : "范鑫鹏",
		phonenum : "18611735102",
		dep: "[华北技术二部]",
		action : "/contracts/contractDetail.html"
	},
	{
		ltitle: "H",
		pimg: " ",
		name : "",
		phonenum : "",
		dep : "",
		action : ""
	},
	{
		ltitle: "",
		pimg: "/image/6.jpg",
		name : "黄林",
		phonenum : "18611735102",
		dep: "[华北技术二部]",
		action : "/contracts/contractDetail.html"
	},
	{
		ltitle: "",
		pimg: "/image/7.png",
		name : "胡福来",
		phonenum : "18611735102",
		dep: "[通用事业部]",
		action : "/contracts/contractDetail.html"
	},
	{
		ltitle: "",
		pimg: "/image/7.png",
		name : "郝振明",
		phonenum : "18611735102",
		dep: "[华北技术二部]",
		action : "/contracts/contractDetail.html"
	},
	{
		ltitle: "",
		pimg: "/image/9.jpg",
		name : "郝艳峰",
		phonenum : "18611735102",
		dep: "[产品部]",
		action : "/contracts/contractDetail.html"
	},
	{
		ltitle: "L",
		pimg: " ",
		name : "",
		phonenum : "",
		dep : "",
		action : ""
	},
	{
		ltitle: "",
		pimg: "/image/5.jpg",
		name : "刘春力",
		phonenum : "18611735102",
		dep: "[华北技术二部]",
		action : "/contracts/contractDetail.html"
	},
	{
		ltitle: "",
		pimg: "/image/6.jpg",
		name : "刘晶",
		phonenum : "18611735102",
		dep: "[华北技术二部]",
		action : "/contracts/contractDetail.html"
	},
	{
		ltitle: "S",
		pimg: " ",
		name : "",
		phonenum : "",
		dep : "",
		action : ""
	},
	{
		ltitle: "",
		pimg: "/image/4.png",
		name : "宋岳辛",
		phonenum : "18611735102",
		dep: "[华北技术二部]",
		action : "/contracts/contractDetail.html"
	},
	{
		ltitle: "X",
		pimg: " ",
		name : "",
		phonenum : "",
		dep : "",
		action : ""
	},
	{
		ltitle: "",
		pimg: "/image/5.jpg",
		name : "徐茂贵",
		phonenum : "18611735102",
		dep: "[华北技术二部]",
		action : "/contracts/contractDetail.html"
	}
];
listview.setItems(items);
listview.addEvent("onItemClick", function(row, tag, data) {
	Emp.page.goTo(data.action, {name : data.name});
});

<!-- 右边列表更新 -->
var a2zitem = [
	{
		a2z: "↑"
	},
	{
		a2z: "☆"
	},
	{
		a2z: "A"
	},
	{
		a2z: "B"
	},
	{
		a2z: "C"
	},
	{
		a2z: "D"
	},
	{
		a2z: "E"
	},
	{
		a2z: "F"
	},
	{
		a2z: "G"
	},
	{
		a2z: "H"
	},
	{
		a2z: "I"
	},
	{
		a2z: "J"
	},
	{
		a2z: "K"
	},
	{
		a2z: "L"
	},
	{
		a2z: "M"
	},
	{
		a2z: "N"
	},
	{
		a2z: "O"
	},
	{
		a2z: "P"
	},
	{
		a2z: "Q"
	},
	{
		a2z: "R"
	},
	{
		a2z: "S"
	},
	{
		a2z: "T"
	},
	{
		a2z: "U"
	},
	{
		a2z: "V"
	},
	{
		a2z: "W"
	},
	{
		a2z: "X"
	},
	{
		a2z: "Y"
	},
	{
		a2z: "Z"
	},
	{
		a2z: "#"
	}
];
a2zlist.setItems(a2zitem);

<!-- 下拉刷新 -->
function refresh(eventype){
	if(eventype == "pullDown" ){
		listview.resetScroller();
		alert("没有更新");
	}
};
		
function openSession(){
	Emp.page.goTo("/message/session.html");
}

function searchList(){
	alert("查找联系人");
}




     Emp.page.render();