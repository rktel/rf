Meteor.startup(function() {
    var restartFrequency = 1000 * 60 * 20 ; // 20 min
    setInterval(function () {
        process.exit();
    }, restartFrequency);
});