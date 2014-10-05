/**
 * Performs generic actions on trying to load a page.
 *
 * @method initPage
 * @param page {String} The page identifier.
 */
window.initPage = function(page) {
	$("#"+page+"Page").css({opacity:0}).stop().animate({opacity:1},500);

	// ensure the page header is correctly sized based on the visibility of the sidebar and infobar
	var $header = $(".page > h1");

	if (SideBar.isMinimized) {
		$header.addClass("minimized-left");
	} else {
		$header.css({left:$("#sideBar").width()});
	}
	if (InfoBar.isVisible) {
		$header.addClass("minimized-right");
	}
	// update the sidebar
	$("#sideBar .option").removeClass("selected");
	$("#sideBar .loadingSpinner").removeClass("visible");
	switch (page) {
		case "profile":
			$("#sideBar .option[data-page='friends']").addClass("selected");
			break;
		case "search":
			$("#sideBar .search-btn").addClass("selected");
			break;
		default:
			$("#sideBar .option[data-page='"+page+"']").addClass("selected");
			break;
	}
	// profile page is a very special case, we always need to ensure that this special case is handled properly
	if (page != "profile") {
		$("#profilePage").remove();
	}
	// some special handling for search page
	if (page != "search") {
		$(".search-btn").removeClass("selected");
	}
};
