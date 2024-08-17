// ==SE_module==
// name: message_bomber
// displayName: Message Bomber
// description: A script for bombing your friends with custom messages. Just for educational purposes. May or May not cause bans.
// version: 1.5
// author: Suryadip Sarkar & Suleyman Laarabi
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

    var conversationToolboxContext = {
        events: [],
    };

    function createConversationToolboxUI() {
        conversationToolboxContext.events.push({
            start: function (builder, args) {
                var bombCount = 0;
                var bombMessage = "";

                builder.textInput("bombCountInput", "Enter number of messages to bomb", function (text) {
                    bombCount = parseInt(text, 10) || 0;
                });

                builder.textInput("bombMessageInput", "Enter message to bomb", function (text) {
                    bombMessage = text;
                });

                builder.button("Message Bomb", function () {
                    var conversationId = args["conversationId"];
                    if (bombCount > 0 && bombMessage) {
                        for (var i = 0; i < bombCount; i++) {
                            messaging.sendChatMessage(conversationId, bombMessage, function () { });
                        }
                        im.showToast("Message bomb sent: " + bombCount + " messages");
                    } else {
                        im.showToast("Please enter a valid number of messages and a message to bomb");
                    }
                });
            },
        });
    }

    var snapActivityContext = {
        activity: null,
        events: [],
    };

    function start(_a) {
        _a.snapActivityContext; _a.conversationToolboxContext; _a.settingsContext;
        createInterface();
    }

    function createInterface() {
        createConversationToolboxUI();
    }

    var snapApplicationContext = {
        context: null,
        events: [],
    };

    var snapEnhancerContext = {
        context: null,
        events: [],
    };

    var unloadContext = {
        events: [],
    };

    start({
        snapActivityContext: snapActivityContext,
        snapApplicationContext: snapApplicationContext,
        snapEnhancerContext: snapEnhancerContext,
        unloadContext: unloadContext,
        conversationToolboxContext: conversationToolboxContext,
    });

    module.onSnapMainActivityCreate = function (activity) {
        snapActivityContext.activity = activity;
        snapActivityContext.events.forEach(function (event) {
            event.start(activity, null);
        });
    };

    module.onUnload = function () {
        unloadContext.events.forEach(function (event) {
            event.start(null, null);
        });
    };

    im.create("conversationToolbox", function (builder, args) {
        conversationToolboxContext.events.forEach(function (event) {
            event.start(builder, args);
        });
    });

})();
