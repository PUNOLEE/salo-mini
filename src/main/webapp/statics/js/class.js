var curPage = 1;
var totalPage;

$(function(){
	$("ul.nav.nav-tabs li").click(function(){
		// change tab -> curPage must be 1
		curPage = 1;

		var _this = $(this);
		$("ul.nav.nav-tabs li").removeClass("active");
		_this.addClass("active");
		
		var tab_no = _this.attr("data-target");
		var target = "#tab-" + tab_no;
		$("#change-content").html($(target).html());
		$("ul.pagination").show();
		
		switch(tab_no){
			case "2":
				loadAssignments(); break;
			case "3":
				loadPPTs(); break;
			case "4":
				loadTopics(); break;
			case "5":
				loadSources(); break;
			case "6":
				loadMyTopicsAndMySources(); 
				$("ul.pagination").hide();
				break;
			case "7":
				$("#to-action").attr("href","action.do?classId="+ $("#curClassId").val());
				loadClassmates();
				$("ul.pagination").hide();
				break;
		}
	});
	
	var href = window.location.href;
	var posTab = href.indexOf("tab=");
	if(posTab >= 0 && href[posTab+4]!=undefined){
		if(href[posTab+4] == '3'){
			$("ul#section-list li[data-target='3']").trigger("click");
		} else if(href[posTab+4] == '4'){
			$("ul#section-list li[data-target='4']").trigger("click");
		} else if(href[posTab+4] == '5'){
			$("ul#section-list li[data-target='5']").trigger("click");
		} else if(href[posTab+4] == '6'){
			$("ul#section-list li[data-target='6']").trigger("click");
		} else if(href[posTab+4] == '7'){
			$("ul#section-list li[data-target='7']").trigger("click");
		} else {
			$("ul#section-list li[data-target='2']").trigger("click");
		}
	} else {
		$("ul#section-list li[data-target='2']").trigger("click");
	}
	
	
	$("#change-content").delegate("a.assignment", "click", function(){
		$(this).closest("tr").next().toggle();
	});

    $("#change-content").delegate(".edit-answer", "click",  function(){
        var dom = $(this).closest("tr");
        $("#assignment-edit-form input[type='hidden']").val(dom.attr("data-id"));
        $("#assign-e-title").val(dom.children().eq(0).find("a").html());
        // REPLACE undo what has been done in ReplaceChar Class
        var content = dom.next().find("p").html();
        content = content.replace(/&lt;/g, "<");
        content = content.replace(/&gt;/g, ">");
        content = content.replace(/&nbsp;/g, " ");
        content = content.replace(/<br>/g, "");  // **** a little different
        $("#assign-e-content").val(content);
        $("#assign-e-publishDate").val(dom.children().eq(1).html());
        $("#assign-e-endDate").val(dom.children().eq(2).html());
        $("#needSubmit-e").prop("checked", dom.children().eq(3).attr("data-submit")=="true");
        $("#answer-edit-modal").modal("show");
    });
	
	$("#source-modal").delegate(".publishment .replied-list .reply-in", "click", function(){
		var dom = $(this).parent().next();
		dom.toggle();
	});
	$("#source-modal").delegate("#score-part i", "mouseover", function(){
		var level = $(this).attr("data-level");
		for(var i=0; i<level; i++){
			$("#score-part").children().eq(i).addClass("selected");
		}
		for(var i=level; i<5; i++){
			$("#score-part").children().eq(i).removeClass("selected");
		}
	});
	$("#source-modal").delegate("#score-part i", "mouseout", function(){
		var level = $("#score-part").attr("data-score");
		for(var i=0; i<level; i++){
			$("#score-part").children().eq(i).addClass("selected");
		}
		for(var i=level; i<5; i++){
			$("#score-part").children().eq(i).removeClass("selected");
		}
	});
	$("#source-modal").delegate("#score-part i", "click", function(){
		var level = $(this).attr("data-level");
		if(level > 5 || level < 0) return;  //avoid someone change code to submit
		var sourceId = $("#score-part").attr("data-source");
		setScore(sourceId, level);
	});
	
	$("#change-content").delegate("#search-btn", "click", function(){
		var key = $("#search-part input").val().replace(/^[\s\t ]+|[\s\t ]+$/g, '');
		if(key.length == 0) return;
		searchStudents(key);
	});
	
	$("#change-content").delegate(".switch-1", "click", function(){
		var _this = $(this);
		_this.next().css({"display":"inline-block"}).next().show();
		_this.prev().hide();
		_this.hide();
	});
	$("#change-content").delegate(".switch-2", "click", function(){
		var _this = $(this);
		_this.prev().prev().show().prev().show();
		_this.prev().hide();
		_this.hide();
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
		
		var tab_no = $("#section-list li.active").attr("data-target");
		if(tab_no == 1){
			loadClassStatus();
		} else if(tab_no == 2){
			loadAssignments();
		} else if(tab_no == 3){
			loadPPTs();
		} else if(tab_no == 4){
			loadTopics();
		} else if(tab_no == 5){
			loadSources();
		} else if(tab_no == 6){
			loadMyTopicsAndMySources();
		} else if(tab_no == 7){
			loadClassmates();
		}
	});
	
	/*  ************ TAB-2 ASSIGNMENT BEGIN ************  */
	$("#change-content").delegate("#assignment-publish", "click", function(){
		$("#assignment-title").val("").next().hide();
		$("#assignment-content").val("").next().hide();
		$("#assignment-endDate").val("").next().hide();
		$("#needSubmit").prop("checked", false);
	});

	$("#change-content").delegate(".del-assignment-trigger", "click",  function(){
		var assignmentId = $(this).closest("tr").attr("data-id");
		var title = $(this).attr("data-title");
		$("#confirm-del-assignment .modal-title span").html(title);
		$("#confirm-del-assignment input[type='hidden']").val(assignmentId);
		$("#confirm-del-assignment").modal("show");
	});
	$("#del-assignment-btn").click(function(){
		var assignmentId = $("#confirm-del-assignment input[type='hidden']").val();
		delAssignment(assignmentId);
	});
	$("#assignment-publish-form").submit(function(e){
		$("#assignment-publish-form input[type='submit']").attr("disabled", true);
		e.preventDefault();
		var titleDom = $("#assignment-title");
		var contentDom = $("#assignment-content");
		var endDateDom = $("#assignment-endDate");
		var date = new Date();
		var publishDate = date.getFullYear()+"-"+(date.getMonth()+1)+"-";
		if(date.getMonth() < 9){
			publishDate = date.getFullYear()+"-0"+(date.getMonth()+1)+"-";
		}
		if(date.getDate() < 10){
			publishDate += "0"+ date.getDate();
		} else {
			publishDate += date.getDate();
		}
		if(!validateEmpty(titleDom, "请输入作业标题")) return;
		if(!validateLength(titleDom, 1, 100, "作业标题的长度不能超过100")) return;
		if(!validateEmpty(contentDom, "请输入作业内容")) return;
		if(!validateEmpty(endDateDom, "请输入提交截止日期")) return;
		if(!validateDate(publishDate, endDateDom, "提交截止日期必须在发布日期之后")) return;
		publishAssignment();
	});
	$("#assignment-edit-form").submit(function(e){
		e.preventDefault();
		var titleDom = $("#assign-e-title");
		var contentDom = $("#assign-e-content");
		var endDateDom = $("#assign-e-endDate");
		var publishDate = $("#assign-e-publishDate").val();
		if(!validateEmpty(titleDom, "请输入作业标题")) return;
		if(!validateLength(titleDom, 1, 100, "作业标题的长度不能超过100")) return;
		if(!validateEmpty(contentDom, "请输入作业内容")) return;
		if(!validateEmpty(endDateDom, "请输入提交截止日期")) return;
		if(!validateDate(publishDate, endDateDom, "提交截止日期必须在发布日期之后")) return;
		editAssignment();
	});
	$("#change-content").delegate(".submit-assign-btn", "click",  function(){
		var assignmentId = $(this).closest("tr").attr("data-id");
		var userId = $("#curId").val();
		$("#assign-submit-form input[name='assignmentId']").val(assignmentId);
		$("#assign-submit-form input[name='userId']").val(userId);
		$("#assign-submit-form input[type='file']").next().hide();
		$("#assign-submit-form input[type='file']").after("<input type='file' name='assignFile' />").remove();
	});
	$("#assign-submit-form").submit(function(e){
		e.preventDefault();
		$("#assign-submit-form input[type='submit']").attr("disabled", true);
		var fileDom = $("#assign-submit-form input[type='file']");
		if(!validateEmpty(fileDom, "请选择作业文件")) return;
		$("#uploading").show();
		submitAssignment();  // 提交作业
	});
	$("#change-content").delegate(".load-answer", "click", function(){
		var assignmentId = $(this).closest("tr").attr("data-id");
		loadAnswer(assignmentId);
	});
	$("#change-content").delegate(".submit-answer", "click",  function(){
		var assignmentId = $(this).closest("tr").attr("data-id");
		$("#answer-submit-form input[name='assignmentId']").val(assignmentId);
		$("#answer-submit-form input[type='file']").after("<input type='file' name='answerFile' />").remove();
	});
	$("#answer-submit-form").submit(function(e){
		e.preventDefault();
		var fileDom = $("#answer-submit-form input[type='file']");
		if(!validateEmpty(fileDom, "请选择作业文件")) return;
		submitAnswer();  // 上传答案
	});
	$("#change-content").delegate("#submit-analyse", "click",  function(){
		submitAnalyse();
	});
	/*  ************ TAB-2 ASSIGNMENT END ************  */
	
	/*  ************ TAB-3 PPT BEGIN ************  */
	$("#change-content").delegate("#ppt-publish", "click", function(){
		$("#ppt-chapter").val("").next().hide();
		$("#ppt-title").val("").next().hide();
		$("#upload-ppt-form input[type='file']").next().hide();
		$("#upload-ppt-form input[type='file']").after("<input type='file' name='pptFile' />").remove();
	});
	$("#upload-ppt-form").submit(function(e){
		$("#upload-ppt-form input[type='submit']").attr("disabled", true);
		e.preventDefault();
		var chapterDom = $("#ppt-chapter");
		var titleDom = $("#ppt-title");
		var fileDom = $("#upload-ppt-form input[type='file']");
		if(!validateEmpty(chapterDom, "请输入课件对应的章节")) return;
		if(!validateEmpty(titleDom, "请输入课件标题")) return;
		if(!validateEmpty(fileDom, "请选择课件文件")) return;
		uploadPPT();
	});
	$("#change-content").delegate(".download-ppt", "click", function(){
		var pptId = $(this).parent().parent().attr("data-id");
		plusDownloadCount(pptId);
	});
	/*$("#change-content").delegate(".delete-ppt", "click", function(){
		var pptId = $(this).parent().parent().attr("data-id");
		deletePPT(pptId);
	});*/
	$("#change-content").delegate(".delete-ppt-trigger", "click",  function(){
		var pptId = $(this).closest("tr").attr("data-id");
		var title = $(this).attr("data-title");
		$("#confirm-del-ppt .modal-title span").html(title);
		$("#confirm-del-ppt input[type='hidden']").val(pptId);
		$("#confirm-del-ppt").modal("show");
	});
	$("#del-ppt-btn").click(function(){
		var pptId = $("#confirm-del-ppt input[type='hidden']").val();
		deletePPT(pptId);
	});
	/*  ************ TAB-3 PPT END ************  */
	
	/*  ************ TAB-4 TOPIC BEGIN ************  */
	$("#change-content").delegate(".topic-release", "click", function(){
		$("#topic-title").val("").next().hide();
		$("#topic-content").val("").next().hide();
		$("#topic-type-1").prop("checked", true);
	});
	$("#release-topic-form").submit(function(e){
		$("#release-topic-form input[type='submit']").attr("disabled", true);
		e.preventDefault();
		var titleDom = $("#topic-title");
		var contentDom = $("#topic-content");
		var fileDom = $("#topic-file");
		if(!validateEmpty(titleDom, "请输入标题")) {
			$("#release-topic-form input[type='submit']").attr("disabled", false);
			return;
		}
		if(!validateEmpty(contentDom, "请输入详细内容")) {
			$("#release-topic-form input[type='submit']").attr("disabled", false);
			return;
		}
		if(!validateFile(fileDom, "不能超过6个文件，请重新选择")) {
			$("#release-topic-form input[type='submit']").attr("disabled", false);
			return;
		}
		releaseTopic();
	});
	$("#change-content").delegate("#topic-list .topic-detail-trigger", "click", function(){
		var topicId = $(this).attr("data-id");
		getTopicDetails(topicId);
		loadTopics();
	});
	$("#topic-content-modal").delegate(".reply-in", "click", function(){
		var faceIcon = $("#curFaceIcon").val();
		$(this).parent().next().children().eq(0).attr("src", faceIcon);
	});
	$("#topic-content-modal").delegate(".reply-topic-btn", "click", function(){
		var content = $(this).parent().children().eq(1).val().replace(/^[\s\t ]+|[\s\t ]+$/g, '');
		if(content.length == 0) return;
		var topicId = $(this).parent().parent().parent().parent().attr("topic-id");
		topicId = topicId.substring(6, topicId.length);
		var toId = $(this).parent().attr("to-id");
		var dom = $(this).parent().parent().parent();
		if(!dom.hasClass("reply")){
			dom = dom.parent();
		}
		dom = dom.parent();
		var path = serialize2($(this).prev().children().eq(2).children(), $(this).prev().children().eq(3).children());
		replyTopic(topicId, $("#curId").val(), toId, content, dom, path);
	});
	$("#topic-content-modal").delegate(".mark-solved", "click", function(){
		var dom = $(this).parent().parent().parent();
		var topicId = dom.attr("topic-id");
		topicId = topicId.substring(6, topicId.length);
		markSolved(topicId, dom, false);
	});
	$("#topic-content-modal").delegate("#send-topic-to-course", "click", function(){
		var topicId = $(this).attr("data-id");
		sendTopicToCourse(topicId);
	});
	$("#source-modal").delegate("#send-source-to-course", "click", function(){
		var sourceId = $(this).attr("data-id");
		sendSourceToCourse(sourceId);
	});
	/*  ************ TAB-4 TOPIC END ************  */
	
	/*  ************ TAB-5 SOURCE BEGIN ************  */
	$("#change-content").delegate(".source-upload", "click", function(){
		$("#source-type").val(1);
		$("#source-file").val("").next().hide();
		$("#upload-source-form input[type='file']").after(
				"<input type='file' name='sourceFiles' id='source-file' multiple='multiple' />").remove();
	});
	$("#upload-source-form").submit(function(e){
		$("#upload-source-form button[type='submit']").attr("disabled", true);
		e.preventDefault();
		var fileDom = $("#source-file");
		if(!validateEmpty(fileDom, "请选择资源文件")) return;
		uploadSource();
	});
	$("#change-content").delegate("#source-list .source-detail-trigger", "click", function(){
		var sourceId = $(this).attr("data-id");
		getSourceDetails(sourceId);
		loadSources();  // refresh kickCount
	});
	$("#source-modal").delegate(".download-source", "click", function(){
		var sourceId = $(this).parent().parent().attr("data-id");
		plusSourceDownloadCount(sourceId);
	});
	$("#source-modal").delegate(".reply-source-btn", "click", function(){
		var content = $(this).parent().children().eq(1).val().replace(/^[\s\t ]+|[\s\t ]+$/g, '');
		if(content.length == 0) return;
		var sourceId = $(this).parent().parent().parent().parent().attr("source-id");
		var dom = $(this).parent().parent().parent().parent().parent().parent();
		var path = serialize2($(this).prev().children().eq(2).children(), $(this).prev().children().eq(3).children());
		replySource(sourceId, $("#curId").val(), content, dom, path);
	});
	/*  ************ TAB-5 SOURCE END ************  */
	
	/*  ************ TAB-6 MY TOPICS & SOURCES BEGIN ************  */
	$("#change-content").delegate("#my-topics .topic-detail-trigger", "click", function(){
		var topicId = $(this).attr("data-id");
		getTopicDetails(topicId);
		loadMyTopicsAndMySources();
	});
	$("#change-content").delegate("#my-sources .source-detail-trigger", "click", function(){
		var sourceId = $(this).attr("data-id");
		getSourceDetails(sourceId);
		loadMyTopicsAndMySources();
	});
	$("#change-content").delegate(".mark-solved", "click", function(){
		var topicId = $(this).attr("topic-id");
		markSolved(topicId, undefined, true);
	});
	$("#change-content").delegate(".edit-source-trigger", "click", function(){
		var sourceId = $(this).attr("data-id");
		$("#source-edit-form input[name='sourceId']").val(sourceId);
		$("#edit-source-title").val($(this).closest("tr").children().eq(1).find("a").html()).next().hide();
		$("#edit-source-type").val($(this).closest("tr").attr("data-type")).next().hide();
		var desc = $(this).closest("tr").attr("data-desc");
		desc = desc.replace(/&lt;/g, "<");
		desc = desc.replace(/&gt;/g, ">");
		desc = desc.replace(/&nbsp;/g, " ");
		desc = desc.replace(/<br>/g, "");
		$("#edit-description").val(desc).next().hide();
		$("#source-edit-modal").modal("show");
	});
	$("#change-content").delegate(".del-topic", "click", function(){
		var topicId = $(this).attr("topic-id");
		var title = $(this).attr("topic-title");
		$("#confirm-del-topic .modal-title span").html(title);
		$("#confirm-del-topic input[type='hidden']").val(topicId);
		$("#confirm-del-topic").modal("show");
	});
	$("#del-topic-btn").click(function(){
		var topicId = $("#confirm-del-topic input[type='hidden']").val();
		deleteTopic(topicId);
	});
	$("#source-edit-form").submit(function(e){
		e.preventDefault();
		var titleDom = $("#edit-source-title");
		var descDom = $("#edit-description");
		if(!validateEmpty(titleDom, "请输入资源标题")) return;
		if(!validateLength(descDom, 1, 170, "资源简介的长度不能超过170")) return;
		editSource();
	});
	$("#change-content").delegate(".del-source-trigger", "click", function(){
		var sourceId = $(this).attr("data-id");
		var title = $(this).attr("data-title");
		$("#confirm-del-source .modal-title span").html(title);
		$("#confirm-del-source input[type='hidden']").val(sourceId);
		$("#confirm-del-source").modal("show");
	});
	$("#del-source-btn").click(function(){
		var sourceId = $("#confirm-del-source input[type='hidden']").val();
		deleteSource(sourceId);
	});
	/*  ************ TAB-6 MY TOPICS & SOURCES END ************  */

	/*  ************ TAB-7 FRIEND BEGIN ************  */
	$("#change-content").delegate("#select-all-classmate", "click", function(){
		var selected = $(this).prop("checked");
		if(selected){
			$("#classmate-list input[type='checkbox']").prop("checked", true);
		} else {
			$("#classmate-list input[type='checkbox']").prop("checked", false);
		}
	});
	$("#change-content").delegate("#select-all-tutor", "click", function(){
		var selected = $(this).prop("checked");
		if(selected){
			$("#tutor-list input[type='checkbox']").prop("checked", true);
		} else {
			$("#tutor-list input[type='checkbox']").prop("checked", false);
		}
	});
	$("#change-content").delegate("#classmate-list input[type='checkbox']", "click", function(){
		var selected = $(this).prop("checked");
		if(selected){
			var dom = $("#classmate-list input[type='checkbox']");
			for(var i=0; i<dom.length; i++){
				if(!dom.eq(i).prop("checked")) return;
			}
			$("#select-all-classmate").prop("checked", true);
		} else {
			$("#select-all-classmate").prop("checked", false);
		}
	});
	$("#change-content").delegate("#tutor-list input[type='checkbox']", "click", function(){
		var selected = $(this).prop("checked");
		if(selected){
			var dom = $("#tutor-list input[type='checkbox']");
			for(var i=0; i<dom.length; i++){
				if(!dom.eq(i).prop("checked")) return;
			}
			$("#select-all-tutor").prop("checked", true);
		} else {
			$("#select-all-tutor").prop("checked", false);
		}
	});
	$("#change-content").delegate(".add-classmate", "click",  function(){
		var userId = $(this).closest("div").attr("data-id");
		addClassmate(userId);
	});
	$("#change-content").delegate(".add-tutor", "click",  function(){
		var userId = $(this).closest("div").attr("data-id");
		addTutor(userId);
	});
	$("#change-content").delegate("#del-classmate-group", "click", function(){
		var arr = [];
		var dom = $("#classmate-list input[type='checkbox']");
		for(var i=0; i<dom.length; i++){
			if(dom.eq(i).prop("checked")){
				arr.push(dom.eq(i).closest("div").attr("data-id"));
			}
		}
		if(arr.length == 0) return;
		$("#del-students-confirm .modal-header input[type='hidden']").val(arr.join("-"));
		$("#del-students-confirm").modal("show");
	});
	$("#change-content").delegate(".del-classmate", "click",  function(){
		var userId = $(this).closest("div").attr("data-id");
		$("#del-students-confirm .modal-header input[type='hidden']").val(userId);
		$("#del-students-confirm").modal("show");
	});
	$("#del-student-btn").click(function(){
		$("#del-students-confirm").modal("hide");
		delClassmate($("#del-students-confirm .modal-header input[type='hidden']").val());
	});
	$("#change-content").delegate(".del-tutor", "click",  function(){
		var userId = $(this).closest("div").attr("data-id");
		$("#del-tutors-confirm .modal-header input[type='hidden']").val(userId);
		$("#del-tutors-confirm").modal("show");
	});
	$("#change-content").delegate("#del-tutor-group", "click", function(){
		var arr = [];
		var dom = $("#tutor-list input[type='checkbox']");
		for(var i=0; i<dom.length; i++){
			if(dom.eq(i).prop("checked")){
				arr.push(dom.eq(i).closest("div").attr("data-id"));
			}
		}
		if(arr.length == 0) return;
		$("#del-tutors-confirm .modal-header input[type='hidden']").val(arr.join("-"));
		$("#del-tutors-confirm").modal("show");
	});
	$("#del-tutor-btn").click(function(){
		$("#del-tutors-confirm").modal("hide");
		delTutor($("#del-tutors-confirm .modal-header input[type='hidden']").val());
	});
	$("#change-content").delegate("#import-student", "click", function(){
		$(".progress .progress-bar").attr("aria-valuenow", 0);
		$(".progress .progress-bar").css({"width": 0});
		$("#student-file").after("<input type='file' name='studentFiles' id='student-file' multiple='multiple' />").remove();
		$("#import-student-modal").modal("show");
	});
	$("#import-student-form").submit(function(e){
		e.preventDefault();
		var fileDom = $("#student-file");
		if(!validateEmpty(fileDom, "请选择文件")) return;
		importStudents();
	});
	/*  ************ TAB-7 FRIEND END ************  */
	
	$.views.helpers({
		transDate: function(datetime){
			return datetime.substring(0, 10);
		},
		passDeadline: function(endDate){
			var now = new Date();
			var year = now.getFullYear();
			var month = (parseInt(now.getMonth())+1).toString();
			if(month.length == 1)  month = "0"+month; 
			var date = (now.getDate()).toString();
			if(date.length == 1)  date = "0"+date.toString();
			var nowStr = year +"-"+ month +"-"+ date;
			if(nowStr > endDate){
				return "<span class='text-danger'>已截止</span>";  // has stopped
			} else {
				return "<a class='btn btn-primary btn-xs submit-assign-btn'"+
						"data-toggle='modal' data-target='#assignment-submit-modal'>提交</a>";  // hasn't stopped
			}
		},
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

function loadAssignments(){
	$.ajax({
		url: "class.do?method=loadAssignments",
		type: "POST",
		data: {"classId": $("#curClassId").val(), "curPage": curPage, "userId": $("#curId").val()},
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				totalPage = returnData.totalPage;
				loadPagination($("ul.pagination"), totalPage, curPage);
				var template = $.templates("#assignment-item");
				$("#change-content tbody#assignment-list").html(template.render(returnData.assignments));
				$("ul.pagination").show();
			} else if(returnData.returnCode == 0) {
				$("#change-content tbody#assignment-list").html("<tr><td colspan='6'><span class='msg'>暂时没有作业 </span></td><tr>");
				$("ul.pagination").hide();
			} else {
				$("#operation-fail .modal-title span").html("加载作业信息失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("加载作业信息失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}

function loadPPTs(){
	$.ajax({
		url: "class.do?method=getPPTList",
		data: {"classId": $("#curClassId").val(), "curPage": curPage},
		type: "POST",
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				totalPage = returnData.totalPage;
				loadPagination($("ul.pagination"), totalPage, curPage);
				var template = $.templates("#ppt-item");
				$("#change-content tbody#ppt-list").html(template.render(returnData.ppts));
				$("ul.pagination").show();
			} else if(returnData.returnCode == 0){
				$("#change-content tbody#ppt-list").html("<tr><td colspan='5'><span class='msg'>暂时没有课件</span></td><tr>");
				$("ul.pagination").hide();
			} else {
				$("#operation-fail .modal-title span").html("加载课件信息失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("加载作业信息失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}

function loadTopics(){
	$.ajax({
		url: "class.do?method=getTopics",
		data: {"classId": $("#curClassId").val(), "curPage": curPage},
		type: "POST",
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				totalPage = returnData.totalPage;
				loadPagination($("ul.pagination"), totalPage, curPage);
				var template = $.templates("#topic-item");
				if(returnData.isTeacher){
					template = $.templates("#topic-item-t");
				}
				$("#change-content tbody#topic-list").html(template.render(returnData.topics));
				$("ul.pagination").show();
			} else if(returnData.returnCode == 0){
				$("#change-content tbody#topic-list").html("<tr><td colspan='5'><span class='msg'>暂时没有讨论</span></td><tr>");
				$("ul.pagination").hide();
			} else {
				$("#operation-fail .modal-title span").html("加载讨论失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("加载讨论失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}

function loadSources(){
	$.ajax({
		url: "class.do?method=getSources",
		data: {"classId": $("#curClassId").val(), "curPage": curPage},
		type: "POST",
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				totalPage = returnData.totalPage;
				loadPagination($("ul.pagination"), totalPage, curPage);
				var template = $.templates("#source-item");
				if(returnData.isTeacher){
					template = $.templates("#source-item-t");
				}
				$("#change-content tbody#source-list").html(template.render(returnData.sources));
				$("ul.pagination").show();
			} else if(returnData.returnCode == 0){
				$("#change-content tbody#source-list").html("<tr><td colspan='6'><span class='msg'>暂时没有资源</span></td><tr>");
				$("ul.pagination").hide();
			} else {
				$("#operation-fail .modal-title span").html("加载资源失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("加载资源失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}

function loadMyTopicsAndMySources(){
	$.ajax({
		url: "class.do?method=loadMyTopicsAndSources",
		type: "POST",
		data: {"classId": $("#curClassId").val(), "userId": $("#curId").val()},
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				var topics = returnData.topics;
				var sources = returnData.sources;
				if(topics==null || topics==undefined || topics.length==0){
					$("#my-topics").html("<tr><td colspan='5'><span class='msg'>您尚未发起讨论</span></td></tr>");
				} else {
					var template = $.templates("#my-topic-item");
					$("#my-topics").html(template.render(topics));
				}
				if(sources==null || sources==undefined || sources.length==0){
					$("#my-sources").html("<tr><td colspan='6'><span class='msg'>您尚未上传资源</span></td></tr>");
				} else {
					var template = $.templates("#my-source-item");
					$("#my-sources").html(template.render(sources));
				}
			} else {
				$("#operation-fail .modal-title span").html("加载我的资源失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("加载我的资源失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}

function loadClassmates(){
	$.ajax({
		url: "class.do?method=loadClassmates",
		type: "POST",
		data: {"classId": $("#curClassId").val()},
		dataType: "json",
		success: function(returnData){
			var template = $.templates("#classmate-item");
			if(returnData.tutors.length > 0){
				$("#tutor-list").html(template.render(returnData.tutors));
				$("#tutor-sum").html(returnData.tutors.length);
			} else {
				$("#tutor-list").html("<span class='msg'>此班级暂时没有助教 </span>");
				$("#tutor-sum").html("0");
			}
			if(returnData.returnCode > 0){
				$("#classmate-list").html(template.render(returnData.classmates));
				$("#classmate-sum").html(returnData.classmates.length);
				if(returnData.noTutor){
					var tutorTmpl = $.templates("#tutor-item");
					$("#classmate-list").append(tutorTmpl.render(returnData.tutors));
				}
			} else if(returnData.returnCode == 0) {
				$("#classmate-list").html("<span class='msg'>此班级暂时没有学生 </span>");
				$("#classmate-sum").html("0");
			} else {
				$("#operation-fail .modal-title span").html("加载学生信息失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("加载学生信息失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}

/*  **************** TAB-2 ASSIGNMENT BEGIN *****************  */
function publishAssignment(){
	$.ajax({
		url: "class.do?method=publishAssignment",
		type: "POST",
		dataType: "json",
		data: $("#assignment-publish-form").serialize(),
		success: function(returnData){
			if(returnData.returnCode > 0){
				$("#operation-success .modal-title span").html("发布作业成功");
				$("#operation-success").modal("show");
				$("#assignment-publish-modal").modal("hide");
				curPage = 1;
				loadAssignments();
			} else {
				$("#operation-fail .modal-title span").html("发布作业失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
			$("#assignment-publish-form input[type='submit']").attr("disabled", false);
		},
		error: function(){
			$("#operation-fail .modal-title span").html("发布作业失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}
function editAssignment(){
	$.ajax({
		url: "class.do?method=editAssignment",
		type: "POST",
		dataType: "json",
		data: $("#assignment-edit-form").serialize(),
		success: function(returnData){
			$("#assignment-edit-modal").modal("hide");
			if(returnData.returnCode > 0){
				$("#operation-success .modal-title span").html("修改作业信息成功");
				$("#operation-success").modal("show");
				$("#assignment-publish-modal").modal("hide");
				loadAssignments();
			} else {
				$("#operation-fail .modal-title span").html("修改作业信息失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("修改作业信息失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}
function delAssignment(assignmentId){
	$.ajax({
		url: "class.do?method=delAssignment",
		type: "POST",
		dataType: "json",
		data: {"assignmentId": assignmentId, "classId": $("#curClassId").val()},
		success: function(returnData){
			$("#confirm-del-assignment").modal("hide");
			if(returnData.returnCode > 0){
				$("#operation-success .modal-title span").html("删除作业成功");
				$("#operation-success").modal("show");
				$("#assignment-publish-modal").modal("hide");
				curPage = 1;
				loadAssignments();
			} else {
				$("#operation-fail .modal-title span").html("删除作业失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#confirm-del-assignment").modal("hide");
			$("#operation-fail .modal-title span").html("删除作业失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}
function submitAssignment(){
	$("#assign-submit-form").ajaxSubmit({
		url: "class.do?method=submitAssignment",
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				$("#operation-success .modal-title span").html("提交作业成功");
				$("#operation-success").modal("show");
				$("#assignment-submit-modal").modal("hide");
				$("#assign-submit-form input[type='file']").after("<input type='file' name='assignFile' />").remove();
				loadAssignments();
			} else {
				$("#operation-fail .modal-title span").html(returnData.returnMsg);
				$("#operation-fail").modal("show");
			}
			$("#assign-submit-form input[type='submit']").attr("disabled", false);
			$("#uploading").hide();
		},
		error: function(){
			$("#operation-fail .modal-title span").html("提交作业失败，请在刷新后重试");
			$("#operation-fail").modal("show");
			$("#assign-submit-form input[type='submit']").attr("disabled", false);
			$("#uploading").hide();
		}
	});
}
function loadAnswer(assignmentId){
	$.ajax({
		url: "class.do?method=loadAnswer",
		data: {"userId": $("#curId").val(), "assignmentId": assignmentId},
		type: "POST",
		dataType: "json"
	});
}
function submitAnswer(){
	$("#answer-submit-form").ajaxSubmit({
		url: "class.do?method=submitAnswer",
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				$("#operation-success .modal-title span").html("上传答案成功");
				$("#operation-success").modal("show");
				$("#answer-submit-modal").modal("hide");
				$("#answer-submit-form input[type='file']").after("<input type='file' name='answerFile' />").remove();
				loadAssignments();
			} else {
				$("#operation-fail .modal-title span").html(returnData.returnMsg);
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("上传答案失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}
function submitAnalyse(){
	$.ajax({
		url: "class.do?method=submitAnalyse",
		type: "POST",
		data: {classId: $("#curClassId").val()},
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				$("#operation-success .modal-title span").html(
						"作业提交情况整理成功！<a href='"+ returnData.excelPath +"'>请点此此链接下载与查看</a>");
				$("#operation-success").modal("show");
			} else {
				$("#operation-fail .modal-title span").html("作业提交情况整理失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("作业提交情况整理失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}
/*  **************** TAB-2 ASSIGNMENT END *****************  */

/*  **************** TAB-3 PPT END *****************  */
function uploadPPT(){
	$("#upload-ppt-form").ajaxSubmit({
		url: "class.do?method=uploadPPT",
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				$("#operation-success .modal-title span").html("上传课件成功");
				$("#operation-success").modal("show");
				$("#ppt-publish-modal").modal("hide");
				curPage = 1;
				loadPPTs();
			} else if(returnData.returnCode == 0) {
				$("#operation-fail .modal-title span").html(returnCode.returnMsg);
				$("#operation-fail").modal("show");
			} else {
				$("#operation-fail .modal-title span").html("上传课件失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
			$("#upload-ppt-form input[type='submit']").attr("disabled", false);
		},
		error: function(){
			$("#operation-fail .modal-title span").html("上传课件失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}
function plusDownloadCount(pptId){
	$.ajax({
		url: "class.do?method=plusDownloadCount",
		type: "POST",
		data: {"pptId": pptId},
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				loadPPTs();
			} else {
				$("#operation-fail .modal-title span").html("增加课件下载次数失败");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("增加课件下载次数失败");
			$("#operation-fail").modal("show");
		}
	});
}
function deletePPT(pptId){
	$.ajax({
		url: "class.do?method=deletePPT",
		data: {"pptId": pptId},
		dataType: "json",
		success: function(returnData){
			$("#confirm-del-ppt").modal("hide");
			if(returnData.returnCode > 0){
				$("#operation-success .modal-title span").html("删除课件成功");
				$("#operation-success").modal("show");
				curPage = 1;
				loadPPTs();
			} else {
				$("#operation-fail .modal-title span").html("删除课件失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#confirm-del-ppt").modal("hide");
			$("#operation-fail .modal-title span").html("删除课件失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}
/*  **************** TAB-3 PPTT END *****************  */

/*  **************** TAB-4 TOPIC BEGIN *****************  */
function releaseTopic(){
	var url = "class.do?method=releaseTopic";
	if($("#topic-file").val() != ""){
		url = "class.do?method=releaseTopicWithFiles";
	}
	$("#release-topic-form").ajaxSubmit({
		url: url,
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				$("#operation-success .modal-title span").html("已成功展开讨论");
				$("#operation-success").modal("show");
				$("#topic-release-modal").modal("hide");
				curPage = 1;
				loadTopics();
			} else {
				$("#operation-fail .modal-title span").html("展开讨论失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
			$("#release-topic-form input[type='submit']").attr("disabled", false);
		},
		error: function(){
			$("#operation-fail .modal-title span").html("展开讨论失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}
function getTopicDetails(topicId){
	$.ajax({
		async: false,
		url: "class.do?method=getTopicDetails",
		type: "POST",
		dataType: "json",
		data: {"topicId": topicId},
		success: function(returnData){
			if(returnData.returnCode > 0){
				var template = $.templates("#topic-detail-tmpl");
				var topic = returnData.topic;
				topic.curId = $("#curId").val();
				topic.canSend = returnData.canSend;
				$("#topic-content-modal .modal-body").html(template.render(topic));
				$("#topic-reply-img").attr("src", $("#curFaceIcon").val());
				$("#topic-content-modal").modal("show");
			} else {
				$("#operation-fail .modal-title span").html("获取讨论详情失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("获取讨论详情失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}
function replyTopic(topicId, fromId, toId, content, dom, path){
	$.ajax({
		url: "class.do?method=replyTopic",
		type: "POST",
		data: {"topicId": topicId, "fromId": fromId, "toId": toId, "content": content, path: path},
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				var template = $.templates("#topic-detail-tmpl");
				var topic = returnData.topic;
				topic.curId = $("#curId").val();
				topic.canSend = returnData.canSend;
				dom.after(template.render(returnData.topic));
				dom.remove();
				$("#topic-reply-img").attr("src", $("#curFaceIcon").val());
			} else {
				$("#operation-fail .modal-title span").html("评论/回复失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("评论/回复失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}
function markSolved(topicId, dom, isMy){
	$.ajax({
		url: "class.do?method=markSolved",
		type: "POST",
		data: {"topicId": topicId},
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				if(!isMy){
					var template = $.templates("#topic-detail-tmpl");
					dom.after(template.render(returnData.topic));
					dom.remove();
					loadTopics();
					$("#topic-reply-img").attr("src", $("#curFaceIcon").val());
				} else {
					loadMyTopicsAndMySources();
				}
			} else {
				$("#operation-fail .modal-title span").html("标记失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("标记失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}
function sendTopicToCourse(topicId){
	$.ajax({
		url: "class.do?method=sendTopicToCourse",
		type: "POST",
		data: {"topicId": topicId, "classId": $("#curClassId").val(), "userId": $("#curId").val()},
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				$("#operation-success .modal-title span").html("推送讨论成功");
				$("#operation-success").modal("show");
				$("#send-topic-to-course").remove();
			} else if(returnData.returnCode == 0 || returnData.returnCode == -1){
				$("#operation-fail .modal-title span").html(returnData.returnMsg);
				$("#operation-fail").modal("show");
			} else {
				$("#operation-fail .modal-title span").html("推送讨论失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("推送讨论失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}
/*  **************** TAB-4 TOPIC END *****************  */

/*  **************** TAB-5 SOURCE BEGIN *****************  */
function uploadSource(){
	$("#upload-source-form").ajaxSubmit({
		url: "class.do?method=uploadSource",
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				$("#operation-success .modal-title span").html("上传资源成功，您可到“我的发布”中，对其进行修改");
				$("#operation-success").modal("show");
				$("#source-upload-modal").modal("hide");
				curPage = 1;
				loadSources();
			} else if(returnData.returnCode == 0){
				$("#operation-fail .modal-title span").html(returnData.returnMsg);
				$("#operation-fail").modal("show");
			} else {
				$("#operation-fail .modal-title span").html("发布资料失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
			$("#source-type").val(1);
			$("#source-file").after("<input type='file' name='sourceFiles' id='source-file' multiple='multiple'>");
			$("#source-file").remove();
			$("#upload-source-form button[type='submit']").attr("disabled", false);
		},
		error: function(){
			$("#operation-fail .modal-title span").html("发布资料失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}
function getSourceDetails(sourceId){
	$.ajax({
		async: false,
		url: "class.do?method=getSourceDetails",
		type: "POST",
		dataType: "json",
		data: {"sourceId": sourceId},
		success: function(returnData){
			if(returnData.returnCode > 0){
				var template = $.templates("#source-detail-tmpl");
				var source = returnData.source;
				source.isTeacher = returnData.isTeacher;
				source.score = parseFloat(returnData.score).toFixed(1);
				source.myScore = returnData.myScore;
				source.canSend = returnData.canSend;
				$("#source-modal .modal-body").html(template.render(source));
				$("#source-reply-img").attr("src", $("#curFaceIcon").val());
				$("#source-modal").modal("show");
			} else {
				$("#operation-fail .modal-title span").html("获取资源详情失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("获取资源详情失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}
function replySource(sourceId, fromId, content, dom, path){
	$.ajax({
		url: "class.do?method=replySource",
		type: "POST",
		data: {"sourceId": sourceId, "fromId": fromId, "content": content, path: path},
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				var template = $.templates("#source-detail-tmpl");
				var source = returnData.source;
				source.isTeacher = returnData.isTeacher;
				source.score = parseFloat(returnData.score).toFixed(1);
				source.myScore = returnData.myScore;
				source.canSend = returnData.canSend;
				dom.after(template.render(returnData.source));
				dom.prev().remove();
				dom.remove();
				$("#source-reply-img").attr("src", $("#curFaceIcon").val());
			} else {
				$("#operation-fail .modal-title span").html("评论/回复失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("评论/回复失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}
function plusSourceDownloadCount(sourceId){
	$.ajax({
		url: "class.do?method=addSourceDownCount",
		type: "POST",
		data: {"sourceId": sourceId},
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				var oriCount = parseInt($("#downloadCount").html());
				$("#downloadCount").html(++oriCount);
				loadSources();
			} else {
				$("#operation-fail .modal-title span").html("增加资料下载次数失败");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("增加资料下载次数失败");
			$("#operation-fail").modal("show");
		}
	});
}
function setScore(sourceId, score){
	$.ajax({
		url: "class.do?method=setScore",
		data: {"sourceId": sourceId, "score": score, "userId": $("#curId").val()},
		dataType: "json",
		type: "POST",
		success: function(returnData){
			if(returnData.returnCode > 0){
				$("#score-part").attr("data-score", score);
				for(var i=0; i<score; i++){ $("#score-part").children().eq(i).addClass("selected");	}
				for(var i=score; i<5; i++){ $("#score-part").children().eq(i).removeClass("selected"); }
				$("#avg-score").html(parseFloat(returnData.avgScore).toFixed(1));
			} else {
				$("#operation-fail .modal-title span").html("评分失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("评分失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}
function sendSourceToCourse(sourceId){
	$.ajax({
		url: "class.do?method=sendSourceToCourse",
		type: "POST",
		data: {"sourceId": sourceId, "classId": $("#curClassId").val(), "userId": $("#curId").val()},
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				$("#operation-success .modal-title span").html("推送资源成功");
				$("#operation-success").modal("show");
				$("#send-source-to-course").remove();
			} else if(returnData.returnCode == 0 || returnData.returnCode == -1){
				$("#operation-fail .modal-title span").html(returnData.returnMsg);
				$("#operation-fail").modal("show");
			} else {
				$("#operation-fail .modal-title span").html("推送资源失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("推送资源失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}
/*  **************** TAB-5 SOURCE BEGIN *****************  */

/*  **************** TAB-6 MY TOPICS & MY SOURCES BEGIN *****************  */
function deleteTopic(topicId){
	$.ajax({
		url: "class.do?method=deleteTopic",
		data: {"topicId": topicId},
		type: "POST",
		dataType: "json",
		success: function(returnData){
			$("#confirm-del-topic").modal("hide");
			if(returnData.returnCode > 0){
				$("#operation-success .modal-title span").html("删除讨论成功");
				$("#operation-success").modal("show");
				if($("#section-list li.active").attr("data-target")=='4'){
					loadTopics();
				} else {
					loadMyTopicsAndMySources();
				}
			} else if(returnData.returnCode == 0){
				$("#operation-fail .modal-title span").html("此讨论已被推送到课程空间，不可删除");
				$("#operation-fail").modal("show");
			} else {
				$("#operation-fail .modal-title span").html("删除讨论失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("删除讨论失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}
function editSource(){
	$.ajax({
		url: "class.do?method=editSource",
		data: $("#source-edit-form").serialize(),
		type: "POST",
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				$("#source-edit-modal").modal("hide");
				$("#operation-success .modal-title span").html("资源信息修改成功");
				$("#operation-success").modal("show");
				loadMyTopicsAndMySources();
			} else {
				$("#operation-fail .modal-title span").html("修改资源失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("修改资源失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}
function deleteSource(sourceId){
	$.ajax({
		url: "class.do?method=deleteSource",
		data: {"sourceId": sourceId},
		type: "POST",
		dataType: "json",
		success: function(returnData){
			$("#confirm-del-source").modal("hide");
			if(returnData.returnCode > 0){
				$("#operation-success .modal-title span").html("删除资源成功");
				$("#operation-success").modal("show");
				if($("#section-list li.active").attr("data-target")=='5'){
					loadSources();
				} else {
					loadMyTopicsAndMySources();
				}
			} else if(returnData.returnCode == 0){
				$("#operation-fail .modal-title span").html("此资源已被推送到课程空间，不可删除");
				$("#operation-fail").modal("show");
			} else {
				$("#operation-fail .modal-title span").html("删除资源失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("删除资源失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}
/*  **************** TAB-6 MY TOPICS & MY SOURCES END *****************  */

/*  **************** TAB-7 CLASSMATE BEGIN *****************  */
function searchStudents(key){
	$.ajax({
		url: "class.do?method=searchStudents",
		type: "POST",
		data: {"keyword": key, "classId": $("#curClassId").val()},
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				var template = $.templates("#search-result-item");
				$("#result-list").html(template.render(returnData.classmates));
				$("#search-result").slideDown();
				$("#search-sum").html(returnData.classmates.length);
			} else if(returnData.returnCode == 0){
				$("#result-list").html("<span class='msg'>"+returnData.returnMsg+"</span>");
				$("#search-result").slideDown();
				$("#search-sum").html("0");
			} else {
				$("#operation-fail .modal-title span").html("搜索学生失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("搜索学生失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}

function addClassmate(userId){
	$.ajax({
		url: "class.do?method=addClassmate",
		type: "POST",
		data: {"userId": userId, "classId": $("#curClassId").val()},
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				$("#operation-success .modal-title span").html("添加学生成功");
				$("#operation-success").modal("show");
				loadClassmates();
				if($("#search-sum").html() != "" && $("#search-sum").html() != "0"){
					var key = $("#search-part input").val().replace(/^[\s\t ]+|[\s\t ]+$/g, '');
					searchStudents(key);
				}
			} else {
				$("#operation-fail .modal-title span").html("添加学生失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("添加学生失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}
function delClassmate(userIds){
	$.ajax({
		url: "class.do?method=delClassmate",
		type: "POST",
		data: {"userIds": userIds, "classId": $("#curClassId").val()},
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				$("#operation-success .modal-title span").html("成功删除"+returnData.succCount+"名学生");
				$("#operation-success").modal("show");
				loadClassmates();
				if($("#search-sum").html() != "" && $("#search-sum").html() != "0"){
					var key = $("#search-part input").val().replace(/^[\s\t ]+|[\s\t ]+$/g, '');
					searchStudents(key);
				}
				$("#select-all-classmate").prop("checked", false);
			} else {
				$("#operation-fail .modal-title span").html("删除学生失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("删除学生失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}
function addTutor(userId){
	$.ajax({
		url: "class.do?method=addTutor",
		type: "POST",
		data: {"userId": userId, "classId": $("#curClassId").val()},
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				$("#operation-success .modal-title span").html("添加助教成功");
				$("#operation-success").modal("show");
				loadClassmates();
				if($("#search-sum").html() != "" && $("#search-sum").html() != "0"){
					var key = $("#search-part input").val().replace(/^[\s\t ]+|[\s\t ]+$/g, '');
					searchStudents(key);
				}
			} else {
				$("#operation-fail .modal-title span").html("添加助教失败，请在刷新后重试");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("添加助教失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}
function delTutor(userIds){
	$.ajax({
		url: "class.do?method=delTutor",
		type: "POST",
		data: {"userIds": userIds, "classId": $("#curClassId").val()},
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				$("#operation-success .modal-title span").html("成功删除"+returnData.succCount+"名助教");
				$("#operation-success").modal("show");
				loadClassmates();
				if($("#search-sum").html() != "" && $("#search-sum").html() != "0"){
					var key = $("#search-part input").val().replace(/^[\s\t ]+|[\s\t ]+$/g, '');
					searchStudents(key);
				}
				$("#select-all-tutor").prop("checked", false);
			} else {
				$("#operation-fail .modal-title span").html("删除助教失败，您没有权限进行此项操作");
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("删除助教失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}
function importStudents(){
	$("#import-student-form").ajaxSubmit({
		url: "class.do?method=importStudents",
		dataType: "json",
		beforeSend:function(XMLHttpRequest){
			$("#import-student-form button[type='submit']").attr("disabled", true);
			$(".progress .progress-bar").css({"width": "80%"});
		}, 
		success: function(returnData){
			if(returnData.returnCode > 0){
				// deal with progress
				$(".progress .progress-bar").css({"width": '100%'});
				$("#import-student-form button[type='submit']").attr("disabled", false);
				// deal with others
				$("#operation-success-im .modal-title span").html("成功导入"+ returnData.succCount +"名学生");
				var depuStudents = returnData.depuStudents;
				$("#operation-success-im .modal-title p").html("");
				if(depuStudents.length > 0){
					var depuStr = "以下"+ depuStudents.length +"名用户的信息已在此教学班中：<br>";
					for(var i=0; i<depuStudents.length; i++){
						depuStr += depuStudents[i].userId +"&nbsp;"+ depuStudents[i].userName +"&nbsp;&nbsp;&nbsp;";
						if((i+1)%3 == 0){
							depuStr += "<br>";
						}
					}
					$("#operation-success-im .modal-title p").html(depuStr);
				}
				var notExisting = returnData.notExisting;
				if(notExisting.length > 0){
					var notExistStr = "以下"+ notExisting.length +"名用户的信息不在系统中：<br>";
					for(var i=0; i<notExisting.length; i++){
						notExistStr += notExisting[i].userId +"&nbsp;"+ notExisting[i].userName +"&nbsp;&nbsp;&nbsp;";
						if((i+1)%3 == 0){
							notExistStr += "<br>";
						}
					}
					$("#operation-success-im .modal-title p").append(notExistStr);
				}
				$("#operation-success-im").modal("show");
				$("#import-student-modal").modal("hide");
				$("#class-file").after("<input type='file' name='studentFiles' id='student-file' multiple='multiple' />").remove();
				loadClassmates();
			} else {
				$("#operation-fail .modal-title span").html(returnData.returnMsg);
				$("#operation-fail").modal("show");
			}
		},
		error: function(){
			$("#operation-fail .modal-title span").html("学生导入失败，请在刷新后重试");
			$("#operation-fail").modal("show");
		}
	});
}
/*  **************** TAB-7 CLASSMATE END *****************  */