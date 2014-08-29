/**
 * Publishes all the users that use Anigiri.
 *
 * @publication users
 */
Meteor.publish('users', function(){
	return Meteor.users.find();
});
/**
 * The current user login data.
 *
 * @publication userData
 */
Meteor.publish('userData', function(){
	return Meteor.users.find(
		{_id: this.userId},
		{fields: {services: 1}}
	);
});
/**
 * Returns the list of current user subscriptions.
 *
 * @publication userSubscriptions
 */
Meteor.publish('userSubscriptions', function(){
	return Subscriptions.find({userId:this.userId});
});
/**
 * Returns the list of animes that the user is current subscribed to.
 * 
 * @publication userAnimes
 */
Meteor.publish('userAnimes', function(){
	var userId = this.userId;
	var subscriptions = Subscriptions.find({userId:userId}).fetch();
	var scope = [];
	// this is our way of doing projection... stupid minimongo
	for (var i=0; i<subscriptions.length; i++){
		scope.push(subscriptions[i].annId);
	}
	return Animes.find({annId: {$in: scope}});
});
/**
 * Gets all anime songs.
 *
 * @publication songs
 */
Meteor.publish('songs', function(){
	return Songs.find();
});
/**
 * Returns the list of user friends (describing the relationship between the two users).
 *
 * @publication userFriends
 */
Meteor.publish('userFriends',function(){
	return Friends.find({userId: this.userId});
});
/** 
 * Returns the list of friends that user friends have.
 *
 * @publication userFriends
 */
Meteor.publish('friendUsers', function(){
	return Friends.find({friendId: this.userId});
});
/** 
 * Gets all subscriptions.
 *
 * @publication generalSubscriptions
 */
Meteor.publish('generalSubscriptions', function(){
	return Subscriptions.find();
});
/**
 * Publishes all animes in the system.
 *
 * @publication allAnimes
 */
Meteor.publish('allAnimes', function(){
	return Animes.find();
});

