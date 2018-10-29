const PublicGoogleCalendar = require('../public-google-calendar.js');
const moment = require('moment');

module.exports = {
    enabled: true,
    run: function(config, client, db) {
        const calendar = new PublicGoogleCalendar({calendarId: config.calendarID});

        function updateCalendar() {
            console.log("Checking calendar for updates...");
        
            var startDate = new Date();
            startDate.setDate(startDate.getDate() - 1);
            var endDate = new Date();
            endDate.setDate(endDate.getDate() + 1);
        
            calendar.getEvents({startDate: startDate.getTime(), endDate: endDate.getTime()}, function(err, events) {
                if (err) { return console.log(err.message); }
        
                var foundEvent = false;
                events.forEach(event => {
                    if (foundEvent) { return; }
        
                    var curTime = Date.now();
                    var startTime = Date.parse(event.start);
                    if (typeof event.start == "object") {
                        startTime = event.start.getTime();
                    }

                    var endTime = Date.parse(event.end);
                    if (typeof event.end == "object") {
                        endTime = event.end.getTime();
                    }

                    if (curTime >= startTime && curTime <= endTime) {
                        var activityStr = event.summary;
        
                        var startTimeStr = moment(startTime).format("h:mm a");
                        var endTimeStr = moment(endTime).format("h:mm a");
                        activityStr +=  " | " + startTimeStr + " - " + endTimeStr;
        
                        if (event.location != "") {
                            activityStr +=  " @ " + event.location;
                        }
        
                        client.user.setActivity(activityStr, {type: "PLAYING"});
                        foundEvent = true;
                        return;
                    }
                });
        
                if (!foundEvent) {
                    client.user.setActivity("No events currently running", {type: "PLAYING"});
                }
        
                console.log("Finished checking calendar for updates");
            });
        }

        updateCalendar();
        setInterval(updateCalendar, config.calUpdateFreq);
    }
}