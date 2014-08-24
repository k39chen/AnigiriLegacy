Template.overviewSubpage.created = function(){
	// hide the loading gif
	InfoBar.hideLoad();

	// destroy any previously created plot plugin
	var plot = $("#overviewSubpage .plot");
	plot.trigger("destroy");
};
Template.overviewSubpage.rendered = function(){
	var subpage = $("#overviewSubpage"),
		poster = $(".poster",subpage),
		plot = $(".plot",subpage);

	// animate into visibility
	subpage.css({opacity:0}).stop().animate({opacity:1},500);

	// truncate the plot paragraph (if available)
	if (!plot.is(":empty")) {
		if ($("a.readmore",plot).size() === 0) {
			plot.append("<a class='readmore'>[Read more]</a>");
		}
		plot.dotdotdot({
			height: 96,
			after: "a.readmore"
		});
		$("a.readmore",plot).click(function(){
			$(this).parent().trigger("destroy");
			$("a.readmore",plot).remove();
		});
	}
};
Template.overviewSubpage.helpers({
	getAnimeData: function(){
		return Session.get("infoBarData");
	},
	isSubscribed: function() {
		return !(!getSubscriptionData(Session.get("infoBarAnnId")));
	},
	plot: function() {
		var data = Session.get("infoBarData");
		if (!data || !data.plot) return null;

		return data.plot;
	},
	poster: function(){
		var data = Session.get("infoBarData");
		if (!data) return null;

		return data.hbiPicture || data.annPicture || null;
	},
	genres: function() {
		var data = Session.get("infoBarData");
		if (!data || !data.genres) return null;

		return capitalizeAll(data.genres).join(", ");
	},
	themes: function() {
		var data = Session.get("infoBarData");
		if (!data || !data.themes) return null;

		return capitalizeAll(data.themes).join(", ");
	},
	startDateLabel: function(){
		var data = Session.get("infoBarData");
		if (!data || !data.type) return null;

		if (hasEpisodes(data.type)) {
			return isFuture(data.startDate) ? "Starts On" : "Started On";
		} else {
			return "Aired On";
		}
	},
	startDate: function() {
		var data = Session.get("infoBarData");
		if (!data || !data.startDate) return null;

		var date = new Date(data.startDate);
		return formatDate(date);
	},
	endDate: function() {
		var data = Session.get("infoBarData");
		if (!data || !data.endDate) return null;

		var date = new Date(data.endDate);
		return formatDate(date);
	},
	runningTime: function(){
		var data = Session.get("infoBarData");
		if (!data || !data.runningTime) return null;

		var num = parseInt(data.runningTime,10);
		return isNaN(num) ? data.runningTime.capitalize() : num + " minutes";
	},
	showStatus: function() {
		var data = Session.get("infoBarData");
		if (!data || !data.type || data.numEpisodes === null) return false;

		return data.numEpisodes && hasEpisodes(data.type);
	},
	status: function() {
		var data = Session.get("infoBarData");
		if (!data) return null;

		if (!data.startDate) {
			return "Not Aired Yet";
		} else if (isFuture(data.startDate)) {
			return "Upcoming Series";
		} else {
			return data.endDate ? "Completed" : "Ongoing";
		}
	},
	showEpisodes: function() {
		var data = Session.get("infoBarData");
		if (!data || !data.type || data.numEpisodes === null) return false;

		return data.numEpisodes && hasEpisodes(data.type);
	},
	numEpisodes: function() {
		var data = Session.get("infoBarData"),
			subscription = getSubscriptionData(Session.get("infoBarAnnId"));

		if (!data || data.numEpisodes === null) return null;

		if (subscription && subscription.episodes !== null) {
			return "<span class='accent'>"+subscription.episodes+"</span>/"+data.numEpisodes;
		} else {
			return data.numEpisodes;
		}
	},
	progress: function() {
		var subscription = getSubscriptionData(Session.get("infoBarAnnId"));
		if (!subscription || !subscription.progress) return;

		return "<span class='progress "+subscription.progress+"'>"+getProgressStr(subscription.progress)+"</span>";
	},
	rating: function() {
		var subscription = getSubscriptionData(Session.get("infoBarAnnId"));
		if (!subscription || !subscription.rating) return;

		var stars = "";
		var star_empty = "<i class='star fa fa-star-o'></i>";
		var star_filled = "<i class='star fa fa-star'></i>";
	
		for (var i=0; i<MAX_RATING; i++) {
			stars += (i < subscription.rating ? star_filled : star_empty);
		}
		return "<div class='stars'>"+stars+"</div>";
	}
});
