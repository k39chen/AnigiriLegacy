Meteor.startup(function(){
    console.log("Hello Anigiri!");

    //startCronJob();
});

function startCronJob() {
    var job = new Cron.Job(new Cron.Spec('*/2 * * * * *'), function(){
        console.log(new Date());
    });
    var cron = new Cron();
    cron.start();
    cron.add(job);
}

// publications
Meteor.publish('userData', function(){
    return Meteor.users.find(
        {_id: this.userId},
        {fields: {services: 1}}
    );
});
Meteor.publish('userSubscriptions', function(){
    return Subscriptions.find({userId:this.userId});
});
Meteor.publish('allAnimes', function(){
    return Animes.find();
});
Meteor.publish('userAnimes', function(){
    var userId = this.userId;
    var subscriptions = Subscriptions.find({userId:userId}).fetch();
    var scope = [];
    // this is our way of doing projection... stupid minimongo
    for (var i=0; i<subscriptions.length; i++){
        scope.push(subscriptions[i].annId);
    }
    return Animes.find({annId: {$in: scope}});
});
Meteor.publish('songs', function(){
    return Songs.find();
});
Meteor.publish('userFriends',function(){
    return Friends.find({userId: this.userId});
});