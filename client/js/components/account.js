Template.account.rendered = function(){
	// ...
};
Template.account.events({
	'mouseover #signout': function(e) {
		var el = $(e.currentTarget);
		el.addClass('hover');
	},
	'mouseout #signout': function(e){
		var el = $(e.currentTarget);
		el.removeClass('hover');
	},
	'click #signout': function(){
		Meteor.logout();
		Router.go("/");
	}
});
Template.account.helpers({
	userPortrait: function(){
		var user = Meteor.user();
		if (user && user.services && user.services.facebook && user.services.facebook.id) {
			var fb_uid = user.services.facebook.id;
			return getUserPortrait(fb_uid, {width:150,height:150});
		}
		return null;
	}
});
