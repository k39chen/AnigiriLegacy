Template.profilePage.rendered = function(){
	// initialize the page
	initPage("profile");
	
	var self = this,
		$searchbox = $(self.find("#friendSearchBox"));

	// initialize the searchbox
	$searchbox.searchbox({
		method: "getUsers",
		minLength: 1,
		placeholderText: "Search for a user...",
		top: "+=12",
		left: "-=144",
		width: 300,
		map: function(item){
			var fb = item.services.facebook,
				fullname = fb.first_name + " " + fb.last_name;
			return {
				_id: item._id,
				label: fullname,
				value: fullname,
				data: fb,
				isFriends: false
			};
		},
		sort: function(a,b){
			// sort the source by name
			var nameA = (a.firstName + " " + a.lastName).toLowerCase(),
				nameB = (b.firstName + " " + b.lastName).toLowerCase();
			if (nameA < nameB) return -1;
			else if (nameA > nameB) return 1;
			return 0;
		},
		select: function(event,ui){
			Router.go("/profile/"+ui.item._id);
		},
		renderItem: function(ul,item){
			// don't show the admin user as an option to view
			if (getUserId() == item._id) {
				return $("<li>");
			}
			return $("<li>").append("<a>"+
				"<span class='group'>"+
					"<img class='portrait' src='"+getUserPortrait(item.data.id)+"' />"+
				"</span>"+
				"<span class='group'>"+
					"<div class='name'>"+item.data.first_name+" "+item.data.last_name+"</div>"+
					"<div class='email'>"+item.data.email+"</div>"+
				"</span>"+
				"<span class='group' style='float:right;'>"+
					"<i class='fa fa-check-circle' "+(item.isFriends ? "style='display:none;'" : "")+"></i>"+
				"</span>"+
			"</a>").appendTo(ul);
		}
	});

	// by default select the `all` progress filter option
	selectProgressFilter("all");
};
Template.profilePage.events({
	"mouseover .back-btn": function(e) {
		var el = $(e.currentTarget);
		el.addClass("hover");
	},
	"mouseout .back-btn": function(e) {
		var el = $(e.currentTarget);
		el.removeClass("hover");
	},
	"click .back-btn": function(e) {
		Router.go("/social");
	},
	"mouseover .addFriend-btn": function(e) {
		var el = $(e.currentTarget);
		el.addClass("hover");
	},
	"mouseout .addFriend-btn": function(e) {
		var el = $(e.currentTarget);
		el.removeClass("hover");
	},
	"click .addFriend-btn": function(e) {
		// send the friend request
		Meteor.call("sendFriendRequest", this._id);
	},
	"mouseover .cancel-btn": function(e) {
		var el = $(e.currentTarget);
		el.addClass("hover");
	},
	"mouseout .cancel-btn": function(e) {
		var el = $(e.currentTarget);
		el.removeClass("hover");
	},
	"click .cancel-btn": function(e) {
		// cancel the friend request
		Meteor.call("cancelFriendRequest", this._id);
	},
	"mouseover .accept-btn": function(e) {
		var el = $(e.currentTarget);
		el.addClass("hover");
	},
	"mouseout .accept-btn": function(e) {
		var el = $(e.currentTarget);
		el.removeClass("hover");
	},
	"click .accept-btn": function(e) {
		var el = $(e.currentTarget),
			friendId = el.data("friend-id");
		Meteor.call("approveFriendRequest",friendId);
	},
	"mouseover .decline-btn": function(e) {
		var el = $(e.currentTarget);
		el.addClass("hover");
	},
	"mouseout .decline-btn": function(e) {
		var el = $(e.currentTarget);
		el.removeClass("hover");
	},
	"click .decline-btn": function(e) {
		var el = $(e.currentTarget),
			friendId = el.data("friend-id");
		Meteor.call("declineFriendRequest",friendId);
	},
	"mouseover .progress-option": function(e) {
		var el = $(e.currentTarget);
		el.addClass("hover");
	},
	"mouseout .progress-option": function(e) {
		var el = $(e.currentTarget);
		el.removeClass("hover");
	},
	"click .progress-option": function(e) {
		var el = $(e.currentTarget);
		selectProgressFilter(el.data("progress"));
	}
});
Template.profilePage.helpers({
	title: function(){
		var self = this,
			fb = getFacebookUserData(self);
		return fb ? fb.name : "";
	},
	portrait: function() {
		var self = this,
			fb = getFacebookUserData(self);

		return fb ? getUserPortrait(fb.id) : "";
	},
	email: function() {
		var self = this,
			fb = getFacebookUserData(self);
		return fb ? fb.email : "";
	},
	friendId: function() {
		return this._id;
	},
	numSubscriptions: function() {
		return Subscriptions.find({userId:this._id}).count();
	},
	finished: function() {
		return Subscriptions.find({userId:this._id, progress:"finished"}).count();
	},
	watching: function() {
		return Subscriptions.find({userId:this._id, progress:"watching"}).count();
	},
	backlogged: function() {
		return Subscriptions.find({userId:this._id, progress:"backlogged"}).count();
	},
	onhold: function() {
		return Subscriptions.find({userId:this._id, progress:"onhold"}).count();
	},
	abandoned: function() {
		return Subscriptions.find({userId:this._id, progress:"abandoned"}).count();
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
	isApproving: function(e) {
		return isApprovingFriendRequest(this._id);
	},
	hasMutualFriends: function(e) {
		return true;
	},
	hasRecommendations: function(e) {
		return true;
	}
});
function selectProgressFilter(progress) {
	var el = $(".progress-option[data-progress='"+progress+"']");

	$(".progress-option").removeClass("selected").each(function(){
		$(".pointer",this).css({visibility:"hidden"});
	});
	el.addClass("selected");
	$(".pointer",el).css({visibility:"visible"});
}
