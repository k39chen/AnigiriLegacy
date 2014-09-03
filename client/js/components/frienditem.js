Template.friendItem.rendered = function() {
	var $el = $(this.find(".portrait"));
	$el.css({opacity:0.8});
};
Template.friendItem.helpers({
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
