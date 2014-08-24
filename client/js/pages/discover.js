Template.discoverPage.rendered = function(){
	// fade in the page
	$("#discoverPage").css({opacity:0}).stop().animate({opacity:1},500);

	// ensure the page header is correctly sized
	$(".page > h1").css({right:$("#page-container").css("right")});

	// update the sidebar
	$("#sideBar .option").removeClass("selected");
	$("#sideBar .option[data-page='discover']").addClass("selected");
};
Template.discoverPage.events({
	// ...
});
