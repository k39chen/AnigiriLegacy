Template.collectionPage.rendered = function(){
	// fade in the page
	$("#collectionPage").css({opacity:0}).stop().animate({opacity:1},500);

	// update the sidebar
	$("#sideBar .option").removeClass("selected");
	$("#sideBar .option[data-page='collection']").addClass("selected");
};
Template.collectionPage.events({
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
	}
});
Template.collectionPage.helpers({
	hasSubscriptions: function(){
		return hasSubscriptions();
	},
	getSubscriptions: function(){
		return getFullSubscriptions();
	}
});
