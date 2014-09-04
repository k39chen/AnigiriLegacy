Template.collectionPage.rendered = function(){
	// initialize the page
	initPage("collection");

	// initialize the collection grid
	if (this && this.find("#collectionGrid")) {
		window.collectionGrid = new CastGrid({
			wrapper: this.find("#collectionGrid"),
			template: this, 
			dim: {w:154,h:270,pw:10,ph:10},
			dataSource: function() {
				var data = getFullSubscriptions();
				this.update(data);
			},
			render: function(data){
				return getTemplateHTML("gridItem",data);
			}
		});
	}
};
Template.collectionPage.events({
	"mouseover .redirect-btn": addHoverTarget,
	"mouseout .redirect-btn": removeHoverTarget,
	"click .redirect-btn": function(e){
		Router.go("/discover");
	},
	"mouseover .gridItem": addHoverCurrentTarget,
	"mouseout .gridItem": removeHoverCurrentTarget,
	"click .gridItem": function(e){
		var $el = $(e.currentTarget);
		var annId = parseInt($el.attr("data-annId"),10);
		InfoBar.load(annId);
	}
});
Template.collectionPage.helpers({
	hasSubscriptions: function(){
		return hasSubscriptions();
	}
});
