/**
 * Performs generic actions on trying to load a page.
 *
 * @method initPage
 * @param page {String} The page identifier.
 */
window.initPage = function(page) {
	$("#"+page+"Page").css({opacity:0}).stop().animate({opacity:1},500);

	// ensure the page header is correctly sized based on the visibility of the infobar
	if (InfoBar.isVisible) {
		$(".page > h1").addClass("minimized-right");
	}
	// update the sidebar
	$("#sideBar .option").removeClass("selected");
	$("#sideBar .option[data-page='"+page+"']").addClass("selected");
};
