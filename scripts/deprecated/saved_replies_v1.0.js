// ==SE_module==
// name: saved_replies
// displayName: Saved Replies
// description: A Script That Allows Users to Save and Send Custom Replies
// version: 1.0
// author: Suryadip Sarkar
// ==/SE_module==

(function () {
  'use strict';

  var im = require("interface-manager");
  var messaging = require("messaging");
  var config = require("config");

  var conversationId = null;
  var newReplyText = "";

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
    if (typeof messaging.sendChatMessage === "function") {
      messaging.sendChatMessage(conversationId, message, function (error) {
        if (error) {
          displayMessage("Error sending message: " + JSON.stringify(error));
        } else {
          displayMessage("Message sent successfully");
        }
      });
    } else {
      displayMessage("Error: messaging.sendChatMessage is not a function");
    }
  }

  function getSavedReplies() {
    return JSON.parse(config.get("savedReplies", "[]"));
  }

  function setSavedReplies(replies) {
    config.set("savedReplies", JSON.stringify(replies), true);
  }

  function addSavedReply(reply) {
    var replies = getSavedReplies();
    replies.push(reply);
    setSavedReplies(replies);
    displayMessage("Reply added: " + reply);
    updateUI();
  }

  function deleteSavedReply(index) {
    var replies = getSavedReplies();
    replies.splice(index, 1);
    setSavedReplies(replies);
    displayMessage("Reply deleted");
    updateUI();
  }

  function updateUI() {
    im.update("conversationToolbox");
  }

  function createConversationToolboxUI() {
    im.create("conversationToolbox", function (builder, args) {
      try {
        conversationId = args["conversationId"];

        builder.textInput("Enter a new saved reply", "", function (value) {
          newReplyText = value;
        }).singleLine(true);

        builder.button("Add", function() {
          if (newReplyText && newReplyText.trim() !== "") {
            addSavedReply(newReplyText);
            newReplyText = "";
          } else {
            displayMessage("Please enter a reply");
          }
        });

        getSavedReplies().forEach(function(reply, index) {
          builder.text(reply);
          builder.row(function(rowBuilder) {
            rowBuilder.button("Send", function() {
              sendMessage(conversationId, reply);
            });
            rowBuilder.button("Delete", function() {
              deleteSavedReply(index);
            });
          });
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