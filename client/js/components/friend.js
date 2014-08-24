Template.friend.rendered = function() {
	var $el = $(this.find(".portrait"));
	$el.css({opacity:0.8});
};
Template.friend.events({
	"mouseover .friend": function(e) {
		var el = $(e.currentTarget);
		el.addClass("hover")
		el.find(".portrait").css({opacity:1});
	},
	"mouseout .friend": function(e) {
		var el = $(e.currentTarget);
		el.removeClass("hover")
		el.find(".portrait").css({opacity:0.8});
	},
	"click .friend": function(e) {
		var el = $(e.currentTarget);
		var friendId = el.attr("data-friendId");

		// show this friend's profile
		Router.go("/profile/"+friendId);
	}
});
Template.friend.helpers({
	portrait: function() {
		var self = this,
			fb = getFacebookUserData(self);

		return fb ? getUserPortrait(fb.id) : "";
	},
	name: function() {
		var self = this,
			fb = getFacebookUserData(self);
		return fb ? fb.name : "";
	},
	friendId: function() {
		return this._id;
	}
});
