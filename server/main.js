Meteor.startup(function() {
    var restartFrequency = 1000 * 60 * 60 * 6 ; // 6 horas
    setInterval(function () {
        process.exit();
    }, restartFrequency);
});