// ==SE_module==
// name: daily_news
// displayName: Daily News
// description: A script that shows daily news as a dialog on Snapchat startup.
// version: 2.3
// author: ΞTΞRNAL
// updateUrl: https://raw.githubusercontent.com/particle-box/SE-Scripts/main/scripts/daily_news.js
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

var owner = "particle-box";
var repo = "SE-Scripts";
var scriptName = "daily_news";
var currentVersion = "v2.3";
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
var defaultFontColor = "#FFFFFF";
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

var translations = {
    en: {
        today: "Today's News",
        moreScripts: "More Scripts",
        scriptsAvailable: "The below scripts are available for download in the Scripts Repository.",
        scheduledMessages: "1. Scheduled Messages",
        messageBomber: "2. Message Bomber",
        greetingsToast: "3. Greetings Toast",
        flexiQuotes: "4. Flexi Quotes",
        customReminders: "5. Custom Reminders",
        savedReplies: "6. Saved Replies",
        customToast: "7. Custom Toast",
        returnBack: "⬅️ Return",
        moduleInfo: "ℹ️ Module Information:",
        moduleName: "Name:",
        moduleAuthor: "Author:",
        moduleDisplayName: "Display Name:",
        moduleVersion: "Version:",
        moduleDescription: "Description:",
        refresh: "🔄️ Refresh",
        allRead: "✅ All news have been read!",
        nextUpdate: "⌛Please wait for the next news update schedule for the next batch of news.",
        newUpdateAvailable: "📢 A new update is available! Please refresh the scripts page & then click on Update Module.",
        understood: "Understood!" 
    },
    pt: {
        today: "Notícias de hoje",
        moreScripts: "Mais Scripts",
        scriptsAvailable: "Os scripts abaixo estão disponíveis para download no Repositório de Scripts.",
        scheduledMessages: "1. Mensagens Agendadas",
        messageBomber: "2. Bombardeiro de Mensagens",
        greetingsToast: "3. Boas-vindas Toast",
        flexiQuotes: "4. Citações Flexíveis",
        customReminders: "5. Lembretes Personalizados",
        savedReplies: "6. Respostas Salvas",
        customToast: "7. Toast Personalizado",
        returnBack: "⬅️ Voltar",
        moduleInfo: "ℹ️ Informações do Módulo:",
        moduleName: "Nome:",
        moduleAuthor: "Autor:",
        moduleDisplayName: "Nome de Exibição:",
        moduleVersion: "Versão:",
        moduleDescription: "Descrição:",
        refresh: "🔄️ Atualizar",
        allRead: "✅ Todas as notícias foram lidas!",
        nextUpdate: "⌛Por favor, aguarde o próximo cronograma de atualização de notícias para o próximo lote de notícias.",
        newUpdateAvailable: "📢 Uma nova atualização está disponível! Atualize a página de scripts e clique em Atualizar Módulo.",
        understood: "Entendi!"
    },
    pa: {
        today: "ਅੱਜ ਦੀ ਖਬਰ",
        moreScripts: "ਹੋਰ ਸਕ੍ਰਿਪਟਾਂ",
        scriptsAvailable: "ਹੇਠਾਂ ਦਿੱਤੇ ਸਕ੍ਰਿਪਟ ਸਕ੍ਰਿਪਟ ਰਿਪੋਜ਼ਟਰੀ ਵਿੱਚ ਡਾਊਨਲੋਡ ਲਈ ਉਪਲਬਧ ਹਨ।",
        scheduledMessages: "1. ਤਹਿ ਕੀਤੇ ਸੁਨੇਹੇ",
        messageBomber: "2. ਸੁਨੇਹਾ ਬੰਬਾਰ",
        greetingsToast: "3. ਸ਼ੁਭਕਾਮਨਾਵਾਂ ਟੋਸਟ",
        flexiQuotes: "4. ਫਲੈਕਸੀ ਹਵਾਲੇ",
        customReminders: "5. ਕਸਟਮ ਰਿਮਾਈਂਡਰ",
        savedReplies: "6. ਸੁਰੱਖਿਅਤ ਕੀਤੇ ਜਵਾਬ",
        customToast: "7. ਕਸਟਮ ਟੋਸਟ",
        returnBack: "⬅️ ਵਾਪਸ ਜਾਓ",
        moduleInfo: "ℹ️ ਮੋਡੀਊਲ ਜਾਣਕਾਰੀ:",
        moduleName: "ਨਾਮ:",
        moduleAuthor: "ਲੇਖਕ:",
        moduleDisplayName: "ਪ੍ਰਦਰਸ਼ਨ ਨਾਮ:",
        moduleVersion: "ਵਰਜਨ:",
        moduleDescription: "ਵਿਆਖਿਆ:",
        refresh: "🔄️ ਤਾਜ਼ਾ ਕਰੋ",
        allRead: "✅ ਸਾਰੀਆਂ ਖ਼ਬਰਾਂ ਪੜ੍ਹੀਆਂ ਗਈਆਂ ਹਨ!",
        nextUpdate: "⌛ਅਗਲੇ ਖ਼ਬਰਾਂ ਦੇ ਅਪਡੇਟ ਸ਼ਡਿਊਲ ਦੀ ਉਡੀਕ ਕਰੋ।",
        newUpdateAvailable: "📢 ਇੱਕ ਨਵਾਂ ਅੱਪਡੇਟ ਉਪਲਬਧ ਹੈ! ਕਿਰਪਾ ਕਰਕੇ ਸਕ੍ਰਿਪਟਾਂ ਵਾਲੇ ਪੰਨੇ ਨੂੰ ਤਾਜ਼ਾ ਕਰੋ ਅਤੇ ਅੱਪਡੇਟ ਮੋਡੀਊਲ 'ਤੇ ਕਲਿੱਕ ਕਰੋ।",
        understood: "ਸਮਝ ਆ ਗਿਆ!"
    },
    de: {
        today: "Aktuelle Nachrichten",
        moreScripts: "Weitere Skripte",
        scriptsAvailable: "Die folgenden Skripte stehen im Skript-Repository zum Download bereit.",
        scheduledMessages: "1. Geplante Nachrichten",
        messageBomber: "2. Nachrichtenbomber",
        greetingsToast: "3. Gruß-Toast",
        flexiQuotes: "4. Flexi-Zitate",
        customReminders: "5. Benutzerdefinierte Erinnerungen",
        savedReplies: "6. Gespeicherte Antworten",
        customToast: "7. Benutzerdefinierter Toast",
        returnBack: "⬅️ Zurück",
        moduleInfo: "ℹ️ Modulinformationen:",
        moduleName: "Name:",
        moduleAuthor: "Autor:",
        moduleDisplayName: "Anzeigename:",
        moduleVersion: "Version:",
        moduleDescription: "Beschreibung:",
        refresh: "🔄️ Aktualisieren",
        allRead: "✅ Alle Nachrichten wurden gelesen!",
        nextUpdate: "⌛Bitte warten Sie auf den nächsten Nachrichten-Update-Zeitplan für den nächsten Nachrichtenstapel.",
        newUpdateAvailable: "📢 Ein neues Update ist verfügbar! Bitte aktualisieren Sie die Skriptseite und klicken Sie dann auf Modul aktualisieren.",
        understood: "Verstanden!"
    },
    ru: {
        today: "Сегодняшние новости",
        moreScripts: "Больше скриптов",
        scriptsAvailable: "Приведенные ниже скрипты доступны для скачивания в репозитории скриптов.",
        scheduledMessages: "1. Запланированные сообщения",
        messageBomber: "2. Бомбардировщик сообщений",
        greetingsToast: "3. Приветственный тост",
        flexiQuotes: "4. Гибкие цитаты",
        customReminders: "5. Пользовательские напоминания",
        savedReplies: "6. Сохраненные ответы",
        customToast: "7. Пользовательский тост",
        returnBack: "⬅️ Вернуться",
        moduleInfo: "ℹ️ Информация о модуле:",
        moduleName: "Название:",
        moduleAuthor: "Автор:",
        moduleDisplayName: "Отображаемое имя:",
        moduleVersion: "Версия:",
        moduleDescription: "Описание:",
        refresh: "🔄️ Обновить",
        allRead: "✅ Все новости прочитаны!",
        nextUpdate: "⌛Пожалуйста, дождитесь следующего расписания обновления новостей для следующей партии новостей.",
        newUpdateAvailable: "📢 Доступно новое обновление! Пожалуйста, обновите страницу скриптов и нажмите кнопку «Обновить модуль».",
        understood: "Понял!"
    },
    ar: {
        today: "أخبار اليوم",
        moreScripts: "المزيد من البرامج النصية",
        scriptsAvailable: "البرامج النصية أدناه متاحة للتنزيل في مستودع البرامج النصية.",
        scheduledMessages: "1. رسائل مجدولة",
        messageBomber: "2. قاذفة الرسائل",
        greetingsToast: "3. تحية محمصة",
        flexiQuotes: "4. اقتباسات مرنة",
        customReminders: "5. تذكيرات مخصصة",
        savedReplies: "6. الردود المحفوظة",
        customToast: "7. نخب مخصص",
        returnBack: "⬅️ عودة",
        moduleInfo: "ℹ️ معلومات الوحدة:",
        moduleName: "اسم:",
        moduleAuthor: "المؤلف:",
        moduleDisplayName: "اسم العرض:",
        moduleVersion: "الإصدار:",
        moduleDescription: "الوصف:",
        refresh: "🔄️ تحديث",
        allRead: "✅ تم قراءة جميع الأخبار!",
        nextUpdate: "⌛يرجى انتظار جدول تحديث الأخبار التالي للدفعة التالية من الأخبار.",
        newUpdateAvailable: "📢 يتوفر تحديث جديد! يرجى تحديث صفحة البرامج النصية ثم النقر فوق تحديث الوحدة النمطية.",
        understood: "فهمتك!"
    },
    fr: {
        today: "L'actualité du jour",
        moreScripts: "Plus de Scripts",
        scriptsAvailable: "Les scripts ci-dessous sont disponibles en téléchargement dans le référentiel de scripts.",
        scheduledMessages: "1. Messages planifiés",
        messageBomber: "2. Bombardement de messages",
        greetingsToast: "3. Toast de bienvenue",
        flexiQuotes: "4. Citations Flexi",
        customReminders: "5. Rappels personnalisés",
        savedReplies: "6. Réponses sauvegardées",
        customToast: "7. Toast personnalisé",
        returnBack: "⬅️ Retour",
        moduleInfo: "ℹ️ Informations sur le module:",
        moduleName: "Nom:",
        moduleAuthor: "Auteur:",
        moduleDisplayName: "Nom d'affichage:",
        moduleVersion: "Version:",
        moduleDescription: "Description:",
        refresh: "🔄️ Actualiser",
        allRead: "✅ Toutes les actualités ont été lues!",
        nextUpdate: "⌛Veuillez patienter jusqu'à la prochaine mise à jour des actualités pour le prochain lot d'actualités.",
        newUpdateAvailable: "📢 Une nouvelle mise à jour est disponible! Veuillez actualiser la page des scripts et cliquez ensuite sur Mettre à jour le module.",
        understood: "Compris!"
    }
};

function showNewsDialog(activity, headline, fontSize, fontColor) {
    activity.runOnUiThread(() => {
        var myDialog = im.createAlertDialog(activity, (builder, dialog) => {
            var selectedLanguage = config.get("language", defaultLanguage);
            function t(key) {
                return translations[selectedLanguage][key] || translations['en'][key];
            }
            builder.row(function (builder) {
                builder.text("📰" + t("today"))
                    .fontSize(config.getInteger("todaysNewsFontSize", 25))
                    .color(hexToColor(config.get("todaysNewsFontColor", "#FFFFFF")))
            })
                .arrangement("center")
                .fillMaxWidth();

            builder.text("")
                .fontSize(10);

            builder.text(headline)
                .fontSize(fontSize)
                .color(fontColor);

            builder.text("")
                .fontSize(10);

            builder.row(function (builder) {
                builder.text("_________________________")
                    .fontSize(10)
                    .color(0xFFCCCCCC)
            })
                .arrangement("center")
                .fillMaxWidth();

            builder.row(function (builder) {
                builder.button("📜" + t("moreScripts"), function () {
                    showOtherScriptsDialog(activity);
                    dialog.dismiss();
                });
                builder.button("ℹ️", function () {
                    showModuleInfoDialog(activity);
                    dialog.dismiss();
                });
                builder.button(t("refresh"), function () {
                    fetchAndShowNews(activity);
                    dialog.dismiss();
                });
            })
                .arrangement("center")
                .arrangement("spaceBetween")
                .fillMaxWidth();

            if (updateAvailable) {
                builder.row(function (builder) {
                    builder.text(t("newUpdateAvailable"))
                        .fontSize(12)
                        .padding(4);
                })
                    .arrangement("center")
                    .fillMaxWidth();
            }
        });
        myDialog.show();
    });
}

function showOtherScriptsDialog(activity) {
    activity.runOnUiThread(() => {
        var OtherScriptsDialog = im.createAlertDialog(activity, (builder, dialog) => {
            var selectedLanguage = config.get("language", defaultLanguage);
            function t(key) {
                return translations[selectedLanguage][key] || translations['en'][key];
            }
            builder.row(function (builder) {
                builder.text("📜" + t("moreScripts") + ":")
                    .fontSize(20)
            })
                .arrangement("center")
                .fillMaxWidth();

            builder.text("")
                .fontSize(10);

            builder.text(t("scriptsAvailable"))
                .fontSize(18);
            builder.text("")
                .fontSize(10);
            builder.text(t("scheduledMessages"))
                .fontSize(16);
            builder.text(t("messageBomber"))
                .fontSize(16);
            builder.text(t("greetingsToast"))
                .fontSize(16);
            builder.text(t("flexiQuotes"))
                .fontSize(16);
            builder.text(t("customReminders"))
                .fontSize(16);
            builder.text(t("savedReplies"))
                .fontSize(16);
            builder.text(t("customToast"))
                .fontSize(16);

            builder.text("")
                .fontSize(10);

            builder.row(function (builder) {
                builder.button(t("returnBack"), function () {
                    fetchAndShowNews(activity);
                    dialog.dismiss();
                });
            })
                .arrangement("center")
                .fillMaxWidth();
        });
        OtherScriptsDialog.show();
    });
}

function showModuleInfoDialog(activity) {
    activity.runOnUiThread(() => {
        var infoDialog = im.createAlertDialog(activity, (builder, dialog) => {
            var selectedLanguage = config.get("language", defaultLanguage);
            function t(key) {
                return translations[selectedLanguage][key] || translations['en'][key];
            }
            builder.row(function (builder) {
                builder.text(t("moduleInfo"))
                    .fontSize(20)
            })
                .arrangement("center")
                .fillMaxWidth();

            builder.text("")
                .fontSize(10);

            builder.text(`${t("moduleName")} ${module.info.name}`)
                .fontSize(16);
            builder.text(`${t("moduleAuthor")} ${module.info.author}`)
                .fontSize(16);
            builder.text(`${t("moduleDisplayName")} ${module.info.displayName}`)
                .fontSize(16);
            builder.text(`${t("moduleVersion")} ${module.info.version}`)
                .fontSize(16);
            builder.text(`${t("moduleDescription")} ${module.info.description}`)
                .fontSize(16);

            builder.text("")
                .fontSize(10);

            builder.row(function (builder) {
                builder.button(t("returnBack"), function () {
                    fetchAndShowNews(activity);
                    dialog.dismiss();
                });
            })
                .arrangement("center")
                .fillMaxWidth();
        });
        infoDialog.show();
    });
}

function showAllRead(activity) {
    activity.runOnUiThread(() => {
        var ReadDialog = im.createAlertDialog(activity, (builder, dialog) => {
            var selectedLanguage = config.get("language", defaultLanguage);
            function t(key) {
                return translations[selectedLanguage][key] || translations['en'][key];
            }
            builder.row(function (builder) {
                builder.text(t("allRead"))
                    .fontSize(20)
            })
                .arrangement("center")
                .alignment("centerVertically")
                .fillMaxWidth();

            builder.text("")
                .fontSize(10);

            builder.text(t("nextUpdate"))
                .fontSize(16);

            builder.text("")
                .fontSize(10);

            builder.row(function (builder) {
                builder.button(t("understood"), function () {
                    dialog.dismiss();
                })
            })
                .arrangement("center")
                .fillMaxWidth();
        });
        ReadDialog.show();
    });
}

function fetchAndShowNews(activity) {
    var selectedLanguage = config.get("language", defaultLanguage);
    newsJsonUrl = `https://raw.githubusercontent.com/particle-box/Script-UPDT/main/networking/news_${selectedLanguage}.json`;

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
                showAllRead(activity);
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

            var todaysNewsFontSizes = [18, 22, 26, 30, 34];
            var oldTodaysNewsFontSize = config.getInteger("todaysNewsFontSize", 25);
            builder.row(function (builder) {
                var text = builder.text("Today's News Font Size: " + oldTodaysNewsFontSize);
                builder.slider(0, todaysNewsFontSizes.length - 1, todaysNewsFontSizes.length - 1, todaysNewsFontSizes.indexOf(oldTodaysNewsFontSize), function (value) {
                    var fontSize = todaysNewsFontSizes[value];
                    text.label("Today's News Font Size: " + fontSize);
                    config.setInteger("todaysNewsFontSize", fontSize, true);
                });
            });

            builder.row(function (builder) {
                builder.textInput("Enter Custom Today's News Font Color (hex)", config.get("todaysNewsFontColor", "#FFFFFF"), function (value) {
                    var trimmedValue = value.trim();
                    if (trimmedValue === "") {
                        config.set("todaysNewsFontColor", "#FFFFFF", true);
                    } else {
                        config.set("todaysNewsFontColor", trimmedValue, true);
                    }
                }).maxLines(1)
                    .singleLine(true);
            });

            var fontSizes = [12, 16, 20, 24, 28, 32, 36];
            var oldSelectedFontSize = config.getInteger("fontSize", defaultFontSize);
            builder.row(function (builder) {
                var text = builder.text("Headline Font Size: " + oldSelectedFontSize);
                builder.slider(0, fontSizes.length - 1, fontSizes.length - 1, fontSizes.indexOf(oldSelectedFontSize), function (value) {
                    var fontSize = fontSizes[value];
                    text.label("Headline Font Size: " + fontSize);
                    config.setInteger("fontSize", fontSize, true);
                });
            });

            builder.row(function (builder) {
                builder.textInput("Enter Custom Headline Font Color (hex)", config.get("fontColor", defaultFontColor), function (value) {
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
