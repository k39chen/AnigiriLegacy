/**
 * The current user login data.
 *
 * @publication userData
 * @param userId {String} The user ID. Defaults to currently logged in user.
 */
Meteor.publish("userData", function(userId){
	userId = userId !== undefined ? userId : this.userId;
	return Meteor.users.find(
		{_id: userId},
		{fields: {services: 1}}
	);
});
/**
 * Returns the list of current user subscriptions.
 *
 * @publication userSubscriptions
 * @param userId {String} The user ID. Defaults to currently logged in user.
 */
Meteor.publish("userSubscriptions", function(userId){
	userId = userId !== undefined ? userId : this.userId;
	return Subscriptions.find({userId:userId});
});
/**
 * Returns the list of current user subscriptions along with its corresponding anime data.
 *
 * @publication userAnimeSubscriptions
 * @param userId {String} The user ID. Defaults to currently logged in user.
 */
Meteor.publish("userAnimeSubscriptions", function(userId){
	userId = userId !== undefined ? userId : this.userId;
	var subscriptions = Subscriptions.find({userId:userId}).fetch();
	var scope = [];
	// this is our way of doing projection... stupid minimongo
	for (var i=0; i<subscriptions.length; i++){
		scope.push(subscriptions[i].annId);
	}
	return Animes.find({annId: {$in: scope}});
});
/**
 * Returns the list of user friends (describing the relationship between the two users).
 *
 * @publication userFriends
 * @param userId {String} The user ID. Defaults to currently logged in user.
 */
Meteor.publish("userFriends",function(userId){
	userId = userId !== undefined ? userId : this.userId;
	return Friends.find({userId: userId});
});
/**
 * Returns the list of current user friends along with their user data.
 *
 * @publication userFriendsUserData
 * @param userId {String} The user ID. Defaults to currently logged in user.
 */
Meteor.publish("userFriendsUserData", function(userId){
	userId = userId !== undefined ? userId : this.userId;
	var friends = Friends.find({userId:userId}).fetch();
	var scope = [];
	// this is our way of doing projection... stupid minimongo
	for (var i=0; i<friends.length; i++) {
		if (friends[i].userId === userId) {
			scope.push(friends[i].friendId);
		} else {
			scope.push(friends[i].userId);
		}
	}
	return Meteor.users.find({_id: {$in: scope}});
});
/**
 * Returns song data for a requested anime.
 *
 * @publication animeSongList
 * @param annId {Number} The anime ID.
 */
Meteor.publish("animeSongList", function(annId){
	return Songs.find({annId:annId});
});
