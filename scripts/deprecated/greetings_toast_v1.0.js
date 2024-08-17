// ==SE_module==
// name: greetings_toast
// displayName: Greetings Toast
// description: A Script that shows a greetings toast on the startup of Snapchat.
// version: 1.0
// author: Suryadip Sarkar
// credits:Gabriel Modz & Jacob Thomas & Jimothy
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

function createManagerToolBoxUI() {
    settingsContext.events.push({
        start: function (builder) {
            builder.row(function (builder) {
                builder.textInput("Enter your birthday (dd/mm/yyyy)", config.get("userBirthday", ""), function (value) {
                    config.set("userBirthday", value, true);
                }).maxLines(1)
                  .singleLine(true);
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

function displayToast() {
    const userBirthday = String(config.get("userBirthday"));
    const { day, month, hours } = getCurrentDateTime();

    var predefinedPrompt;
    if (hours < 12) {
        predefinedPrompt = "Good Morning!";
    } else if (hours < 18) {
        predefinedPrompt = "Good Afternoon!";
    } else {
        predefinedPrompt = "Good Evening!";
    }

    if (userBirthday) {
        var [bDay, bMonth] = userBirthday.split('/');
        if (day === bDay && month === bMonth) {
            var age = getAge(userBirthday);
            predefinedPrompt = `Happy Birthday! You are ${age} years old today!`;
        }
    }

    longToast(predefinedPrompt);
}

module.onSnapMainActivityCreate = activity => {
    displayToast();
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