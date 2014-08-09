Template.userScreen.rendered = function() {
	// fade in this screen
	$('#userScreen').css({opacity:0}).stop().animate({opacity:1},500);

	// by default we will select the dashboard page
	selectPage('dashboard');

	// this is a fix for when the info bar some how has data in it already??
	InfoBar.clear();
};
Template.userScreen.helpers({
	// some methods to determine which page to display
	showDashboardPage: function(){
		return Session.equals('page','dashboard');
	},
	showCollectionPage: function(){
		return Session.equals('page','collection');
	},
	showDiscoverPage: function(){
		return Session.equals('page','discover');
	},
	showSocialPage: function(){
		Session.set('friendProfile',null);
		return Session.equals('page','social');
	},
	showStatisticsPage: function(){
		return Session.equals('page','statistics');
	},
	showAdminPage: function(){
		return Session.equals('page','admin');
	}
});
