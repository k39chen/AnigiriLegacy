Template.sideBar.rendered = function(){
	var self = this,
		$searchbox = $(self.find("#animeSearchBox"));
	
	// initialize the searchbox
	$searchbox.searchbox({
		method: "getAnimes",
		minLength: 3,
		placeholderText: "Search for an anime",
		top: "-=25",
		left: "+=186",
		width: 300,
		map: function(item){
			return {label:item.title, value:item.title, type:item.type, data:item};
		},
		sort: function(a,b){
			// sort the source by category (and subsort alphabetically)
			if (a.type == b.type) { return b.label-a.label; } 
			else if (a.type == "tv") { return 0; }
			else if (a.type == "oav") { return 1; }
			else { return 2; }
		},
		select: function(event,ui){
			InfoBar.init(ui.item.data.annId);
		},
		renderItem: function(ul,item){
			var html = getTemplateHTML("animeMenuItem", {
				label: item.label,
				type: getTypeStr(item.type)
			});
			return $("<li>").append(html).appendTo(ul);
		}
	});
};
Template.sideBar.events({
	"mouseover .option": function(e) {
		var el = $(e.currentTarget);
		el.addClass("hover");
	},
	"mouseout .option": function(e) {
		var el = $(e.currentTarget);
		el.removeClass("hover");
	},
	"click .option": function(e) {
		var el = $(e.currentTarget);

		// select the page
		Router.go("/"+el.attr("data-page"));
	}
});
Template.sideBar.helpers({
	"isAdminUser": function() {
		return isAdminUser();
	}
});
