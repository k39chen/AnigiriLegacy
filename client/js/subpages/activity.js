var SubscriptionForm = {
	setProgress: function(progress){
		// update the progress on the server
		var data = Session.get("infoBarData"),
			annId = Session.get("infoBarAnnId");
		if (!annId) return;

		Meteor.call("changeSubscriptionProgress",data.annId,progress);
		switch (progress) {
			case "finished":
				Meteor.call("changeSubscriptionEpisodes",data.annId,data.numEpisodes);
				break;
			case "backlogged":
				SubscriptionForm.setEpisodes(0);
				SubscriptionForm.setRating(-1);
				break;
			default:
				break;
		}
	},
	setRating: function(rating) {
		// update the rating on the server
		var annId = Session.get("infoBarAnnId");
		if (!annId) return;

		Meteor.call("changeSubscriptionRating",annId,rating);
	},
	setEpisodes: function(episodes) {
		var data = Session.get("infoBarData"),
			annId = Session.get("infoBarAnnId");
		if (!annId) return;
		
		var prevEpisodes = getSubscriptionData(annId).episodes,
			newEpisodes = Math.min(episodes,data.numEpisodes);

		if (prevEpisodes == newEpisodes) return;

		Meteor.call("changeSubscriptionEpisodes",annId,newEpisodes);
	},
	incrementEpisodes: function(){
		var data = Session.get("infoBarData"),
			$elem = $("#activitySubpage .currEpisode");
		if (!data || data.numEpisodes === null || !$elem) return;

		var newCount = Math.min(parseInt($elem.text(),10)+1,data.numEpisodes);
		$elem.text(newCount);
	},
	decrementEpisodes: function(){
		var $elem = $("#activitySubpage .currEpisode");
		if (!$elem) return;

		var newCount = Math.max(parseInt($elem.text(),10)-1,0);
		$elem.text(newCount);
	},
	setLinkGenerationRule: function(linkGenerationRule) {
		// update the link generation rule on the server
		var annId = Session.get("infoBarAnnId");
		if (!annId) return;

		Meteor.call("changeSubscriptionLinkGenerationRule",annId,linkGenerationRule);
	},
	// click hold handlers and states
	isClickHolding: false,
	clickHoldDelay: 400,
	clickHoldHandler: function(cb){
		setTimeout(function(){
			// do not perform any actions if a release event has been detected
			if (!SubscriptionForm.isClickHolding) return;

			// change the duration of the delay
			SubscriptionForm.clickHoldDelay = Math.max(SubscriptionForm.clickHoldDelay * 0.75, 1);
			SubscriptionForm.clickHoldHandler(cb);
			
			// perform the requested action
			if (cb) cb();
		}, SubscriptionForm.clickHoldDelay);
	}
};
Template.activitySubpage.rendered = function(){
	// initialize the subpage
	initSubpage("activity");
};
Template.activitySubpage.events({
	"mouseover .subscribe-btn": addHoverTarget,
	"mouseout .subscribe-btn": removeHoverTarget,
	"click .subscribe-btn": function(e){
		var annId = Session.get("infoBarAnnId");
		if (!annId) return;

		// subscribe to this anime
		Meteor.call("subscribeToAnime",annId,function(err,data){
			$("#activitySubpage").css({opacity:0}).stop().animate({opacity:1},500);
		});
	},
	"mouseover .progress": addHoverTarget,
	"mouseout .progress": removeHoverTarget,
	"click .progress": function(e){
		var $el = $(e.target);
		SubscriptionForm.setProgress($el.attr("data-progress"));
	},
	"mouseover .epCountControl": addHoverTarget,
	"mouseout .epCountControl": removeHoverTarget,
	"mouseup .epCountControl": function(e){
		SubscriptionForm.isClickHolding = false;
		SubscriptionForm.clickHoldDelay = 400;

		var $elem = $("#activitySubpage .currEpisode");
		if (!$elem) return;
		
		SubscriptionForm.setEpisodes(parseInt($elem.text(),10));
	},
	"mousedown .epCountUp": function(e){
		SubscriptionForm.incrementEpisodes();

		// start a click/hold handler
		SubscriptionForm.isClickHolding = true;
		SubscriptionForm.clickHoldHandler(SubscriptionForm.incrementEpisodes);
	},
	"mousedown .epCountDown": function(e){
		SubscriptionForm.decrementEpisodes();

		// start a click/hold handler
		SubscriptionForm.isClickHolding = true;
		SubscriptionForm.clickHoldHandler(SubscriptionForm.decrementEpisodes);
	},
	"mouseover .stars": function(e) {
		var $stars = $(e.currentTarget),
			$star = $(e.target),
			num = $star.attr("data-star-num"),
			annId = Session.get("infoBarAnnId"),
			subscription = getSubscriptionData(annId);

		if (!subscription || subscription.progress == "backlogged") return;

		if (num) {
			$stars.addClass("hover");

			// perform a star preview
			$(".star",$stars).removeClass("fa-star").addClass("fa-star-o");
			for (var i=1; i<=num; i++) {
				$(".star[data-star-num='"+i+"']",$stars)
					.removeClass("fa-star-o")
					.addClass("fa-star");
			}
		}
	},
	"mouseleave .stars": function(e) {
		var $stars = $(e.currentTarget),
			$star = $(e.target),
			annId = Session.get("infoBarAnnId"),
			subscription = getSubscriptionData(annId);

		if (!subscription || subscription.progress == "backlogged") return;

		// reset to the default star value
		for (var i=1; i<=MAX_RATING; i++) {
			var $star = $(".star[data-star-num='"+i+"']",$stars);
			
			$star.removeClass("fa-star").removeClass("fa-star-o");
			(i <= subscription.rating)
				? $star.addClass("fa-star")
				: $star.addClass("fa-star-o");
		}
	},
	"click .star": function(e){
		var $el = $(e.target),
			num = $el.attr("data-star-num"),
			annId = Session.get("infoBarAnnId"),
			subscription = getSubscriptionData(annId);

		if (!subscription || subscription.progress == "backlogged") return;

		SubscriptionForm.setRating(num);
	},
	"mouseover .unsubscribe-btn": addHoverTarget,
	"mouseout .unsubscribe-btn": removeHoverTarget,
	"click .unsubscribe-btn": function(e){
		var annId = Session.get("infoBarAnnId");
		if (!annId) return;

		// unsubscribe from this anime
		Meteor.call("unsubscribeFromAnime",annId,function(err,data){
			SubscriptionForm.setRating(-1);
			$("#activitySubpage").css({opacity:0}).stop().animate({opacity:1},500);
		});
	},
	"change .linkGenerationRule": function(e){
		var $el = $(e.target),
			lgr = $el.val(),
			annId = Session.get("infoBarAnnId");
		
		if (!annId) return;

		SubscriptionForm.setLinkGenerationRule(lgr);
	}
});
Template.activitySubpage.helpers({
	getSubscription: function(){
		return getSubscriptionData(Session.get("infoBarAnnId"));
	},
	isSubscribed: function() {
		return !(!getSubscriptionData(Session.get("infoBarAnnId")));
	},
	progress: function(){
		var subscription = getSubscriptionData(Session.get("infoBarAnnId"));
		if (!subscription) return null;

		var progressOptions = ["finished","watching","backlogged","X","onhold","abandoned"],
			progressStrings = ["Finished","Watching","Backlogged","X","On Hold","Abandoned"],
			result = "";

		for (var i=0; i<progressOptions.length; i++) {
			if (progressOptions[i] == "X") { result += "<br/>"; continue; }
			result += ((subscription && subscription.progress && progressOptions[i] == subscription.progress) 
				? ("<span class='progress selected' data-progress='"+progressOptions[i]+"'>"+progressStrings[i]+"</span>")
				: ("<span class='progress' data-progress='"+progressOptions[i]+"'>"+progressStrings[i]+"</span>")
			)
		}
		return result;
	},
	showEpisodes: function() {
		var data = Session.get("infoBarData");
		if (!data || !data.type) return false;

		return data.numEpisodes && hasEpisodes(data.type);
	},
	showEpisodeControls: function(){
		var subscription = getSubscriptionData(Session.get("infoBarAnnId"));
		if (!subscription) return null;

		return subscription.progress != "finished" && subscription.progress != "backlogged";
	},
	episodes: function(){
		var data = Session.get("infoBarData"),
			subscription = getSubscriptionData(Session.get("infoBarAnnId"));
		
		if (!data || data.numEpisodes === null || !subscription) return null;

		return "<span class='currEpisode'>"+subscription.episodes+"</span><span class='maxEpisodes'> / "+data.numEpisodes+"</span>";
	},
	rating: function(){
		var subscription = getSubscriptionData(Session.get("infoBarAnnId"));
		if (!subscription) return null;

		var stars = "";
		var star_empty = "<i class='star fa fa-star-o' data-star-num='{data-star-num}'></i>";
		var star_filled = "<i class='star fa fa-star' data-star-num='{data-star-num}'></i>";
	
		for (var i=0; i<MAX_RATING; i++) {
			var star = "";
			star = (i < subscription.rating) ? star_filled : star_empty;
			star = star.replace("{data-star-num}",i+1);
			stars += star;
		}
		return "<div class='stars'>"+stars+"</div>";
	},
	lgr: function() {
		var subscription = getSubscriptionData(Session.get("infoBarAnnId"));
		if (!subscription || !subscription.linkGenerationRule) return null;

		return subscription.linkGenerationRule || "";
	}
});
