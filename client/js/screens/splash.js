Template.splashScreen.rendered = function() {
	// fade in this screen
	$("#splashScreen").css({opacity:0}).stop().animate({opacity:1},500);

	// wait until we have a proper user
	var interval = window.setInterval(function(){
		if (Meteor.user()) {
			window.clearInterval(interval);

			// bring the user to their dashboard
			Router.go("/dashboard");
		}
	},1000);
};
Template.splashScreen.events({
	"mouseover #signin": addHoverCurrentTarget,
	"mouseout #signin": removeHoverCurrentTarget,
	"click #signin": function(e){
		$(".login-button").trigger("click");
	}
});
