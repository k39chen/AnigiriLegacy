// Meteor subscriptions
Meteor.subscribe('users');
Meteor.subscribe('userData');
Meteor.subscribe('userAnimes');
Meteor.subscribe('userSubscriptions');
Meteor.subscribe('songs');
Meteor.subscribe('userFriends');
Meteor.subscribe('generalSubscriptions');
Meteor.subscribe('generalFriends');

// define our router configuration
Router.configure({
	notFound: 'notFound',
	layoutTemplate: 'userScreen',
	loadingTemplate: 'loadingScreen'
});
Router.onBeforeAction('loading');

// define our routes
Router.map(function(){
	// set up dashboard router
	this.route('dashboardPage', {
		path: '/dashboard',
		template: 'dashboardPage',
		yieldTemplates: {
			'dashboardPage': {to: 'page-container'}
		}
	});
	// set up collection router
	this.route('collectionPage', {
		path: '/collection',
		template: 'collectionPage',
		yieldTemplates: {
			'collectionPage': {to: 'page-container'}
		}
	});
	// set up discover router
	this.route('discoverPage', {
		path: '/discover',
		template: 'discoverPage',
		yieldTemplates: {
			'discoverPage': {to: 'page-container'}
		}
	});
	// set up social router
	this.route('socialPage', {
		path: '/social',
		template: 'socialPage',
		yieldTemplates: {
			'socialPage': {to: 'page-container'}
		}
	});
	// set up statistics router
	this.route('statisticsPage', {
		path: '/statistics',
		template: 'statisticsPage',
		yieldTemplates: {
			'statisticsPage': {to: 'page-container'}
		}
	});
	// set up admin router
	this.route('adminPage', {
		path: '/admin',
		template: 'adminPage',
		yieldTemplates: {
			'adminPage': {to: 'page-container'}
		}
	});
	// set up the profile router
	this.route('profile', {
		path: '/profile/:_id',
		template: 'profilePage',
		yieldTemplates: {
			'profilePage': {to: 'page-container'}
		},
		data: function() {
			return Meteor.users.findOne({_id: this.params._id});
		}
	});

	// set up splash page router
	this.route('splashScreen', {
		path: '/',
		template: 'splashScreen',
		layoutTemplate: 'splashScreen'
	});
	// have a natural fallback
	this.route('notFoundScreen', {
		path: '*',
		template: 'notFoundScreen',
		layoutTemplate: 'notFoundScreen'
	});

});
