Template.adminPage.rendered = function(){
	// initialize the page
	initPage("admin");

	Meteor.call("getAdminData", function(err,data){
		Session.set("adminData",data);
	});
};
Template.adminPage.events({
	"mouseover .anigiri-btn": addHoverTarget,
	"mouseout .anigiri-btn": removeHoverTarget,
	"click #fetchAnimesBtn": function(e) {
		// fetch all animes
		Meteor.call("fetchAllAnimes");
	},
	"click #deleteAnimesBtn": function(e) {
		// delete all animes
		Meteor.call("deleteAllAnimes");
	},
	"click #deleteSongsBtn": function(e) {
		// delete all songs
		Meteor.call("deleteAllSongs");
	},
	"click #clearFriendRequestsBtn": function(e) {
		// clear all friend requests
		Meteor.call("clearAllFriendRequests");
	},
	"click #clearAllFriendshipsBtn": function(e) {
		// clear all friendships
		Meteor.call("clearAllFriendships");
	}
});
Template.adminPage.helpers({
	getTotalAnimes: function(){
		var data = Session.get("adminData");
		return data ? data.totalAnimes : null;
	},
	getTotalANN: function(){
		var data = Session.get("adminData");
		return data 
			? data.totalANN + "/" + data.totalAnimes + " (" + (data.totalANN / data.totalAnimes * 100).toFixed(2) + "%)"
			: null;
	},
	getTotalHBI: function(){
		var data = Session.get("adminData");
		return data
			? data.totalHBI + "/" + data.totalAnimes + " (" + (data.totalHBI / data.totalAnimes * 100).toFixed(2) + "%)"
			: null;
	},
	getTotalCovers: function(){
		var data = Session.get("adminData");
		return data 
			? data.totalCovers + "/" + data.totalAnimes + " (" + (data.totalCovers / data.totalAnimes * 100).toFixed(2) + "%)"
			: null;
	},
	getTotalSongs: function(){
		var data = Session.get("adminData");
		return data ? data.totalSongs : null;
	}
});
