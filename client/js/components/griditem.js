Template.gridItem.rendered = function() {
	// ...
};
Template.gridItem.events({
	'mouseover .gridItem': function(e){
		var el = $(e.currentTarget);
		el.addClass('hover');
	},
	'mouseout .gridItem': function(e){
		var el = $(e.currentTarget);
		el.removeClass('hover');
	},
	'click .gridItem': function(e){
		var el = $(e.currentTarget);
		var annId = parseInt(el.attr('data-annId'),10);
		
		// get the anime data
		InfoBar.init(annId);
	}
});
Template.gridItem.helpers({
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
			return 'Upcoming Series';
		}
		return item.endDate || item.subscription.progress == 'finished'
			? item.numEpisodes+' Episodes'
			: '+'+item.numEpisodes+' Episodes (Ongoing)';
	},
	subbedEpisodes: function(item) {
		return isFuture(item.startDate) 
			? 'Upcoming Series'
			: '<span>'+item.subscription.episodes+'</span> / '+item.numEpisodes+' Episodes';
	},
	rating: function(item){
		var stars = '';
		var star_empty = '<i class="star fa fa-star unfilled"></i>';
		var star_filled = '<i class="star fa fa-star"></i>';
	
		for (var i=0; i<MAX_RATING; i++) {
			stars += (i < item.subscription.rating ? star_filled : star_empty);
		}
		return '<div class="stars">'+stars+'</div>';
	}
});
