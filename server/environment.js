Meteor.startup(function(){
    console.log("Hello Anigiri!");

    //startCronJob();
});

// publications
Meteor.publish('subscriptions', function(){
    return Subscriptions.find({userId:this.userId});
});

function startCronJob() {
    var job = new Cron.Job(new Cron.Spec('*/2 * * * * *'), function(){
        console.log(new Date());
    });
    var cron = new Cron();
    cron.start();
    cron.add(job);
}