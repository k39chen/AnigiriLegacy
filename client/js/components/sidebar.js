window.SideBar = {
	$el: null,
	$account: null,
	$toggle: null,
	init: function() {
		var self = this;
		self.$el = $("#sideBar");
		self.$toggle = $("#corner .toggle");
		self.$account = $("#account");

		// show the maximized view
		self.maximize();
	},
	toggle: function() {
		var self = this;
		if (self.$el.hasClass("minimized")) {
			self.maximize();
		} else {
			self.minimize();
		}
	},
	maximize: function() {
		var self = this;
		self.$el.removeClass("minimized");
		self.$account.removeClass("minimized");
		self.$toggle.removeClass("fa-toggle-right").addClass("fa-toggle-left");
	},
	minimize: function() {
		var self = this;
		self.$el.addClass("minimized");
		self.$account.addClass("minimized");
		self.$toggle.removeClass("fa-toggle-left").addClass("fa-toggle-right");
	}
};
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
	// initialize the corner controls
	SideBar.init();
};
Template.sideBar.events({
	"mouseover .toggle": function(e) {
		var el = $(e.target);
		el.addClass("hover");
	},
	"mouseout .toggle": function(e) {
		var el = $(e.target);
		el.removeClass("hover");
	},
	"click .toggle" : function(e) {
		var el = $(e.target);
		SideBar.toggle();
	},
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
		Router.go("/"+el.attr("data-page"));
	},
	"mouseover #signout": function(e) {
		var el = $(e.currentTarget);
		el.addClass("hover");
	},
	"mouseout #signout": function(e){
		var el = $(e.currentTarget);
		el.removeClass("hover");
	},
	"click #signout": function(){
		Meteor.logout();
		Router.go("/");
	}
});
Template.sideBar.helpers({
	"isAdminUser": function() {
		return isAdminUser();
	},
	name: function(){
		var user = Meteor.user(),
			fb = getFacebookUserData(user);
		return fb ? fb.name : "";
	},
	portrait: function() {
		var user = Meteor.user(),
			fb = getFacebookUserData(user);
		return fb ? getUserPortrait(fb.id) : "";
	},
});
