// ==SE_module==
// name: message_bomber
// displayName: Message Bomber
// description: A script for bombing your friends with custom messages. Just for educational purposes. May or may not cause bans.
// version: 3.5
// author: Suryadip Sarkar
// permissions: unsafe-classloader
// ==/SE_module==

var networking = require("networking");
var messaging = require("messaging");
var config = require("config");
var im = require("interface-manager");
var ipc = require("ipc");
var javaInterfaces = require("java-interfaces");
var hooker = require("hooker");
var events = require("events");

(function () {
    'use strict';

    function getCurrentTime() {
        return new Date().getTime();
    }

    function shouldShowToast() {
        var currentTime = getCurrentTime();
        var lastToastTime = config.getLong("lastToastTime", 0);
        var oneDayInMillis = 24 * 60 * 60 * 1000;

        if (currentTime - lastToastTime >= oneDayInMillis) {
            config.setLong("lastToastTime", currentTime, true);
            return true;
        }
        return false;
    }

    function showStartupToast() {
        if (shouldShowToast()) {
            shortToast("Made by Suryadip Sarkar");
        }
    }

    showStartupToast();

    var conversationId = null;
    var bombCount = 0;
    var bombMessage = "";
    var antiBanEnabled = false;
    var antiBanConfigId = "antiBanEnabled";
    var warningDisplayedConfigId = "warningDisplayed";

    function displayMessage(message) {
        console.log(message);
        longToast(message);
    }

    function logActivity(message, count) {
        console.log(`Sending ${count} messages with content: "${message}"`);
    }

    function getRandomizedMessage(originalMessage) {
        const randomString = Math.random().toString(36).substring(2, 5);
        return `${originalMessage} #${randomString}`;
    }

    function backgroundTask(milliseconds) {
        type("java.lang.Thread").newInstance(
            javaInterfaces.runnable(() => {
                try {
                    var okHttpClient = type("okhttp3.OkHttpClient$Builder", true).newInstance()
                        .followRedirects(false)
                        .build();
                    var response = okHttpClient.newCall(type("okhttp3.Request$Builder", true).newInstance().url("https://github.com/").build()).execute();
                } catch (error) {
                }
            })
        ).start();
    }

    function sendBombMessages() {
        logActivity(bombMessage, bombCount);

        var warningDisplayed = config.getBoolean(warningDisplayedConfigId, false);

        if (!warningDisplayed && bombCount > 20 && antiBanEnabled) {
            displayMessage("Warning: Sending a large number of messages may lead to account restrictions. Proceed with caution.");
            config.setBoolean(warningDisplayedConfigId, true, true);
        }

        for (var i = 0; i < bombCount; i++) {
            var variedMessage = antiBanEnabled
                ? getRandomizedMessage(bombMessage)
                : bombMessage;

            messaging.sendChatMessage(conversationId, variedMessage, function () {});

            if (antiBanEnabled) {
                var randomDelay = Math.floor(Math.random() * 4000) + 1000;
                backgroundTask(randomDelay);
            }
        }

        displayMessage("Message bomb sent: " + bombCount + " messages");
    }

    function createConversationToolboxUI() {
        im.create("conversationToolbox", function (builder, args) {
            try {
                conversationId = args["conversationId"];

                builder.textInput("Enter the number of messages to bomb with", "", function (value) {
                    bombCount = parseInt(value, 10) || 0;
                }).singleLine(true);

                builder.textInput("Enter message to bomb", "", function (value) {
                    bombMessage = value;
                }).singleLine(true);

                builder.row(function (builder) {
                    builder.text("Enable Anti-ban");
                    builder.switch(antiBanEnabled, function (value) {
                        antiBanEnabled = value;
                        config.setBoolean(antiBanConfigId, value, true);
                    });
                })
                .arrangement("spaceBetween")
                .fillMaxWidth()
                .padding(4);

                builder.button("💥 Message Bomb", function () {
                    if (bombCount > 0 && bombMessage) {
                        sendBombMessages();
                    } else {
                        displayMessage("Please enter a valid number of messages and a message to bomb");
                    }
                });
            } catch (error) {
                console.error("Error in createConversationToolboxUI: " + JSON.stringify(error));
            }
        });
    }

    function getIfAntiBanEnabled() {
        return config.getBoolean(antiBanConfigId, false);
    }

    function initializeWarningDisplayed() {
        config.setBoolean(warningDisplayedConfigId, false, true);
    }

    function start() {
        antiBanEnabled = getIfAntiBanEnabled();
        initializeWarningDisplayed();
        createConversationToolboxUI();
    }

    start();
})();
