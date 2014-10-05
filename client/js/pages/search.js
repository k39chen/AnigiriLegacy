var Search = {
	timeout: null,
	delay: 400,
	minLength: 3,
	maxLength: 100,
	performSearch: function(query) {
		Search.hideNoSearchResults();
		Search.showLoading();

		// fake simulation of search
		setTimeout(function(){
			Search.hideLoading();
			Search.showNoSearchResults();
		},3000);
	},
	showLoading: function() {
		$("#searchLoading").addClass("visible");
	},
	hideLoading: function() {
		$("#searchLoading").removeClass("visible");
	},
	showNoSearchResults: function() {
		$("#noSearchResults").addClass("visible");
	},
	hideNoSearchResults: function() {
		$("#noSearchResults").removeClass("visible");
	}
};

Template.searchPage.rendered = function(){
	// initialize the page
	initPage("search");

	$("#searchInput").focus();
};
Template.searchPage.events({
	"mouseover .close-btn": addHoverTarget,
	"mouseout .close-btn": removeHoverTarget,
	"click .close-btn": function(e) {
		Router.go(Session.get("currentURL") || "/dashboard");
	},
	"keyup #searchInput": function(e) {
		var $el = $(e.currentTarget),
			query = $("#searchInput").val();
		// escape key
		if (e.keyCode == 27) {
			// clear the input
			$el.val("");
			return;
		}
		// query must have length greater than 3 for a search to be valid
		if (query.length <= Search.minLength) return;

		// do an auto-search after a short typing delay
		clearTimeout(Search.timeout);
		Search.timeout = setTimeout(function(){
			// perform a search query
			Search.performSearch(query);
		}, Search.delay);
	}
});
Template.searchPage.helpers({
	// ...
});
