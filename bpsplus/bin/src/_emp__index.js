   Emp.page.setId('_BODY_17968560');
	var _div_7711615 = new Emp.Panel({"id":"_div_7711615","height":"45","backgroundColor":"#2A6E91","vAlign":"middle","hAlign":"center","layout":"HBox","width":"100%"});
    var _div_21904334 = new Emp.Panel({"id":"_div_21904334","height":"100%","vAlign":"middle","hAlign":"center","width":"100"});
    var dev = new Emp.Label({"id":"dev","color":"#FFFFFF","value":"微行","fontSize":"18"});
            _div_21904334.add(dev);
                _div_7711615.add(_div_21904334);
        var _div_23721919 = new Emp.Panel({"id":"_div_23721919","height":"100%","vAlign":"middle","hAlign":"right","width":"100%"});
    var _img_541773 = new Emp.Image({"id":"_img_541773","height":"26","tag":"timg","width":"26","src":"/image/search.png"});
	_img_541773.addEvent('onClick',goMain);
            _div_23721919.add(_img_541773);
        var other = new Emp.Label({"id":"other","value":"     ","fontSize":"18"});
            _div_23721919.add(other);
        var _img_21947584 = new Emp.Image({"id":"_img_21947584","height":"26","tag":"timg","width":"26","src":"/image/configs.png"});
	_img_21947584.addEvent('onClick',goPass);
            _div_23721919.add(_img_21947584);
        var other = new Emp.Label({"id":"other","value":"     ","fontSize":"18"});
            _div_23721919.add(other);
        var _img_11973928 = new Emp.Image({"id":"_img_11973928","height":"26","tag":"timg","width":"26","src":"/image/account.png"});
	_img_11973928.addEvent('onClick',showDailog);
            _div_23721919.add(_img_11973928);
                _div_7711615.add(_div_23721919);
        var _div_19891890 = new Emp.Panel({"id":"_div_19891890","height":"100%","vAlign":"middle","hAlign":"center","width":"10"});
    var test = new Emp.Label({"id":"test","value":"","fontSize":"18"});
            _div_19891890.add(test);
                _div_7711615.add(_div_19891890);
               Emp.page.add(_div_7711615);
		var mmls = new Emp.Panel({"position":"absolute","id":"mmls","height":"10","backgroundColor":"#000000","tag":"n","width":"100%","display":"false"});
           Emp.page.add(mmls);
		var confluence = new Emp.Panel({"id":"confluence","height":"40","vAlign":"middle","hAlign":"center","layout":"HBox","width":"100%"});
    var test = new Emp.Panel({"id":"test","height":"100%","vAlign":"middle","hAlign":"center","width":"100%"});
	test.addEvent('onClick',clickTest1);
    var dev = new Emp.Label({"id":"dev","color":"#0077EC","value":"信息","fontSize":"18"});
            test.add(dev);
        var _input_16371022 = new Emp.Label({"id":"_input_16371022","color":"#FF0000","value":"18","fontSize":"12"});
            test.add(_input_16371022);
                confluence.add(test);
        var _div_1439188 = new Emp.Panel({"id":"_div_1439188","height":"100%","vAlign":"middle","hAlign":"center","width":"100%"});
	_div_1439188.addEvent('onClick',clickTest2);
    var test = new Emp.Label({"id":"test","value":"创造","fontSize":"18"});
            _div_1439188.add(test);
        var _input_30336715 = new Emp.Label({"id":"_input_30336715","color":"#FF0000","value":"●","fontSize":"14"});
            _div_1439188.add(_input_30336715);
                confluence.add(_div_1439188);
        var _div_9589708 = new Emp.Panel({"id":"_div_9589708","height":"100%","vAlign":"middle","hAlign":"center","width":"100%"});
	_div_9589708.addEvent('onClick',clickTest3);
    var other = new Emp.Label({"id":"other","value":"企业通讯录","fontSize":"18"});
            _div_9589708.add(other);
                confluence.add(_div_9589708);
               Emp.page.add(confluence);
		var _div_9274024 = new Emp.Panel({"id":"_div_9274024","height":"3","width":"100%"});
    var mark = new Emp.Panel({"position":"absolute","id":"mark","height":"3","backgroundColor":"#0077EC","width":"120","display":"true"});
            _div_9274024.add(mark);
               Emp.page.add(_div_9274024);
		var _div_25784080 = new Emp.Panel({"id":"_div_25784080","height":"0.5","backgroundColor":"#AAAAAA","width":"100%"});
           Emp.page.add(_div_25784080);
		var mainSilde = new Emp.SlidePage({"id":"mainSilde"});
					mainSilde.addUrl("/message/message.html")
						mainSilde.addUrl("/create/create.html")
						mainSilde.addUrl("/contracts/contracts.html")
	           Emp.page.add(mainSilde);
		var configdialog = new Emp.CustomDialog({"id":"configdialog","height":"100%","width":"100%","canceledOnTouchOutside":"true"});

	var _div_33086494 = new Emp.Panel({"id":"_div_33086494","height":"100%","backgroundColor":"#FFFFFF","vAlign":"top","hAlign":"center","width":"100%"});
    var _input_20667004 = new Emp.Label({"id":"_input_20667004","value":"我的弹出窗口"});
            _div_33086494.add(_input_20667004);
        var _input_28415222 = new Emp.Button({"id":"_input_28415222","value":"close"});
	_input_28415222.addEvent('onClick',closeDailog);
            _div_33086494.add(_input_28415222);
                configdialog.setView(_div_33086494);
        		


mainSilde.addEvent("onChange",function(o,n){   
	  if(n=="0")     
	   {    
		    dev.setColor("#0077EC");
		    test.setColor("#000000");
		    other.setColor("#000000");
		    move(120,0);
	   }
	    if(n=="1")   
	   {   
		    dev.setColor("#000000");
		    test.setColor("#0077EC");
		    other.setColor("#000000");  
		    if(o=="0"){
		    	move(0,120);	
		    }
		    else{
		    	move(240,120);
		    }
	   } 
	    if(n=="2")     
	   {          
		    dev.setColor("#000000");
		    test.setColor("#000000");
		    other.setColor("#0077EC");
		    move(120,240);
	   }
	});
    function clickTest1(){
    	mainSilde.setSelectedIndex("0");
    }
    function clickTest2(){
    	mainSilde.setSelectedIndex("1");
    }
    function clickTest3(){
    	mainSilde.setSelectedIndex("2");
    }
    
    function move(fx,tx){
		mark.clearAnimation();
		var an1 = new $M.TranslateAnimation({
			fromX :fx,
			toX : tx,
			toY : 0,
			fromY : 0, 
			duration : 250
		});         
		mark.addAnimation(an1);
		mark.startAnimation();
	}
	function start(){
		if(mmls.getTag()=="d"){
			mmls.setTag("n");
			mmls.setDisplay(false);
		}else{
			mmls.setDisplay(true);
			mmls.setTag("d");
		}
	}
	
	function showDailog(){
		configdialog.show();
	}
	function closeDailog(){
		configdialog.close();
	}
	function scanCode(){
		Utils.startBarCodeScanner(function(content){alert(content)});
	}
	function goPass(){
		Emp.page.goTo("/security/password.html");
	}
	function goMain(){
		Emp.page.goTo("/main.html");
	}


     Emp.page.render();