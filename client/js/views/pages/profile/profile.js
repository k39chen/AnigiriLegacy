Template.profilePage.rendered = function(){
	// fade in the page
	$('#profilePage').css({opacity:0}).stop().animate({opacity:1},500);

	// update the sidebar
	$('#sideBar .option').removeClass("selected");
	$('#sideBar .option[data-page="social"]').addClass("selected");

	// retrieve all the users
	var results = Meteor.call('getUsers', function(err,data){
		// format the data into autocomplete accepted formats
		var source = $.map(data, function(item){
			var fb = item.services.facebook,
				fullname = fb.first_name + " " + fb.last_name;
			return {
				_id: item._id,
				label: fullname,
				value: fullname,
				data: fb,
				isFriends: false
			};
		});
		// sort the source by name
		source.sort(function(a,b){
			var nameA = (a.firstName + " " + a.lastName).toLowerCase(),
				nameB = (b.firstName + " " + b.lastName).toLowerCase();
			if (nameA < nameB) return -1;
			else if (nameA > nameB) return 1;
			return 0;
		});
		// we will now initialize it as an autocomplete searchbar
		$('#friendSearchInput').autocomplete({
			minLength: 1,
			source: source,
			open : function(){
				$(".ui-autocomplete:visible").css({
					top: "+=12",
					left: "-=144",
					width: 300
				});
			},
			select: function(event,ui){
				Router.go("/profile/"+ui.item._id);
			}
		});
		if ($('#friendSearchInput').data('ui-autocomplete')) {
			$('#friendSearchInput').data('ui-autocomplete')._renderItem = function(ul,item){
				// don't show the admin user as an option to view
				if (isAdminUser(item._id)) {
					return $("<li>");
				}
				return $('<li>')
					.append('<a>'+
						'<span class="group">'+
							'<img class="portrait" src="'+getUserPortrait(item.data.id)+'" />'+
						'</span>'+
						'<span class="group">'+
							'<div class="name">'+item.data.first_name+' '+item.data.last_name+'</div>'+
							'<div class="email">'+item.data.email+'</div>'+
						'</span>'+
						'<span class="group" style="float:right;">'+
							'<i class="fa fa-check-circle" '+(item.isFriends ? 'style="display:none;"' : '')+'></i>'+
						'</span>'+
					'</a>')
					.appendTo(ul);
			};
		}
	});

	// by default select the `all` progress filter option
	selectProgressFilter('all');
};
Template.profilePage.events({
	'mouseover .back-btn': function(e) {
		var el = $(e.currentTarget);
		el.addClass('hover');
	},
	'mouseout .back-btn': function(e) {
		var el = $(e.currentTarget);
		el.removeClass('hover');
	},
	'click .back-btn': function(e) {
		Router.go('/social');
	},
	'mouseover .addFriend-btn': function(e) {
		var el = $(e.currentTarget);
		el.addClass('hover');
	},
	'mouseout .addFriend-btn': function(e) {
		var el = $(e.currentTarget);
		el.removeClass('hover');
	},
	'click .addFriend-btn': function(e) {
		Meteor.call('sendFriendRequest', this._id, function(err,data){
			console.log(err,data);
		});
	},
	'mouseover .progress-option': function(e) {
		var el = $(e.currentTarget);
		el.addClass('hover');
	},
	'mouseout .progress-option': function(e) {
		var el = $(e.currentTarget);
		el.removeClass('hover');
	},
	'click .progress-option': function(e) {
		var el = $(e.currentTarget);
		selectProgressFilter(el.data('progress'));
	}

});
Template.profilePage.helpers({
	title: function(){
		var self = this,
			fb = getFacebookUserData(self);
		return fb ? fb.name : '';
	},
	portrait: function() {
		var self = this,
			fb = getFacebookUserData(self);

		return fb ? getUserPortrait(fb.id) : '';
	},
	email: function() {
		var self = this,
			fb = getFacebookUserData(self);
		return fb ? fb.email : '';
	},
	numSubscriptions: function() {
		return Subscriptions.find({userId:this._id}).count();
	},
	finished: function() {
		return Subscriptions.find({userId:this._id, progress:'finished'}).count();
	},
	watching: function() {
		return Subscriptions.find({userId:this._id, progress:'watching'}).count();
	},
	backlogged: function() {
		return Subscriptions.find({userId:this._id, progress:'backlogged'}).count();
	},
	onhold: function() {
		return Subscriptions.find({userId:this._id, progress:'onhold'}).count();
	},
	abandoned: function() {
		return Subscriptions.find({userId:this._id, progress:'abandoned'}).count();
	},
	hasSubscriptions: function() {
		return hasSubscriptions(this._id);
	},
	getSubscriptions: function() {
		return getFullSubscriptions(null,this._id);
	},
	isFriend: function(e) {
		return isFriend(this._id);
	},
	isPending: function(e) {
		return isPendingFriendRequest(this._id);
	},
	hasMutualFriends: function(e) {
		return true;
	},
	hasRecommendations: function(e) {
		return true;
	}
});
function selectProgressFilter(progress) {
	var el = $('.progress-option[data-progress="'+progress+'"]');

	$('.progress-option').removeClass('selected').each(function(){
		$('.pointer',this).css({visibility:'hidden'});
	});
	el.addClass('selected');
	$('.pointer',el).css({visibility:'visible'});
}
