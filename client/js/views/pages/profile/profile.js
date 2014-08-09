Template.profilePage.rendered = function(){
	// fade in the page
	$('#profilePage').css({opacity:0}).stop().animate({opacity:1},500);

	// update the sidebar
	$('#sideBar .option').removeClass("selected");
	$('#sideBar .option[data-page="profile"]').addClass("selected");

	// retrieve all the anime titles
	var results = Meteor.call('getUsers', function(err,data){
		// format the data into autocomplete accepted formats
		var source = $.map(data, function(item){
			var fb = item.services.facebook,
				fullname = fb.first_name + " " + fb.last_name;
			return {
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
};
Template.profilePage.events({
	// ...
});
Template.profilePage.helpers({
	title: function(){
		var self = this;
		if (self && self.services && self.services.facebook) {
			return self.services.facebook.first_name+"'s Profile";
		} else {
			return 'Random';
		}
	},
	firstName: function(){
		var self = this;
		if (self && self.services && self.services.facebook) {
			return self.services.facebook.first_name+"'s Profile";
		} else {
			return 'Random';
		}
	}
});
