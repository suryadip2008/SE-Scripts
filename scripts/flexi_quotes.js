// ==SE_module==
// name: flexi_quotes
// displayName: FlexiQuote: Customizable Motivation
// description: A script that shows customizable motivation quotes on Snapchat startup, with options for dialog or toast notifications.
// version: 4.0
// author: Suryadip Sarkar & Jacob Thomas
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

function getCurrentTime() {
        return new Date().getTime();
    }

function shouldShowToast() {
    var currentTime = getCurrentTime();
    var nextToastTime = config.getLong("nextToastTime", 0); 

    if (currentTime >= nextToastTime || nextToastTime === 0) {
        var oneDayInMillis = 24 * 60 * 60 * 1000;
        config.setLong("nextToastTime", currentTime + oneDayInMillis, true);
        return true;
    }
        return false;
}

function showStartupToast() {
    if (shouldShowToast()) {
        shortToast("Made by Suryadip Sarkar");
    }
}

var quotes = [
    "Believe you can and you're halfway there.",
    "Don't watch the clock; do what it does. Keep going.",
    "You are never too old to set another goal or to dream a new dream.",
    "It always seems impossible until it's done.",
    "Keep your face always toward the sunshine—and shadows will fall behind you.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "The only limit to our realization of tomorrow is our doubts of today.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "The only way to do great work is to love what you do.",
    "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.",
    "Act as if what you do makes a difference. It does.",
    "Success is not how high you have climbed, but how you make a positive difference to the world.",
    "Your time is limited, don't waste it living someone else's life.",
    "The best way to predict the future is to create it.",
    "You are enough just as you are.",
    "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
    "Start where you are. Use what you have. Do what you can.",
    "Your life does not get better by chance, it gets better by change.",
    "Do not wait to strike till the iron is hot; but make it hot by striking.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Dream big and dare to fail.",
    "What you get by achieving your goals is not as important as what you become by achieving your goals.",
    "The purpose of our lives is to be happy.",
    "Don't let yesterday take up too much of today.",
    "Life is what happens when you're busy making other plans.",
    "You only live once, but if you do it right, once is enough.",
    "Never let the fear of striking out keep you from playing the game.",
    "Money and success don't change people; they merely amplify what is already there.",
    "Not how long, but how well you have lived is the main thing.",
    "If life were predictable it would cease to be life, and be without flavor.",
    "The whole secret of a successful life is to find out what is one's destiny to do, and then do it.",
    "In order to write about life first you must live it.",
    "The big lesson in life, baby, is never be scared of anyone or anything.",
    "Sing like no one's listening, love like you've never been hurt, dance like nobody's watching, and live like it's heaven on earth.",
    "Curiosity about life in all of its aspects, I think, is still the secret of great creative people.",
    "Life is not a problem to be solved, but a reality to be experienced.",
    "The unexamined life is not worth living.",
    "Turn your wounds into wisdom.",
    "The way I see it, if you want the rainbow, you gotta put up with the rain.",
    "Do all the good you can, for all the people you can, in all the ways you can, as long as you can.",
    "Don't settle for what life gives you; make life better and build something.",
    "Everything negative – pressure, challenges – is all an opportunity for me to rise.",
    "I like criticism. It makes you strong.",
    "You never really learn much from hearing yourself speak.",
    "Life imposes things on you that you can’t control, but you still have the choice of how you’re going to live through this.",
    "Life is never easy. There is work to be done and obligations to be met – obligations to truth, to justice, and to liberty.",
    "Live for each second without hesitation.",
    "Life is like riding a bicycle. To keep your balance, you must keep moving.",
    "Life is really simple, but men insist on making it complicated.",
    "Life is a succession of lessons which must be lived to be understood.",
    "My mama always said, life is like a box of chocolates. You never know what you're gonna get.",
    "Watch your thoughts; they become words. Watch your words; they become actions. Watch your actions; they become habits. Watch your habits; they become character. Watch your character; it becomes your destiny.",
    "When we do the best we can, we never know what miracle is wrought in our life or the life of another.",
    "The healthiest response to life is joy.",
    "Life is short, and it's up to you to make it sweet.",
    "Maybe that's what life is... a wink of the eye and winking stars.",
    "Life is ten percent what happens to you and ninety percent how you respond to it.",
    "Keep smiling, because life is a beautiful thing and there's so much to smile about.",
    "Health is the greatest gift, contentment the greatest wealth, faithfulness the best relationship.",
    "You have within you right now, everything you need to deal with whatever the world can throw at you.",
    "Believe that life is worth living and your belief will help create the fact.",
    "The only impossible journey is the one you never begin.",
    "In the long run, the sharpest weapon of all is a kind and gentle spirit.",
    "You cannot control everything that happens to you; you can only control the way you respond to what happens. In your response is your power.",
    "Our lives begin to end the day we become silent about things that matter.",
    "In three words I can sum up everything I've learned about life: It goes on.",
    "It is our choices that show what we truly are, far more than our abilities.",
    "Challenges are what make life interesting and overcoming them is what makes life meaningful.",
    "The best way to get started is to quit talking and begin doing.",
    "Don't let what you cannot do interfere with what you can do.",
    "Dream as if you'll live forever, live as if you'll die today.",
    "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    "Life is either a daring adventure or nothing at all.",
    "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.",
    "Do not go where the path may lead, go instead where there is no path and leave a trail.",
    "Life shrinks or expands in proportion to one's courage.",
    "You must be the change you wish to see in the world.",
    "The best revenge is massive success.",
    "Good friends, good books, and a sleepy conscience: this is the ideal life.",
    "Life would be tragic if it weren't funny.",
    "Live in the sunshine, swim the sea, drink the wild air.",
    "Do not let making a living prevent you from making a life.",
    "Life is a flower of which love is the honey.",
    "Keep your eyes on the stars and your feet on the ground.",
    "The only way to have a friend is to be one.",
    "It is not length of life, but depth of life.",
    "Life is made of ever so many partings welded together.",
    "Life's tragedy is that we get old too soon and wise too late.",
    "Dost thou love life? Then do not squander time, for that is the stuff life is made of.",
    "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.",
    "Life is trying things to see if they work.",
    "Life is what we make it, always has been, always will be.",
    "Life is a mirror and will reflect back to the thinker what he thinks into it.",
    "Life is too important to be taken seriously.",
    "Life is a journey that must be traveled no matter how bad the roads and accommodations.",
    "The longer I live, the more I realize the impact of attitude on life.",
    "In the end, it's not the years in your life that count. It's the life in your years.",
    "Life doesn't require that we be the best, only that we try our best.",
    "To live is the rarest thing in the world. Most people exist, that is all.",
    "A life spent making mistakes is not only more honorable but more useful than a life spent doing nothing.",
    "The chief danger in life is that you may take too many precautions.",
    "Life is an opportunity, benefit from it. Life is beauty, admire it. Life is a dream, realize it.",
    "The biggest adventure you can take is to live the life of your dreams.",
    "When you cease to dream you cease to live.",
    "Live your life and forget your age.",
    "To succeed in life, you need three things: a wishbone, a backbone, and a funny bone.",
    "Life is not measured by the number of breaths we take, but by the moments that take our breath away.",
    "May you live every day of your life.",
    "Don't count the days, make the days count.",
    "Life is too short to be anything but happy.",
    "Life is not about waiting for the storm to pass but learning to dance in the rain.",
    "The purpose of life is a life of purpose.",
    "Life is like photography. You need the negatives to develop.",
    "The best revenge is living well.",
    "Life is about making an impact, not making an income.",
    "Life is short, make it sweet.",
    "An unexamined life is not worth living.",
    "I've never met a strong person with an easy past.",
    "God gives his toughest battles to his strongest soldiers.",
    "Actions always prove why words means nothing.",
    "In the end, we only regret the chances we didn't take.",
    "Shoutout to people whose kindness isn't a strategy but a way of life.",
    "You get tested the most when it's time for you to elevate. Don't break.",
    "Close your heart, open your mind.",
    "This comeback is personal, it's an apology to myself.",
    "Late nights. Early mornings. This is how you win.",
    "You secretly hate me, I openly don't care",
    "Before you talk about me, talk to me",
    "Never share your secrets to anyone",
    "Real is Rare, Fake is Everywhere",
    "Be Private, Be Alone. Grow In Silence",
    "The only way some people will learn to appreciate you is by losing you",
    "Being alone has a power. That very few people can handle it.",
];

var defaultColor = "#4CAF50";

function getRandomQuote() {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

function sendChatMessage(conversationId, message, callback) {
    messaging.sendChatMessage(conversationId, message, callback);
}

function createConversationToolboxUI() {
    im.create("conversationToolbox", function (builder, args) {
        try {
            var conversationId = args["conversationId"];

            builder.row(function (builder) {
                builder.button("Send Motivation Quote", function () {
                    var randomQuote = getRandomQuote();
                    sendChatMessage(conversationId, randomQuote, function () {
                        builder.root().activity.runOnUiThread(javaInterfaces.runnable(() => {
                            longToast("Motivation quote sent!");
                        }));
                    });
                });
            })
            .arrangement("spaceBetween")
            .fillMaxWidth()
            .padding(4);

        } catch (error) {
            console.error("Error in createConversationToolboxUI: " + JSON.stringify(error));
        }
    });
}

function createManagerToolBoxUI() {
    settingsContext.events.push({
        start: function (builder) {
            builder.row(function (builder) {
                builder.text("Random Quotes are enabled.");
            });

            var fontSizes = [12, 16, 20, 24, 28, 32, 36];
            var oldSelectedFontSize = config.getInteger("fontSize", 20);
            builder.row(function (builder) {
                var text = builder.text("Font Size: " + oldSelectedFontSize);
                builder.slider(0, fontSizes.length - 1, fontSizes.length - 1, fontSizes.indexOf(oldSelectedFontSize), function (value) {
                    var fontSize = fontSizes[value];
                    text.label("Font Size: " + fontSize);
                    config.setInteger("fontSize", fontSize, true);
                });
            });

            builder.row(function (builder) {
                builder.textInput("Enter Custom Color (hex)", config.get("customColor", defaultColor), function (value) {
                    var trimmedValue = value.trim();
                    if (trimmedValue === "") {
                        config.set("customColor", defaultColor, true);
                    } else {
                        config.set("customColor", trimmedValue, true);
                    }
                }).maxLines(1)
                  .singleLine(true);
            });

            builder.row(function (builder) {
                builder.button("Test Hex Codes", function () {
                    testHexCode();
                });
            });

            builder.row(function (builder) {
                var text = builder.text("Notification Type: " + (config.getBoolean("useToast", false) ? "Toast" : "Dialog"));
                builder.slider(0, 1, 1, config.getBoolean("useToast", false) ? 1 : 0, function (value) {
                    var useToast = value === 1;
                    text.label("Notification Type: " + (useToast ? "Toast" : "Dialog"));
                    config.setBoolean("useToast", useToast, true);
                });
            });
        },
    });
}

function testHexCode() {
    const customColor = config.get("customColor", defaultColor);

    if (isValidHex(customColor)) {
        longToast("Entered HEX Code is valid!");
    } else {
        longToast("Entered HEX Code is invalid!");
    }
}

function hexToColor(hex) {
    if (!isValidHex(hex)) {
        return null;
    }
    return parseInt('FF' + hex.substring(1), 16);
}

function isValidHex(hex) {
    return /^#([0-9A-Fa-f]{6})$/.test(hex);
}

module.onSnapMainActivityCreate = activity => {
    showStartupToast();
    var randomQuote = getRandomQuote();
    var fontSize = config.getInteger("fontSize", 20);
    var customColor = config.get("customColor", defaultColor);
    var colorInt = hexToColor(customColor);
    var useToast = config.getBoolean("useToast", false);

    if (colorInt === null) {
        longToast("Incorrect hex code. Please try again.");
        colorInt = hexToColor(defaultColor);
    } else if (customColor.trim() === "") {
        colorInt = hexToColor(defaultColor);
    }

    activity.runOnUiThread(javaInterfaces.runnable(() => {
        if (useToast) {
            longToast(randomQuote);
        } else {
            var myDialog = im.createAlertDialog(activity, (builder, dialog) => {
                builder.text(randomQuote)
                       .fontSize(fontSize)
                       .color(colorInt);
            });
            myDialog.show();
        }
    }));
};

function start() {
    createManagerToolBoxUI();
    createConversationToolboxUI();
}

start();

im.create("settings" /* EnumUI.SETTINGS */, function (builder, args) {
    settingsContext.events.forEach(function (event) {
        event.start(builder, args);
    });
});
