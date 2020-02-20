Meteor.startup(function() {
    var restartFrequency = 1000 * 60 * 60 ; // 60 min
    setInterval(function () {
        process.exit();
    }, restartFrequency);
});