Template.collectionPage.rendered = function(){
	// initialize the page
	initPage("collection");
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
