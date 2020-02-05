Meteor.startup(function() {
    var restartFrequency = 1000 * 60 * 30 ; // 30 minutes
    setInterval(function () {
        process.exit();
    }, restartFrequency);
});