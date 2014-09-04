Template.musicSubpage.rendered = function(){
	// initialize the subpage
	initSubpage("music");
};
Template.musicSubpage.events({
	"mouseover .song": addHoverCurrentTarget,
	"mouseout .song": removeHoverCurrentTarget
});
Template.musicSubpage.helpers({
	hasSongs: function(){
		return Songs.find({annId: Session.get("infoBarAnnId")}).fetch().length > 0;
	},
	getSongData: function(){
		return Songs.find({annId: Session.get("infoBarAnnId")}).fetch();
	},
	getOpeningThemes: function() {
		return Songs.find({annId: Session.get("infoBarAnnId"), type: "op"}).fetch();
	},
	getEndingThemes: function(){
		return Songs.find({annId: Session.get("infoBarAnnId"), type: "ed"}).fetch();
	},
	getInsertThemes: function(){
		return Songs.find({annId: Session.get("infoBarAnnId"), type: "in"}).fetch();
	},
	displayEpisodes: function(episodes){
		if (!episodes || !episodes.length || !episodes[0]) return null;

		// we"re only going to display the first episode range
		var epRange = episodes[0];
		var label = "Ep";
		var value = "";

		value = epRange.start;
		if (epRange.end) {
			var maxEpisodes = epRange.end == -1 ? Session.get("infoBarData").numEpisodes : epRange.end;
			label += "s";
			value += ("-" + maxEpisodes);
		}
		return "<div class='label'>"+label+"</div><div class='value'>"+value+"</div>";
	}
});
