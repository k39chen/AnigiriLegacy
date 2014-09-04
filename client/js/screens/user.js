Template.userScreen.rendered = function() {

	// if there is no user here, then we will bring them back to the splash page
	if (!Meteor.user()) {
		Router.go("/");
		return;
	}
	// fade in this screen
	$("#userScreen").css({opacity:0}).stop().animate({opacity:1},500);
};
Template.userScreen.helpers({
	// ...
});
