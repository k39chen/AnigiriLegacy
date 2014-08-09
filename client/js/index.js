// Meteor subscriptions
Meteor.subscribe('users');
Meteor.subscribe('userData');
Meteor.subscribe('userAnimes');
Meteor.subscribe('userSubscriptions');
Meteor.subscribe('songs');
Meteor.subscribe('userFriends');

// define our routers
Router.map(function(){
	this.route("home", {path: "/"});
	this.route("about", {path: "/about"});

	// lets just plan out some routes
	// this.route("dashboard", {path: "/dashboard"});
	// this.route("collection", {path: "/collection"});
	// this.route("discover", {path: "/discover"});
	// this.route("social", {path: "/social"});
	// this.route("statistics", {path: "/statistics"});
	// this.route("admin", {path: "/admin"});

});
