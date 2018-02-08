var curPage = 1;
var totalPage;

loadStatus();

$(function(){
	$("#content").on("input keyup change", function(){
		calRest();
	});
	
	$(".published-part .read-option span").on("click", function(){
		var _this = $(this);
		$(".published-part .read-option span").removeClass("selected");
		_this.addClass("selected");
		
		// change tab -> curPage must be 1
		curPage = 1;
		
		if(_this.hasClass("all")){
			loadStatus();
		} else if(_this.hasClass("course")){
			loadCourseStatus();
		} else if(_this.hasClass("teacher")){
			loadTeacherStatus();
		} else if(_this.hasClass("friend")){
			loadFriendStatus();
		} else if(_this.hasClass("self")){
			loadSelfStatus();
		}
	});
	
	$("#publishment-list").delegate(".reply-toggle", "click", function(){
		var faceIcon = $(".simpleInfo-part").find("img").attr("src");
		$(this).parent().parent().next().children().eq(0).children().eq(0).children().eq(0).attr("src", faceIcon);
	});
	$("#publishment-list").delegate(".reply-in", "click", function(){
		var faceIcon = $(".simpleInfo-part").find("img").attr("src");
		$(this).parent().next().children().eq(0).attr("src", faceIcon);
	});
	
	$("#publish-form").submit(function(e){
		e.preventDefault();
		publish();
	});
	
	$("ul.pagination").delegate("li", "click", function(){
    	var dom = $(this);
    	if(dom.hasClass("disabled") || dom.hasClass("omit-left") || dom.hasClass("omit-right")) 
 	    return;
 	    		
    	if(dom.hasClass("prevPage")){
    		$(".prevPage").attr("page", --curPage );
    	} else if(dom.hasClass("nextPage")){
    		$(".nextPage").attr("page", ++curPage );
    	} else {
    		$(".prevPage").attr("page", (curPage-1) );
    		$(".nextPage").attr("page", (curPage+1) );
    		curPage = $(this).attr("page");
    	}
    	$("#pageNo").val(curPage);
		
		var _tabs = $(".read-option span");
		if(_tabs.eq(0).hasClass("selected")){
			loadStatus();
		} else if(_tabs.eq(1).hasClass("selected")){
			loadCourseStatus();
		} else if(_tabs.eq(2).hasClass("selected")){
			loadTeacherStatus();
		} else if(_tabs.eq(3).hasClass("selected")){
			loadFriendStatus();
		} else if(_tabs.eq(4).hasClass("selected")){
			loadSelfStatus();
		}
	});
	
	$.views.helpers({
		transFaceIcon: function(faceIcon){
			if(faceIcon == null || faceIcon.length == 0){
				return basePath + "/resource/img/blank.jpg";
			} else {
				return basePath + faceIcon;
			}
		},
		transFace: function(content){
			return transWords(content);
		},
		showFiles: function(fileList){
			var resultImg = "";
			var resultOther = "";
			for(var i=0; i<fileList.length; i++){
				var path = fileList[i].path;
				var pos = path.lastIndexOf(".");
				var type = path.substring(pos+1);
				if(type=="png" || type=="jpg" || type=="jpeg" || type=="bmp" || type=="gif"){
					resultImg += "<img class='img' src='"+ path +"' /> ";
				} else {
					var title = path.substring(34, pos);
					resultOther += "<br><a target='_blank' href='"+ path +"'>"
						+"<i class='glyphicon glyphicon-file'></i> "+ title +"</a>";
				}
			}
			if(resultImg == ""){
				resultOther = resultOther.substring(4);
			}
			var result = resultImg + resultOther;
			if(resultImg.length + resultOther.length > 0){
				result = "<span class='files-part'>" + result + "</span>";
			} else {
				result += "<br>";
			}
			return result;
		}
	});
});

function calRest(){
	var contentDom = $("#content");
	if(contentDom.val().length > 170){
		$("#publish-msg").html("您输入的内容太多啦").addClass("text-danger");
		$("#publish-btn").attr("disabled", true);
	} else {
		$("#publish-msg").removeClass("text-danger").html("还能输入<i id='rest-num'></i>个字");
		$("#rest-num").html(170 - parseInt(contentDom.val().length));
		if(contentDom.val().length == 0 || $("#publish-msg").prev().find("label").length > 0){
			$("#publish-btn").attr("disabled", true);
		} else {
			$("#publish-btn").attr("disabled", false);
		}
	}
}

function publish(){
	$.ajax({
		url: "homepage.do?method=publish",
		type: "POST",
		data: $("#publish-form").serialize() 
			+ serialize($("#publish-form .imgs li"), $("#publish-form .others li")),
		dataType: "json",
		success: function(returnData){
			$("#publish-btn").attr("disabled", true);
			if(returnData.returnCode > 0){
				$("#content").val("");
				$("#rest-num").html("170");
				$(".published-part .all").trigger("click");
			} else {
				$("#publish-fail").modal("show");
			}
			$("#publish-form .imgs").html("");
			$("#publish-form .others").html("");
			$("#publish-form .file-panel").attr("data-number", 0).hide();
			$("#publish-form input[type='file']").after("<input type='file' name='files' multiple>").remove();
			hideAll();
		},
		error: function(){
			$("#publish-fail").modal("show");
		}
	});
}

// load all status with pagination
function loadStatus(){
	$.ajax({
		url: "homepage.do?method=getStatusByUserId",
		type: "POST",
		data: {"userId": $("#curId").val(), "curPage": curPage},
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				totalPage = returnData.totalPage;
				renderStauts(returnData.status, returnData.statusReply);
				loadPagination($("ul.pagination"), totalPage, curPage);
				$("ul.pagination").show();
			} else if(returnData.returnCode == 0) {
				$("#publishment-list").html("<span class='msg'>暂时没有新鲜事哦~ 快去发布一条吧！</span>");
				$("ul.pagination").hide();
			} else {

			}
		},
		error: function(){

		}
	});
}

//load all courses's status with pagination
function loadCourseStatus(){
	$.ajax({
		url: "homepage.do?method=getCourseStatusByUserId",
		type: "POST",
		data: {"userId": $("#curId").val(), "curPage": curPage},
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				totalPage = returnData.totalPage;
				renderStauts(returnData.status, returnData.statusReply);
				loadPagination($("ul.pagination"), totalPage, curPage);
				$("ul.pagination").show();
			} else if(returnData.returnCode == 0) {
				$("#publishment-list").html("<span class='msg'>暂时没有课程状态哦~ </span>");
				$("ul.pagination").hide();
			} else {

			}
		},
		error: function(){

		}
	});
}

//load all teachers's status with pagination
function loadTeacherStatus(){
	$.ajax({
		url: "homepage.do?method=getTeacherStatusByUserId",
		type: "POST",
		data: {"userId": $("#curId").val(), "curPage": curPage},
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				totalPage = returnData.totalPage;
				renderStauts(returnData.status);
				loadPagination($("ul.pagination"), totalPage, curPage);
				$("ul.pagination").show();
			} else if(returnData.returnCode == 0) {
				$("#publishment-list").html("<span class='msg'>暂时没有老师发布的新鲜事哦~ </span>");
				$("ul.pagination").hide();
			} else {

			}
		},
		error: function(){

		}
	});
}

//load all friends's status with pagination
function loadFriendStatus(){
	$.ajax({
		url: "homepage.do?method=getFriendStatusByUserId",
		type: "POST",
		data: {"userId": $("#curId").val(), "curPage": curPage},
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				totalPage = returnData.totalPage;
				renderStauts(returnData.status, returnData.statusReply);
				loadPagination($("ul.pagination"), totalPage, curPage);
				$("ul.pagination").show();
			} else if(returnData.returnCode == 0) {
				$("#publishment-list").html("<span class='msg'>暂时没有好友发布的新鲜事哦~ </span>");
				$("ul.pagination").hide();
			} else {

			}
		},
		error: function(){

		}
	});
}

//load all self's status with pagination
function loadSelfStatus(){
	$.ajax({
		url: "homepage.do?method=getSelfStatusByUserId",
		type: "POST",
		data: {"userId": $("#curId").val(), "curPage": curPage},
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				totalPage = returnData.totalPage;
				renderStauts(returnData.status, returnData.statusReply);
				loadPagination($("ul.pagination"), totalPage, curPage);
				$("ul.pagination").show();
			} else if(returnData.returnCode == 0) {
				$("#publishment-list").html("<span class='msg'>还没有新鲜事哦~ 快去发布一条吧！</span>");
				$("ul.pagination").hide();
			} else {

			}
		},
		error: function(){

		}
	});
}

function renderStauts(status){
	var template = $.templates("#status-tmpl");
	$("#publishment-list").html(template.render(status));
}