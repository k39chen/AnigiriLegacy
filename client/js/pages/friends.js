Template.friendsPage.rendered = function(){
	// initialize the page
	initPage("friends");

	var self = this;

	// initialize the friends grid
	if (self && self.find("#friendsGrid")) {
		window.friendsGrid = new CastGrid({
			wrapper: self.find("#friendsGrid"),
			template: self, 
			dim: {w:128,h:128,pw:12,ph:12},
			drawType: "dynamic",
			dataSource: function(){
				var data = getFriends();
				this.update(data);
			},
			render: function(data){
				return getTemplateHTML("friendItem",data);
			}
		});
	}
};
Template.friendsPage.events({
	"mouseover .friendItem": addHoverCurrentTarget,
	"mouseout .friendItem": removeHoverCurrentTarget,
	"click .friendItem": function(e) {
		var $el = $(e.currentTarget);
		var friendId = $el.attr("data-friendId");

		// show this friend's profile
		Router.go("/profile/"+friendId);
	}
});
Template.friendsPage.helpers({
	hasFriends: function(){
		return hasFriends();
	}
});
