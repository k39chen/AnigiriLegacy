// Application globals
var MAX_RATING = 5;

// Meteor subscriptions
Meteor.subscribe('userData');
Meteor.subscribe('userAnimes');
Meteor.subscribe('userSubscriptions');
Meteor.subscribe('songs');
Meteor.subscribe('userFriends');

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
    showStatisticsPage: function(){
        return Session.equals('page','statistics');
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
Template.account.helpers({
    userPortrait: function(){
        var user = Meteor.user();
        if (user && user.services && user.services.facebook && user.services.facebook.id) {
            var fb_uid = user.services.facebook.id;
            return 'https://graph.facebook.com/'+fb_uid+'/picture?width=150&height=150';
        }
        return null;
    }
});
//====================================================================================
// TEMPLATE: DASHBOARDPAGE
//====================================================================================
Template.dashboardPage.rendered = function(){
    hideLoadingScreen();
    $('#dashboardPage').css({opacity:0}).stop().animate({opacity:1},500);
}
Template.dashboardPage.events({
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
    }
});
Template.dashboardPage.helpers({
    hasSubscriptions: function(){
        return Subscriptions.find().count() > 0;
    },
    userFirstName: function(){
        var user = Meteor.user(), firstname = 'Otaku';
        if (user && user.profile && user.profile.name) {
            var names = user.profile.name.split(' ');
            if (names.length > 0) {
                firstname = names[0];
            }
        }
        return firstname;
    },
    hasCurrentlyWatching: function(){
        return Subscriptions.find({progress:'watching'}).count() > 0;
    },
    countCurrentlyWatching: function(){
        return Subscriptions.find({progress:'watching'}).count();
    },
    getCurrentlyWatching: function(){
        var subscriptions = Subscriptions.find({progress:'watching'}).fetch();
        return getFullSubscriptions(subscriptions);
    },
    hasBacklogged: function(){
        return Subscriptions.find({progress:'backlogged'}).count() > 0;
    },
    countBacklogged: function(){
        return Subscriptions.find({progress:'backlogged'}).count();
    },
    getBacklogged: function(){
        var subscriptions = Subscriptions.find({progress:'backlogged'}).fetch();
        return getFullSubscriptions(subscriptions);
    },
    hasRatedAnimes: function(){
        return Subscriptions.find({rating:{$gt:0}}).count() > 0;
    },
    getHighestRatedAnimes: function(topX){
        var subscriptions = Subscriptions.find().fetch();
        return getFullSubscriptions(subscriptions, function(a,b){
            return b.subscription.rating - a.subscription.rating;
        }).splice(0,topX);
    }
});
//====================================================================================
// TEMPLATE: COLLECTIONPAGE
//====================================================================================
Template.collectionPage.rendered = function(){
    hideLoadingScreen();
    $('#collectionPage').css({opacity:0}).stop().animate({opacity:1},500);
}
Template.collectionPage.events({
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
    }
});
Template.collectionPage.helpers({
    hasSubscriptions: function(){
        return hasSubscriptions();
    },
    getSubscriptions: function(){
        return getFullSubscriptions();
    }
});
//====================================================================================
// TEMPLATE: DISCOVERPAGE
//====================================================================================
Template.discoverPage.rendered = function(){
    hideLoadingScreen();
    $('#discoverPage').css({opacity:0}).stop().animate({opacity:1},500);
}
Template.discoverPage.events({
    // ...
});
//====================================================================================
// TEMPLATE: SOCIALPAGE
//====================================================================================
Template.socialPage.rendered = function(){
    hideLoadingScreen();
    $('#socialPage').css({opacity:0}).stop().animate({opacity:1},500);
}
Template.socialPage.events({
    // ...
});
//====================================================================================
// TEMPLATE: STATISTICSPAGE
//====================================================================================
Template.statisticsPage.rendered = function(){
    hideLoadingScreen();
    $('#statisticsPage').css({opacity:0}).stop().animate({opacity:1},500);
}
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
//====================================================================================
// TEMPLATE: ADMINPAGE
//====================================================================================
Template.adminPage.rendered = function(){
    hideLoadingScreen();
    $('#adminPage').css({opacity:0}).stop().animate({opacity:1},500);

    Meteor.call('getAdminData', function(err,data){
        Session.set('adminData',data);
    });
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
        var data = Session.get('adminData');
        return data ? data.totalAnimes : null;
    },
    getTotalANN: function(){
        var data = Session.get('adminData');
        return data 
            ? data.totalANN + '/' + data.totalAnimes + ' (' + (data.totalANN / data.totalAnimes * 100).toFixed(2) + '%)'
            : null;
    },
    getTotalHBI: function(){
        var data = Session.get('adminData');
        return data
            ? data.totalHBI + '/' + data.totalAnimes + ' (' + (data.totalHBI / data.totalAnimes * 100).toFixed(2) + '%)'
            : null;
    },
    getTotalCovers: function(){
        var data = Session.get('adminData');
        return data 
            ? data.totalCovers + '/' + data.totalAnimes + ' (' + (data.totalCovers / data.totalAnimes * 100).toFixed(2) + '%)'
            : null;
    },
    getTotalSongs: function(){
        var data = Session.get('adminData');
        return data ? data.totalSongs : null;
    }
});
//====================================================================================
// TEMPLATE: INFOBAR
//====================================================================================
var InfoBar = {
    isShown: false,
    isShowing: false,
    init: function(data) {
        // set the session variable for the info bar
        this.clear();
        Session.set('infoBarData',data);

        // force a re-render
        UI.render(Template.infoBar);
    },
    clear: function() {
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
        var infoBarData = Session.get('infoBarData'),
            annId = infoBarData.annId;
        InfoBar.showLoad();

        // depending on what subpage, we need to also load the corresponding data
        switch (subpage) {
            case 'overview':
                Meteor.call('getAnimeData', annId, function(err,animeData){
                    // lets combine the subscription data while we're at it
                    Session.set('infoBarData', $.extend(
                        Session.get('infoBarData'),
                        {subscription: Subscriptions.findOne({annId:annId})},
                        animeData
                    ));
                    InfoBar.hideLoad();
                });
                break;
            case 'activity':
                // the subscription data was already loaded with the overview page
                if (!Session.get('infoBarData').subscriptions) {
                    Session.set('infoBarData', $.extend(
                        Session.get('infoBarData'),
                        {subscription: Subscriptions.findOne({annId:annId})}
                    ));
                }
                InfoBar.hideLoad();
                break;
            case 'music':
                Session.set('infoBarData',$.extend(
                    Session.get('infoBarData'),
                    {songs: Songs.find({annId:annId}).fetch()}
                ));
                InfoBar.hideLoad();
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
        if (this.isShown) return;

        var settings = $.extend({duration:500},options),
            barWidth = $('#infoBar').width(),
            start    = {right: -barWidth},
            end      = {right: 0},
            dur      = settings.duration;

        this.isShowing = true;

        $('#page-container') .css({right:0}).stop().animate({right:barWidth},dur,function(){
            InfoBar.isShowing = false;
        });
        $('#infoBar')        .css(start).stop().animate(end,dur);
        $('#infoBar > .body').css(start).stop().animate(end,dur);
        $('#loadingSubpage') .css({display:'block',opacity:1});
        $('#loadingSubpage') .css(start).animate(end,dur);

        this.isShown = true;
    },
    hide: function(options) {
        if (!this.isShown) return;

        var settings = $.extend({duration:500},options),
            barWidth = $('#infoBar').width(),
            start    = {right: 0},
            end      = {right: -barWidth},
            dur      = settings.duration;
        $('#page-container') .css({right:barWidth}).stop().animate({right:0},dur);
        $('#infoBar')        .css(start).stop().animate(end,dur);
        $('#infoBar > .body').css(start).stop().animate(end,dur);
        $('#loadingSubpage') .css(start).animate(end,dur);

        this.isShown = false;
    },
    showLoad: function(options) {
        var settings = $.extend({duration:400},options),
            start    = {display:'block', opacity: 0},
            end      = {opacity: 1},
            dur      = settings.duration;
        
        if (!this.isShowing) {
            $('#loadingSubpage').stop();
        }
        $('#loadingSubpage').css(start).animate(end,dur);
    },
    hideLoad: function(options) {
        var settings = $.extend({duration:400},options),
            start    = {display:'block', opacity: 1},
            end      = {opacity: 0},
            dur      = settings.duration;
        
        if (!this.isShowing) {
            $('#loadingSubpage').stop();
        }
        $('#loadingSubpage').css(start).animate(end,dur,function(){
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
Template.overviewSubpage.helpers({
    getAnimeData: function(){
        return Session.get('infoBarData');
    },
    isSubscribed: function() {
        var data = Session.get('infoBarData');
        if (!data || !data.subscription) return false;

        return data.subscription != null;
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

        if (hasEpisodes(data.type)) {
            return isFuture(data.startDate) ? 'Starts On' : 'Started On';
        } else {
            return 'Aired On';
        }
    },
    startDate: function() {
        var data = Session.get('infoBarData');
        if (!data || !data.startDate) return null;

        var date = new Date(data.startDate);
        return formatDate(date);
    },
    endDate: function() {
        var data = Session.get('infoBarData');
        if (!data || !data.endDate) return null;

        var date = new Date(data.endDate);
        return formatDate(date);
    },
    runningTime: function(){
        var data = Session.get('infoBarData');
        if (!data || !data.runningTime) return null;

        var num = parseInt(data.runningTime);
        return isNaN(num) ? data.runningTime.capitalize() : num + ' minutes';
    },
    showStatus: function() {
        var data = Session.get('infoBarData');
        if (!data || !data.type || data.numEpisodes === null) return false;

        return data.numEpisodes && hasEpisodes(data.type);
    },
    status: function() {
        var data = Session.get('infoBarData');
        if (!data) return null;

        if (!data.startDate) {
            return 'Not Aired Yet';
        } else if (isFuture(data.startDate)) {
            return 'Upcoming Series';
        } else {
            return data.endDate ? 'Completed' : 'Ongoing';
        }
    },
    showEpisodes: function() {
        var data = Session.get('infoBarData');
        if (!data || !data.type || data.numEpisodes === null) return false;

        return data.numEpisodes && hasEpisodes(data.type);
    },
    numEpisodes: function() {
        var data = Session.get('infoBarData');

        if (!data || data.numEpisodes === null) return null;

        if (data.subscription && data.subscription.episodes !== null) {
            return '<span class="accent">'+data.subscription.episodes+'</span>/'+data.numEpisodes;
        } else {
            return data.numEpisodes;
        }
    },
    progress: function() {
        var data = Session.get('infoBarData');
        if (!data || !data.subscription || !data.subscription.progress) return null;

        return '<span class="progress '+data.subscription.progress+'">'+getProgressStr(data.subscription.progress)+'</span>';
    },
    rating: function() {
        var data = Session.get('infoBarData');
        if (!data || !data.subscription || !data.subscription.rating) return null;

        var stars = '';
        var star_empty = '<i class="star fa fa-star-o"></i>';
        var star_filled = '<i class="star fa fa-star"></i>';
    
        for (var i=0; i<MAX_RATING; i++) {
            stars += (i < data.subscription.rating ? star_filled : star_empty);
        }
        return '<div class="stars">'+stars+'</div>';
    }
});
//====================================================================================
// TEMPLATE: ACTIVITYSUBPAGE
//====================================================================================
var SubscriptionForm = {
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
    setEpisodes: function(episodes) {
        var data = Session.get('infoBarData');

        if (!data || !data.subscription) return;
        
        var prevEpisodes = data.subscription.episodes,
            newEpisodes = Math.min(episodes,data.numEpisodes);

        if (prevEpisodes == newEpisodes) return;

        Meteor.call('changeSubscriptionEpisodes',data.annId,newEpisodes);
    },
    incrementEpisodes: function(){
        var data = Session.get('infoBarData'),
            elem = $('#activitySubpage .currEpisode');
        if (!data || data.numEpisodes === null || !elem) return;

        var newCount = Math.min(parseInt(elem.text(),10)+1,data.numEpisodes);
        elem.text(newCount);
    },
    decrementEpisodes: function(){
        var elem = $('#activitySubpage .currEpisode');
        if (!elem) return;

        var newCount = Math.max(parseInt(elem.text(),10)-1,0);
        elem.text(newCount);
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
        }, SubscriptionForm.clickHoldDelay);
    }
};
Template.activitySubpage.rendered = function(){
    $('#activitySubpage').css({opacity:0}).stop().animate({opacity:1},500);
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
            $('#activitySubpage').css({opacity:0}).stop().animate({opacity:1},500);
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

        var elem = $('#activitySubpage .currEpisode');
        if (!elem) return;
        
        SubscriptionForm.setEpisodes(parseInt(elem.text(),10));
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
            data = Session.get('infoBarData'),
            stars = $('#activitySubpage .stars');

        if (!data || !data.subscription) return;

        // reset to the default star value
        for (var i=1; i<=MAX_RATING; i++) {
            var star = $('.star[data-star-num="'+i+'"]',stars);
            
            star.removeClass('fa-star').removeClass('fa-star-o');
            (i <= data.subscription.rating)
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
    getSubscription: function(){
        var data = Session.get('infoBarData');
        return data.subscription;
    },
    isSubscribed: function() {
        var data = Session.get('infoBarData');
        return data && data.subscription;
    },
    progress: function(){
        var data = Session.get('infoBarData');
        if (!data || !data.subscription) return null;

        var progressOptions = ['finished','watching','backlogged','X','onhold','abandoned'],
            progressStrings = ['Finished','Watching','Backlogged','X','On Hold','Abandoned'],
            result = '';

        for (var i=0; i<progressOptions.length; i++) {
            if (progressOptions[i] == 'X') { result += '<br/>'; continue; }
            result += ((data.subscription && data.subscription.progress && progressOptions[i] == data.subscription.progress) 
                ? ('<span class="progress selected" data-progress="'+progressOptions[i]+'">'+progressStrings[i]+'</span>')
                : ('<span class="progress" data-progress="'+progressOptions[i]+'">'+progressStrings[i]+'</span>')
            )
        }
        return result;
    },
    showEpisodes: function() {
        var data = Session.get('infoBarData');
        if (!data || !data.type) return false;

        return data.numEpisodes && hasEpisodes(data.type);
    },
    showEpisodeControls: function(){
        var data = Session.get('infoBarData');
        if (!data || !data.subscription || !data.subscription.progress) return false;

        return data.subscription.progress != 'finished';
    },
    episodes: function(){
        var data = Session.get('infoBarData');
        if (!data || data.numEpisodes === null || !data.subscription) return null;

        return '<span class="currEpisode">'+data.subscription.episodes+'</span><span class="maxEpisodes"> / '+data.numEpisodes+'</span>';
    },
    rating: function(){
        var data = Session.get('infoBarData');
        if (!data || !data.subscription || !data.subscription.rating) return null;

        var stars = '';
        var star_empty = '<i class="star fa fa-star-o" data-star-num="{data-star-num}"></i>';
        var star_filled = '<i class="star fa fa-star" data-star-num="{data-star-num}"></i>';
    
        for (var i=0; i<MAX_RATING; i++) {
            var star = '';
            star = (i < data.subscription.rating) ? star_filled : star_empty;
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
    'mouseover .addfriends-btn': function(e){
        var el = $(e.target);
        el.addClass('hover');
    },
    'mouseout .addfriends-btn': function(e){
        var el = $(e.target);
        el.removeClass('hover');
    },
    'click .addfriends-btn': function(e){
        selectPage('social');
    },
});
Template.socialSubpage.helpers({
    hasFriends: function() {
        return hasFriends();
    }
});
//====================================================================================
// TEMPLATE: GRIDITEM
//====================================================================================
Template.gridItem.rendered = function() {
    // ...
};
Template.gridItem.events({
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
Template.gridItem.helpers({
    progress: function(item){
        return item.subscription.progress;
    },
    poster: function(item){
        if (!item) return null;
        return item.hbiPicture || item.annPicture || null;
    },
    title: function(item){
        return item.title;
    },
    showEpisodes: function(item) {
        return item.numEpisodes && hasEpisodes(item.type);
    },
    unsubbedEpisodes: function(item) {
        if (isFuture(item.startDate)) {
            return 'Upcoming Series';
        }
        return item.endDate || item.subscription.progress == 'finished'
            ? item.numEpisodes+' Episodes'
            : '+'+item.numEpisodes+' Episodes (Ongoing)';
    },
    subbedEpisodes: function(item) {
        return isFuture(item.startDate) 
            ? 'Upcoming Series'
            : '<span>'+item.subscription.episodes+'</span> / '+item.numEpisodes+' Episodes';
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
// TEMPLATE: TINYGRIDITEM
//====================================================================================
Template.tinyGridItem.rendered = function() {
    // ...
};
Template.tinyGridItem.events({
    'mouseover .hoverTarget': function(e){
        var el = $(e.currentTarget),
            tgi = el.parent('.tinyGridItem');
            mask = $('.mask',tgi),
            content = $('.maskcontent',tgi),
            maskHeight = mask.height();

        content.css({bottom:-maskHeight,opacity:0}).stop().animate({bottom:0,opacity:1},500);
        mask.css({display:'block',opacity:0}).stop().animate({opacity:0.7},500);
    },

    'mouseout .hoverTarget': function(e){
        var el = $(e.currentTarget),
            tgi = el.parent('.tinyGridItem');
            mask = $('.mask',tgi),
            content = $('.maskcontent',tgi),
            maskHeight = mask.height();

        content.css({display:'block',bottom:0,opacity:1}).stop().animate({bottom:-maskHeight,opacity:0},500);
        mask.css({display:'block',opacity:0.7}).stop().animate({opacity:0},500,function(){
            $(this).css({display:'block'});
        })
    },
    'click .hoverTarget': function(e){
        var el = $(e.currentTarget),
            tgi = el.parent('.tinyGridItem');
        var annId = parseInt(tgi.attr('data-annId'),10);
        
        // get the anime data
        Meteor.call('getAnimeData',annId,function(err,data){
            InfoBar.init(data);
        });
    }
});
Template.tinyGridItem.helpers({
    progress: function(item){
        return item.subscription.progress;
    },
    poster: function(item){
        if (!item) return null;
        return item.hbiPicture || item.annPicture || null;
    },
    title: function(item){
        return item.title;
    },
    showEpisodes: function(item) {
        return item.numEpisodes && hasEpisodes(item.type);
    },
    unsubbedEpisodes: function(item) {
        if (isFuture(item.startDate)) {
            return 'Upcoming Series';
        }
        return item.endDate || item.subscription.progress == 'finished'
            ? item.numEpisodes+' Episodes'
            : '+'+item.numEpisodes+' Episodes (Ongoing)';
    },
    subbedEpisodes: function(item) {
        return isFuture(item.startDate)
            ? 'Upcoming Series'
            : '<span>'+item.subscription.episodes+'</span> / '+item.numEpisodes+' Episodes';
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
// APPLICATION METHODS
//====================================================================================
/**
 * Shows the loading screen overlay.
 *
 * @method showLoadingScreen
 */
function showLoadingScreen() {
    $('#loadingScreen').css({display:'block',opacity:0}).stop().animate({opacity:0.8},500);
}
/**
 * Hides the loading screen overlay.
 *
 * @method hideLoadingScreen
 */
function hideLoadingScreen() {
    $('#loadingScreen').css({display:'block',opacity:0.8}).stop().animate({opacity:0},500,function(){
        $(this).css({display:'none'});
    });
}
/**
 * Updates all the visual dependencies for page changing and then queues the associated
 * page for the appropriate data load.
 *
 * @method selectPage
 * @param page {String} The page identifier.
 */
function selectPage(page) {
    if (Session.get('page') == page) return;

    // update the selected visual for the sidebar
    $('#sideBar .option').removeClass('selected');
    $('#sideBar .option[data-page="'+page+'"]').addClass('selected');

    // show the loading screen as we try to load the data
    showLoadingScreen();

    // update the session variable for the page
    Session.set('page',page);
}
/**
 * Gets a human-readable version of anime progress strings.
 *
 * @method getTypeStr
 * @param type {String} The system recognized type string.
 * @return {String} The human-readable type string.
 */
function getTypeStr(type) {
    switch (type) {
        case 'tv': return 'TV Series';
        case 'oav': return 'Original Video Animation';
        case 'ona': return 'Original Net Animation';
        case 'movie': return 'Movie';
        default: return type.capitalize();
    }
}
/**
 * Determines whether or not a given anime type possesses episodes.
 *
 * @method hasEpisodes
 * @param type {String} The type string.
 * @return {Boolean} The boolean of whether or not the anime type has episodes.
 */
function hasEpisodes(type){
    return type == 'tv' ||
        type == 'ona' ||
        type == 'oav' ||
        type == 'special';

}
/**
 * Gets a human-readable version of anime progress strings.
 *
 * @method getProgressStr
 * @param progress {String} The system recognized progress strings.
 * @return {String} The human-readable progress strings.
 */
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
/**
 * Determine whether or not the current user has any subscriptions.
 *
 * @method hasSubscriptions
 * @return {Boolean} Whether or not the current user has subscriptions.
 */
function hasSubscriptions() {
    return Subscriptions.find().count() > 0;
}
/**
 * Determine whether or not the current user has any friends.
 *
 * @method hasSubscriptions
 * @return {Boolean} Whether or not the current user has friends.
 */
function hasFriends() {
    return Friends.find().count() > 0;
}
/**
 * Performs a client-side join between the subscription and anime data.
 *
 * @method getFullSubscriptions.
 * @param subscriptions {Array} The array of subscriptions. (default=null)
 * @param sort {Function} An optional sorting function. (default=null)
 * @return {Array} The sorted and complete set of subscription data.
 */
function getFullSubscriptions(subscriptions,sort){
    var result = null;
    
    // if no subset of subscriptions is provided, then just use the full set
    if (!subscriptions) {
        subscriptions = Subscriptions.find().fetch();
    }
    for (var i=0; i<subscriptions.length; i++) {
        var sub = subscriptions[i],
            annId = sub.annId,
            entry = Animes.findOne({annId:annId});
        entry = $.extend(entry,{subscription:sub});
        
        if (!result) result = [];
        result.push(entry);
    }
    // return an alphabetically sorted result
    if (result) {
        if (sort) {
            result = result.sort(sort);
        } else {
            result = result.sort(function(a,b){
                if(a.title < b.title) return -1;
                if(a.title > b.title) return 1;
                return 0;
            });
        }
    }
    return result;
}
/**
 * Determines if the provided date is in the future.
 *
 * @method isFuture
 * @param date {Date} The date object.
 * @return {Boolean} Whether or not the provided date is in the future.
 */
function isFuture(date) {
    return new Date(date) > new Date()
}
/**
 * Formats date object to human-readable format.
 *
 * @method formatDate
 * @param date {Date} The date object to format.
 * @return {String} The human-readable date string.
 */
function formatDate(date) {
    return date.getShortMonthName() + ' ' + date.getDate() + ', ' + date.getFullYear();
}
/**
 * Capitalizes all words in all elements of the provided string array.
 *
 * @method capitalizeAll
 * @param arr {Array} The array of strings to be capitalized.
 * @return {Array} The capitalized array of strings.
 */
function capitalizeAll(arr) {
    // captialize all the genres
    return $.map(arr, function(item){
        return item.capitalize();
    });
}
