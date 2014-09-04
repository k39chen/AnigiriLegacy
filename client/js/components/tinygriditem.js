Template.tinyGridItem.rendered = function() {
	// ...
};
Template.tinyGridItem.events({
	"mouseover .hoverTarget": function(e){
		var $el = $(e.currentTarget),
			$tgi = $el.parent(".tinyGridItem");
			$mask = $(".mask",$tgi),
			$content = $(".maskcontent",$tgi),
			maskHeight = $mask.height();

		$content.css({bottom:-maskHeight,opacity:0}).stop().animate({bottom:0,opacity:1},500);
		$mask.css({display:"block",opacity:0}).stop().animate({opacity:0.7},500);
	},
	"mouseout .hoverTarget": function(e){
		var $el = $(e.currentTarget),
			$tgi = $el.parent(".tinyGridItem");
			$mask = $(".mask",$tgi),
			$content = $(".maskcontent",$tgi),
			maskHeight = $mask.height();

		$content.css({display:"block",bottom:0,opacity:1}).stop().animate({bottom:-maskHeight,opacity:0},500);
		$mask.css({display:"block",opacity:0.7}).stop().animate({opacity:0},500,function(){
			$(this).css({display:"block"});
		})
	},
	"click .hoverTarget": function(e){
		var $el = $(e.currentTarget),
			$tgi = $el.parent(".tinyGridItem");
		var annId = parseInt($tgi.attr("data-annId"),10);
		
		// get the anime data
		InfoBar.load(annId);
	}
});
Template.tinyGridItem.helpers({
	progress: function(item){
		return item.subscription.progress;
	},
	poster: function(item){
		if (!item) return null;
		return item.hbiPicture || item.annPicture || null;
	},
	title: function(item){
		return item.title;
	},
	showEpisodes: function(item) {
		return item.numEpisodes && hasEpisodes(item.type);
	},
	unsubbedEpisodes: function(item) {
		if (isFuture(item.startDate)) {
			return "Upcoming Series";
		}
		return item.endDate || item.subscription.progress == "finished"
			? item.numEpisodes+" Episodes"
			: "+"+item.numEpisodes+" Episodes (Ongoing)";
	},
	subbedEpisodes: function(item) {
		return isFuture(item.startDate)
			? "Upcoming Series"
			: "<span>"+item.subscription.episodes+"</span> / "+item.numEpisodes+" Episodes";
	},
	rating: function(item){
		var stars = "";
		var star_empty = "<i class='star fa fa-star unfilled'></i>";
		var star_filled = "<i class='star fa fa-star'></i>";
	
		for (var i=0; i<MAX_RATING; i++) {
			stars += (i < item.subscription.rating ? star_filled : star_empty);
		}
		return "<div class='stars'>"+stars+"</div>";
	}
});
