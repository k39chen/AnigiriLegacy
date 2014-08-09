Template.collectionPage.rendered = function(){
	hideLoadingScreen();
	$('#collectionPage').css({opacity:0}).stop().animate({opacity:1},500);
};
Template.collectionPage.events({
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
		selectPage('discover');
	}
});
Template.collectionPage.helpers({
	hasSubscriptions: function(){
		return hasSubscriptions();
	},
	getSubscriptions: function(){
		return getFullSubscriptions();
	}
});
