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
	if (page == "profile") {
		$("#sideBar .option[data-page='friends']").addClass("selected");
	} else {
		$("#sideBar .option[data-page='"+page+"']").addClass("selected");
	}
	// profile page is a very special case, we always need to ensure that this special case is handled properly
	if (page != "profile") {
		$("#profilePage").remove();
	}
};
