// Meteor subscriptions
Meteor.subscribe('users');
Meteor.subscribe('userData');
Meteor.subscribe('userAnimes');
Meteor.subscribe('userSubscriptions');
Meteor.subscribe('songs');
Meteor.subscribe('userFriends');

// define our router configuration
Router.configure({
	notFound: 'notFound',
	loadingTemplate: 'loadingScreen'
});
Router.onBeforeAction('loading');

// define our routes
Router.map(function(){
	// set up splash page router
	this.route('splashScreen', {
		path: '/',
		template: 'splashScreen'
	});
	// set up dashboard router
	this.route('dashboardPage', {
		path: '/dashboard',
		template: 'dashboardPage',
		layoutTemplate: 'userScreen',
		yieldTemplates: {
			'dashboardPage': {to: 'page-container'}
		}
	});
	// set up collection router
	this.route('collectionPage', {
		path: '/collection',
		template: 'collectionPage',
		layoutTemplate: 'userScreen',
		yieldTemplates: {
			'collectionPage': {to: 'page-container'}
		}
	});
	// set up discover router
	this.route('discoverPage', {
		path: '/discover',
		template: 'discoverPage',
		layoutTemplate: 'userScreen',
		yieldTemplates: {
			'discoverPage': {to: 'page-container'}
		}
	});
	// set up social router
	this.route('socialPage', {
		path: '/social',
		template: 'socialPage',
		layoutTemplate: 'userScreen',
		yieldTemplates: {
			'socialPage': {to: 'page-container'}
		}
	});
	// set up statistics router
	this.route('statisticsPage', {
		path: '/statistics',
		template: 'statisticsPage',
		layoutTemplate: 'userScreen',
		yieldTemplates: {
			'statisticsPage': {to: 'page-container'}
		}
	});
	// set up admin router
	this.route('adminPage', {
		path: '/admin',
		template: 'adminPage',
		layoutTemplate: 'userScreen',
		yieldTemplates: {
			'adminPage': {to: 'page-container'}
		}
	});
	// set up the profile router
	this.route('profile', {
		path: '/profile/:_id',
		template: 'profilePage',
		layoutTemplate: 'userScreen',
		yieldTemplates: {
			'profilePage': {to: 'page-container'}
		},
		data: function() {
			return Meteor.users.findOne({_id: this.params._id});
		}
	});
	// have a natural fallback
	this.route('notFoundScreen', {
		path: '*',
		template: 'notFoundScreen'
	});



	// lets just plan out some routes

	// this.route('profile', {path: '/profile/:id', data: function() { return Users.findOne({_id: this.params.id}); }})

	// TODO: look more into this method and how to use it
	// Router.onBeforeAction('loading');

	// TODO: investigate more into yield layouts
	// https://github.com/EventedMind/iron-router/blob/devel/DOCS.md#using-a-layout-with-yields

});
