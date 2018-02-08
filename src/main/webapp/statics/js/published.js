$(function(){
	$("#select-btn .dropdown-menu li").on("click", function(){
		$("#select-btn .btn-content").html($(this).find("a").html());
	});
	
	$("#publishment-list").delegate(".published .reply-toggle", "click", function(){
		var dom = $(this).parent().parent().next();
		dom.toggle();
		//dom.find("input").val("");
	});
	$("#topic-content-modal").delegate(".published .reply-toggle", "click", function(){
		var dom = $(this).parent().parent().next();
		dom.toggle();
		//dom.find("input").val("");
	});
	
	$("#publishment-list").delegate(".publishment .replied-list .reply-in", "click", function(){
		var dom = $(this).parent().next();
		dom.toggle();
		//dom.find("input").val("");
	});
	$("#topic-content-modal").delegate(".publishment .replied-list .reply-in", "click", function(){
		var dom = $(this).parent().next();
		dom.toggle();
		//dom.find("input").val("");
	});
	
	// ***** REPLY STATUS *****
	$("#publishment-list").delegate(".reply-btn", "click", function(){
		var content = $(this).closest("div").children().eq(1).val().replace(/^[\s\t ]+|[\s\t ]+$/g, '');
		if(content.length == 0 || content.length > 170) return;
		var statusId = $(this).parent().parent().parent().parent().attr("status-id");
		statusId = statusId.substring(7, statusId.length);
		var toId = $(this).parent().attr("to-id");
		var dom = $(this).parent().parent().parent();
		if(!dom.hasClass("reply")){
			dom = dom.parent();
		}
		dom = dom.parent();
		var path = serialize2($(this).prev().children().eq(2).children(), $(this).prev().children().eq(3).children());
		replyStatus(statusId, $("#curId").val(), toId, content, dom, path);
	});
	
});

function replyStatus(statusId, fromId, toId, content, dom, path){
	$.ajax({
		url: "homepage.do?method=reply",
		type: "POST",
		data: {"statusId": statusId, "fromId": fromId, "toId": toId, "content": content, path: path},
		dataType: "json",
		success: function(returnData){
			if(returnData.returnCode > 0){
				var template = $.templates("#status-tmpl");
				dom.after(template.render(returnData.status));
				dom.remove();
			} else {
				$("#reply-fail").modal("show");
			}
		},
		error: function(){
			$("#reply-fail").modal("show");
		}
	});
}