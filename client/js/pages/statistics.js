Template.statisticsPage.rendered = function(){
	// initialize the page
	initPage("statistics");
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
