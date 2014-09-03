window.InfoBar = {
	firstLoad: true,
	isShown: false,
	init: function(annId) {
		this.clear();
		Session.set("infoBarAnnId",annId);

		// show the info bar
		this.show();

		// make this call so the user can see a preview of whats being loaded (title/type)
		Meteor.call("getSimpleAnimeData", annId, function(err,data){
			Session.set("infoBarData",data);
		
			// get the rest of the anime data
			Meteor.call("getAnimeData", annId, function(err,animeData){
				Session.set("infoBarData", $.extend(Session.get("infoBarData"), animeData));
				UI.render(Template.infoBar);
			});
		});
	},
	clear: function() {
		Session.set("subpage",null);
		Session.set("infoBarAnnId",null);
		Session.set("infoBarData",null);
	},
	selectSubpage: function(subpage) {
		// don't bother trying to change subpages if the target page is the same as the
		// currently selected one.
		if (Session.get("subpage") == subpage) return;
		Session.set("subpage",subpage);

		// update the selector for the navbar
		$("#navbar .navitem").removeClass("selected");
		$("#navbar .navitem[data-subpage='"+subpage+"']").addClass("selected");

		if (!this.firstLoad) {
			this.showLoad();
		}
		this.firstLoad = true;
	},
	show: function(options) {
		if (this.isShown) {
			this.showLoad();
			return;
		}
		var settings = $.extend({duration:500},options),
			barWidth = $("#infoBar").width(),
			start = {display: "block", right: -barWidth, opacity: 1},
			end = {right: 0},
			dur = settings.duration;

		$("#page-container").css({right:0}).stop().animate({right:barWidth},dur);
		$(".page > h1").css({right:0}).stop().animate({right:barWidth},dur);
		$("#infoBar").css(start).stop().animate(end,dur,function(){
			if (window.collectionGrid) { collectionGrid.resize(); }
			if (window.profileGrid) { profileGrid.resize(); }
			if (window.friendsGrid) { friendsGrid.resize(); }
		});
		$("#infoBar > .body").css(start).stop().animate(end,dur);
		$("#loadingSubpage").css(start).stop().animate(end,dur);

		this.isShown = true;
	},
	hide: function(options) {
		if (!this.isShown) return;

		var settings = $.extend({duration:500},options),
			barWidth = $("#infoBar").width(),
			start = {right: 0},
			end = {right: -barWidth},
			dur = settings.duration;
		$("#page-container").css({right:barWidth}).stop().animate({right:0},dur);
		$(".page > h1").css({right:barWidth}).stop().animate({right:0},dur);
		$("#infoBar").css(start).stop().animate(end,dur,function(){
			if (window.collectionGrid) { collectionGrid.resize(); }
			if (window.profileGrid) { profileGrid.resize(); }
			if (window.friendsGrid) { friendsGrid.resize(); }
		});
		$("#infoBar > .body").css(start).stop().animate(end,dur);
		$("#loadingSubpage").css(start).stop().animate(end,dur);
		
		this.isShown = false;
	},
	showLoad: function(options) {
		var settings = $.extend({duration:400},options),
			start = {display:"block", opacity: 0},
			end	= {opacity: 1},
			dur	= settings.duration;
		$("#loadingSubpage").css(start).stop().animate(end,dur);
	},
	hideLoad: function(options) {
		var settings = $.extend({duration:400},options),
			start = {display:"block", opacity: 1},
			end = {opacity: 0},
			dur = settings.duration;
		$("#loadingSubpage").css(start).stop().animate(end,dur,function(){
			$(this).css({display:"none"});
		});
	}
};
Template.infoBar.created = function(){
	if (!Session.get("infoBarData")) return;

	// select the Overview subpage by default
	InfoBar.selectSubpage("overview");
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
	getTitle: function(){
		return Session.get("infoBarData") ? Session.get("infoBarData").title : null;
	},
	getType: function() {
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
	showSocialSubpage: function(){
		return Session.equals("subpage","social");
	}
});
