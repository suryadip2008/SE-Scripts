// ==SE_module==
// name: daily_news
// displayName: Daily News
// description: A script that shows daily news as a dialog on Snapchat startup.
// version: 1.0
// author: Suryadip Sarkar
// ==/SE_module==

var networking = require("networking");
var im = require("interface-manager");
var config = require("config");

var newsJsonUrl = "https://raw.githubusercontent.com/suryadip2008/SE-Scripts/main/networking/news.json";

function showNewsDialog(activity, headline) {
    activity.runOnUiThread(() => {
        var myDialog = im.createAlertDialog(activity, (builder, dialog) => {
            builder.text(headline).fontSize(18);
        });
        myDialog.show();
    });
}

function fetchAndShowNews(activity) {
    networking.getUrl(newsJsonUrl, (error, response) => {
        if (error) {
            console.error("Error fetching news.json:", error);
            return;
        }
        try {
            var newsData = JSON.parse(response);
            var headlines = newsData.headlines;
            var unreadHeadlines = [];

            for (var i = 0; i < headlines.length; i++) {
                if (!config.getBoolean(`headline_${i}`, false)) {
                    unreadHeadlines.push(headlines[i]);
                }
            }

            if (unreadHeadlines.length > 0) {
                var randomIndex = Math.floor(Math.random() * unreadHeadlines.length);
                var selectedHeadline = unreadHeadlines[randomIndex];

                var originalIndex = headlines.indexOf(selectedHeadline);

                showNewsDialog(activity, selectedHeadline);

                config.setBoolean(`headline_${originalIndex}`, true);
                config.save();
            } else {
                console.log("All headlines have been read.");
            }
        } catch (e) {
            console.error("Error parsing news.json:", e);
        }
    });
}

module.onSnapMainActivityCreate = activity => {
    fetchAndShowNews(activity);
};
