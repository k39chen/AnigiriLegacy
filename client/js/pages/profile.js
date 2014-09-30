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
				isFriends: isFriend(item._id)
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

			// render the new one on top of the old one
			$("#profilePage").remove();
			var template = UI.renderWithData(
				Template.profilePage,
				Meteor.users.findOne({_id:ui.item._id})
			);
			UI.insert(template, $("#page-container").get(0));
		},
		renderItem: function(ul,item){
			// don't show the current user as an option to view
			if (getUserId() == item._id) {
				return $("<li>");
			}
			var html = getTemplateHTML("friendMenuItem", {
				portrait: getUserPortrait(item.data.id),
				name: item.data.first_name + " " + item.data.last_name,
				email: item.data.email,
				isFriends: item.isFriends
			});
			return $("<li>").append(html).appendTo(ul);
		}
	});
	
	// initialize the anime grid
	if (self && self.data && self.data._id && $("#profileGrid") && $("#profileGrid").length > 0) {
		window.profileGrid = new CastGrid({
			wrapper: $("#profileGrid").get(0),
			template: self,
			dim: {w:154,h:270,pw:10,ph:10},
			dataSource: function() {
				var data = getFullSubscriptions(null,self.data._id);
				if (!data) return;
				this.update(data);
			},
			render: function(data){
				return getTemplateHTML("gridItem",data);
			}
		});
	}

	// by default select the `all` progress filter option
	selectProgressFilter("all");
};
Template.profilePage.events({
	"mouseover .back-btn": addHoverCurrentTarget,
	"mouseout .back-btn": removeHoverCurrentTarget,
	"click .back-btn": function(e) {
		Router.go("/friends");
	},
	"mouseover .addFriend-btn": addHoverCurrentTarget,
	"mouseout .addFriend-btn": removeHoverCurrentTarget,
	"click .addFriend-btn": function(e) {
		// send the friend request
		Meteor.call("sendFriendRequest", this._id);
	},
	"mouseover .cancel-btn": addHoverCurrentTarget,
	"mouseout .cancel-btn": removeHoverCurrentTarget,
	"click .cancel-btn": function(e) {
		// cancel the friend request
		Meteor.call("cancelFriendRequest", this._id);
	},
	"mouseover .accept-btn": addHoverCurrentTarget,
	"mouseout .accept-btn": removeHoverCurrentTarget,
	"click .accept-btn": function(e) {
		var $el = $(e.currentTarget),
			friendId = $el.data("friend-id");
		Meteor.call("approveFriendRequest",friendId);
	},
	"mouseover .decline-btn": addHoverCurrentTarget,
	"mouseout .decline-btn": removeHoverCurrentTarget,
	"click .decline-btn": function(e) {
		var $el = $(e.currentTarget),
			friendId = $el.data("friend-id");
		Meteor.call("declineFriendRequest",friendId);
	},
	"mouseover .progress-option": addHoverCurrentTarget,
	"mouseout .progress-option": removeHoverCurrentTarget,
	"click .progress-option": function(e) {
		var $el = $(e.currentTarget);
		selectProgressFilter($el.data("progress"));
	},
	"mouseover .gridItem": addHoverCurrentTarget,
	"mouseout .gridItem": removeHoverCurrentTarget,
	"click .gridItem": function(e){
		var $el = $(e.currentTarget);
		var annId = parseInt($el.attr("data-annId"),10);
		InfoBar.load(annId);
	}
});
Template.profilePage.helpers({
	name: function(){
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
	var $el = $(".progress-option[data-progress='"+progress+"']");

	$(".progress-option").removeClass("selected").each(function(){
		$(".pointer",this).css({visibility:"hidden"});
	});
	$el.addClass("selected");
	$(".pointer",$el).css({visibility:"visible"});
}
