Template.dashboardPage.rendered = function(){
	// fade in the page
	$('#dashboardPage').css({opacity:0}).stop().animate({opacity:1},500);

	// update the sidebar
	$('#sideBar .option').removeClass("selected");
	$('#sideBar .option[data-page="dashboard"]').addClass("selected");
};
Template.dashboardPage.events({
	'mouseover .redirect-btn': function(e) {
		var el = $(e.target);
		el.addClass('hover');
	},
	'mouseout .redirect-btn': function(e) {
		var el = $(e.target);
		el.removeClass('hover');
	},
	'click .redirect-btn': function(e){
		var el = $(e.target);
		Router.go("/discover");
	}
});
Template.dashboardPage.helpers({
	hasSubscriptions: function(){
		return Subscriptions.find().count() > 0;
	},
	userFirstName: function(){
		var user = Meteor.user(), firstname = 'Otaku';
		if (user && user.profile && user.profile.name) {
			var names = user.profile.name.split(' ');
			if (names.length > 0) {
				firstname = names[0];
			}
		}
		return firstname;
	},
	hasCurrentlyWatching: function(){
		return Subscriptions.find({progress:'watching'}).count() > 0;
	},
	countCurrentlyWatching: function(){
		return Subscriptions.find({progress:'watching'}).count();
	},
	getCurrentlyWatching: function(){
		var subscriptions = Subscriptions.find({progress:'watching'}).fetch();
		return getFullSubscriptions(subscriptions);
	}
});
