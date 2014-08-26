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
