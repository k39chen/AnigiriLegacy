Template.dashboardPage.rendered = function(){
	// initialize the page
	initPage("dashboard");

	$(".expo").owlCarousel({
		items : 6,
		dots: false,
		loop: true,
		autoplay: true,
		autoplayTimeout: 2000
	});
};
Template.dashboardPage.events({
	"mouseover .redirect-btn": addHoverTarget,
	"mouseout .redirect-btn": removeHoverTarget,
	"click .redirect-btn": function(e){
		Router.go("/discover");
	},
	"mouseover .accept-btn": addHoverTarget,
	"mouseout .accept-btn": removeHoverTarget,
	"click .accept-btn": function(e) {
		var $el = $(e.target),
			friendId = $($el.parent()).data("friend-id");
		Meteor.call("approveFriendRequest", friendId);
	},
	"mouseover .decline-btn": addHoverTarget,
	"mouseout .decline-btn": removeHoverTarget,
	"click .decline-btn": function(e) {
		var $el = $(e.target),
			friendId = $($el.parent()).data("friend-id");
		Meteor.call("declineFriendRequest", friendId);
	}
});
Template.dashboardPage.helpers({
	hasSubscriptions: function(){
		return hasSubscriptions();
	},
	userFirstName: function(){
		var user = Meteor.user(), firstname = "Otaku";
		if (user && user.profile && user.profile.name) {
			var names = user.profile.name.split(" ");
			if (names.length > 0) {
				firstname = names[0];
			}
		}
		return firstname;
	},
	hasCurrentlyWatching: function(){
		return Subscriptions.find({userId: getUserId(), progress:"watching"}).count() > 0;
	},
	countCurrentlyWatching: function(){
		return Subscriptions.find({userId: getUserId(), progress:"watching"}).count();
	},
	getCurrentlyWatching: function(){
		var subscriptions = Subscriptions.find({userId: getUserId()/*, progress:"watching"*/}).fetch();
		return getFullSubscriptions(subscriptions);
	},

	hasApprovableFriendRequests: function() {
		return getApprovableFriendRequests().length > 0;
	},
	getApprovableFriendRequests: function() {
		return getApprovableFriendRequests();
	},

	friendId: function(friendRequest) {
		return friendRequest.userId;
	},
	portrait: function(friendRequest) {
		var friend = Meteor.users.findOne({_id:friendRequest.userId}),
			fb = getFacebookUserData(friend);
		return getUserPortrait(fb.id);
	},
	friendName: function(friendRequest) {
		var friend = Meteor.users.findOne({_id:friendRequest.userId}),
			fb = getFacebookUserData(friend);
		return fb.name;
	}
});
