Meteor.startup(function() {
    var restartFrequency = 1000 * 60 * 20 ; // 30 minutes
    setInterval(function () {
        process.exit();
    }, restartFrequency);
});