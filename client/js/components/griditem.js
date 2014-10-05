Template.gridItem.helpers({
	progress: function(){
		return this.subscription.progress;
	},
	poster: function(){
		if (!this) return null;
		return this.hbiPicture || this.annPicture || null;
	},
	title: function(){
		return this.title;
	},
	showEpisodes: function() {
		return this.numEpisodes && hasEpisodes(this.type);
	},
	unsubbedEpisodes: function() {
		if (isFuture(this.startDate)) {
			return "Upcoming Series";
		}
		return this.endDate || this.subscription.progress == "finished"
			? this.numEpisodes+" Episodes"
			: "+"+this.numEpisodes+" Episodes (Ongoing)";
	},
	subbedEpisodes: function() {
		return isFuture(this.startDate) 
			? "Upcoming Series"
			: "<span>"+this.subscription.episodes+"</span>/"+this.numEpisodes+" Episodes";
	},
	rating: function(){
		var stars = "";
		var star_empty = "<i class='star fa fa-star unfilled'></i>";
		var star_filled = "<i class='star fa fa-star'></i>";
	
		for (var i=0; i<MAX_RATING; i++) {
			stars += (i < this.subscription.rating ? star_filled : star_empty);
		}
		return "<div class='stars'>"+stars+"</div>";
	},
	showRating: function() {
		return this.subscription.progress != "backlogged";
	}
});
