// ==SE_module==
// name: scheduled_messages
// displayName: Scheduled Messages
// description: A Script That Allows For Scheduling Messages. Please don't remove Snapchat from the background when your message is scheduled.
// version: 1.0
// author: Suryadip Sarkar
// credits: rhunk & Jacob Thomas
// minSEVersion: Versions after 20/08/24
// ==/SE_module==

var messaging = require("messaging");
var im = require("interface-manager");
var config = require("config");

(function () {
  'use strict';

  var inputMessage = "";
  var customScheduleTime = "";
  var conversationId = null;

  function displayMessage(message) {
    console.log(message);
    if (typeof shortToast === "function") {
      shortToast(message);
    } else {
      console.warn("shortToast is not available. Message:", message);
    }
  }

  function sendMessage(conversationId, message) {
    displayMessage("Attempting to send message: " + message);

    if (typeof messaging.sendChatMessage !== "function") {
      displayMessage("Error: messaging.sendChatMessage is not a function");
      return;
    }

    try {
      messaging.sendChatMessage(conversationId, message, function (error) {
        if (error) {
          displayMessage("Error sending message: " + JSON.stringify(error));
        } else {
          displayMessage("Message sent successfully");
        }
      });
    } catch (error) {
      displayMessage("Unexpected error in sendMessage: " + JSON.stringify(error));
    }
  }

  function scheduleMessage(message, durationInMs) {
    displayMessage("Message scheduled. Will be sent in " + (durationInMs / 1000) + " seconds...");

    setTimeout(function() {
      sendMessage(conversationId, message);
    }, durationInMs);
  }

  function scheduleCustomMessage(message, dateTimeString) {
    var parts = dateTimeString.split(" ");
    if (parts.length !== 5) {
      displayMessage("Invalid date/time format. Please use 'DD M YYYY HH MM'");
      return;
    }

    var targetDate = new Date(parts[2], parts[1] - 1, parts[0], parts[3], parts[4]);
    var now = new Date();
    var timeUntilSend = targetDate.getTime() - now.getTime();

    if (timeUntilSend <= 0) {
      displayMessage("The specified time is in the past. Please choose a future time.");
      return;
    }

    displayMessage("Message scheduled for " + targetDate.toString());
    setTimeout(function() {
      sendMessage(conversationId, message);
    }, timeUntilSend);
  }

  function createConversationToolboxUI() {
    im.create("conversationToolbox", function (builder, args) {
      conversationId = args["conversationId"];

      builder.textInput("Enter your message", "", function (value) {
        inputMessage = value;
      }).singleLine(true);

      builder.row(function(rowBuilder) {
        rowBuilder.button("Schedule (1m) ", function() {
          if (inputMessage.trim() !== "") {
            scheduleMessage(inputMessage, 60000);
          } else {
            displayMessage("Please enter a message");
          }
        });

        rowBuilder.text(" ");

        rowBuilder.button("Schedule (5m)", function() {
          if (inputMessage.trim() !== "") {
            scheduleMessage(inputMessage, 300000);
          } else {
            displayMessage("Please enter a message");
          }
        });
      });

      builder.row(function(rowBuilder) {
        rowBuilder.button("Schedule (30m)", function() {
          if (inputMessage.trim() !== "") {
            scheduleMessage(inputMessage, 1800000);
          } else {
            displayMessage("Please enter a message");
          }
        });

        rowBuilder.text(" ");

        rowBuilder.button("Schedule (1h)", function() {
          if (inputMessage.trim() !== "") {
            scheduleMessage(inputMessage, 3600000);
          } else {
            displayMessage("Please enter a message");
          }
        });
      });

      builder.textInput("Custom Schedule (DD M YYYY HH MM)", "", function (value) {
        customScheduleTime = value;
      }).singleLine(true);

      builder.button("⏰ Custom Schedule", function() {
        if (inputMessage.trim() !== "" && customScheduleTime.trim() !== "") {
          scheduleCustomMessage(inputMessage, customScheduleTime);
        } else {
          displayMessage("Please enter both a message and a custom schedule time");
        }
      });
    });
  }

  function start() {
    createConversationToolboxUI();
  }

  start();

})();
