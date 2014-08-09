Template.splashScreen.rendered = function() {
    // fade in this screen
    $('#splashScreen').css({opacity:0}).stop().animate({opacity:1},500);
};
Template.splashScreen.events({
    'mouseover #signin': function(e) {
        var el = $(e.currentTarget);
        el.addClass('hover');
    },
    'mouseout #signin': function(e){
        var el = $(e.currentTarget);
        el.removeClass('hover');
    },
    'click #signin': function(e){
        $('.login-button').trigger('click');
    }
});
