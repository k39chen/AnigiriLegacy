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
});
