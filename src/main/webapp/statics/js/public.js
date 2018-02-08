var canChange = true;

$(function(){
	/* change password begin */
	$("#psd-change").click(function(){
		$("#oldPsd").val("").next().html("").show();
		$("#newPsd").val("").next().html("").show();
		$("#newPsdAgain").val("").next().html("").show();
	});
	$("#oldPsd").on("change, input, keyup", function(){
		var dom = $(this);
		if(!validateEmpty(dom, "请输入原密码")){
			canChange = false;
		} else {
			canChange = true;
		}
	});
	$("#newPsd").on("change, input, keyup", function(){
		var dom = $(this);
		if(!validateEmpty(dom, "请输入新密码")){
			canChange = false;
		} else if(!validateSame()){
			canChange = false;
		} else {
			canChange = true;
		}
	});
	$("#newPsdAgain").on("change, input, keyup", function(){
		var dom = $(this);
		if(!validateEmpty(dom, "请确认新密码")){
			canChange = false;
		} else if(!validateSame()){
			canChange = false;
		} else {
			canChange = true;
		}
	});
	$("#change-psd-form").submit(function(e){
		e.preventDefault();
		if(!canChange) return;
		
		var oldDom = $("#oldPsd");
		var newDom = $("#newPsd");
		var againDom = $("#newPsdAgain");
		if(!validateEmpty(oldDom, "请输入原密码")) return;
		if(!validateEmpty(newDom, "请输入新密码")) return;
		if(!validateEmpty(againDom, "请确认新密码")) return;
		if(!validateSame()) return;
		
		changePsd();
	});
	/* change password end */
});

var validateEmpty = function(obj, msg){
	var value = obj.val().replace(/^[\s\t ]+|[\s\t ]+$/g, '');
	if(value.length == 0){
		obj.next().html(msg).show();
		return false;
	} else {
		obj.next().html("").hide();
		return true;
	}
};

var validateLength = function(obj, min, max, msg){
	var value = obj.val().replace(/^[\s\t ]+|[\s\t ]+$/g, '');
	if(value.length < min || value.length > max){
		obj.next().html(msg).show();
		return false;
	} else {
		obj.next().html("").hide();
		return true;
	}
};

// for assignment : end date can not be less than publish date 
var validateDate = function(publishDate, obj, msg){
	var value = obj.val().replace(/^[\s\t ]+|[\s\t ]+$/g, '');
	var p_year = publishDate.substring(0, 4);
	var p_month = publishDate.substring(5, 7);
	var p_day = publishDate.substring(8, 10);
	var e_year = value.substring(0, 4);
	var e_month = value.substring(5, 7);
	var e_day = value.substring(8, 10);
	var judge = true;
	if(p_year > e_year){
		judge = false;
	} else if(p_year == e_year){
		if(p_month > e_month){
			judge = false;
		} else if(p_month == e_month){
			if(p_day > e_day){
				judge = false;
			}
		}
	} 
	if(!judge){
		obj.next().html(msg).show();
		return false;
	} else {
		obj.next().html("").hide();
		return true;
	}
};

var validateFile = function(obj, msg){
	if(obj[0].files == undefined) return true;
	var value = obj[0].files;
	if(value.length > 6){
		obj.next().html(msg).show();
		return false;
	} else {
		obj.next().html("").hide();
		return true;
	}
};

function validateSame(){
	var psd = $("#newPsd").val().replace(/^[\s\t ]+|[\s\t ]+$/g, '');
	var psdAgain = $("#newPsdAgain").val().replace(/^[\s\t ]+|[\s\t ]+$/g, '');
	if(psd != psdAgain){
		$("#newPsdAgain").next().html("两个新密码不一致").show();
		return false;
	} else {
		$("#newPsdAgain").next().html("").hide();
		return true;
	}
}

function changePsd(){
	$.ajax({
		url: "homepage.do?method=changePsd",
		type: "post",
		data: $("#change-psd-form").serialize(),
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				$("#oldPsd").next().html("").hide();
				$("#change-psd").modal("hide");
			} else if(returnData.returnCode == 0){
				$("#oldPsd").next().html(returnData.returnMsg).show();
			} else {
				alert(returnData.returnMsg);
			}
		},
		error: function(){
			alert("修改密码失败");
		}
	});
}

function loadPagination(dom, page, cur){
	if(page<0 || cur<0) return;
	if(cur>page) return;
	
	dom.html("");
	if(page == 0){
		// do nothing
	} else if(page == 1){
		// dom.html("<li><a href='javascript:void(0);'>1</a></li>");
	} else{
		dom.append("<li page='1' class='prevPage'><a href='javascript:void(0);'>&laquo;</a></li>");
		if(page <= 6){
			for(var i=1; i<=page; i++){
				if(cur == i){
					dom.append("<li page="+ i +" class='active'><a href='javascript:void(0);'>"+ i +"</a></li>");
				} else {
					dom.append("<li page="+ i +"><a href='javascript:void(0);'>"+ i +"</a></li>");
				}
			}
		} else {
			dom.append("<li class='active' page='1'><a href='javascript:void(0);'>1</a></li>");
			dom.append("<li class='omit-left'><a href='javascript:void(0);'>...</a></li>");
			for(var i=2; i<page; i++){
				dom.append("<li page="+ i +"><a href='javascript:void(0);'>"+ i +"</a></li>");
			}
			dom.append("<li class='omit-right'><a href='javascript:void(0);'>...</a></li>");
			dom.append("<li page="+ page +"><a href='javascript:void(0);'>"+ page +"</a></li>");
			showHidePage(page, cur);
		}
		dom.append("<li page='2' class='nextPage'><a href='javascript:void(0);'>&raquo;</a></li>");
		
		if(cur == 1){
			$(".prevPage").addClass("disabled");
		}
		if(cur == page){
			$(".nextPage").addClass("disabled");
		}
	}
}

function showHidePage(page, cur){
	if(cur <= 3){
		$(".omit-left").hide();
		for(var i=1; i<=3; i++){
			$("ul.pagination li[page="+ i +"]:not(.prevPage, .nextPage)").show();
		}
		for(var i=4; i<=page; i++){
			$("ul.pagination li[page="+ i +"]:not(.prevPage, .nextPage)").hide();
		}
		$(".omit-right").show();
	} else if(cur < page-2){
		$(".omit-left").show();
		$("ul.pagination li[page=1]").show();
		for(var i=2; i<=page; i++){
			$("ul.pagination li[page="+ i +"]:not(.prevPage, .nextPage)").hide();
		}
		for(var i=cur-1; i<=parseInt(cur)+1; i++){
			$("ul.pagination li[page="+ i +"]:not(.prevPage, .nextPage)").show();
		}
		$(".omit-right").show();
	} else {
		$(".omit-left").show();
		for(var i=page; i>=page-2; i--){
			$("ul.pagination li[page="+ i +"]:not(.prevPage, .nextPage)").show();
		}
		for(var i=1; i<page-2; i++){
			$("ul.pagination li[page="+ i +"]:not(.prevPage, .nextPage)").hide();
		}
		$(".omit-right").hide();
	}
	$("ul.pagination li").removeClass("active");
	$("ul.pagination li[page="+ cur +"]").addClass("active");
}