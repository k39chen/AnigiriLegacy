window.getUserId = function() {
	return Meteor.userId();
}
/**
 * Determines if a user is an admin user.
 *
 * @method isAdmin
 * @param _id {String} The user id. (Optional, defaults to currently logged in user)
 * @return {Boolean} Whether or not the user is an admin.
 */
window.isAdminUser = function(_id) {
	// use the currently logged in user id
	if (_id === undefined) {
		_id = getUserId();
	}
	if (_id) {
		for (var i=0; i<ADMIN_USERS.length; i++) {
			if (_id === ADMIN_USERS[i]) {
				return true;
			}
		}
	}
	return false;
};
/**
 * Given the Meteor user data, get the facebook user data, otherwise null.
 *
 * @method getFacebookUserData
 * @param userData {Object} The Meteor user data.
 * @return {Object} The facebook user data.
 */
window.getFacebookUserData = function(userData) {
	if (userData && userData.services && userData.services.facebook) {
		return userData.services.facebook;
	} else {
		return null;
	}
};
/**
 * Gets a human-readable version of anime progress strings.
 *
 * @method getTypeStr
 * @param type {String} The system recognized type string.
 * @return {String} The human-readable type string.
 */
window.getTypeStr = function(type) {
	switch (type) {
		case 'tv': return 'TV Series';
		case 'oav': return 'Original Video Animation';
		case 'ona': return 'Original Net Animation';
		case 'movie': return 'Movie';
		default: return type.capitalize();
	}
};
/**
 * Returns the Facebook portrait URL given the user's facebook user ID.
 *
 * @method getUserPortrait
 * @param fb_uid {Number} The user facebook id.
 * @param options {Object} The dimensions of the facebook portrait.
 * @return {String} The portrait URL. 
 */
window.getUserPortrait = function(fb_uid, options) {
	var settings = $.extend({width:150,height:150},options);
	return 'https://graph.facebook.com/'+fb_uid+'/picture?width='+settings.width+'&height='+settings.height;
};
/**
 * Determines whether or not a given anime type possesses episodes.
 *
 * @method hasEpisodes
 * @param type {String} The type string.
 * @return {Boolean} The boolean of whether or not the anime type has episodes.
 */
window.hasEpisodes = function(type){
	return type == 'tv' ||
		type == 'ona' ||
		type == 'oav' ||
		type == 'special';

};
/**
 * Gets a human-readable version of anime progress strings.
 *
 * @method getProgressStr
 * @param progress {String} The system recognized progress strings.
 * @return {String} The human-readable progress strings.
 */
window.getProgressStr = function(progress) {
	switch (progress) {
		case 'finished': return 'Finished';
		case 'watching': return 'Watching';
		case 'onhold': return 'On Hold';
		case 'backlogged': return 'Backlogged';
		case 'abandoned': return 'Abanonded';
		default: return progress.capitalize();
	}
};
/**
 * Determine whether or not the current user has any friends.
 *
 * @method hasSubscriptions
 * @param userId {String} The user id that we test against. (default=currentUserId) 
 * @return {Boolean} Whether or not the current user has friends.
 */
window.hasFriends = function(userId) {
	// default to using the current user id if none is specified
	if (!userId) {
		userId = getUserId();
	}
	return userId ? Friends.find({userId: userId}).count() > 0 : false;
};
/**
 * Determine whether or not the supplied user id corresponds to an already existing friend.
 *
 * @method isFriend
 * @param friendId {String} The user id in question.
 * @return {Boolean} Whether or not the user supplied is a friend of the current user.
 */
window.isFriend = function(friendId) {
	if (!friendId) return false;
	return Friends.find({
		userId: getUserId(), // current user id
		friendId: friendId,
		status: 'approved'
	}).count() > 0;
};

window.isPendingFriendRequest = function(friendId) {
	if (!isFriend(friendId)) {
		return !(!Friends.findOne({
			userId: getUserId(),
			friendId: friendId,
			status: 'pending'
		}));
	}
	return false;
}

/**
 * Determine whether or not the current user has any subscriptions.
 *
 * @method hasSubscriptions
 * @param userId {String} The user id that we test against. (default=currentUserId) 
 * @return {Boolean} Whether or not the current user has subscriptions.
 */
window.hasSubscriptions = function(userId) {
	// default to using the current user id if none is specified
	if (!userId) {
		userId = getUserId();
	}
	return userId ? Subscriptions.find({userId: userId}).count() > 0 : false;
};
/**
 * Gets the subscription data an anime for a given user.
 *
 * @method getSubscriptionData
 * @param annId {Number} The anime id that we are getting.
 * @param userId {String} The user id that we want to fetch the subscriptions. (default=currentUserId)
 * @return {Object} The subscription data.
 */
window.getSubscriptionData = function(annId, userId) {
	// default to using the current user id if none is specified
	if (!userId) {
		userId = getUserId();
	}
	return userId ? Subscriptions.findOne({userId: userId, annId: annId}) : null;
};
/**
 * Performs a client-side join between the subscription and anime data.
 *
 * @method getFullSubscriptions. 
 * @param subscriptions {Array} The array of subscriptions. (default=null)
 * @param userId {String} The user id that we want to fetch the subscriptions. (default=currentUserId)
 * @param sort {Function} An optional sorting function. (default=null)
 * @return {Array} The sorted and complete set of subscription data.
 */
window.getFullSubscriptions = function(subscriptions,userId,sort){
	var result = null;
	
	// default to using the current user id if none is specified
	if (!userId) {
		userId = getUserId();
	}
	if (!userId) return null;

	// if no subset of subscriptions is provided, then just use the full set
	if (!subscriptions) {
		subscriptions = Subscriptions.find({userId:userId}).fetch();
	}
	for (var i=0; i<subscriptions.length; i++) {
		var sub = subscriptions[i],
			annId = sub.annId,
			entry = Animes.findOne({annId:annId});
		entry = $.extend(entry,{subscription:sub});
		
		if (!result) result = [];
		result.push(entry);
	}
	// return an alphabetically sorted result
	if (result) {
		if (sort) {
			result = result.sort(sort);
		} else {
			result = result.sort(function(a,b){
				if(a.title < b.title) return -1;
				if(a.title > b.title) return 1;
				return 0;
			});
		}
	}
	return result;
};
/**
 * Determines if the provided date is in the future.
 *
 * @method isFuture
 * @param date {Date} The date object.
 * @return {Boolean} Whether or not the provided date is in the future.
 */
window.isFuture = function(date) {
	return new Date(date) > new Date()
};
/**
 * Formats date object to human-readable format.
 *
 * @method formatDate
 * @param date {Date} The date object to format.
 * @return {String} The human-readable date string.
 */
window.formatDate = function(date) {
	return date.getShortMonthName() + ' ' + date.getDate() + ', ' + date.getFullYear();
};
/**
 * Capitalizes all words in all elements of the provided string array.
 *
 * @method capitalizeAll
 * @param arr {Array} The array of strings to be capitalized.
 * @return {Array} The capitalized array of strings.
 */
window.capitalizeAll = function(arr) {
	// captialize all the genres
	return $.map(arr, function(item){
		return item.capitalize();
	});
};