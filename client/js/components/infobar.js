/**
 * We are maintaining three Session variables of interest here:
 *
 * @param subpage {String} The currently selected subpage in view.
 * @param infoBarAnnId {Number} The currently viewing anime ID.
 * @param infoBarData {Object} The corresponding anime data.
 */
window.InfoBar = {
	$el: null,
	$navbar: null,
	$loading: null,
	$pageContainer: null,
	isVisible: false,
	animDuration: 500,
	subpage: null,
	init: function() {
		var self = this;
		self.$el = $("#infoBar");
		self.$navbar = $("#navbar");
		self.$loading = $("#loadingSubpage");
		self.$pageContainer = $("#page-container");

		// clear any pre-exisitng anime data that was previously here
		self.clear();

		// hide the infobar on page load
		self.hide();
	},
	load: function(annId, options) {
		var self = this, o = $.extend({
			subpage: "overview"
		},options);

		// don't re-load the anime data if its the same anime
		if (Session.get("infoBarAnnId") == annId) return;

		// clear the previous data
		self.clear();

		Session.set("infoBarAnnId",annId);

		// show the infobar
		self.show();

		// load all the anime data
		self.showLoading();

		// check to see if we can save ourselves a trip to the server
		var animeData = Animes.findOne({annId:annId});
		if (animeData) {
			Session.set("infoBarData",animeData);
			self.hideLoading();
			initSubpage(o.subpage);
		} else {
			// make this call so the user can see a preview of whats being loaded (title/type)
			Meteor.call("getSimpleAnimeData", annId, function(err,data){
				Session.set("infoBarData",data);
			
				// get the rest of the anime data
				Meteor.call("getAnimeData", annId, function(err,animeData){
					Session.set("infoBarData", $.extend(Session.get("infoBarData"), animeData));
					self.hideLoading();
				});
			});
		}
		// load the song list for this anime as well
		Meteor.subscribe("animeSongList",annId);

		// select the subpage
		self.selectSubpage(o.subpage);
	},
	selectSubpage: function(subpage) {
		var self = this;
		// don't re-select the subpage if its the same page
		if (subpage === self.subpage) return;
		self.subpage = subpage;
		Session.set("subpage",subpage);
	},
	show: function(options) {
		var self = this;
		self.$el.addClass("visible");
		self.$pageContainer.addClass("minimized-right");
		$("h1",self.$pageContainer).addClass("minimized-right");

		self.isVisible = true;

		setTimeout(function(){
			resizeGrids();
		},self.animDuration);
	},
	hide: function(options) {
		var self = this;
		self.$el.removeClass("visible");
		self.$pageContainer.removeClass("minimized-right");
		$("h1",self.$pageContainer).removeClass("minimized-right");

		self.isVisible = false;

		setTimeout(function(){
			self.clear();
			resizeGrids();
		},self.animDuration);
	},
	clear: function() {
		var self = this;
		Session.set("subpage",null);
		Session.set("infoBarAnnId",null);
		Session.set("infoBarData",null);
		self.subpage = null;
	},
	showLoading: function() {
		var self = this;
		self.$loading.css({display:"block"}).addClass("visible");
	},
	hideLoading: function() {
		var self = this;
		self.$loading.removeClass("visible");
		setTimeout(function(){
			self.$loading.css({display:"none"});
		},self.animDuration);
	}
};
Template.infoBar.rendered = function(){
	InfoBar.init();
};
Template.infoBar.events({
	"mouseover .close-btn": addHoverCurrentTarget,
	"mouseout .close-btn": removeHoverCurrentTarget,
	"click .close-btn": function(e) {
		$("#searchInput").val("");
		InfoBar.hide();
	},
	"mouseover .navitem": addHoverCurrentTarget,
	"mouseout .navitem": removeHoverCurrentTarget,
	"click .navitem": function(e) {
		var $el = $(e.currentTarget);
		// show the subpage
		InfoBar.selectSubpage($el.attr("data-subpage"));
	}
});
Template.infoBar.helpers({
	title: function(){
		return Session.get("infoBarData") ? Session.get("infoBarData").title : null;
	},
	type: function() {
		return Session.get("infoBarData") ? getTypeStr(Session.get("infoBarData").type) : null;
	},
	// some methods to determine which subpage to display
	showOverviewSubpage: function(){
		return Session.equals("subpage","overview");
	},
	showActivitySubpage: function(){
		return Session.equals("subpage","activity");
	},
	showMusicSubpage: function(){
		return Session.equals("subpage","music");
	},
	showFriendsSubpage: function(){
		return Session.equals("subpage","friends");
	}
});
