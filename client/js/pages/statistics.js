Template.statisticsPage.rendered = function(){
	// fade in the page
	$("#statisticsPage").css({opacity:0}).stop().animate({opacity:1},500);

	// ensure the page header is correctly sized
	$(".page > h1").css({right:$("#page-container").css("right")});

	// update the sidebar
	$("#sideBar .option").removeClass("selected");
	$("#sideBar .option[data-page='statistics']").addClass("selected");
};
Template.statisticsPage.events({
	"mouseover .redirect-btn": function(e) {
		var el = $(e.target);
		el.addClass("hover");
	},
	"mouseout .redirect-btn": function(e) {
		var el = $(e.target);
		el.removeClass("hover");
	},
	"click .redirect-btn": function(e){
		var el = $(e.target);
		Router.go("/discover");
	},
});
Template.statisticsPage.helpers({
	hasSubscriptions: function(){
		return hasSubscriptions();
	}
});
