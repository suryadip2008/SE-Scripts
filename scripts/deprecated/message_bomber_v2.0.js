// ==SE_module==
// name: message_bomber
// displayName: Message Bomber
// description: A script for bombing your friends with custom messages. Just for educational purposes. May or May not cause bans.
// version: 2.0
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

    var conversationId = null;
    var bombCount = 0;
    var bombMessage = "";

    function displayMessage(message) {
        console.log(message);
        if (typeof im.showToast === "function") {
            im.showToast(message);
        } else {
            console.warn("im.showToast is not available. Message:", message);
        }
    }

    function createConversationToolboxUI() {
        im.create("conversationToolbox", function (builder, args) {
            try {
                conversationId = args["conversationId"];

                builder.textInput("Enter no. of messages to bomb with", "", function (value) {
                    bombCount = parseInt(value, 10) || 0;
                }).singleLine(true);

                builder.textInput("Enter message to bomb", "", function (value) {
                    bombMessage = value;
                }).singleLine(true);

                builder.button("💥 Message Bomb", function () {
                    if (bombCount > 0 && bombMessage) {
                        for (var i = 0; i < bombCount; i++) {
                            messaging.sendChatMessage(conversationId, bombMessage, function () { });
                        }
                        displayMessage("Message bomb sent: " + bombCount + " messages");
                    } else {
                        displayMessage("Please enter a valid number of messages and a message to bomb");
                    }
                });
            } catch (error) {
                console.error("Error in createConversationToolboxUI: " + JSON.stringify(error));
            }
        });
    }

    function start() {
        createConversationToolboxUI();
    }

    start();
})();