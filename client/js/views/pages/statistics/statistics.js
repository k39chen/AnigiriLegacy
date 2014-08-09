Template.statisticsPage.rendered = function(){
    hideLoadingScreen();
    $('#statisticsPage').css({opacity:0}).stop().animate({opacity:1},500);
};
Template.statisticsPage.events({
    'mouseover .redirect-btn': function(e) {
        var el = $(e.target);
        el.addClass('hover');
    },
    'mouseout .redirect-btn': function(e) {
        var el = $(e.target);
        el.removeClass('hover');
    },
    'click .redirect-btn': function(e){
        var el = $(e.target);
        selectPage('discover');
    },
});
Template.statisticsPage.helpers({
    hasSubscriptions: function(){
        return hasSubscriptions();
    }
});
