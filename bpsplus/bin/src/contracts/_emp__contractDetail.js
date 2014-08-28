   Emp.page.setId('_BODY_30292652');
	var _div_7208816 = new Emp.Panel({"id":"_div_7208816","height":"40","backgroundColor":"#bbbbbb","layout":"hBox","width":"100%"});
    var _div_27077613 = new Emp.Panel({"id":"_div_27077613","height":"100%","vAlign":"middle","hAlign":"center","width":"100"});
    var _input_28245885 = new Emp.Label({"id":"_input_28245885","value":"曹立磊 "});
            _div_27077613.add(_input_28245885);
                _div_7208816.add(_div_27077613);
        var _div_500448 = new Emp.Panel({"id":"_div_500448","height":"100%","vAlign":"middle","hAlign":"right"});
    var _input_22434932 = new Emp.Label({"id":"_input_22434932","value":" | "});
            _div_500448.add(_input_22434932);
                _div_7208816.add(_div_500448);
        var _div_12766459 = new Emp.Panel({"id":"_div_12766459","height":"100%","vAlign":"middle","hAlign":"right"});
    var _input_18854586 = new Emp.Label({"id":"_input_18854586","value":"手机号有误请戳我 "});
	_input_18854586.addEvent('onClick',remark);
            _div_12766459.add(_input_18854586);
                _div_7208816.add(_div_12766459);
        var _div_982796 = new Emp.Panel({"id":"_div_982796","height":"100%","vAlign":"middle","hAlign":"right"});
    var _input_9078138 = new Emp.Label({"id":"_input_9078138","value":" | "});
            _div_982796.add(_input_9078138);
                _div_7208816.add(_div_982796);
        var _div_4268385 = new Emp.Panel({"id":"_div_4268385","height":"100%","vAlign":"middle","hAlign":"right","width":"100%"});
    var pentacleimg = new Emp.Image({"id":"pentacleimg","height":"30","width":"30","src":"/image/phone/pentacle1.png"});
	pentacleimg.addEvent('onClick',common);
            _div_4268385.add(pentacleimg);
                _div_7208816.add(_div_4268385);
               Emp.page.add(_div_7208816);
		var _div_32582991 = new Emp.Panel({"id":"_div_32582991","height":"100%","width":"100%"});
    var listviewdetail = new Emp.ListView({"dividerVisible":"true","id":"listviewdetail","height":"100%","width":"100%"});

    var _template_28660739 = new Emp.Panel({"id":"_template_28660739"});
_template_28660739.__isTemplate=true;
    var _div_27173964 = new Emp.Panel({"id":"_div_27173964","height":"40","layout":"hBox","width":"100%"});
    var _div_3443673 = new Emp.Panel({"id":"_div_3443673","height":"100%","vAlign":"middle","hAlign":"left","width":"60"});
    var _label_29971895 = new Emp.Label({"id":"_label_29971895","color":"#000000","tag":"name","fontSize":"20"});
            _div_3443673.add(_label_29971895);
                _div_27173964.add(_div_3443673);
        var _div_18508941 = new Emp.Panel({"id":"_div_18508941","height":"100%","vAlign":"middle","hAlign":"left","width":"200"});
    var _label_30197921 = new Emp.Label({"id":"_label_30197921","color":"#000000","tag":"value","fontSize":"20"});
            _div_18508941.add(_label_30197921);
                _div_27173964.add(_div_18508941);
        var _div_25681836 = new Emp.Panel({"id":"_div_25681836","height":"100%","vAlign":"middle","hAlign":"right","width":"100%"});
    var _img_23965602 = new Emp.Image({"id":"_img_23965602","height":"35","tag":"operimg","width":"35"});
            _div_25681836.add(_img_23965602);
                _div_27173964.add(_div_25681836);
                _template_28660739.add(_div_27173964);
                listviewdetail.setTemplate(_template_28660739,"_template_28660739");
    
            _div_32582991.add(listviewdetail);
               Emp.page.add(_div_32582991);
			

var index = 0;
var itemscll = [
	{
		name : "部门",
		value : "华北技术二部",
		operimg: ""
	},
	{
		name : "手机",
		value : "18611735102",
		operimg: "/image/phone/phone.png"
	},
	{
		name : "办公",
		value : "01062698005",
		operimg: "/image/phone/tel.png"
	},
	{
		name : "邮箱",
		value: "caoll@primeton.com",
		operimg: "/image/phone/email.png"
	},
	{
		name : "QQ",
		value : "1010100",
		operimg: "/image/phone/QQM.png"
	},
	{
		name : "微信",
		value : "10090980",
		operimg: "/image/phone/chat.png"
	},
	{
		name : "主页",
		value : "http://primeton.com",
		operimg: "/image/phone/network.png"
	}

];
listviewdetail.setItems(itemscll);

listviewdetail.reloadData();
 
 
listviewdetail.addEvent("onItemClick", function(row, tag, data) {
	if(row=="1" || row=="2"){
		<!--  拨打电话 -->
		Utils.tel(data.value);
	}else if(row=="3"){
		<!-- 发送邮件 -->
		var email = new $M.Email();
  		email.setTo(data.value); 
  		email.setCc("caoll@primeton.com");
  		email.setBcc("caoll@primeton.com");
  		email.setSubject("emp测试");
  		email.setBody("通信录邮件发送测试");
  		email.show();
	}else if(row=="6"){
		Emp.page.goTo(data.action);
		
	}else{
		Emp.page.goTo(data.action, {name : data.name});
	}
});
	
function remark(){
	alert(itemscll[1].value+"有误，系统已标记，会通知维护人员");
};

function common(){
	var count= (index++)%2;
	if(count == 0){
		pentacleimg.setSrc("/image/phone/pentacle2.png");
		alert("已添加到您的常用联系人中");
	}else{
		pentacleimg.setSrc("/image/phone/pentacle1.png");
		alert("取消关联");
	}
}



     Emp.page.render();