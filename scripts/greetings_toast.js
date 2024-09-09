// ==SE_module==
// name: greetings_toast
// displayName: Greetings Toast
// description: A Script that shows a greetings toast on the startup of Snapchat. Enter your username and event date in the format: username dd/mm/yyyy Note: Avoid including your full name as the toast will not work properly. Eg: Suryadip 20/01/1900. 
// version: 4.0
// author: Suryadip Sarkar
// credits: Gabriel Modz & Jacob Thomas & Jimothy & Bard
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

const defaultLanguage = "en";
const languages = {
    "en": "English",
    "pt": "Portuguese",
    "pa": "Punjabi",
    "fr": "French",
    "de": "German",
    "ru": "Russian",
    "ar": "Arabic"
};

const defaultEvent = "birthday";
const eventsList = {
    "birthday": "Birthday",
    "anniversary": "Anniversary",
    "graduation": "Graduation",
    "promotion": "Promotion"
};

const tones = ["Formal", "Informal", "Humorous"];
const defaultTone = "Informal";

function createManagerToolBoxUI() {
    settingsContext.events.push({
        start: function (builder) {
            builder.row(function (builder) {
                builder.textInput("Enter your username and event date (username dd/mm/yyyy)", config.get("userInput", ""), function (value) {
                    config.set("userInput", value, true);
                }).maxLines(1)
                  .singleLine(true);
            });

            var currentTone = config.get("tone", defaultTone);
            builder.row(function (builder) {
                var text = builder.text("Tone: " + currentTone);
                builder.slider(0, tones.length - 1, 1, tones.indexOf(currentTone), function (value) {
                    var tone = tones[value];
                    text.label("Tone: " + tone);
                    config.set("tone", tone, true);
                });
            });

            var languageKeys = Object.keys(languages);
            var selectedLanguageIndex = languageKeys.indexOf(config.get("language", defaultLanguage));
            builder.row(function (builder) {
                var text = builder.text("Language: " + languages[languageKeys[selectedLanguageIndex]]);
                builder.slider(0, languageKeys.length - 1, languageKeys.length - 1, selectedLanguageIndex, function (value) {
                    var selectedLanguage = languageKeys[value];
                    text.label("Language: " + languages[selectedLanguage]);
                    config.set("language", selectedLanguage, true);
                });
            });

            var eventKeys = Object.keys(eventsList);
            var selectedEventIndex = eventKeys.indexOf(config.get("event", defaultEvent));
            builder.row(function (builder) {
                var text = builder.text("Event: " + eventsList[eventKeys[selectedEventIndex]]);
                builder.slider(0, eventKeys.length - 1, eventKeys.length - 1, selectedEventIndex, function (value) {
                    var selectedEvent = eventKeys[value];
                    text.label("Event: " + eventsList[selectedEvent]);
                    config.set("event", selectedEvent, true);
                });
            });

            builder.row(function (builder) {
                builder.button("Test Greetings Toast", function () {
                    testGreetingsToast();
                });
            });
        },
    });
}

function getCurrentDateTime() {
    var now = new Date();
    var day = String(now.getDate()).padStart(2, '0');
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var year = now.getFullYear();
    var hours = now.getHours();
    return { day, month, year, hours };
}

function getAge(birthday) {
    var today = new Date();
    var birthDate = new Date(birthday.split('/').reverse().join('-'));
    var age = today.getFullYear() - birthDate.getFullYear();
    var monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function isValidDateFormat(dateString) {
    var dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/;
    if (!dateRegex.test(dateString)) {
        return false;
    }

    var parts = dateString.split('/');
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1;
    var year = parseInt(parts[2], 10);
    var date = new Date(year, month, day);
    return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year;
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function testGreetingsToast() {
    const userInput = String(config.get("userInput"));
    if (!userInput) {
        longToast("Please enter your username and event date first.");
        return;
    }

    var [username, userEventDate] = userInput.split(' ');
    if (!username || !userEventDate) {
        longToast("Invalid input format. Please use 'username dd/mm/yyyy'.");
        return;
    }

    if (!isValidDateFormat(userEventDate)) {
        longToast("Invalid date format. Please use dd/mm/yyyy.");
        return;
    }

    displayToast();
}

function displayToast() {
    const userInput = String(config.get("userInput"));
    const { day, month, hours } = getCurrentDateTime();
    const tone = config.get("tone", defaultTone);
    const selectedLanguage = config.get("language", defaultLanguage);
    const selectedEvent = config.get("event", defaultEvent);

    var [username, userEventDate] = userInput.split(' ');
    var [eDay, eMonth] = userEventDate.split('/');

    var greetingsUrl;
    if (day === eDay && month === eMonth) {
        greetingsUrl = `https://raw.githubusercontent.com/suryadip2008/SE-Scripts/main/networking/greetings_toast/${selectedEvent}_${selectedLanguage}.json`;
    } else {
        var timeOfDay;
        if (hours < 12) {
            timeOfDay = "good_morning";
        } else if (hours < 18) {
            timeOfDay = "good_afternoon";
        } else {
            timeOfDay = "good_evening";
        }

        var toneAbr;
        if (tone === "Formal") {
            toneAbr = "fl";
        } else if (tone === "Informal") {
            toneAbr = "il";
        } else {
            toneAbr = "hs";
        }
        greetingsUrl = `https://raw.githubusercontent.com/suryadip2008/SE-Scripts/main/networking/greetings_toast/${timeOfDay}_${toneAbr}_${selectedLanguage}.json`;
    }

    networking.getUrl(greetingsUrl, (error, response) => {
        if (error) {
            console.error("Error fetching greetings:", error);
            longToast("Error fetching greetings. Please check your internet connection.");
            return;
        }

        try {
            var greetingsData = JSON.parse(response);
            var randomGreeting = getRandomElement(greetingsData); // Select a random greeting here

            var predefinedPrompt = randomGreeting.replace('{username}', username);

            if (day === eDay && month === eMonth && selectedEvent === "birthday") {
                var age = getAge(userEventDate);
                predefinedPrompt += ` You are ${age} years old today!`;
            }

            longToast(predefinedPrompt); 

        } catch (e) {
            console.error("Error parsing greetings.json:", e);
            longToast("Error parsing greetings data.");
        }
    });
}


module.onSnapMainActivityCreate = activity => {
    testGreetingsToast();
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
