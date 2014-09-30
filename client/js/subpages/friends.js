Template.friendsSubpage.rendered = function(){
	// initialize the subpage
	initSubpage("friends");
};
Template.friendsSubpage.events({
	"mouseover .addfriends-btn": addHoverTarget,
	"mouseout .addfriends-btn": removeHoverTarget,
	"click .addfriends-btn": function(e){
		Router.go("/friends");
	},
	"mouseover .friend": addHoverCurrentTarget,
	"mouseout .friend": removeHoverCurrentTarget,
	"mouseover .name": addHoverTarget,
	"mouseout .name": removeHoverTarget,
	"click .name": function(e) {
		var $el = $(e.target).parent().parent(),
			friendId = $el.attr("data-friendId");
		Router.go("/profile/"+friendId);
	}
});
Template.friendsSubpage.helpers({
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
