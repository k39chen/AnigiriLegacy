Template.socialPage.rendered = function(){
	// initialize the page
	initPage("social");

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
};
Template.socialPage.events({
	// ...
});
Template.socialPage.helpers({
	hasFriends: function(){
		return hasFriends();
	},
	getFriends: function() {
		return getFriends();
	}
});
