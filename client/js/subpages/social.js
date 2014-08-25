Template.socialSubpage.rendered = function(){
	InfoBar.hideLoad();
	$("#socialSubpage").css({opacity:0}).stop().animate({opacity:1},500);
};
Template.socialSubpage.events({
	"mouseover .addfriends-btn": function(e){
		var el = $(e.target);
		el.addClass("hover");
	},
	"mouseout .addfriends-btn": function(e){
		var el = $(e.target);
		el.removeClass("hover");
	},
	"click .addfriends-btn": function(e){
		Router.go("/social");
	},
	"mouseover .friend": function(e) {
		var el = $(e.currentTarget);
		el.addClass("hover");
	},
	"mouseout .friend": function(e) {
		var el = $(e.currentTarget);
		el.removeClass("hover");
	},
	"mouseover .name": function(e) {
		var el = $(e.target);
		el.addClass("hover");
	},
	"mouseout .name": function(e) {
		var el = $(e.target);
		el.removeClass("hover");
	},
	"click .name": function(e) {
		var el = $(e.target).parent().parent(),
			friendId = el.attr("data-friendId");
		Router.go("/profile/"+friendId);
	}
});
Template.socialSubpage.helpers({
	hasFriends: function() {
		return hasFriends();
	},
	getFriends: function() {
		return getFriends();
	},
	portrait: function(item) {
		var self = this,
			fb = getFacebookUserData(self);
		return fb ? getUserPortrait(fb.id) : "";
	},
	name: function(item) {
		var self = this,
			fb = getFacebookUserData(self);
		return fb ? fb.name : "";
	},
	email: function() {
		var self = this,
			fb = getFacebookUserData(self);
		return fb ? fb.email : "";
	},
	friendId: function() {
		return this._id;
	}
});
