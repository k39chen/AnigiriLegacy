Template.searchBar.rendered = function(){
    // retrieve all the anime titles
    var results = Meteor.call('getAnimes', function(err,data){
        // format the data into autocomplete accepted formats
        var source = $.map(data,function(item){
            return {
                label: item.title,
                value: item.title,
                type: item.type,
                data: item
            }
        });
        // sort the source by category (and subsort alphabetically)
        source.sort(function(a,b){
            if (a.type == b.type) { return b.label-a.label; } 
            else if (a.type == 'tv') { return 0; }
            else if (a.type == 'oav') { return 1; }
            else { return 2; }
        });
        // we will now initialize it as an autocomplete searchbar
        $('#searchInput').autocomplete({
            minLength: 3,
            source: source,
            open : function(){
                $(".ui-autocomplete:visible").css({
                    top: "-=25",
                    left: "+=186",
                    width: 300
                });
            },
            select: function(event,ui){
                InfoBar.init(ui.item.data.annId);
            }
        });
        $('#searchInput').data('ui-autocomplete')._renderItem = function(ul,item){
            return $('<li>')
                .append('<a>'+
                    '<div class="label">'+item.label+'</div>'+
                    '<div class="type">'+getTypeStr(item.type)+'</div>'+
                '</a>')
                .appendTo(ul);
        };
    });
}
Template.searchBar.events({
    'click #searchBar': function(e) {
        $('#searchInput').val('');
    }
});