Template.discoverPage.rendered = function(){
	// fade in the page
	$("#discoverPage").css({opacity:0}).stop().animate({opacity:1},500);

	// update the sidebar
	$("#sideBar .option").removeClass("selected");
	$("#sideBar .option[data-page='discover']").addClass("selected");
};
Template.discoverPage.events({
	// ...
});
