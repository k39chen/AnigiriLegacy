Template.sideBar.rendered = function(){
    // ...
};
 Template.sideBar.events({
    'mouseover .option': function(e) {
        var el = $(e.currentTarget);
        el.addClass('hover');
    },
    'mouseout .option': function(e) {
        var el = $(e.currentTarget);
        el.removeClass('hover');
    },
    'click .option': function(e) {
        var el = $(e.currentTarget);

        // select the page
        selectPage(el.attr('data-page'));
    }
});
 