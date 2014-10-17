window.SideBar = {
	$el: null,
	$toggle: null,
	$pageContainer: null,
	isMinimized: false,
	animDuration: 200,
	init: function() {
		var self = this;
		self.$el = $("#sideBar");
		self.$toggle = $("#corner .toggle");
		self.$pageContainer = $("#page-container");

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
		self.$toggle.removeClass("fa-toggle-right").addClass("fa-toggle-left");
		self.$el.removeClass("minimized");
		self.$pageContainer.removeClass("minimized-left");
		$("h1",self.$pageContainer).removeClass("minimized-left");
		$("h1",self.$pageContainer).css({left:215});

		self.isMinimized = false;

		setTimeout(function(){
			resizeGrids();
		}, self.animDuration);
	},
	minimize: function() {
		var self = this;
		self.$toggle.removeClass("fa-toggle-left").addClass("fa-toggle-right");
		self.$el.addClass("minimized");
		self.$pageContainer.addClass("minimized-left");
		$("h1",self.$pageContainer).addClass("minimized-left");

		self.isMinimized = true;

		setTimeout(function(){
			resizeGrids();
		}, self.animDuration);
	}
};
Template.sideBar.rendered = function(){
	// initialize the corner controls
	SideBar.init();
};
Template.sideBar.events({
	"mouseover .toggle": addHoverTarget,
	"mouseout .toggle": removeHoverTarget,
	"click .toggle" : function(e) {
		SideBar.toggle();
	},
	"mouseover .search-btn": addHoverCurrentTarget,
	"mouseout .search-btn": removeHoverCurrentTarget,
	"click .search-btn:not(.selected)": function(e) {
		var $el = $(e.currentTarget);
		$el.addClass("selected");
		Session.set("currentURL",window.location.pathname);
		console.log(Session.get("currentURL"));
		Router.go("/search");
	},
	"mouseover .search-btn .close-btn": addHoverCurrentTarget,
	"mouseout .search-btn .close-btn": removeHoverCurrentTarget,
	"click .search-btn.selected .close-btn": function(e) {
		var $el = $(e.currentTarget);
		$el.parent().removeClass("selected");
		Router.go(Session.get("currentURL"));
	},
	"mouseover .option": addHoverCurrentTarget,
	"mouseout .option": removeHoverCurrentTarget,
	"click .option": function(e) {
		var $el = $(e.currentTarget);
		$el.find(".loadingSpinner").addClass("visible");
		Router.go("/"+$el.attr("data-page"));
	},
	"mouseover #signout": addHoverCurrentTarget,
	"mouseout #signout": removeHoverCurrentTarget,
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
