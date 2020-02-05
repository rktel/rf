Meteor.startup(function() {
    var restartFrequency = 1000 * 60 * 2 ; // 2 minutes
    setInterval(function () {
        process.exit();
    }, restartFrequency);
});