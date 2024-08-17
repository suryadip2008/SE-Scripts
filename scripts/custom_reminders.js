// ==SE_module==
// name: custom_reminders
// displayName: Custom Reminders with Custom Messages
// description: A Script that shows custom reminders with countdowns based on specified dates.
// version: 1.0
// author: Suryadip Sarkar
// ==/SE_module==

var networking = require("networking");
var messaging = require("messaging");
var config = require("config");
var im = require("interface-manager");
var ipc = require("ipc");
var javaInterfaces = require("java-interfaces");
var hooker = require("hooker");
var events = require("events");

var settingsContext = {
    events: [],
};


function displayCustomToast() {
    const customMessage = String(config.get("customMessage", ""));
    const countdownDate = String(config.get("countdownDate", ""));
    
    if (customMessage && countdownDate) {
        const { daysUntil } = getDaysUntil(countdownDate);
        if (daysUntil !== null) {
            var eventPhrase = getEventPhrase(daysUntil);
            var message = `${customMessage} ${daysUntil} days ${eventPhrase}!`;
            longToast(message);
        } else {
            longToast("Invalid countdown date. Please check your settings.");
        }
    } else {
        longToast("Please set both custom message and countdown date in settings.");
    }
}


function getEventPhrase(days) {
    if (days <= 7) {
        return "until the big day";
    } else if (days <= 30) {
        return "and counting";
    } else if (days <= 90) {
        return "until the excitement begins";
    } else {
        return "until the adventure unfolds";
    }
}


function getDaysUntil(dateString) {
    try {
        var [day, month, year] = dateString.split('/').map(Number);
        var now = new Date();
        var targetDate = new Date(year, month - 1, day);
        
        if (isNaN(targetDate.getTime())) {
            return { daysUntil: null };
        }
        
        var timeDiff = targetDate.getTime() - now.getTime();
        var daysUntil = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return { daysUntil };
    } catch (error) {
        console.error("Error calculating days until:", error);
        return { daysUntil: null };
    }
}


function createManagerToolBoxUI() {
    settingsContext.events.push({
        start: function (builder) {
            builder.row(function (builder) {
                builder.textInput("Enter Custom Message", config.get("customMessage", ""), function (value) {
                    config.set("customMessage", value.trim(), true);
                }).maxLines(1)
                  .singleLine(true);
            });

            builder.row(function (builder) {
                builder.textInput("Enter Countdown Date (dd/mm/yyyy)", config.get("countdownDate", ""), function (value) {
                    config.set("countdownDate", value.trim(), true);
                }).maxLines(1)
                  .singleLine(true);
            });

            
            builder.row(function (builder) {
                builder.button("Test Custom Reminder", function () {
                    displayCustomToast();
                });
            });
        },
    });
}


module.onSnapMainActivityCreate = activity => {
    displayCustomToast();
};


function createInterface() {
    createManagerToolBoxUI();
}


function start(_) {
    createInterface();
}

start();


im.create("settings" /* EnumUI.SETTINGS */, function (builder, args) {
    settingsContext.events.forEach(function (event) {
        event.start(builder, args);
    });
});
