/**
 * Performs generic actions on trying to load a subpage.
 *
 * @method initSubpage
 * @param subpage {String} The subpage identifier.
 */
window.initSubpage = function(subpage) {
	$("#"+subpage+"Subpage").css({opacity:0}).stop().animate({opacity:1},500);

	// update the selector for the navbar
	$(".navitem",self.$navbar).removeClass("selected");
	$(".navitem[data-subpage='"+subpage+"']",self.$navbar).addClass("selected");
};
