var Search = {
	timeout: null,
	delay: 400,
	minLength: 3,
	maxLength: 100,
	query: null,
	performSearch: function(query) {
		Search.clearSearchResults();
		Search.hideResults();
		Search.hideNoSearchResults();
		Search.showLoading();

		// execute the search query
		Search.query = query;
		Meteor.call("executeSearch", query, function(err,data){
			if (!data) return;

			// if this is a cancelled query, then ignore it
			if (query != Search.query) {
				return;
			}

			var results = data.results;
			Search.hideLoading();

			// no results found
			if ($.isEmptyObject(results)) {
				Search.showNoSearchResults();
				return;
			}
			Search.showResults();

			var orderedResults = [];
			for (var category in results) {
				var priority;
				switch (category) {
					case "tv": priority = 1; break;
					case "movie": priority = 2; break;
					case "oav": priority = 3; break;
					case "ona": priority = 4; break;
					case "special": priority = 5; break
					case "omnibus": priority = 6; break;
					case "user": priority = 7; break;
					default: priority = -1; break;
				}
				// lets filter out unwanted items
				var items = [];
				for (var i=0; i<results[category].length; i++) {
					items.push(results[category][i]);
				}
				if (items.length > 0){
					orderedResults.push({
						priority: priority,
						category: category,
						items: items
					});
				}
			}
			orderedResults.sort(function(a,b){
				if (a.priority > b.priority) return 1;
				else if (a.priority < b.priority) return -1;
				else return 0;
			});

			// work on rendering the returned results
			for (var index in orderedResults) {
				var category = orderedResults[index].category;
				var categoryTitle = "<i class='fa fa-{{icon}}'></i> {{title}}";
				var categoryStr = category.toLowerCase();
				switch (categoryStr) {
					case "tv":
						categoryTitle = categoryTitle
							.replace("{{icon}}","desktop")
							.replace("{{title}}","TV Series");
						break;
					case "movie":
						categoryTitle = categoryTitle
							.replace("{{icon}}","film")
							.replace("{{title}}","Movies");
						break;
					case "oav":
						categoryTitle = categoryTitle
							.replace("{{icon}}","video-camera")
							.replace("{{title}}","Original Video Animations");
						text = "";
					case "ona":
						categoryTitle = categoryTitle
							.replace("{{icon}}","video-camera")
							.replace("{{title}}","Original Net Animations");
						break;
					case "omnibus":
						categoryTitle = categoryTitle
							.replace("{{icon}}","video-camera")
							.replace("{{title}}","Omnibus");
						break;
					case "special":
						categoryTitle = categoryTitle
							.replace("{{icon}}","star")
							.replace("{{title}}","Specials");
						break;
					case "user":
						categoryTitle = categoryTitle
							.replace("{{icon}}","user")
							.replace("{{title}}","Users");
						break;
					default:
						categoryTitle = categoryTitle
							.replace("{{icon}}","star")
							.replace("{{title}}",categoryStr);
						break;
				}
				var categoryHtml = getTemplateHTML("searchResultCategory", {
					category: categoryTitle,
					counter: orderedResults[index].items.length,
					items: orderedResults[index].items,
					useUserTemplate: categoryStr == "user",
					useAnimeTemplate: category != "user"
				});
				$("#searchResultsContent").append(categoryHtml);
			}
			$("#searchResultsContent").width(336*orderedResults.length+24);
		});
	},
	clearSearchResults: function() {
		$("#searchResultsContent").empty();
	},
	showResults: function() {
		$("#searchResults").addClass("visible");
	},
	hideResults: function() {
		$("#searchResults").removeClass("visible");
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
	"click #searchInput": function(e) {
		var $el = $(e.currentTarget);
		$el.select();
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
		// if the search field is empty, then just clear the search results
		Search.clearSearchResults();

		// query must have length greater than 3 for a search to be valid
		if (query.length <= Search.minLength) return;

		// do an auto-search after a short typing delay
		clearTimeout(Search.timeout);
		Search.timeout = setTimeout(function(){
			// perform a search query
			Search.performSearch(query);
		}, Search.delay);
	},
	"mouseover .searchResultCategory": addHoverCurrentTarget,
	"mouseout .searchResultCategory": removeHoverCurrentTarget,

	"mouseover .searchResultAnime": addHoverCurrentTarget,
	"mouseout .searchResultAnime": removeHoverCurrentTarget,
	"click .searchResultAnime .title": function(e) {
		var $el = $(e.currentTarget),
			annId = $el.parent().parent().parent().data("annid");

		// the infobar component will handle retrieving the info for us,
		// no need to invoke a subscribe call here
		InfoBar.load(annId);
	},

	"mouseover .searchResultUser": addHoverCurrentTarget,
	"mouseout .searchResultUser": removeHoverCurrentTarget,
	"click .searchResultUser .name": function(e) {
		var $el = $(e.currentTarget),
			userId = $el.parent().parent().parent().data("userid");

		// the profile page will do the appropriate subscription actions
		Router.go("/profile/"+userId);
	},

	"mouseover .searchResultAnime .fa-check-circle": addHoverCurrentTarget,
	"mouseout .searchResultAnime .fa-check-circle": removeHoverCurrentTarget,
	"click .searchResultAnime .fa-check-circle": function(e) {
		var $el = $(e.currentTarget);
		
		// subscribe to this anime
		$el.toggleClass("selected");
	}
});
Template.searchPage.helpers({
	// ...
});
