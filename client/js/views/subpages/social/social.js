Template.socialSubpage.rendered = function(){
	InfoBar.hideLoad();
	$('#socialSubpage').css({opacity:0}).stop().animate({opacity:1},500);
};
Template.socialSubpage.events({
	'mouseover .addfriends-btn': function(e){
		var el = $(e.target);
		el.addClass('hover');
	},
	'mouseout .addfriends-btn': function(e){
		var el = $(e.target);
		el.removeClass('hover');
	},
	'click .addfriends-btn': function(e){
		selectPage('social');
	},
});
Template.socialSubpage.helpers({
	hasFriends: function() {
		return hasFriends();
	}
});
