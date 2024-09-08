// ==SE_module==
// name: daily_news
// displayName: Daily News
// description: A script that shows daily news as a dialog on Snapchat startup.
// version: 1.5
// author: Suryadip Sarkar
// updateUrl: https://raw.githubusercontent.com/suryadip2008/SE-Scripts/main/scripts/daily_news.js
// ==/SE_module==

var networking = require("networking");
var im = require("interface-manager");
var config = require("config");
var goodbyePrompt = "Sorry to see you go :( I hope you liked my script :D";
var hasShownWelcome = "hasShownWelcome";

if (!config.getBoolean(hasShownWelcome, false)) {
    longToast("Thank you for installing my script! Hope you like it :D");
    config.setBoolean(hasShownWelcome, true, true);
}

var owner = "suryadip2008";
var repo = "SE-Scripts";
var scriptName = "daily_news";
var currentVersion = "v1.5";
let updateAvailable = false;

var versionJsonUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/version.json`;
var messagesJsonUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/messages.json`;

function checkForNewVersion() {
    networking.getUrl(versionJsonUrl, (error, response) => {
        if (error) {
            console.error("Error fetching version.json:", error);
            return;
        }
        try {
            var versions = JSON.parse(response);
            var latestVersion = versions[scriptName];
            if (currentVersion !== latestVersion) {
                longToast("A new version of daily news is available! Please refresh the scripts page.");
                updateAvailable = true;
            }
        } catch (e) {
            console.error("Error parsing version.json:", e);
        }
    });
}

function checkForNewMessages() {
    networking.getUrl(messagesJsonUrl, (error, response) => {
        if (error) {
            console.error("Error fetching messages.json:", error);
            return;
        }
        try {
            var messages = JSON.parse(response);
            for (var i = 0; i < messages.length; i++) {
                var message = messages[i];
                var messageId = message.id;
                if (!config.getBoolean(`message_${messageId}`, false)) {
                    longToast(message.text);
                    config.setBoolean(`message_${messageId}`, true);
                    config.save();
                    break;
                }
            }
        } catch (e) {
            console.error("Error parsing messages.json:", e);
        }
    });
}

var defaultFontSize = 18;
var defaultFontColor = "#000000";
var defaultLanguage = "en";
var languages = {
    "en": "English",
    "pt": "Portuguese",
    "pa": "Punjabi",
    "fr": "French",
    "de": "German",
    "ru": "Russian",
    "ar": "Arabic"
};

var settingsContext = {
    events: [],
};

function showNewsDialog(activity, headline, fontSize, fontColor) {
    activity.runOnUiThread(() => {
        var myDialog = im.createAlertDialog(activity, (builder, dialog) => {
            builder.text(headline)
                   .fontSize(fontSize)
                   .color(fontColor);
        });
        myDialog.show();
    });
}

function fetchAndShowNews(activity) {
    var selectedLanguage = config.get("language", defaultLanguage);
    newsJsonUrl = `https://raw.githubusercontent.com/suryadip2008/SE-Scripts/main/networking/news_${selectedLanguage}.json`;

    networking.getUrl(newsJsonUrl, (error, response) => {
        if (error) {
            console.error("Error fetching news_en.json:", error);
            return;
        }
        try {
            var newsData = JSON.parse(response);
            var headlines = newsData.headlines;

            var allRead = true;
            for (var i = 0; i < headlines.length; i++) {
                if (!config.getBoolean(`headline_${headlines[i]}`, false)) {
                    allRead = false;
                    break;
                }
            }

            if (allRead) {
                for (var i = 0; i < headlines.length; i++) {
                    config.delete(`headline_${headlines[i]}`);
                }
                config.save();
            }

            var unreadHeadlines = [];
            for (var i = 0; i < headlines.length; i++) {
                if (!config.getBoolean(`headline_${headlines[i]}`, false)) {
                    unreadHeadlines.push(headlines[i]);
                }
            }

            if (unreadHeadlines.length > 0) {
                var randomIndex = Math.floor(Math.random() * unreadHeadlines.length);
                var selectedHeadline = unreadHeadlines[randomIndex];

                var fontSize = config.getInteger("fontSize", defaultFontSize);
                var fontColor = hexToColor(config.get("fontColor", defaultFontColor));

                showNewsDialog(activity, selectedHeadline, fontSize, fontColor);

                config.setBoolean(`headline_${selectedHeadline}`, true);
                config.save();
            } else {
                console.log("All headlines have been read.");
            }
        } catch (e) {
            console.error("Error parsing news.json:", e);
        }
    });
}

function createManagerToolBoxUI() {
    settingsContext.events.push({
        start: function (builder) {
            builder.row(function (builder) {
                builder.text("Daily News is enabled.");
            });

            var fontSizes = [12, 16, 20, 24, 28, 32, 36];
            var oldSelectedFontSize = config.getInteger("fontSize", defaultFontSize);
            builder.row(function (builder) {
                var text = builder.text("Font Size: " + oldSelectedFontSize);
                builder.slider(0, fontSizes.length - 1, fontSizes.length - 1, fontSizes.indexOf(oldSelectedFontSize), function (value) {
                    var fontSize = fontSizes[value];
                    text.label("Font Size: " + fontSize);
                    config.setInteger("fontSize", fontSize, true);
                });
            });

            builder.row(function (builder) {
                builder.textInput("Enter Custom Font Color (hex)", config.get("fontColor", defaultFontColor), function (value) {
                    var trimmedValue = value.trim();
                    if (trimmedValue === "") {
                        config.set("fontColor", defaultFontColor, true);
                    } else {
                        config.set("fontColor", trimmedValue, true);
                    }
                }).maxLines(1)
                  .singleLine(true);
            });

            builder.row(function (builder) {
                builder.button("Test Hex Codes", function () {
                    testHexCode();
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
        },
    });
}

function isValidHex(hex) {
    return /^#([0-9A-Fa-f]{6})$/.test(hex);
}

function testHexCode() {
    const customColor = config.get("fontColor", defaultFontColor);

    if (isValidHex(customColor)) {
        longToast("Entered HEX Code is valid!");
    } else {
        longToast("Entered HEX Code is invalid!");
    }
}

function hexToColor(hex) {
    if (!isValidHex(hex)) {
        return parseInt('FF' + defaultFontColor.substring(1), 16);
    }
    return parseInt('FF' + hex.substring(1), 16);
}

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

module.onUnload = () => {
    longToast(goodbyePrompt);
    config.setBoolean(hasShownWelcome, false, true);
}

module.onSnapMainActivityCreate = activity => {
    fetchAndShowNews(activity);
    checkForNewVersion();
    checkForNewMessages();
};
