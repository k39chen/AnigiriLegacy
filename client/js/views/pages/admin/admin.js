Template.adminPage.rendered = function(){
	hideLoadingScreen();
	$('#adminPage').css({opacity:0}).stop().animate({opacity:1},500);

	Meteor.call('getAdminData', function(err,data){
		Session.set('adminData',data);
	});
};
Template.adminPage.events({
	'mouseover .button': function(e) {
		var el = $(e.target);
		el.addClass('hover');
	},
	'mouseout .button': function(e) {
		var el = $(e.target);
		el.removeClass('hover');
	},
	'click #fetchAnimesBtn': function(e) {
		var el = $(e.target);
		// fetch all animes
		Meteor.call('fetchAllAnimes');
	},
	'click #deleteAnimesBtn': function(e) {
		var el = $(e.target);
		// delete all animes
		Meteor.call('deleteAllAnimes');
	},
	'click #deleteSongsBtn': function(e) {
		var el = $(e.target);
		// delete all songs
		Meteor.call('deleteAllSongs');
	},
});
Template.adminPage.helpers({
	getTotalAnimes: function(){
		var data = Session.get('adminData');
		return data ? data.totalAnimes : null;
	},
	getTotalANN: function(){
		var data = Session.get('adminData');
		return data 
			? data.totalANN + '/' + data.totalAnimes + ' (' + (data.totalANN / data.totalAnimes * 100).toFixed(2) + '%)'
			: null;
	},
	getTotalHBI: function(){
		var data = Session.get('adminData');
		return data
			? data.totalHBI + '/' + data.totalAnimes + ' (' + (data.totalHBI / data.totalAnimes * 100).toFixed(2) + '%)'
			: null;
	},
	getTotalCovers: function(){
		var data = Session.get('adminData');
		return data 
			? data.totalCovers + '/' + data.totalAnimes + ' (' + (data.totalCovers / data.totalAnimes * 100).toFixed(2) + '%)'
			: null;
	},
	getTotalSongs: function(){
		var data = Session.get('adminData');
		return data ? data.totalSongs : null;
	}
});
