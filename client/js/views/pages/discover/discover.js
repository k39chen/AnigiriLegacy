Template.discoverPage.rendered = function(){
    hideLoadingScreen();
    $('#discoverPage').css({opacity:0}).stop().animate({opacity:1},500);
};
Template.discoverPage.events({
    // ...
});
