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
 * Determine whether or not the current user has any subscriptions.
 *
 * @method hasSubscriptions
 * @return {Boolean} Whether or not the current user has subscriptions.
 */
window.hasSubscriptions = function() {
	return Subscriptions.find().count() > 0;
};
/**
 * Determine whether or not the current user has any friends.
 *
 * @method hasSubscriptions
 * @return {Boolean} Whether or not the current user has friends.
 */
window.hasFriends = function() {
	return Friends.find().count() > 0;
};
/**
 * Performs a client-side join between the subscription and anime data.
 *
 * @method getFullSubscriptions.
 * @param subscriptions {Array} The array of subscriptions. (default=null)
 * @param sort {Function} An optional sorting function. (default=null)
 * @return {Array} The sorted and complete set of subscription data.
 */
window.getFullSubscriptions = function(subscriptions,sort){
	var result = null;
	
	// if no subset of subscriptions is provided, then just use the full set
	if (!subscriptions) {
		subscriptions = Subscriptions.find().fetch();
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
