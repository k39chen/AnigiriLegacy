var ANN_API			= 'https://animenewsnetwork.p.mashape.com/api.xml';
var ANN_REPORTS		= 'https://animenewsnetwork.p.mashape.com/reports.xml';
var HUMMINGBIRD_API	= 'https://hummingbirdv1.p.mashape.com/anime/';
var HUMMINGBIRD_SEARCH = 'http://hummingbird.me/search?query={{hbAnimeId}}&type=anime';
var MASHAPE_KEY		= 'pT8ejx9ujTSBpdtA3Dz3BT9KdIZn77VK';

// this should be set to true only for testing purposes.
var ALWAYS_LOAD_NEWEST_DATA_FROM_ANN = false;

// http://www.rabbitpoets.com/anime-planet-com-a-worthy-replacement-for-myanimelist/
// http://www.anime-planet.com/anime/one-piece
// http://anime-pictures.net/pictures/view_posts/0?search_tag=bleach&order_by=rating&ldate=0&lang=en
// http://myanimelist.net/anime/1234

function getSingleField(value) {
	return value && value.length > 0 ? value[0] : null;
}
function getArrayField(value) {
	return value && value.length > 0 ? value: null;
}

Meteor.methods({
	/**
	 * Performs search query and returns grouped results.
	 *
	 * @method executeSearch
	 * @param query {String} The search query string.
	 * @return {Object} The search result data.
	 */
	executeSearch: function(query) {
		var results = {};
		console.log("Performing search for: "+query);

		// search against animes
		var animeResultsRaw = Animes.find({title: new RegExp(query,"i")}).fetch();

		for (var i=0; i<animeResultsRaw.length; i++) {
			var match = animeResultsRaw[i];
			// we should also know whether or not this is user is already subscribed to this anime
			var subscription = Subscriptions.find({annId:match.annId,userId:Meteor.userId()}).fetch();
			match.isSubscribed = (subscription.length > 0);
			if (match.isSubscribed) {
				subscription = subscription[0];
				match.progress = subscription.progress;
			}
		}
		// lets now prune the anime data so that the client doesn't get more than they need to know
		for (var i=0; i<animeResultsRaw.length; i++) {
			var match = animeResultsRaw[i];
			var formattedMatch = {
				annId: match.annId,
				title: match.title,
				type: match.type,
				isSubscribed: match.isSubscribed,
				numEpisodes: match.numEpisodes,
				picture: match.hbiPicture || match.annPicture
			};
			// the date info
			var startDate = new Date(match.startDate);
			var endDate = new Date(match.endDate);
			formattedMatch.info = startDate.getFullYear() || "";
			if (match.endDate) {
				if (endDate.getFullYear() === startDate.getFullYear()) {
					formattedMatch.info = 
						startDate.getShortMonthName() + " " + startDate.getFullYear() + " - " + 
						endDate.getShortMonthName() + " " + endDate.getFullYear();
				} else {
					formattedMatch.info = startDate.getFullYear() + " - " + endDate.getFullYear();
				}
			}
			// push this into its own category by type
			if (!results[match.type]) {
				results[match.type] = [];
			}
			results[match.type].push(formattedMatch);
		}
		// now lets see if we can find any users
		var userResultsRaw = Meteor.users.find({"profile.name": new RegExp(query,"i")}).fetch();
		for (var i=0; i<userResultsRaw.length; i++) {
			var user = userResultsRaw[i];
			var formattedUser = {
				userId: user._id
			};
			if (user && user.profile && user.profile.name) {
				formattedUser.name = user.profile.name;
			}
			if (user && user.services && user.services.facebook) {
				if (user.services.facebook.id) {
					formattedUser.portrait = "https://graph.facebook.com/"+user.services.facebook.id+"/picture?width=150&height=150";
				}
				if (user.services.facebook.email) {
					formattedUser.email = user.services.facebook.email;
				}
			}
			if (!results.user) {
				results.user = [];
			}
			results.user.push(formattedUser);
		}
		// just print some diagnostics for the console
		if (Object.keys(results).length > 0) {
			for (var category in results) {
				console.log("--- "+category + ": "+results[category].length);
			}
		} else {
			console.log("--- No search results found");
		}
		return {query:query,results:results};
	},
	/**
	 * Gets a series of administrative data to display on the admin page.
	 *
	 * @method getAdminData
	 * @return {Object} The admin data.
	 */
	getAdminData: function(){
		return {
			totalAnimes: Animes.find().count(),
			totalANN: Animes.find({dataANN:true}).count(),
			totalHBI: Animes.find({dataHBI:true}).count(),
			totalCovers: Animes.find({$or: [{annPicture: {$exists:true}}, {hbiPicture: {$exists:true}}]}).count(),
			totalSongs: Songs.find().count()
		};
	},
	/**
	 * Simply returns the entire list of users on Anigiri. This is used for the autocomplete mechanism.
	 *
	 * @method getUsers
	 * @return {Array} The list of users.
	 */
	getUsers: function() {
		return Meteor.users.find().fetch();
	},
	/**
	 * Simply returns the entire list of animes. This is used for the autocomplete mechanism.
	 *
	 * @method getAnimes
	 * @return {Array} The list of animes.
	 */
	getAnimes: function() {
		return Animes.find().fetch();
	},
	/**
	 * Gets the anime title and type given an ANN ID.
	 *
	 * @method getSimpleAnimeData
	 * @param annId {Number} The ANN ID.
	 * @return {Object} The title and type packaged in an object.
	 */
	getSimpleAnimeData: function(annId) {
		var anime = Animes.findOne({annId:annId});
		return {title: anime.title, type: anime.type};
	},
	/**
	 * Gets the anime data with the given ANN anime ID. Will either return a cached version,
	 * or a fresh fetch from ANN depending on the last time the entry was updated. This is used
	 * to populate the infoBar.
	 *
	 * @method getAnimeData
	 * @param annId {Number} The ANN anime ID.
	 * @return {Object} The ANN anime data.
	 */
	getAnimeData: function(annId) {
		// we will try to return an existing document in the collection
		var animeDoc = Animes.findOne({annId:annId});
		console.log('Getting '+annId+': ('+animeDoc.type+') '+animeDoc.title);

		// we will only attempt to get updated data if the last time we attempted
		// to fetch from the API is more than 1 day ago.
		var result = {};
		if (ALWAYS_LOAD_NEWEST_DATA_FROM_ANN || timeSinceLastUpdate(animeDoc) > 24) {
			console.log('-- Fetching fresh data from ANN and HBI');
			Meteor.call('fetchAnimeData',annId,animeDoc.title);
			result = Animes.findOne({annId:annId});
		} else {
			console.log('-- Returning cached data');
			result = animeDoc;
		}
		return result;
	},
	/**
	 * Performs an extensive search for all animes in the ANN database.
	 * WARNING: This should never EVER be run...
	 *
	 * @method fetchCompleteAnimeList
	 * @return {Array} The list of animes.
	 */
	fetchCompleteAnimeList: function(){
		// if we are issuing this request, then we must be getting info
		// from the source API.
		console.log('Fetching complete anime list');
		
		// get all the cursory anime data
		Meteor.call('fetchAllAnimes');

		// now that we have the complete cursory anime list, we will try to get the full data for each anime
		Animes.find().forEach(function(doc){
			console.log('--- Fetching data for '+doc.annId+' > '+doc.title);

			// fetch the anime data from both HB and ANN
			Meteor.call('fetchAnimeData',animeId,animeDoc.title); 
		});

		return Animes.find().fetch();
	},
	/**
	 * Performs a request against ANN, and gets all cursory reports on anime data.
	 *
	 * @method fetchAllAnimes
	 * @return {Array} The list of animes.
	 */
	fetchAllAnimes: function() {
		var response = HTTP.get(ANN_REPORTS+'?id=155&type=anime&nlist=all',{
			headers: {'X-Mashape-Authorization': MASHAPE_KEY}
		});
		if (response.content) {
			var data = XML2JS.parse(response.content);
		
			// we will try to add new entries into the Animes collection
			for (var i=0; i<data.report.item.length; i++) {
				var item  = data.report.item[i];
				var doc = {
					annId: parseInt(getSingleField(item.id),10),
					title: getSingleField(item.name),
					type:  getSingleField(item.type).toLowerCase(),
					lastUpdate: null,
					dataHBI: false,
					dataANN: false
				};
				console.log('Fetching '+doc.annId+': ('+doc.type+') '+doc.title);
				
				// if this doesn't exist in the collection, add it
				if (!Animes.findOne({annId:doc.annId})){
					Animes.insert(doc);
				}
			}
		}
		return Animes.find().fetch();
	},
	/**
	 * @DANGEROUS!!
	 *
	 * Removes all animes! This is a super dangerous call, and should only be used during 
	 * the testing and development phase.
	 *
	 * @method deleteAllAnimes
	 */
	deleteAllAnimes: function(){
		console.log('Deleting all animes!!');
		var animes = Animes.find().fetch();
		for (var i=0; i<animes.length; i++) {
			Animes.remove({_id:animes[i]._id});
		}
	},
	/**
	 * @DANGEROUS!!
	 *
	 * Removes all songs! This is a super dangerous call, and should only be used during 
	 * the testing and development phase.
	 *
	 * @method deleteAllSongs
	 */
	deleteAllSongs: function(){
		console.log('Deleting all songs!!');
		var songs = Songs.find().fetch();
		for (var i=0; i<songs.length; i++) {
			Songs.remove({_id:songs[i]._id});
		}
	},
	/**
	 * Collects data on an anime from both ANN and Hummingbird.
	 *
	 * @method fetchAnimeData
	 * @param animeId {Number} The ANN anime ID.
	 * @param animeTitle {String} The anime title.
	 * @return {Object|null} The anime data, otherwise null.
	 */
	fetchAnimeData: function(animeId, animeTitle) {
		// Hummingbird
		var hbiData = {};
		var hbi = Meteor.call('fetchHummingbirdInfo',animeTitle.slugify());
		if (hbi) {
			if (hbi.pictureUrl == 'http://hummingbird.me/assets/missing-anime-cover.jpg') {
				hbi.pictureUrl = null;
			}
			hbiData.hbiPicture = hbi.pictureUrl;
			hbiData.dataHBI = true;
			console.log('--- HBI SUCCESS');
		} else {
			console.log('--- HBI FAILED');
		}
		// // Anime News Network
		var annData = Meteor.call('fetchANNInfo',animeId);
		if (annData) {
			annData.dataANN = true;
			console.log('--- ANN SUCCESS');
		} else {
			console.log('--- ANN FAILED');
		}

		Animes.update({annId:animeId},{$set:hbiData});
		Animes.update({annId:animeId},{$set:annData});

		return Animes.findOne({annId:animeId});
	},
	/**
	 * Parses and returns an ANN anime record, given its corresponding ANN ID.
	 *
	 * @method fetchANNInfo
	 * @param animeId {Number} The ANN anime ID.
	 * @return {Object|null} The ANN anime data, otherwise null.
	 */
	fetchANNInfo: function(animeId) {
		var response = HTTP.get(ANN_API+'?anime='+parseInt(animeId,10),{
			headers: {'X-Mashape-Authorization': MASHAPE_KEY}
		});
		if (response.content) {
			var data = XML2JS.parse(response.content);
			data = data.ann.anime[0];
			var doc = {};

			// normalize the general anime data
			var general = data['$'];
			doc.annId = parseInt(general.id,10);
			doc.title = general.name;
			doc.type  = general.type.toLowerCase();

			// normalize the anime info data
			var info = data['info'];
			var foundVintage = false;
			doc.genres = [];
			doc.themes = [];

			if (info) {
				for (var i=0; i<info.length; i++) {
					var type = info[i]['$'].type;
					var value = info[i]['_'];
					switch (type) {
						case 'Picture': doc.annPicture = info[i]['$'].src; break;
						case 'Genres': 
							var genre = value.toLowerCase();
							if (Genres.find({label:genre}).count()>0) {
								Genres.insert({label:genre});
							}
							doc.genres.push(genre);
							break;
						case 'Themes': doc.themes.push(value.toLowerCase()); break;
						case 'Objectionable content': doc.mature = value.toLowerCase(); break;
						case 'Plot Summary': doc.plot = value; break;
						case 'Running time': doc.runningTime = value; break;
						case 'Opening Theme': insertSong('op',animeId,value); break;
						case 'Ending Theme': insertSong('ed',animeId,value); break;
						case 'Insert Theme': insertSong('in',animeId,value); break;
						case 'Number of episodes': doc.numEpisodes = isNaN(parseInt(value)) 
							? Episodes.find({animeId:animeId}).count()
							: parseInt(value);
							break;
						case 'Vintage':
							// TODO: still need to format (start/end)
							if (!foundVintage) {
								var matches = value.match(/[0-9]{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])/g);
								if (!matches) { matches = value.match(/[0-9]{4}\-(0[1-9]|1[012])/g); }
								if (!matches) { matches = value.match(/[0-9]{4}/g); }
								if (!matches) break;
								switch (matches.length) {
									case 1: 
										doc.startDate = new Date(matches[0]).valueOf(); break;
									case 2: 
										doc.startDate = new Date(matches[0]).valueOf(); 
										doc.endDate = new Date(matches[1]).valueOf(); 
										break;
									default: break;
								}
								foundVintage = true;
							}
							break;
						default:
							break;
					}
				}
			}
			// normalize the anime episode data and add it to the Episodes collection
			var episodes = data['episode'];
			var epCount = 0;

			if (episodes) {
				for (var i=0; i<episodes.length; i++) {
					var num = parseInt(episodes[i]['$'].num,10);
					var title = episodes[i].title[0]['_'];
					
					// skip unnumbered episodes
					if (isNaN(num)) continue;
					epCount++;

					// add this to the episode collection if it doesn't already exist
					var epDoc = Episodes.findOne({annId:animeId,num:num});
					if (!epDoc) {
						Episodes.insert({
							annId: animeId,
							num: num,
							title: title
						});
					}
				}
				if (!doc.numEpisodes) {
					doc.numEpisodes = epCount;
				}
			}
			doc.lastUpdate = new Date().valueOf();

			// we will try to return an existing document in the collection
			var animeDoc = Animes.findOne({annId:animeId});

			// if there is a pre-existing document
			if (animeDoc) {
				Animes.update({annId:animeId},{$set:doc});
			} else {
				Animes.insert(doc);
			}

			// report the anime data
			return doc;
		}
		return null;
	},
	/**
	 * Searches the Hummingbird API, hopeful for an immediate match from the ANN anime title to the
	 * Hummingbird anime title. If it fails, then we will perform a search query against the Hummingbird
	 * records, in the hope of retrieving the Hummingbird entry.
	 *
	 * @method fetchHummingbirdInfo
	 * @param animeTitle {String} The title of the anime.
	 * @return {Object|null} A well-formed package of the Hummingbird instance of the anime data, otherwise null.
	 */
	fetchHummingbirdInfo: function(animeTitle) {
		var result = null;
		try {
			response = HTTP.get(HUMMINGBIRD_API+animeTitle,{
				headers: {'X-Mashape-Authorization': MASHAPE_KEY}
			});
			if (response && response.data) {
				result = {
					animeTitle: response.data.slug,
					pictureUrl: response.data.cover_image,
					numEpisodes: response.data.status == 'Currently Airing' ? null : response.data.episode_count
				};
			}
		} catch(err) {
			// lets try to do a hummingbird search and select the first result, if it exists
			var hbAnimeId = Meteor.call('searchHummingbird',animeTitle);
			if (hbAnimeId) {
				return Meteor.call('fetchHummingbirdInfo',hbAnimeId);
			}
		}
		if (!result) {
			console.log('Error fetching picture for '+animeTitle);
		}
		return result;
	},
	/** 
	 * Searches the Hummingbird API for an anime with the corresponding anime title, and returns the 
	 * Hummingbird anime ID, if a corresponding anime could be found.
	 *
	 * @method searchHummingbird
	 * @param animeTitle {String} The title of the anime.
	 * @return {Number|null} The corresponding anime ID in the hummingbird database, otherwise null.
	 */
	searchHummingbird: function(animeTitle){
		var url = HUMMINGBIRD_SEARCH.replace('{{animeTitle}}',encodeURI(animeTitle)).replace(/ /g,'+');
		var response = HTTP.get(url);

		// see if we have received a healthy response from the Hummingbird service
		if (response.content) {
			var $ = Cheerio.load(response.content);
			if ($('.search-result.cf').length > 0) {
				var match = $('.search-result.cf').first();
				return $('.columns.title a',match).attr('href').replace('/anime/','');
			} else {
				console.log('Error fetching search results for '+animeTitle);
			}
		}
		return null;
	},
	/**
	 * Subscribes a user to the anime.
	 *
	 * @method subscribeToAnime
	 * @param animeId {Number} The ANN anime ID.
	 */
	subscribeToAnime: function(animeId) {
		var userId = Meteor.userId();

		// create a relationship between the user and the anime (described with subscription)
		if (Subscriptions.find({userId:userId,annId:animeId}).count() == 0) {   
			// establish the subscription
			var sub_id = Subscriptions.insert({
				userId: userId,
				annId: animeId,
				progress: 'backlogged', // backlogged,watching,finished,abandoned,onhold
				rating: -1,
				episodes: 0,
				linkGenerationRule: null,
				subscriptionDate: new Date().valueOf()
			});
			return Subscriptions.findOne({_id:sub_id});
		}
		return null;
	},
	/**
	 * Unsubscribes a user from the anime.
	 *
	 * @method subscribeToAnime
	 * @param animeId {Number} The ANN anime ID.
	 */
	unsubscribeFromAnime: function(animeId) {
		var userId = Meteor.userId();

		// create a relationship between the user and the anime (described with subscription)
		if (Subscriptions.find({userId:userId}).count() > 0) {
			Subscriptions.remove({userId:userId,annId:animeId});
		}
	},
	/**
	 * Changes the progress field in the subscription.
	 *
	 * @method changeSubscriptionProgress
	 * @param animeId {Number} The ANN anime ID.
	 * @param progress {String} The new progress field. One of: [backlogged,watching,onhold,finished,abandoned]
	 */
	changeSubscriptionProgress: function(animeId,progress) {
		if (progress != 'backlogged' &&
			progress != 'watching' &&
			progress != 'onhold' &&
			progress != 'finished' &&
			progress != 'abandoned') return;

		var userId = Meteor.userId();

		// update the progress field
		Subscriptions.update({userId:userId,annId:animeId},{$set:{progress:progress}});
		return progress;
	},
	/**
	 * Changes the rating field in the subscription.
	 *
	 * @method changeSubscriptionRating
	 * @param animeId {Number} The ANN anime ID.
	 * @param rating {Number} The new rating value. Expects between [1,5]
	 */
	changeSubscriptionRating: function(animeId,rating) {
		var userId = Meteor.userId(),
			rating = Math.min(rating,5);

		// update the rating field
		Subscriptions.update({userId:userId,annId:animeId},{$set:{rating:rating}});
		return rating;
	},
	/**
	 * Changes the episodes field in the subscription.
	 *
	 * @method changeSubscriptionEpisodes
	 * @param animeId {Number} The ANN anime ID.
	 * @param episodes {Number} The new episodes value.
	 */
	changeSubscriptionEpisodes: function(animeId,episodes) {
		var userId = Meteor.userId();
		// update the episodes field
		Subscriptions.update({userId:userId,annId:animeId},{$set:{episodes:episodes}});
		return episodes;
	},

	/**
	 * Changes the link generation rule field in the subscription.
	 *
	 * @method changeSubscriptionLinkGenerationRule
	 * @param animeId {Number} The ANN anime ID.
	 * @param linkGenerationRule {String} The link generation rule.
	 */
	changeSubscriptionLinkGenerationRule: function(animeId,linkGenerationRule) {
		var userId = Meteor.userId();
		// update the link generation rule field
		Subscriptions.update({userId:userId,annId:animeId},{$set:{linkGenerationRule:linkGenerationRule}});
		return linkGenerationRule;
	},
	/**
	 * @DANGEROUS!!
	 *
	 * Clears all friendships in the system, including pending requests.
	 *
	 * @method clearAllFriendships
	 */
	clearAllFriendships: function() {
		console.log('Delete all friendships!!');
		var friends = Friends.find().fetch();
		for (var i=0; i<friends.length; i++) {
			Friends.remove({_id:friends[i]._id});
		}
	},
	/**
	 * @DANGEROUS!!
	 * 
	 * Clears all friend requests in the system.
	 *
	 * @method clearAllFriendRequests
	 */
	clearAllFriendRequests: function() {
		console.log('Deleting all friend requests!!');
		var friends = Friends.find({status:'pending'}).fetch();
		for (var i=0; i<friends.length; i++) {
			Friends.remove({_id:friends[i]._id});
		}
	},
	/**
	 * Sends a friend request to the appropriate user. Will not allow multiple 
	 * pending requests to be sent between two people.
	 *
	 * @method sendFriendRequest
	 * @param friendId {String} The friend that we want to send the friend request to.
	 */
	sendFriendRequest: function(friendId) {
		var userId = Meteor.userId();
		
		// don't send another friend request if they are already friends or
		// if there is already a pending request between these two people
		if (Friends.find({userId:userId,friendId:friendId,status:'approved'}).count() == 0 ||
			Friends.find({userId:userId,friendId:friendId,status:'pending'}).count() == 0) 
		{
			// establish the friend request
			var request_id = Friends.insert({
				userId: userId,
				friendId: friendId,
				status: 'pending', // pending,approved,declined
				approveDate: null
			});
			// return the friend request that was just sent
			return Friends.findOne({_id:request_id});
		}
		// no friend request sent
		return null;
	},
	/**
	 * Cancels a pending friend request.
	 *
	 * @method cancelFriendRequest
	 * @param friendId {String} The friend request that we want to cancelling.
	 */
	cancelFriendRequest: function(friendId) {
		var userId = Meteor.userId();
		console.log( 'Cancelling friend request', userId, friendId );

		// don't cancel a friend request if there the two parties are
		// already friends or if there was no friend request pending to begin with
		if (Friends.find({userId:userId,friendId:friendId}).count() > 0 &&
			Friends.find({userId:userId,friendId:friendId,status:'pending'}).count() > 0) 
		{
			// remove the friends request entry
			Friends.remove({userId:userId,friendId:friendId});
		}
		return null;
	},
	/**
	 * Approves a pending friend request.
	 *
	 * @method approveFriendRequest
	 * @param friendId {String} The friend request that we want to be approving.
	 */
	approveFriendRequest: function(friendId) {
		var userId = Meteor.userId();
		console.log( 'Approving friend request', userId, friendId );

		// don't approve a friend request if there the two parties are
		// already friends or if there was no friend request pending to begin with
		if (Friends.find({userId:friendId,friendId:userId}).count() > 0 &&
			Friends.find({userId:friendId,friendId:userId,status:'pending'}).count() > 0) 
		{
			// establish the friend request approval
			var approve_id = Friends.update(
				{userId:friendId,friendId:userId},
				{$set: {
					status:'approved',
					approveDate: new Date().valueOf()
				}}
			);
			// return the friend request that was just approved
			return Friends.findOne({_id:approve_id});
		}
		// no friend request approved
		return null;
	},
	/**
	 * Declines a pending friend request.
	 *
	 * @method declineFriendRequest
	 * @param friendId {String} The friend request that we are declining.
	 */
	declineFriendRequest: function(friendId) {
		var userId = Meteor.userId();
		console.log( 'Declining friend request', userId, friendId );

		// don't decline a friend request if there the two parties are
		// already friends or if there was no friend request pending to begin with
		if (Friends.find({userId:friendId,friendId:userId}).count() > 0 &&
			Friends.find({userId:friendId,friendId:userId,status:'pending'}).count() > 0) 
		{
			// remove the friends request entry
			Friends.remove({userId:friendId,friendId:userId});
		}
		return null;
	}
});

// gets the time since the last update for this anime document
function timeSinceLastUpdate(doc) {
	var currentDate = new Date();
	var lastUpdate = doc ? doc.lastUpdate : null;
	return (currentDate-lastUpdate)/3600000; // difference in hours
}

// helper functions for parsing song information
function insertSong(type,animeId,songStr){
	var songinfo = parseSongString(songStr);
	if (!songinfo) return null;
	var songobj = {
		annId: animeId,
		type: type,
		num: songinfo.num,
		song: songinfo.song,
		artist: songinfo.artist,
		episodes: songinfo.episodes
	};
	if (Songs.find({annId: animeId, type: type, num: songobj.num}).count() > 0) {
		Songs.update({annId: animeId, type: type, num: songobj.num}, {$set: songobj});
	} else {
		Songs.insert(songobj);
	}
}
function parseSongString(str) {
	var matches = str.match(/^#([0-9]+):\s(.*)\sby\s(.*)$/i);
	if (matches) {
		var matches2 = matches[3].match(/^(.*)\s\((ep.*)\)$/i);
		if (!matches2) matches2 = matches[3].match(/^(.*)\s\[(ep.*)\]$/i);
		
		// lets parse the episode range string
		var episodes = matches2 ? [] : null;
		if (episodes !== null) {
			var epList = matches2[2];
			episodes = epList.split(',');
			for (var i=0; i<episodes.length; i++) {
				var epRange = episodes[i];
				epRange = epRange.replace(/eps/i,'').replace(/ep/i,'');
				epRange = epRange.split('-');

				// create the episode entry
				episodes[i] = {};
				episodes[i].start = parseInt(epRange[0]);
				if (epRange.length > 1) {
					episodes[i].end = epRange[1] !== '' ? parseInt(epRange[1]) : -1;
				}
			}
		}
		return {
			num: parseInt(matches[1],10),
			song: matches[2].replace(/"/g,''),
			artist: matches2 ? matches2[1] : matches[3],
			episodes: episodes
		};
	} else {
		matches = str.match(/^(.*)\sby\s(.*)$/i);
		return {
			num: 1,
			song: matches[1].replace(/"/g,''),
			artist: matches[2],
			episodes: null
		};
	}
	return null;	
};

String.prototype.slugify = function(){
  var str = this;
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "ãàáäâẽèéëêìíïîōõòóöôūùúüûñç·/_,:;";
  var to   = "aaaaaeeeeeiiiioooooouuuuunc------";
  for (var i=0, l=from.length ; i<l ; i++) {
	str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
	.replace(/\s+/g, '-') // collapse whitespace and replace by -
	.replace(/-+/g, '-'); // collapse dashes

  return str;
};

/**
 * An extensive list of month names.
 */
Date.prototype.monthNames = [
	"January", "February", "March",
	"April", "May", "June",
	"July", "August", "September",
	"October", "November", "December"
];
/**
 * Returns the month name for this date.
 */
Date.prototype.getMonthName = function() {
	return this.monthNames[this.getMonth()];
};
/**
 * Returns an abbreviated month name for this date.
 */
Date.prototype.getShortMonthName = function () {
	return this.getMonthName().substr(0,3);
};
