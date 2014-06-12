/*
Template.collectionPage.animes = function(){
    var items = Animes.find({},{limit:5,sort:{id:-1}}).map(function(doc,index,cursor){
        var props = {};
        switch (doc.type) {
            case 'tv'     : props.type = null; break;
            case 'oav'    : props.type = 'OVA'; break;
            case 'ona'    : props.type = 'ONA'; break;
            case 'special': props.type = 'Special'; break;
            case 'movie'  : props.type = 'Movie'; break;
            default       : props.type = doc.type; break;
        }
        if (doc.type == 'tv') {
            if (doc.numEpisodes == 0) {
                props.episodes = doc.numEpisodes + ' Episodes';
            } else {
                props.episodes = 'Ongoing Series';
            }
        } else {
            props.episodes = null;
        }
        return _.extend(doc,props);
    });
    return items;
}
Template.collectionPage.rendered = function(){
    // reinitialize the scrollbar
    $('#pagecontainer').mCustomScrollbar('destroy');
    $('#pagecontainer').mCustomScrollbar();

    // allow the grid items to be hoverable
    $('.gridItem').hoverable();

    // define click event for grid items
    $('.gridItem').click(function(){
        var animeId = $(this).data('id');
        console.log(animeId);
        Meteor.call('getFullAnimeData',animeId,function(err,res){
            if (res) {
                console.log(res);
            }
        });
        $('#modalAnimeInfo').reveal($(this).data());
    });

    // define click event for grid item subscribe flags
    $('.gridItem .subscribed-flag').click(function(e){

        e.preventDefault();
        e.stopPropagation();
        $(this).toggleClass('active');

        //$('#modalAnimeInfo').reveal($(this).data());
    });

}
Template.collectionItem.rendered = function(){
    var data = this.data;
    var obj = $(this.firstNode);
    obj.data('id',data.id);
}
*/