/*
// Meteor subscriptions
Meteor.subscribe("users");
Meteor.subscribe("userData");
Meteor.subscribe("userAnimes");
Meteor.subscribe("userSubscriptions");
Meteor.subscribe("songs");
Meteor.subscribe("userFriends");
Meteor.subscribe("friendUsers");
Meteor.subscribe("allAnimes");
Meteor.subscribe("generalSubscriptions");
*/

// installs the `cast` component for grid layouts
Meteor.startup(function() {
	$("head").append("<script src='/cast.js'></script>");
});

// define our router configuration
Router.configure({
	trackPageView: true,
	notFound: "notFound",
	layoutTemplate: "userScreen",
	loadingTemplate: "loadingScreen",
	waitOn: function() {
		// always load the current user data
		this.subscribe("userData");

		// always load complete subscription and their 
		// corresponding anime info
		this.subscribe("userSubscriptions");
		this.subscribe("userAnimeSubscriptions");

		// always load complete user friend info
		this.subscribe("userFriends");
		this.subscribe("userFriendsUserData");
	}
});
Router.onBeforeAction("loading");

// define our routes
Router.map(function(){
	// set up search page
	this.route("searchPage", {
		path: "/search",
		template: "searchPage",
		yieldTemplates: { "searchPage": {to: "page-container"} },
		progress: { delay: 100 },
		/*
		data: function() {
			return Meteor.users.findOne({_id: this.params._id});
		},
		*/
		waitOn: function() {
			// ...
		},
		action: function() {
			if (this.ready()) {
				this.render();
			}
		}
	});
	// set up dashboard router
	this.route("dashboardPage", {
		path: "/dashboard",
		template: "dashboardPage",
		yieldTemplates: { "dashboardPage": {to: "page-container"} },
		progress: { delay: 100 },
		waitOn: function() {
			// ...
		},
		action: function() {
			if (this.ready()) {
				this.render();
			}
		}
	});
	// set up collection router
	this.route("collectionPage", {
		path: "/collection",
		template: "collectionPage",
		yieldTemplates: { "collectionPage": {to: "page-container"} },
		progress: {delay: 100},
		waitOn: function() {
			// ...
		},
		action: function() {
			if (this.ready()) {
				this.render();
			}
		}
	});
	// set up discover router
	this.route("discoverPage", {
		path: "/discover",
		template: "discoverPage",
		yieldTemplates: { "discoverPage": {to: "page-container"} },
		progress: {delay: 100},
		waitOn: function() {
			// ...
		},
		action: function() {
			if (this.ready()) {
				this.render();
			}
		}
	});
	// set up friends router
	this.route("friendsPage", {
		path: "/friends",
		template: "friendsPage",
		yieldTemplates: { "friendsPage": {to: "page-container"} },
		progress: {delay: 100},
		waitOn: function() {
			// ...
		},
		action: function() {
			if (this.ready()) {
				this.render();
			}
		}
	});
	// set up statistics router
	this.route("statisticsPage", {
		path: "/statistics",
		template: "statisticsPage",
		yieldTemplates: { "statisticsPage": {to: "page-container"} },
		progress: {delay: 100},
		waitOn: function() {
			// ...
		},
		action: function() {
			if (this.ready()) {
				this.render();
			}
		}
	});
	// set up admin router
	this.route("adminPage", {
		path: "/admin",
		template: "adminPage",
		yieldTemplates: { "adminPage": {to: "page-container"} },
		progress: {delay: 100},
		waitOn: function() {
			// ...
		},
		action: function() {
			if (this.ready()) {
				this.render();
			}
		}
	});
	// set up the profile router
	this.route("profile", {
		path: "/profile/:_id",
		template: "profilePage",
		yieldTemplates: { "profilePage": {to: "page-container"} },
		progress: {delay: 100},
		data: function() {
			return Meteor.users.findOne({_id: this.params._id});
		},
		waitOn: function() {
			// ...
		},
		action: function() {
			if (this.ready()) {
				this.render();
			}
		}
	});

	// set up splash page router
	this.route("splashScreen", {
		path: "/",
		template: "splashScreen",
		layoutTemplate: "splashScreen"
	});
	// have a natural fallback
	this.route("notFoundScreen", {
		path: "*",
		template: "notFoundScreen",
		layoutTemplate: "notFoundScreen"
	});

});
