Template.collectionPage.rendered = function(){
	// initialize the page
	initPage("collection");

	// initialize the collection grid
	window.collectionGrid = new CastGrid({
		wrapper: this.find("#collectionGrid"),
		template: this, 
		data: getFullSubscriptions(),
		dim: {w:154,h:270,pw:10,ph:10},
		render: function(data){
			return getTemplateHTML("gridItem",data);
		}
	});
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
	},
	"mouseover .gridItem": function(e){
		var el = $(e.currentTarget);
		el.addClass("hover");
	},
	"mouseout .gridItem": function(e){
		var el = $(e.currentTarget);
		el.removeClass("hover");
	},
	"click .gridItem": function(e){
		var el = $(e.currentTarget);
		var annId = parseInt(el.attr("data-annId"),10);
		InfoBar.init(annId);
	}
});
Template.collectionPage.helpers({
	hasSubscriptions: function(){
		return hasSubscriptions();
	}
});
