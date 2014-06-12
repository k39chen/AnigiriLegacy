var MAX_RATING = 5;

//====================================================================================
// TEMPLATE: SPLASHSCREEN
//====================================================================================
Template.splashScreen.rendered = function() {
    // fade in this screen
    $('#splashScreen').css({opacity:0}).stop().animate({opacity:1},500);
}
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
//====================================================================================
// TEMPLATE: USERSCREEN
//====================================================================================
Template.userScreen.rendered = function() {
    // fade in this screen
    $('#userScreen').css({opacity:0}).stop().animate({opacity:1},500);

    // by default we will select the dashboard page
    selectPage('dashboard');

    // this is a fix for when the info bar some how has data in it already??
    InfoBar.clear();
}
Template.userScreen.events({
    // ...
});
Template.userScreen.helpers({
    // some methods to determine which page to display
    showDashboardPage: function(){
        return Session.equals('page','dashboard');
    },
    showCollectionPage: function(){
        return Session.equals('page','collection');
    },
    showDiscoverPage: function(){
        return Session.equals('page','discover');
    },
    showSocialPage: function(){
        return Session.equals('page','social');
    },
    showAdminPage: function(){
        return Session.equals('page','admin');
    }
});
//====================================================================================
// TEMPLATE: SIDEBAR
//====================================================================================
Template.sideBar.rendered = function(){
    // ...
}
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
//====================================================================================
// TEMPLATE: SEARCHBAR
//====================================================================================
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
            if (a.type == b.type) {
                // alphabetical
                return b.label-a.label;
            } else if (a.type == 'tv') {
                return 0;
            } else if (a.type == 'oav') {
                return 1;
            } else {
                return 2;
            }
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
                InfoBar.init(ui.item.data);
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
//====================================================================================
// TEMPLATE: ACCOUNT
//====================================================================================
Template.account.rendered = function(){
    // ...
}
Template.account.events({
    'mouseover #signout': function(e) {
        var el = $(e.currentTarget);
        el.addClass('hover');
    },
    'mouseout #signout': function(e){
        var el = $(e.currentTarget);
        el.removeClass('hover');
    },
    'click #signout': function(){
        Meteor.logout();
    }
});
//====================================================================================
// TEMPLATE: DASHBOARDPAGE
//====================================================================================
Template.dashboardPage.rendered = function(){
    $('#dashboardPage').css({opacity:0}).stop().animate({opacity:1},500);
}
Template.dashboardPage.events({
    // ...
});
//====================================================================================
// TEMPLATE: COLLECTIONPAGE
//====================================================================================
Template.collectionPage.rendered = function(){
    $('#collectionPage').css({opacity:0}).stop().animate({opacity:1},500);
}
Template.collectionPage.events({
    'mouseover .gridItem': function(e){
        var el = $(e.currentTarget);
        el.addClass('hover');
    },
    'mouseout .gridItem': function(e){
        var el = $(e.currentTarget);
        el.removeClass('hover');
    },
    'click .gridItem': function(e){
        var el = $(e.currentTarget);
        var annId = parseInt(el.attr('data-annId'),10);
        
        // get the anime data
        Meteor.call('getAnimeData',annId,function(err,data){
            InfoBar.init(data);
        });
    }
});
Template.collectionPage.helpers({
    getSubscriptions: function(){
        var userId = Meteor.userId(),
            subscriptions = Subscriptions.find({userId:userId}).fetch(),
            result = null;

        for (var i=0; i<subscriptions.length; i++) {
            var sub = subscriptions[i],
                annId = sub.annId,
                entry = Animes.findOne({annId:annId});
            entry = $.extend(entry,{subscription:sub});
            
            if (!result) result = [];
            result.push(entry);
        }
        return result;
    },
    poster: function(item){
        if (!item) return null;
        return item.hbiPicture || item.annPicture || null;
    },
    showEpisodes: function(item) {
        return item.type == 'tv' && item.numEpisodes;
    },
    episodes: function(item) {
        var userId = Meteor.userId();
        var status = '';

        var isFuture = new Date(item.startDate) > new Date();
        if (isFuture) {
            return 'Upcoming Series';
        }
        return item.endDate || item.subscription.progress == 'finished'
            ? item.numEpisodes+' Episodes'
            : '+'+item.numEpisodes+' Episodes (Ongoing)';
    },
    type: function(item){
        return getTypeStr(item.type);
    },
    rating: function(item){
        var stars = '';
        var star_empty = '<i class="star fa fa-star unfilled"></i>';
        var star_filled = '<i class="star fa fa-star"></i>';
    
        for (var i=0; i<MAX_RATING; i++) {
            stars += (i < item.subscription.rating ? star_filled : star_empty);
        }
        return '<div class="stars">'+stars+'</div>';
    }
});
//====================================================================================
// TEMPLATE: DISCOVERPAGE
//====================================================================================
Template.discoverPage.rendered = function(){
    $('#discoverPage').css({opacity:0}).stop().animate({opacity:1},500);
}
Template.discoverPage.events({
    // ...
});
//====================================================================================
// TEMPLATE: SOCIALPAGE
//====================================================================================
Template.socialPage.rendered = function(){
    $('#socialPage').css({opacity:0}).stop().animate({opacity:1},500);
}
Template.socialPage.events({
    // ...
});
//====================================================================================
// TEMPLATE: ADMINPAGE
//====================================================================================
Template.adminPage.rendered = function(){
    $('#adminPage').css({opacity:0}).stop().animate({opacity:1},500);
}
Template.adminPage.events({
    'mouseover .button': function(e) {
        var el = $(e.target);
        el.addClass('hover');
    },
    'mouseout .button': function(e) {
        var el = $(e.target);
        el.removeClass('hover');
    },
    'click #fetchAnimesBtn': function(e) {
        var el = $(e.target);
        // fetch all animes
        Meteor.call('fetchAllAnimes');
    },
    'click #deleteAnimesBtn': function(e) {
        var el = $(e.target);
        // delete all animes
        Meteor.call('deleteAllAnimes');
    },
    'click #deleteSongsBtn': function(e) {
        var el = $(e.target);
        // delete all songs
        Meteor.call('deleteAllSongs');
    },
});
Template.adminPage.helpers({
    getTotalAnimes: function(){
        return Animes.find().count();
    },
    getTotalANN: function(){
        return Animes.find({dataANN:true}).count();
    },
    getTotalANNPct: function(){
        var total = Animes.find().count(),
            totalANN = Animes.find({dataANN:true}).count();
        return total > 0 ? (totalANN/total * 100).toFixed(2) : 0;
    },
    getTotalHBI: function(){
        return Animes.find({dataHBI:true}).count();
    },
    getTotalHBIPct: function(){
        var total = Animes.find().count(),
            totalHBI = Animes.find({dataHBI:true}).count();
        return total > 0 ? (totalHBI/total * 100).toFixed(2) : 0;
    },
    getTotalCovers: function(){
        return Animes.find({$or: [{annPicture: {$exists:true}}, {hbiPicture: {$exists:true}}]}).count();
    },
    getTotalCoversPct: function(){
        var total = Animes.find().count(),
            totalCovers = Animes.find({$or: [{annPicture: {$exists:true}}, {hbiPicture: {$exists:true}}]}).count();
        return total > 0 ? (totalCovers/total * 100).toFixed(2) : 0;
    },
    getTotalSongs: function(){
        return Songs.find().count();
    },
    allAnimes: function(){
        // this is just a simple test
        return Animes.find({annId: {$gt: 15500}});
    }
});
//====================================================================================
// TEMPLATE: INFOBAR
//====================================================================================
var InfoBar = {
    init: function(data) {
        // set the session variable for the info bar
        this.clear();
        Session.set('infoBarData',data);

        // force a re-render
        UI.render(Template.infoBar);
    },
    clear: function() {
        this.hide({duration:0});
        Session.set('subpage',null);
        Session.set('infoBarData',null);
    },
    selectSubpage: function(subpage) {
        // don't bother trying to change subpages if the target page is the same as the
        // currently selected one.
        if (Session.get('subpage') == subpage) return;
        Session.set('subpage',subpage);

        // update the selector for the navbar
        $('#navbar .navitem').removeClass('selected');
        $('#navbar .navitem[data-subpage="'+subpage+'"]').addClass('selected');

        // get the current info bar data
        var infoBarData = Session.get('infoBarData');
        InfoBar.showLoad();

        // depending on what subpage, we need to also load the corresponding data
        switch (subpage) {
            case 'overview':
                Meteor.call('getAnimeData', infoBarData.annId, function(err,data){
                    Session.set('infoBarData',$.extend(Session.get('infoBarData'),data));
                    InfoBar.hideLoad();
                });
                break;
            case 'activity':
                InfoBar.hideLoad();
                break;
            case 'music':
                Meteor.call('getSongData', infoBarData.annId, function(err,data){
                    Session.set('infoBarData',$.extend(Session.get('infoBarData'),{songs:data}));
                    InfoBar.hideLoad();
                });
                break;
            case 'social':
                InfoBar.hideLoad();
                break;
            default:
                InfoBar.hideLoad();
                break;
        }
    },
    show: function(options) {
        var settings = $.extend({duration:500},options),
            barWidth = $('#infoBar').width(),
            start    = {right: -barWidth},
            end      = {right: 0},
            dur      = settings.duration;
        $('#page-container') .css({right:0}).stop().animate({right:barWidth},dur);
        $('#infoBar')        .css(start).stop().animate(end,dur);
        $('#infoBar > .body').css(start).stop().animate(end,dur);
        $('#loadingSubpage') .css({display:'block',opacity:1});
        $('#loadingSubpage') .css(start).animate(end,dur);
    },
    hide: function(options) {
        var settings = $.extend({duration:500},options),
            barWidth = $('#infoBar').width(),
            start    = {right: 0},
            end      = {right: -barWidth},
            dur      = settings.duration;
        $('#page-container') .css({right:barWidth}).stop().animate({right:0},dur);
        $('#infoBar')        .css(start).stop().animate(end,dur);
        $('#infoBar > .body').css(start).stop().animate(end,dur);
        $('#loadingSubpage') .css(start).animate(end,dur);
    },
    showLoad: function(options) {
        if ($('#loadingSubpage').css('opacity') > 0) return;

        var settings = $.extend({duration:200},options),
            start    = {display:'block', opacity: 0},
            end      = {opacity: 1},
            dur      = settings.duration;
        $('#loadingSubpage').css(start).stop().animate(end,dur);
    },
    hideLoad: function(options) {
        var settings = $.extend({duration:200},options),
            start    = {display:'block', opacity: 1},
            end      = {opacity: 0},
            dur      = settings.duration;
        $('#loadingSubpage').css(start).stop().animate(end,dur,function(){
            $(this).css({display:'none'});
        });
    }
};
Template.infoBar.created = function(){
    var data = Session.get('infoBarData');
    if (!data) return;

    // show the info bar
    InfoBar.show();

    // select the Overview subpage by default
    InfoBar.selectSubpage('overview');
}
Template.infoBar.events({
    'mouseover .close-btn': function(e) {
        var el = $(e.currentTarget);
        el.addClass('hover');
    },
    'mouseout .close-btn': function(e) {
        var el = $(e.currentTarget);
        el.removeClass('hover');
    },
    'click .close-btn': function(e) {
        var el = $(e.currentTarget);
        $('#searchInput').val('');
        
        InfoBar.hide();
    },
    'mouseover .navitem': function(e) {
        var el = $(e.currentTarget);
        el.addClass('hover');
    },
    'mouseout .navitem': function(e) {
        var el = $(e.currentTarget);
        el.removeClass('hover');
    },
    'click .navitem': function(e) {
        var el = $(e.currentTarget);

        // show the subpage
        InfoBar.selectSubpage(el.attr('data-subpage'));
    }
});
Template.infoBar.helpers({
    getTitle: function(){
        return Session.get('infoBarData') ? Session.get('infoBarData').title : null;
    },
    getType: function() {
        return Session.get('infoBarData') ? getTypeStr(Session.get('infoBarData').type) : null;
    },
    getInfoBarData: function(){
        return Session.get('infoBarData');
    },
    // some methods to determine which subpage to display
    showOverviewSubpage: function(){
        return Session.equals('subpage','overview');
    },
    showActivitySubpage: function(){
        return Session.equals('subpage','activity');
    },
    showMusicSubpage: function(){
        return Session.equals('subpage','music');
    },
    showSocialSubpage: function(){
        return Session.equals('subpage','social');
    }
});
//====================================================================================
// TEMPLATE: OVERVIEWSUBPAGE
//====================================================================================
Template.overviewSubpage.created = function(){
    // destroy any previously created plot plugin
    var plot = $('#overviewSubpage .plot');
    plot.trigger('destroy');
}
Template.overviewSubpage.rendered = function(){
    var subpage = $('#overviewSubpage'),
        poster = $('.poster',subpage),
        plot = $('.plot',subpage);

    // animate into visibility
    subpage.css({opacity:0}).stop().animate({opacity:1},500);

    // truncate the plot paragraph (if available)
    if (!plot.is(':empty')) {
        if ($('a.readmore',plot).size() == 0) {
            plot.append('<a class="readmore">[Read more]</a>')
        }
        plot.dotdotdot({
            height: 96,
            after: 'a.readmore'
        });
        $('a.readmore',plot).click(function(){
            $(this).parent().trigger('destroy');
            $('a.readmore',plot).remove();
        });
    }
};
Template.overviewSubpage.events({
    // ...
});
Template.overviewSubpage.helpers({
    getAnimeData: function(){
        return Session.get('infoBarData');
    },
    isTV: function() {
        var data = Session.get('infoBarData');
        if (!data || !data.type) return false;
        return data.type === 'tv';
    },
    isSubscribed: function() {
        return getSubscriptionData() != null;
    },
    plot: function() {
        var data = Session.get('infoBarData');
        if (!data || !data.plot) return null;
        return data.plot;
    },
    poster: function(){
        var data = Session.get('infoBarData');
        if (!data) return null;
        return data.hbiPicture || data.annPicture || null;
    },
    genres: function() {
        var data = Session.get('infoBarData');
        if (!data || !data.genres) return null;
        return capitalizeAll(data.genres).join(', ');
    },
    themes: function() {
        var data = Session.get('infoBarData');
        if (!data || !data.themes) return null;
        return capitalizeAll(data.themes).join(', ');
    },
    startDateLabel: function(){
        var data = Session.get('infoBarData');
        if (!data || !data.type) return null;

        var isFuture = new Date(data.startDate) > new Date();

        switch (data.type) {
            case 'tv': 
                return isFuture ? 'Starts On' : 'Started On';
            default:
                return 'Aired On';
        }
    },
    startDate: function() {
        var data = Session.get('infoBarData');
        if (!data || !data.startDate) return null;

        var date = new Date(data.startDate);
        return date.getShortMonthName() + ' ' + date.getDate() + ', ' + date.getFullYear();
    },
    endDate: function() {
        var data = Session.get('infoBarData');
        if (!data || !data.endDate) return null;

        var date = new Date(data.endDate);
        return date.getShortMonthName() + ' ' + date.getDate() + ', ' + date.getFullYear();
    },
    runningTime: function(){
        var data = Session.get('infoBarData');
        if (!data || !data.runningTime) return null;

        var num = parseInt(data.runningTime);
        return isNaN(num) ? data.runningTime.capitalize() : num + ' minutes';
    },
    status: function() {
        var data = Session.get('infoBarData');
        if (!data) return null;

        if (!data.startDate) {
            return 'Not Aired Yet';
        }
        var isFuture = new Date(data.startDate) > new Date();
        if (isFuture) {
            return 'Upcoming Series';
        } else {
            return data.endDate ? 'Completed' : 'Ongoing';
        }
    },
    showEpisodes: function() {
        var data = Session.get('infoBarData');
        if (!data || !data.type || !data.numEpisodes) return false;
        return data.type == 'tv' && data.numEpisodes;
    },
    numEpisodes: function() {
        var data = Session.get('infoBarData'),
            subscription = getSubscriptionData();
        
        if (!data || data.numEpisodes === null) return null;

        if (subscription && subscription.episodes !== null) {
            return '<span class="accent">'+subscription.episodes+'</span>/'+data.numEpisodes;
        } else {
            return data.numEpisodes;
        }
    },
    progress: function() {
        var subscription = getSubscriptionData();
        if (!subscription || !subscription.progress) return null;
        return '<span class="progress '+subscription.progress+'">'+getProgressStr(subscription.progress)+'</span>';
    },
    rating: function() {
        var subscription = getSubscriptionData();
        if (!subscription || !subscription.rating) return null;

        var stars = '';
        var star_empty = '<i class="star fa fa-star-o"></i>';
        var star_filled = '<i class="star fa fa-star"></i>';
    
        for (var i=0; i<MAX_RATING; i++) {
            stars += (i < subscription.rating ? star_filled : star_empty);
        }
        return '<div class="stars">'+stars+'</div>';
    }
});
//====================================================================================
// TEMPLATE: ACTIVITYSUBPAGE
//====================================================================================
var SubscriptionForm = {
    init: function() {
        var subscriptionData = getSubscriptionData();
        if (!subscriptionData) return;

        // ...
    },
    setProgress: function(progress){
        // update the progress on the server
        var data = Session.get('infoBarData');
        if (!data || !data.annId) return;

        Meteor.call('changeSubscriptionProgress',data.annId,progress);

        if (progress == 'finished') {
            Meteor.call('changeSubscriptionEpisodes',data.annId,data.numEpisodes);
        }
    },
    setRating: function(rating) {
        // update the rating on the server
        var data = Session.get('infoBarData');
        if (!data || !data.annId) return;

        Meteor.call('changeSubscriptionRating',data.annId,rating);
    },
    incrementEpisodes: function(){
        var data = Session.get('infoBarData'),
            subscriptionData = getSubscriptionData();

        if (!data || !subscriptionData) return;
        
        var episodes = subscriptionData.episodes,
            newEpisodes = Math.min(episodes+1,data.numEpisodes);

        if (episodes == newEpisodes) return;

        Meteor.call('changeSubscriptionEpisodes',data.annId,newEpisodes);
    },
    decrementEpisodes: function(){
        var data = Session.get('infoBarData'),
            subscriptionData = getSubscriptionData();

        if (!data || !subscriptionData) return;
        
        var episodes = subscriptionData.episodes,
            newEpisodes = Math.max(episodes-1,0);

        if (episodes == newEpisodes) return; 

        Meteor.call('changeSubscriptionEpisodes',data.annId,newEpisodes);
    },

    // click hold handlers and states
    isClickHolding: false,
    clickHoldDelay: 400,
    clickHoldHandler: function(cb){
        setTimeout(function(){
            // do not perform any actions if a release event has been detected
            if (!SubscriptionForm.isClickHolding) return;

            // change the duration of the delay
            SubscriptionForm.clickHoldDelay = Math.max(SubscriptionForm.clickHoldDelay * 0.75, 1);
            SubscriptionForm.clickHoldHandler(cb);
            
            // perform the requested action
            if (cb) cb();
        },SubscriptionForm.clickHoldDelay);
    }
};
Template.activitySubpage.rendered = function(){
    $('#activitySubpage').css({opacity:0}).stop().animate({opacity:1},500);

    // initialize the subscription form
    SubscriptionForm.init();
};
Template.activitySubpage.events({
    'mouseover .subscribe-btn': function(e){
        var el = $(e.target);
        el.addClass('hover');
    },
    'mouseout .subscribe-btn': function(e){
        var el = $(e.target);
        el.removeClass('hover');
    },
    'click .subscribe-btn': function(e){
        var data = Session.get('infoBarData');
        if (!data || !data.annId) return null;

        // subscribe to this anime
        Meteor.call('subscribeToAnime',data.annId,function(err,data){

            // re-initialize the form
            $('#activitySubpage').css({opacity:0}).stop().animate({opacity:1},500);
            SubscriptionForm.init();
        });
    },
    'mouseover .progress': function(e){
        var el = $(e.target);
        el.addClass('hover');
    },
    'mouseout .progress': function(e){
        var el = $(e.target);
        el.removeClass('hover');
    },
    'click .progress': function(e){
        var el = $(e.target);
        SubscriptionForm.setProgress(el.attr('data-progress'));
    },
    'mouseover .epCountControl': function(e){
        var el = $(e.target);
        el.addClass('hover');
    },
    'mouseout .epCountControl': function(e){
        var el = $(e.target);
        el.removeClass('hover');
    },
    'mouseup .epCountControl': function(e){
        SubscriptionForm.isClickHolding = false;
        SubscriptionForm.clickHoldDelay = 400;
    },
    'mousedown .epCountUp': function(e){
        var el = $(e.target);
        SubscriptionForm.incrementEpisodes();

        // start a click/hold handler
        SubscriptionForm.isClickHolding = true;
        SubscriptionForm.clickHoldHandler(SubscriptionForm.incrementEpisodes);
    },
    'mousedown .epCountDown': function(e){
        var el = $(e.target);
        SubscriptionForm.decrementEpisodes();

        // start a click/hold handler
        SubscriptionForm.isClickHolding = true;
        SubscriptionForm.clickHoldHandler(SubscriptionForm.decrementEpisodes);
    },
    'mouseover .star': function(e){
        var el = $(e.target),
            num = el.attr('data-star-num'),
            stars = $('#activitySubpage .stars');

        // perform a star preview
        $('.star',stars).removeClass('fa-star').addClass('fa-star-o');
        for (var i=1; i<=num; i++) {
            $('.star[data-star-num="'+i+'"]',stars)
                .removeClass('fa-star-o')
                .addClass('fa-star');
        }
    },
    'mouseout .star': function(e){
        var el = $(e.target),
            subscriptionData = getSubscriptionData(),
            stars = $('#activitySubpage .stars');

        if (!subscriptionData) return;

        // reset to the default star value
        for (var i=1; i<=MAX_RATING; i++) {
            var star = $('.star[data-star-num="'+i+'"]',stars);
            
            star.removeClass('fa-star').removeClass('fa-star-o');
            (i <= subscriptionData.rating)
                ? star.addClass('fa-star')
                : star.addClass('fa-star-o')
        }
    },
    'click .star': function(e){
        var el = $(e.target),
            num = el.attr('data-star-num');
        SubscriptionForm.setRating(num);
    },
    'mouseover .unsubscribe-btn': function(e){
        var el = $(e.target);
        el.addClass('hover');
    },
    'mouseout .unsubscribe-btn': function(e){
        var el = $(e.target);
        el.removeClass('hover');
    },
    'click .unsubscribe-btn': function(e){
        var data = Session.get('infoBarData');
        if (!data || !data.annId) return null;

        // unsubscribe from this anime
        InfoBar.showLoad();
        Meteor.call('unsubscribeFromAnime',data.annId,function(err,data){
            InfoBar.hideLoad();
            $('#activitySubpage').css({opacity:0}).stop().animate({opacity:1},500);
        });
    }
});
Template.activitySubpage.helpers({
    isTV: function() {
        var data = Session.get('infoBarData');
        if (!data || !data.type) return false;
        return data.type === 'tv';
    },
    getSubscription: function(){
        return getSubscriptionData();
    },
    isSubscribed: function() {
        return getSubscriptionData() != null;
    },
    progress: function(){
        var subscriptionData = getSubscriptionData();

        var progressOptions = ['finished','watching','backlogged','X','onhold','abandoned'],
            progressStrings = ['Finished','Watching','Backlogged','X','On Hold','Abandoned'],
            result = '';

        for (var i=0; i<progressOptions.length; i++) {
            if (progressOptions[i] == 'X') { result += '<br/>'; continue; }
            result += ((subscriptionData && subscriptionData.progress && progressOptions[i] == subscriptionData.progress) 
                ? ('<span class="progress selected" data-progress="'+progressOptions[i]+'">'+progressStrings[i]+'</span>')
                : ('<span class="progress" data-progress="'+progressOptions[i]+'">'+progressStrings[i]+'</span>')
            )
        }
        return result;
    },
    showEpisodeControls: function(){
        var subscriptionData = getSubscriptionData();

        if (!subscriptionData || !subscriptionData.progress) return false;
        return subscriptionData.progress != 'finished';
    },
    episodes: function(){
        var data = Session.get('infoBarData'),
            subscription = getSubscriptionData();
        
        if (!data || data.numEpisodes === null) return null;

        return '<span class="currEpisode">'+subscription.episodes+'</span>/<span class="maxEpisodes">'+data.numEpisodes+'</span>';
    },
    rating: function(){
        var subscription = getSubscriptionData();
        if (!subscription || !subscription.rating) return null;

        var stars = '';
        var star_empty = '<i class="star fa fa-star-o" data-star-num="{data-star-num}"></i>';
        var star_filled = '<i class="star fa fa-star" data-star-num="{data-star-num}"></i>';
    
        for (var i=0; i<MAX_RATING; i++) {
            var star = '';
            star = (i < subscription.rating) ? star_filled : star_empty;
            star = star.replace('{data-star-num}',i+1);
            stars += star;
        }
        return '<div class="stars">'+stars+'</div>';
    }
});
//====================================================================================
// TEMPLATE: MUSICSUBPAGE
//====================================================================================
Template.musicSubpage.rendered = function(){
    $('#musicSubpage').css({opacity:0}).stop().animate({opacity:1},500);
};
Template.musicSubpage.events({
    // ...
});
Template.musicSubpage.helpers({
    hasSongs: function(){
        var data = Session.get('infoBarData');
        return data && data.songs && data.songs.length > 0;
    },
    getSongData: function(){
        var data = Session.get('infoBarData');
        return (!data || !data.songs) ? null : data.songs;
    },
    getOpeningThemes: function() {
        var data = Session.get('infoBarData');
        if (!data || !data.songs) return null;

        var result = [];
        for (var i=0; i<data.songs.length; i++) {
            if (data.songs[i].type == 'op') result.push(data.songs[i]);
        }
        return result.length > 0 ? result : null;
    },
    getEndingThemes: function(){
        var data = Session.get('infoBarData');
        if (!data || !data.songs) return null;

        var result = [];
        for (var i=0; i<data.songs.length; i++) {
            if (data.songs[i].type == 'ed') result.push(data.songs[i]);
        }
        return result.length > 0 ? result : null;

    },
    getInsertThemes: function(){
        var data = Session.get('infoBarData');
        if (!data || !data.songs) return null;

        var result = [];
        for (var i=0; i<data.songs.length; i++) {
            if (data.songs[i].type == 'in') result.push(data.songs[i]);
        }
        return result.length > 0 ? result : null;
    },
    displayEpisodes: function(episodes){
        if (!episodes || !episodes.length || !episodes[0]) return null;

        // we're only going to display the first episode range
        var epRange = episodes[0];
        var label = 'Ep';
        var value = '';

        value = epRange.start;
        if (epRange.end) {
            var maxEpisodes = epRange.end == -1 ? Session.get('infoBarData').numEpisodes : epRange.end;
            label += 's';
            value += ('-' + maxEpisodes);
        }
        return '<div class="label">'+label+'</div><div class="value">'+value+'</div>';
    }
});
//====================================================================================
// TEMPLATE: SOCIALSUBPAGE
//====================================================================================
Template.socialSubpage.rendered = function(){
    $('#socialSubpage').css({opacity:0}).stop().animate({opacity:1},500);
};
Template.socialSubpage.events({
    // ...
});
Template.socialSubpage.helpers({
    // ...
});
//====================================================================================
// APPLICATION METHODS
//====================================================================================
function selectPage(page) {
    // update the selected visual for the sidebar
    $('#sideBar .option').removeClass('selected');
    $('#sideBar .option[data-page="'+page+'"]').addClass('selected');

    // update the session variable for the page
    Session.set('page',page);
}
function getTypeStr(type) {
    switch (type) {
        case 'tv': return 'TV Series';
        case 'oav': return 'Original Video Animation';
        case 'ona': return 'Original Net Animation';
        case 'movie': return 'Movie';
        default: return type.capitalize();
    }
}
function getProgressStr(progress) {
    switch (progress) {
        case 'finished': return 'Finished';
        case 'watching': return 'Watching';
        case 'onhold': return 'On Hold';
        case 'backlogged': return 'Backlogged';
        case 'abandoned': return 'Abanonded';
        default: return progress.capitalize();
    }
}
function getSubscriptionData() {
    var data = Session.get('infoBarData'),
        user = Meteor.user();
    if (!data || !data.annId || !user || !user._id) return null;
    return Subscriptions.findOne({userId: user._id, annId: data.annId}) || null;
}
function capitalizeAll(arr) {
    // captialize all the genres
    return $.map(arr, function(item){
        return item.capitalize();
    });
}