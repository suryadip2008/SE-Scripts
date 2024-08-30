// ==SE_module==
// name: message_bomber
// displayName: Message Bomber
// description: A script for bombing your friends with custom messages. Just for educational purposes. May or may not cause bans.
// version: 5.0
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

    var conversationId = null;
    var bombCount = 0;
    var bombMessage = "";
    var antiBanEnabled = false;
    var antiBanConfigId = "antiBanEnabled";
    var warningDisplayedConfigId = "warningDisplayed";

    var translations = {
        en: {
            enableAntiBan: "Enable Anti-ban",
            enterMessages: "Enter the number of messages to bomb with",
            enterMessage: "Enter message to bomb",
            messageBomb: "Bomb !",
            funPop: "Fun Pop!",
            messageSent: "Message bomb sent: ",
            warning: "Warning: Sending a large number of messages may lead to account restrictions. Proceed with caution.",
            pleaseEnterValid: "Please enter a valid number of messages and a message to bomb",
            predefinedMessages: [
              "You're so lazy, even a caterpillar becomes a butterfly faster than you move!",
              "Your brain is like a web browser: 12 tabs open, 2 frozen, and where's that music coming from?",
              "If I said you had a face for radio, it'd be an insult to radio shows everywhere.",
              "You're the reason they put directions on shampoo bottles.",
              "If brains were cars, you'd be a busted old pick-up truck.",
              "You couldn't find your way out of a paper bag with a map.",
              "You're proof that evolution can work in reverse.",
              "You're as useful as the 'g' in lasagna.",
              "If you were any slower, you'd be going backwards.",
              "You have the emotional range of a teaspoon.",
              "Bless your heart, but your head could use a map sometimes.",
              "You're the human equivalent of a participation trophy.",
              "You're like a cloudy day: all grey and no sunshine.",
              "If good looks were a crime, you'd be the most law-abiding citizen I know.",
              "I've seen more life in a bowl of oatmeal than in a conversation with you.",
              "You're the kind of person that makes the 'meh' emoji feel good about itself.",
              "If you were a spice, you'd be flour.",
              "You're not the dumbest person in the world, but you better hope they don't die.",
              "Your elevator doesn't go all the way to the top floor.",
              "You're so awkward, you make a sloth look like a social butterfly.",
              "You're the reason we have instruction manuals for toasters.",
              "You could get lost in a one-room cabin.",
              "Your selfies could cure insomnia.",
              "You're like a cloud: when you disappear, it's a brighter day.",
              "You're proof that even evolution makes mistakes.",
              "If life was a game, you'd be playing in easy mode and still lose.",
              "You're as sharp as a marble.",
              "You're the kind of person who claps while watching fireworks on TV.",
              "I would explain it to you, but I left my crayons at home.",
              "You're not completely useless; you can always serve as a bad example.",
              "You have the charisma of expired milk.",
              "Trying to have a conversation with you is like herding cats.",
              "I've met rocks with more personality than you.",
              "If you were an animal, you'd be a sloth – and the sloths would be offended.",
              "You're about as reliable as a chocolate teapot.",
              "You're not totally useless; you could always become a speed bump.",
              "You're the human version of a cold sore.",
              "If you were any less intelligent, I'd have to water you twice a week.",
              "You're the mistake in the happy little accident.",
              "You’re the reason alarms have snooze buttons.",
              "How do you type messages with boxing gloves on?",
              "Your mind is like a steel trap – rusted shut and hard to open.",
              "Talking to you is like a near-death experience, without the benefits.",
              "You're a person of hidden depths – you wouldn't want to look at it.",
              "You're so special, even dogs avoid eye contact with you.",
              "You're the sort of person who would trip over a wireless phone.",
              "You're like a lighthouse at sea – out of commission and not much help.",
              "Your life must be a series of winning participation awards.",
              "You're the reason people bring books to parties.",
              "If adorkable was a crime, you'd still be living free."
            ]
        },
        pt: {
            enableAntiBan: "Ativar Anti-ban",
            enterMessages: "Digite o número de mensagens para bombardear",
            enterMessage: "Digite a mensagem para bombardear",
            messageBomb: "Bomba !",
            funPop: "Diversão Pop!",
            messageSent: "Mensagens enviadas: ",
            warning: "Aviso: Enviar um grande número de mensagens pode levar a restrições na conta. Prossiga com cautela.",
            pleaseEnterValid: "Digite um número válido de mensagens e uma mensagem para bombardeio",
            predefinedMessages: [
              "Você é tão preguiçoso que até uma lagarta se transforma em borboleta mais rápido do que você se move!",
              "Seu cérebro é como um navegador da web: 12 abas abertas, 2 congeladas e de onde vem essa música?",
              "Se eu dissesse que você tem um rosto para rádio, seria um insulto para todas as emissoras de rádio.",
              "Você é o motivo pelo qual eles colocam instruções nos frascos de xampu.",
              "Se cérebros fossem carros, você seria uma caminhonete velha e quebrada.",
              "Você não conseguiria encontrar a saída de um saco de papel nem com um mapa.",
              "Você é a prova de que a evolução pode funcionar ao contrário.",
              "Você é tão útil quanto o 'h' em hora.",
              "Se você fosse mais lento, estaria andando para trás.",
              "Você tem a amplitude emocional de uma colher de chá.",
              "Que Deus te abençoe, mas sua cabeça às vezes precisa de um mapa.",
              "Você é o equivalente humano a um troféu de participação.",
              "Você é como um dia nublado: tudo cinza e sem sol.",
              "Se a boa aparência fosse um crime, você seria o cidadão mais cumpridor da lei que eu conheço.",
              "Já vi mais vida em uma tigela de mingau do que em uma conversa com você.",
              "Você é o tipo de pessoa que faz o emoji 'meh' se sentir bem consigo mesmo.",
              "Se você fosse um tempero, seria farinha.",
              "Você não é a pessoa mais burra do mundo, mas é melhor torcer para que ela não morra.",
              "Seu elevador não vai até o último andar.",
              "Você é tão desajeitado que faz uma preguiça parecer uma borboleta social.",
              "Você é o motivo pelo qual temos manuais de instruções para torradeiras.",
              "Você conseguiria se perder em uma cabana de um cômodo.",
              "Suas selfies poderiam curar insônia.",
              "Você é como uma nuvem: quando desaparece, o dia fica mais brilhante.",
              "Você é a prova de que até a evolução comete erros.",
              "Se a vida fosse um jogo, você estaria jogando no modo fácil e ainda assim perderia.",
              "Você é tão afiado quanto uma bolinha de gude.",
              "Você é o tipo de pessoa que aplaude enquanto assiste fogos de artifício na TV.",
              "Eu explicaria para você, mas deixei meus gizes de cera em casa.",
              "Você não é completamente inútil; você sempre pode servir como um mau exemplo.",
              "Você tem o carisma de leite vencido.",
              "Tentar ter uma conversa com você é como pastorear gatos.",
              "Já conheci pedras com mais personalidade que você.",
              "Se você fosse um animal, seria uma preguiça - e as preguiças ficariam ofendidas.",
              "Você é tão confiável quanto um bule de chocolate.",
              "Você não é totalmente inútil; você sempre poderia se tornar um quebra-molas.",
              "Você é a versão humana de uma herpes labial.",
              "Se você fosse menos inteligente, eu teria que te regar duas vezes por semana.",
              "Você é o erro no pequeno acidente feliz.",
              "Você é o motivo pelo qual os alarmes têm botões de soneca.",
              "Como você digita mensagens com luvas de boxe?",
              "Sua mente é como uma armadilha de aço - enferrujada e difícil de abrir.",
              "Conversar com você é como uma experiência de quase morte, sem os benefícios.",
              "Você é uma pessoa de profundezas ocultas - você não gostaria de olhar para isso.",
              "Você é tão especial que até os cães evitam contato visual com você.",
              "Você é o tipo de pessoa que tropeçaria em um telefone sem fio.",
              "Você é como um farol no mar - fora de serviço e não muito útil.",
              "Sua vida deve ser uma série de prêmios de participação vencedores.",
              "Você é o motivo pelo qual as pessoas levam livros para festas.",
              "Se ser 'adorkável' fosse um crime, você ainda estaria vivendo em liberdade."
            ]
        },
        pa: {
            enableAntiBan: "ਐਂਟੀ-ਬੈਨ ਨੂੰ ਸਮਰਥਨ ਦਿਓ",
            enterMessages: "ਬੰਬ ਕਰਨ ਲਈ ਸੰਦੇਸ਼ਾਂ ਦੀ ਗਿਣਤੀ ਦਰਜ ਕਰੋ",
            enterMessage: "ਬੰਬ ਕਰਨ ਲਈ ਸੁਨੇਹਾ ਦਰਜ ਕਰੋ",
            messageBomb: "ਬੰਬ !",
            funPop: "ਮਜ਼ੇਦਾਰ ਪੌਪ!",
            messageSent: "ਸੁਨੇਹੇ ਭੇਜੇ ਗਏ: ",
            warning: "ਚੇਤਾਵਨੀ: ਵੱਡੀ ਗਿਣਤੀ ਵਿੱਚ ਸੁਨੇਹੇ ਭੇਜਣ ਨਾਲ ਖਾਤੇ ਦੀਆਂ ਪਾਬੰਦੀਆਂ ਹੋ ਸਕਦੀਆਂ ਹਨ। ਸਾਵਧਾਨ ਰਹੋ.",
            pleaseEnterValid: "ਕਿਰਪਾ ਕਰਕੇ ਸੁਨੇਹੇ ਅਤੇ ਬੰਬ ਲਈ ਇੱਕ ਸੁਨੇਹਾ ਜਾਰੀ ਕਰੋ",
            predefinedMessages: [
              "ਤੂੰ ਇੰਨਾ ਆਲਸੀ ਹੈਂ, ਇੱਕ ਕੀੜਾ ਵੀ ਤੈਥੋਂ ਪਹਿਲਾਂ ਤਿਤਲੀ ਬਣ ਜਾਂਦਾ ਹੈ!",
              "ਤੁਹਾਡਾ ਦਿਮਾਗ਼ ਇੱਕ ਵੈੱਬ ਬ੍ਰਾਊਜ਼ਰ ਵਾਂਗ ਹੈ: 12 ਟੈਬਾਂ ਖੁੱਲ੍ਹੀਆਂ ਹਨ, 2 ਜੰਮੀਆਂ ਹੋਈਆਂ ਹਨ, ਅਤੇ ਇਹ ਸੰਗੀਤ ਕਿੱਥੋਂ ਆ ਰਿਹਾ ਹੈ?",
              "ਜੇ ਮੈਂ ਕਿਹਾ ਕਿ ਤੁਹਾਡੇ ਕੋਲ ਰੇਡੀਓ ਲਈ ਚਿਹਰਾ ਹੈ, ਤਾਂ ਇਹ ਹਰ ਜਗ੍ਹਾ ਰੇਡੀਓ ਸ਼ੋਅ ਲਈ ਅਪਮਾਨ ਹੋਵੇਗਾ।",
              "ਤੁਸੀਂ ਹੀ ਕਾਰਨ ਹੋ ਕਿ ਉਹ ਸ਼ੈਂਪੂ ਦੀਆਂ ਬੋਤਲਾਂ 'ਤੇ ਨਿਰਦੇਸ਼ ਦਿੰਦੇ ਹਨ।",
              "ਜੇ ਦਿਮਾਗ਼ ਕਾਰਾਂ ਹੁੰਦੇ, ਤਾਂ ਤੁਸੀਂ ਇੱਕ ਪੁਰਾਣੀ ਪਿਕ-ਅੱਪ ਟਰੱਕ ਹੁੰਦੇ।",
              "ਤੁਸੀਂ ਨਕਸ਼ੇ ਨਾਲ ਇੱਕ ਕਾਗਜ਼ੀ ਬੈਗ ਵਿੱਚੋਂ ਆਪਣਾ ਰਸਤਾ ਨਹੀਂ ਲੱਭ ਸਕਦੇ।",
              "ਤੁਸੀਂ ਇਸ ਗੱਲ ਦਾ ਸਬੂਤ ਹੋ ਕਿ ਵਿਕਾਸ ਉਲਟਾ ਕੰਮ ਕਰ ਸਕਦਾ ਹੈ।",
              "ਤੁਸੀਂ ਲਾਸਗਨਾ ਵਿੱਚ 'g' ਜਿੰਨੇ ਹੀ ਉਪਯੋਗੀ ਹੋ।",
              "ਜੇ ਤੁਸੀਂ ਹੋਰ ਹੌਲੀ ਹੁੰਦੇ, ਤਾਂ ਤੁਸੀਂ ਪਿੱਛੇ ਵੱਲ ਜਾ ਰਹੇ ਹੁੰਦੇ।",
              "ਤੁਹਾਡੇ ਕੋਲ ਇੱਕ ਚਮਚ ਦੀ ਭਾਵਨਾਤਮਕ ਸੀਮਾ ਹੈ।",
              "ਤੁਹਾਡੇ ਦਿਲ ਨੂੰ ਅਸੀਸ ਦਿਓ, ਪਰ ਤੁਹਾਡਾ ਸਿਰ ਕਈ ਵਾਰ ਨਕਸ਼ੇ ਦੀ ਵਰਤੋਂ ਕਰ ਸਕਦਾ ਹੈ।",
              "ਤੁਸੀਂ ਇੱਕ ਭਾਗੀਦਾਰੀ ਟਰਾਫੀ ਦੇ ਬਰਾਬਰ ਮਨੁੱਖ ਹੋ।",
              "ਤੁਸੀਂ ਇੱਕ ਬੱਦਲવાਈ ਵਾਲੇ ਦਿਨ ਵਾਂਗ ਹੋ: ਸਾਰੇ ਸਲੇਟੀ ਅਤੇ ਕੋਈ ਧੁੱਪ ਨਹੀਂ।",
              "ਜੇ ਚੰਗਾ ਲੱਗਣਾ ਇੱਕ ਅਪਰਾਧ ਹੁੰਦਾ, ਤਾਂ ਤੁਸੀਂ ਸਭ ਤੋਂ ਵੱਧ ਕਾਨੂੰਨ ਦੀ ਪਾਲਣਾ ਕਰਨ ਵਾਲੇ ਨਾਗਰਿਕ ਹੋਵੋਗੇ ਜੋ ਮੈਂ ਜਾਣਦਾ ਹਾਂ।",
              "ਮੈਂ ਤੁਹਾਡੇ ਨਾਲ ਗੱਲਬਾਤ કરਨ ਨਾਲੋਂ ਇੱਕ ਕਟੋਰੀ ਓਟਮੀਲ ਵਿੱਚ ਜ਼ਿਆਦਾ ਜ਼ਿੰਦਗੀ ਦੇਖੀ ਹੈ।",
              "ਤੁਸੀਂ ਉਸ ਕਿਸਮ ਦੇ ਵਿਅਕਤੀ ਹੋ ਜੋ 'ਮੇਹ' ਇਮੋਜੀ ਨੂੰ ਆਪਣੇ ਬਾਰੇ ਚੰਗਾ ਮਹਿਸੂਸ ਕਰਵਾਉਂਦਾ ਹੈ।",
              "ਜੇ ਤੁਸੀਂ ਇੱਕ ਮਸਾਲਾ ਹੁੰਦੇ, ਤਾਂ ਤੁਸੀਂ ਆਟਾ ਹੁੰਦੇ।",
              "ਤੁਸੀਂ ਦੁਨੀਆ ਦੇ ਸਭ ਤੋਂ ਮੂਰਖ ਵਿਅਕਤੀ ਨਹੀਂ ਹੋ, ਪਰ ਤੁਸੀਂ ਉਮੀਦ ਕਰੋਗੇ ਕਿ ਉਹ ਨਾ ਮਰਨ।",
              "ਤੁਹਾਡੀ ਲਿਫਟ ਸਾਰੀ ਮੰਜ਼ਿਲ ਤੱਕ ਨਹੀਂ ਜਾਂਦੀ।",
              "ਤੁਸੀਂ ਇੰਨੇ ਅਜੀਬ ਹੋ, ਤੁਸੀਂ ਇੱਕ ਸੁਸਤ ਨੂੰ ਇੱਕ ਸਮਾਜਿਕ ਤਿਤਲੀ ਵਰਗਾ ਬਣਾਉਂਦੇ ਹੋ।",
              "ਤੁਸੀਂ ਹੀ ਕਾਰਨ ਹੋ ਕਿ ਸਾਡੇ ਕੋਲ ਟੋਸਟਰਾਂ ਲਈ ਹਦਾਇਤ ਨਿਰਦੇਸ਼ ਹਨ।",
              "ਤੁਸੀਂ ਇੱਕ ਕਮਰੇ ਵਾਲੇ ਕੈਬਿਨ ਵਿੱਚ ખોવાઈ શકો છો।",
              "ਤੁਹਾਡੀਆਂ ਸੈਲਫੀ ਇਨਸੌਮਨੀਆ ਨੂੰ ਠੀਕ ਕਰ ਸਕਦੀਆਂ ਹਨ।",
              "ਤੁਸੀਂ ਇੱਕ ਬੱਦਲ ਵਾਂਗ ਹੋ: ਜਦੋਂ ਤੁਸੀਂ ਅਲੋਪ ਹੋ ਜਾਂਦੇ ਹੋ, ਤਾਂ ਇਹ ਇੱਕ ਚਮਕਦਾਰ ਦਿਨ ਹੁੰਦਾ ਹੈ।",
              "ਤੁਸੀਂ ਇਸ ਗੱਲ ਦਾ ਸਬੂਤ ਹੋ ਕਿ ਵਿਕਾਸ ਵੀ ਗਲਤੀਆਂ ਕਰਦਾ ਹੈ।",
              "ਜੇ ਜ਼ਿੰਦਗੀ ਇੱਕ ਖੇਡ ਹੁੰਦੀ, ਤਾਂ ਤੁਸੀਂ ਆਸਾਨ ਮੋਡ ਵਿੱਚ ਖੇਡ ਰਹੇ ਹੁੰਦੇ ਅਤੇ ਫਿਰ ਵੀ ਹਾਰ ਜਾਂਦੇ।",
              "ਤੁਸੀਂ ਸੰਗਮਰਮਰ ਵਾਂਗ ਤਿੱਖੇ ਹੋ।",
              "ਤੁਸੀਂ ਉਸ ਕਿਸਮ ਦੇ ਵਿਅਕਤੀ ਹੋ ਜੋ ਟੀਵੀ 'ਤੇ ਆਤਿਸ਼ਬਾਜ਼ੀ ਦੇਖਦੇ ਹੋਏ ਤਾੜੀਆਂ ਵਜਾਉਂਦੇ ਹਨ।",
              "ਮੈਂ ਤੁਹਾਨੂੰ ਇਹ ਸਮਝਾਵਾਂਗਾ, ਪਰ ਮੈਂ ਆਪਣੇ ਕ੍ਰੇਅਨ ਘਰ ਛੱਡ ਦਿੱਤੇ ਹਨ।",
              "ਤੁਸੀਂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਬੇਕਾਰ ਨਹੀਂ ਹੋ; ਤੁਸੀਂ ਹਮੇਸ਼ਾ ਇੱਕ ਮਾੜੀ ਮਿਸਾਲ ਵਜੋਂ ਸੇਵਾ ਕਰ ਸਕਦੇ ਹੋ।",
              "ਤੁਹਾਡੇ ਕੋਲ ਮਿਆਦ ਪੁੱਗੇ ਦੁੱਧ ਦਾ ਕਰਿਸ਼ਮਾ ਹੈ।",
              "ਤੁਹਾਡੇ ਨਾਲ ਗੱਲਬਾਤ ਕਰਨ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰਨਾ ਬਿੱਲੀਆਂ ਨੂੰ ਚਰਾਉਣ ਵਰਗਾ ਹੈ।",
              "ਮੈਂ ਤੁਹਾਡੇ ਨਾਲੋਂ ਜ਼ਿਆਦਾ ਸ਼ਖਸੀਅਤ ਵਾਲੀਆਂ ਚੱਟਾਨਾਂ ਨੂੰ ਮਿਲਿਆ ਹਾਂ।",
              "ਜੇ ਤੁਸੀਂ ਇੱਕ ਜਾਨਵਰ ਹੁੰਦੇ, ਤਾਂ ਤੁਸੀਂ ਇੱਕ ਸੁਸਤ ਹੋਵੋਗੇ - ਅਤੇ ਸੁਸਤ ਨਾਰਾਜ਼ ਹੋਣਗੇ।",
              "ਤੁਸੀਂ ਇੱਕ ਚਾਕਲੇਟ ਚਾਹਦਾਨੀ ਜਿੰਨੇ ਭਰੋਸੇਮੰਦ ਹੋ।",
              "ਤੁਸੀਂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਬੇਕਾਰ ਨਹੀਂ ਹੋ; ਤੁਸੀਂ ਹਮੇਸ਼ਾ ਇੱਕ ਸਪੀਡ ਬੰਪ ਬਣ ਸਕਦੇ ਹੋ।",
              "ਤੁਸੀਂ ਇੱਕ ਠੰਡੇ ਦਰਦ ਦਾ ਮਨੁੱਖੀ ਸੰਸਕਰਣ ਹੋ।",
              "ਜੇ ਤੁਸੀਂ ਥੋੜ੍ਹੇ ਘੱਟ ਬੁੱਧੀਮਾਨ ਹੁੰਦੇ, ਤਾਂ ਮੈਨੂੰ ਤੁਹਾਨੂੰ ਹਫ਼ਤੇ ਵਿੱਚ ਦੋ ਵਾਰ ਪਾਣੀ ਦੇਣਾ ਪੈਂਦਾ।",
              "ਤੁਸੀਂ ਖੁਸ਼ਹਾਲ ਛੋਟੇ ਹਾਦਸੇ ਵਿੱਚ ਗਲਤੀ ਹੋ।",
              "ਤੁਸੀਂ ਹੀ ਕਾਰਨ ਹੋ ਕਿ ਅਲਾਰਮ ਵਿੱਚ ਸਨੂਜ਼ ਬਟਨ ਹੁੰਦੇ ਹਨ।",
              "ਤੁਸੀਂ ਬਾਕਸਿੰਗ ਦਸਤਾਨੇ ਪਾ ਕੇ ਸੁਨੇਹੇ ਕਿਵੇਂ ਟਾਈਪ ਕਰਦੇ ਹੋ?",
              "ਤੁਹਾਡਾ ਮਨ ਸਟੀਲ ਦੇ ਜਾਲ ਵਰਗਾ ਹੈ - ਜੰਗਾਲ ਲੱਗਿਆ ਹੋਇਆ ਹੈ ਅਤੇ ਖੋਲ੍ਹਣਾ ਔਖਾ ਹੈ।",
              "ਤੁਹਾਡੇ ਨਾਲ ਗੱਲ ਕਰਨਾ ਇੱਕ ਮੌਤ ਦੇ ਨੇੜੇ ਦੇ ਤਜ਼ਰਬੇ ਵਾਂਗ ਹੈ, ਲਾਭਾਂ ਤੋਂ ਬਿਨਾਂ।",
              "ਤੁਸੀਂ ਲੁਕੀਆਂ ਡੂੰਘਾਈਆਂ ਵਾਲੇ ਵਿਅ ਕਤੀ ਹੋ - ਤੁਸੀਂ ਇਸਨੂੰ ਵੇਖਣਾ ਨਹੀਂ ਚਾਹੋਗੇ।",
              "ਤੁਸੀਂ ਇੰਨੇ ਖਾਸ ਹੋ, ਕੁੱਤੇ ਵੀ ਤੁਹਾਡੇ ਨਾਲ ਅੱਖਾਂ ਦਾ ਸੰਪਰਕ ਕਰਨ ਤੋਂ ਪਰਹੇਜ਼ ਕਰਦੇ ਹਨ।",
              "ਤੁਸੀਂ ਉਸ ਕਿਸਮ ਦੇ ਵਿਅਕਤੀ ਹੋ ਜੋ ਵਾਇਰਲੈੱਸ ਫ਼ੋਨ 'ਤੇ ਠੋਕਰ ਮਾਰ ਦੇਣਗੇ।",
              "ਤੁਸੀਂ ਸਮੁੰਦਰ ਵਿੱਚ ਇੱਕ ਲਾਈਟਹਾਊਸ ਵਰਗੇ ਹੋ - ਕਮਿਸ਼ਨ ਤੋਂ ਬਾਹਰ ਅਤੇ ਬਹੁਤੀ ਮਦਦ ਨਹੀਂ ਕਰਦੇ।",
              "ਤੁਹਾਡੀ ਜ਼ਿੰਦਗੀ ਜਿੱਤਣ ਵਾਲੇ ਭਾਗੀਦਾਰੀ ਪੁਰਸਕਾਰਾਂ ਦੀ ਇੱਕ ਲੜੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।",
              "ਤੁਸੀਂ ਹੀ ਕਾਰਨ ਹੋ ਕਿ ਲੋਕ ਪਾਰਟੀਆਂ ਵਿੱਚ ਕਿਤਾਬਾਂ ਲਿਆਉਂਦੇ ਹਨ।",
              "ਜੇ ਐਡੋਰੇਬਲ ਇੱਕ ਅਪਰਾਧ ਹੁੰਦਾ, ਤਾਂ ਤੁਸੀਂ ਅਜੇ ਵੀ ਆਜ਼ਾਦ ਰਹਿ ਰਹੇ ਹੋਵੋਗੇ।"
            ]
        },
        de: {
            enableAntiBan: "Anti-Ban aktivieren",
            enterMessages: "Geben Sie die Anzahl der Nachrichten für die Bombardierung ein",
            enterMessage: "Geben Sie die Nachricht ein, um zu bombardieren",
            messageBomb: "Bombe !",
            funPop: "Spaß-Pop!",
            messageSent: "Nachrichtenbombing gesendet: ",
            warning: "Warnung: Das Senden einer großen Anzahl von Nachrichten kann zu Kontobeschränkungen führen. Bitte vorsichtig fortfahren.",
            pleaseEnterValid: "Bitte geben Sie eine gültige Anzahl von Nachrichten und eine Nachricht zum Bombardieren ein",
            predefinedMessages: [
              "Du bist so faul, sogar eine Raupe wird schneller zum Schmetterling als du dich bewegst!",
              "Dein Gehirn ist wie ein Webbrowser: 12 Tabs offen, 2 eingefroren, und woher kommt diese Musik?",
              "Wenn ich sagen würde, du hättest ein Gesicht fürs Radio, wäre das eine Beleidigung für Radiosendungen auf der ganzen Welt.",
              "Du bist der Grund, warum auf Shampoo-Flaschen Anweisungen stehen.",
              "Wenn Gehirne Autos wären, wärst du ein schrottreifer, alter Pick-up-Truck.",
              "Du würdest selbst mit einer Karte nicht aus einer Papiertüte herausfinden.",
              "Du bist der Beweis dafür, dass Evolution auch rückwärts funktionieren kann.",
              "Du bist so nützlich wie das 'g' in Lasagne.",
              "Wenn du noch langsamer wärst, würdest du rückwärts gehen.",
              "Du hast die emotionale Bandbreite eines Teelöffels.",
              "Dein Herz ist ja gut, aber dein Kopf könnte manchmal eine Karte gebrauchen.",
              "Du bist das menschliche Äquivalent zu einer Teilnehmerurkunde.",
              "Du bist wie ein wolkiger Tag: alles grau und kein Sonnenschein.",
              "Wenn gutes Aussehen ein Verbrechen wäre, wärst du der gesetzestreueste Bürger, den ich kenne.",
              "Ich habe in einer Schüssel Haferflocken mehr Leben gesehen als in einem Gespräch mit dir.",
              "Du bist die Art von Person, die dafür sorgt, dass sich das 'Meh'-Emoji gut fühlt.",
              "Wenn du ein Gewürz wärst, wärst du Mehl.",
              "Du bist nicht der dümmste Mensch der Welt, aber du solltest besser hoffen, dass derjenige nicht stirbt.",
              "Dein Aufzug fährt nicht bis ganz nach oben.",
              "Du bist so ungeschickt, dass du ein Faultier wie einen sozialen Schmetterling aussehen lässt.",
              "Du bist der Grund, warum wir Bedienungsanleitungen für Toaster haben.",
              "Du könntest dich in einer Einzimmerhütte verirren.",
              "Deine Selfies könnten Schlaflosigkeit heilen.",
              "Du bist wie eine Wolke: Wenn du verschwindest, ist es ein schönerer Tag.",
              "Du bist der Beweis dafür, dass selbst die Evolution Fehler macht.",
              "Wenn das Leben ein Spiel wäre, würdest du im einfachen Modus spielen und trotzdem verlieren.",
              "Du bist so scharfsinnig wie eine Murmel.",
              "Du bist die Art von Person, die klatscht, während sie sich Feuerwerk im Fernsehen ansieht.",
              "Ich würde es dir erklären, aber ich habe meine Buntstifte zu Hause gelassen.",
              "Du bist nicht völlig nutzlos; du kannst immer als schlechtes Beispiel dienen.",
              "Du hast die Ausstrahlung von abgelaufener Milch.",
              "Versuchen, ein Gespräch mit dir zu führen, ist wie Katzen hüten.",
              "Ich habe Steine mit mehr Persönlichkeit getroffen als dich.",
              "Wenn du ein Tier wärst, wärst du ein Faultier - und die Faultiere wären beleidigt.",
              "Du bist ungefähr so zuverlässig wie eine Teekanne aus Schokolade.",
              "Du bist nicht völlig nutzlos; du könntest immer noch als Bremsschwelle dienen.",
              "Du bist die menschliche Version eines Herpesbläschens.",
              "Wenn du noch weniger intelligent wärst, müsste ich dich zweimal pro Woche gießen.",
              "Du bist der Fehler in dem glücklichen kleinen Unfall.",
              "Du bist der Grund, warum Wecker eine Schlummertaste haben.",
              "Wie tippst du Nachrichten mit Boxhandschuhen?",
              "Dein Verstand ist wie eine Stahlfalle - verrostet und schwer zu öffnen.",
              "Mit dir zu reden ist wie eine Nahtoderfahrung, nur ohne die Vorteile.",
              "Du bist ein Mensch mit verborgenen Tiefen - du würdest nicht hineinsehen wollen.",
              "Du bist so besonders, dass sogar Hunde den Augenkontakt mit dir vermeiden.",
              "Du bist die Art von Person, die über ein schnurloses Telefon stolpern würde.",
              "Du bist wie ein Leuchtturm auf See - außer Betrieb und nicht sehr hilfreich.",
              "Dein Leben muss eine Reihe von gewonnenen Trostpreisen sein.",
              "Du bist der Grund, warum Leute Bücher zu Partys mitbringen.",
              "Wenn liebenswert ein Verbrechen wäre, würdest du immer noch in Freiheit leben."
            ]
        },
        ru: {
            enableAntiBan: "Включить Anti-ban",
            enterMessages: "Введите количество сообщений для бомбы",
            enterMessage: "Введите сообщение для бомбы",
            messageBomb: "Бомбить !",
            funPop: "Веселый поп!",
            messageSent: "Сообщение бомбы отправлено: ",
            warning: "Предупреждение: Отправка большого количества сообщений может привести к ограничению учетной записи. Действуйте осторожно.",
            pleaseEnterValid: "Пожалуйста, введите правильное количество сообщений и текст для бомбы",
            predefinedMessages: [
              "Ты такой ленивый, что даже гусеница превращается в бабочку быстрее, чем ты шевелишься!",
              "Твой мозг как браузер: 12 вкладок открыто, 2 зависли, и откуда играет музыка?",
              "Если бы я сказал, что у тебя лицо для радио, это было бы оскорблением для всех радиостанций мира.",
              "Ты - причина, по которой на бутылках с шампунем пишут инструкцию.",
              "Если бы мозги были машинами, ты был бы старым развалившимся пикапом.",
              "Ты бы не нашел выход из бумажного пакета даже с картой.",
              "Ты - доказательство того, что эволюция может идти в обратном направлении.",
              "Ты такой же полезный, как буква 'г' в слове 'лазанья'.",
              "Если бы ты был хоть немного медленнее, ты бы двигался назад.",
              "У тебя эмоциональный диапазон чайной ложки.",
              "Бог с тобой, но твоей голове иногда не помешала бы карта.",
              "Ты - человеческий эквивалент утешительного приза.",
              "Ты как пасмурный день: все серое и нет солнца.",
              "Если бы красота была преступлением, ты был бы самым законопослушным гражданином из всех, кого я знаю.",
              "Я видел больше жизни в тарелке овсянки, чем в разговоре с тобой.",
              "Ты из тех людей, из-за которых эмодзи 'meh' чувствует себя лучше.",
              "Если бы ты был специей, ты был бы мукой.",
              "Ты не самый глупый человек в мире, но тебе лучше надеяться, что он не умрет.",
              "Твой лифт не поднимается до последнего этажа.",
              "Ты такой неуклюжий, что ленивец на твоем фоне выглядит светским львом.",
              "Ты - причина, по которой у нас есть инструкции к тостерам.",
              "Ты бы потерялся в однокомнатной хижине.",
              "Твои селфи могут вылечить бессонницу.",
              "Ты как облако: когда ты исчезаешь, день становится ярче.",
              "Ты - доказательство того, что даже эволюция совершает ошибки.",
              "Если бы жизнь была игрой, ты бы играл на легком уровне и все равно проиграл бы.",
              "Ты такой же острый, как мраморный шарик.",
              "Ты из тех людей, которые хлопают в ладоши, смотря салют по телевизору.",
              "Я бы объяснил тебе, но я оставил свои мелки дома.",
              "Ты не совсем бесполезен; тобой всегда можно воспользоваться как плохим примером.",
              "У тебя харизма прокисшего молока.",
              "Пытаться разговаривать с тобой - это как пасти котов.",
              "Я встречал камни с большей индивидуальностью, чем у тебя.",
              "Если бы ты был животным, ты был бы ленивцем - и ленивцы бы обиделись.",
              "На тебя можно положиться, как на шоколадный чайник.",
              "Ты не совсем бесполезен; из тебя всегда можно сделать лежачий полицейский.",
              "Ты - человеческий эквивалент простуды на губах.",
              "Если бы ты был хоть немного глупее, мне пришлось бы поливать тебя два раза в неделю.",
              "Ты - ошибка в маленькой оплошности.",
              "Ты - причина, по которой у будильников есть кнопка повтора.",
              "Как ты печатаешь сообщения в боксерских перчатках?",
              "Твой разум как стальной капкан – заржавевший, закрытый и трудно открывающийся.",
              "Говорить с тобой - это как околосмертный опыт, но без преимуществ.",
              "Ты человек со скрытой глубиной - но на нее лучше не смотреть.",
              "Ты такой особенный, что даже собаки избегают зрительного контакта с тобой.",
              "Ты из тех людей, кто споткнется о беспроводной телефон.",
              "Ты как маяк в море - не работает и мало чем может помочь.",
              "Твоя жизнь, должно быть, серия побед в номинации «За участие».",
              "Ты - причина, по которой люди берут книги на вечеринки.",
              "Если бы «милая неловкость» была преступлением, ты бы все равно был на свободе."
            ]
        },
        ar: {
            enableAntiBan: "تمكين مضاد الحظر",
            enterMessages: "أدخل عدد الرسائل للقصف",
            enterMessage: "أدخل الرسالة للقصف",
            messageBomb: "قنبلة !",
            funPop: "مفاجأة !",
            messageSent: "تم إرسال الرسائل: ",
            warning: "تحذير: إرسال عدد كبير من الرسائل قد يؤدي إلى تقييد الحساب. تابع بحذر.",
            pleaseEnterValid: "الرجاء إدخال عدد صحيح من الرسائل ورسالة للقصف",
            predefinedMessages: [
              "أنت كسول جدًا ، حتى اليرقة تصبح فراشة أسرع من تحركك!",
              "دماغك مثل متصفح الويب: 12 علامة تبويب مفتوحة ، 2 مجمدة ، ومن أين يأتي هذا الصوت؟",
              "إذا قلت إن لديك وجهًا مناسبًا للراديو ، فسيكون ذلك إهانة لبرامج الراديو في كل مكان.",
              "أنت السبب في وضعهم إرشادات على زجاجات الشامبو.",
              "إذا كانت العقول سيارات ، فستكون شاحنة قديمة مكسورة.",
              "لا يمكنك إيجاد طريقك للخروج من كيس ورقي مع وجود خريطة.",
              "أنت دليل على أن التطور يمكن أن يعمل بشكل عكسي.",
              "أنت مفيد مثل حرف 'g' في اللازانيا.",
              "إذا كنت أبطأ ، فستعود إلى الوراء.",
              "لديك النطاق العاطفي لملعقة صغيرة.",
              "بارك الله في قلبك ، لكن رأسك يمكن أن يستخدم خريطة في بعض الأحيان.",
              "أنت ما يعادل الإنسان لكأس المشاركة.",
              "أنت مثل يوم غائم: كله رمادي ولا يوجد شمس.",
              "لو كان المظهر الجميل جريمة ، لكنت ستكون أكثر مواطن ملتزم بالقانون أعرفه.",
              "لقد رأيت حياة أكثر في وعاء من دقيق الشوفان منها في محادثة معك.",
              "أنت من النوع الذي يجعل رمزًا تعبيريًا 'مه' يشعر بالرضا عن نفسه.",
              "إذا كنت نوعًا من التوابل ، فستكون دقيقًا.",
              "أنت لست أغبى شخص في العالم ، لكن من الأفضل أن تأمل ألا يموت.",
              "مصعدك لا يصعد إلى الطابق العلوي.",
              "أنت محرج للغاية ، فأنت تجعل الكسلان يبدو وكأنه فراشة اجتماعية.",
              "أنت السبب في أن لدينا كتيبات تعليمات لأجهزة التحميص.",
              "يمكن أن تضيع في مقصورة من غرفة واحدة.",
              "يمكن أن تعالج صورك الذاتية الأرق.",
              "أنت مثل السحابة: عندما تختفي ، يكون اليوم أكثر إشراقًا.",
              "أنت دليل على أن التطور يرتكب أخطاء.",
              "إذا كانت الحياة لعبة ، فستلعب في الوضع السهل وستظل تخسر.",
              "أنت حاد مثل الرخام.",
              "أنت من النوع الذي يصفق أثناء مشاهدة الألعاب النارية على التلفزيون.",
              "كنت سأشرح لك ذلك ، لكنني تركت أقلام التلوين الخاصة بي في المنزل.",
              "أنت لست عديم الفائدة تمامًا ؛ يمكنك دائمًا أن تكون مثالًا سيئًا.",
              "لديك جاذبية الحليب منتهي الصلاحية.",
              "محاولة إجراء محادثة معك هي مثل رعي القطط.",
              "لقد قابلت صخورًا تتمتع بشخصية أكبر منك.",
              "إذا كنت حيوانًا ، فستكون كسلانًا - وستشعر الكسلان بالإهانة.",
              "أنت موثوق به مثل إبريق الشاي المصنوع من الشوكولاتة.",
              "أنت لست عديم الفائدة تمامًا ؛ يمكنك دائمًا أن تصبح مطبًا سريعًا.",
              "أنت النسخة البشرية من قرحة البرد.",
              "إذا كنت أقل ذكاءً ، فسأضطر إلى سقيبك مرتين في الأسبوع.",
              "أنت الخطأ في الحادث الصغير السعيد.",
              "أنت السبب في أن أجهزة الإنذار بها أزرار غفوة.",
              "كيف تكتب الرسائل مع ارتداء قفازات الملاكمة؟",
              "عقلك مثل مصيدة فولاذية - صدئة مغلقة ويصعب فتحها.",
              "التحدث إليك يشبه تجربة الاقتراب من الموت ، بدون فوائد.",
              "أنت شخص ذو أعماق خفية - لا ترغب في النظر إليه.",
              "أنت مميز جدًا ، حتى الكلاب تتجنب الاتصال البصري معك.",
              "أنت من النوع الذي سيتعثر في هاتف لاسلكي.",
              "أنت مثل المنارة في البحر - خارج الخدمة وليست ذات فائدة كبيرة.",
              "يجب أن تكون حياتك عبارة عن سلسلة من جوائز المشاركة الفائزة.",
              "أنت السبب الذي يجعل الناس يحضرون الكتب إلى الحفلات.",
              "إذا كانت كلمة رائع جريمة ، فستظل تعيش حراً."
            ]
        },
        fr: {
            enableAntiBan: "Activer Anti-ban",
            enterMessages: "Entrez le nombre de messages à bombarder",
            enterMessage: "Entrez le message à bombarder",
            messageBomb: "Bombe !",
            funPop: "Pop Amusante!",
            messageSent: "Messages envoyés: ",
            warning: "Avertissement: Envoyer un grand nombre de messages peut entraîner des restrictions de compte. Continuez avec prudence.",
            pleaseEnterValid: "Veuillez entrer un nombre valide de messages et un message à bombarder",
            predefinedMessages: [
              "Tu es tellement paresseux, même une chenille se transforme en papillon plus vite que toi !",
              "Ton cerveau est comme un navigateur web : 12 onglets ouverts, 2 gelés, et d'où vient cette musique ?",
              "Si je te disais que tu as une tête pour la radio, ce serait une insulte aux émissions de radio du monde entier.",
              "C'est à cause de toi qu'il y a des instructions sur les bouteilles de shampoing.",
              "Si les cerveaux étaient des voitures, tu serais une vieille camionnette en panne.",
              "Tu ne retrouverais pas ton chemin hors d'un sac en papier avec une carte.",
              "Tu es la preuve que l'évolution peut fonctionner en sens inverse.",
              "Tu es aussi utile que le 'g' dans lasagne.",
              "Si tu étais plus lent, tu reculerait.",
              "Tu as l'éventail émotionnel d'une cuillère à café.",
              "Que Dieu bénisse ton cœur, mais ta tête pourrait parfois avoir besoin d'une carte.",
              "Tu es l'équivalent humain d'un trophée de participation.",
              "Tu es comme un jour nuageux : tout gris et sans soleil.",
              "Si la beauté était un crime, tu serais le citoyen le plus respectueux de la loi que je connaisse.",
              "J'ai vu plus de vie dans un bol de flocons d'avoine que dans une conversation avec toi.",
              "Tu es le genre de personne qui rend l'emoji 'bof' fier de lui-même.",
              "Si tu étais une épice, tu serais de la farine.",
              "Tu n'es pas la personne la plus stupide du monde, mais tu ferais mieux d'espérer qu'elle ne meure pas.",
              "Ton ascenseur ne va pas jusqu'au dernier étage.",
              "Tu es tellement bizarre que tu fais passer un paresseux pour un papillon social.",
              "C'est à cause de toi qu'il existe des manuels d'instructions pour les grille-pain.",
              "Tu pourrais te perdre dans une cabane d'une seule pièce.",
              "Tes selfies pourraient guérir l'insomnie.",
              "Tu es comme un nuage : quand tu disparais, le journée est plus belle.",
              "Tu es la preuve que même l'évolution fait des erreurs.",
              "Si la vie était un jeu, tu jouerais en mode facile et tu perdrais quand même.",
              "Tu es aussi vif qu'une bille.",
              "Tu es le genre de personne qui applaudit en regardant un feu d'artifice à la télévision.",
              "Je te l'expliquerais, mais j'ai oublié mes crayons de couleur à la maison.",
              "Tu n'es pas complètement inutile ; tu peux toujours servir de mauvais exemple.",
              "Tu as le charisme d'un lait périmé.",
              "Essayer d'avoir une conversation avec toi, c'est comme essayer de rassembler des chats.",
              "J'ai rencontré des cailloux avec plus de personnalité que toi.",
              "Si tu étais un animal, tu serais un paresseux - et les paresseux seraient offensés.",
              "Tu es aussi fiable qu'une théière en chocolat.",
              "Tu n'es pas totalement inutile ; tu pourrais toujours servir de ralentisseur.",
              "Tu es la version humaine d'un bouton de fièvre.",
              "Si tu étais moins intelligent, je devrais t'arroser deux fois par semaine.",
              "Tu es l'erreur dans le petit accident heureux.",
              "C'est à cause de toi que les réveils ont des boutons 'répétition'.",
              "Comment fais-tu pour écrire des messages avec des gants de boxe ?",
              "Ton esprit est comme un piège à ours : rouillé, fermé et difficile à ouvrir.",
              "Te parler est comme une expérience de mort imminente, sans les avantages.",
              "Tu es une personne aux profondeurs cachées - tu ne voudrais pas les voir.",
              "Tu es si spécial que même les chiens évitent tout contact visuel avec toi.",
              "Tu es le genre de personne qui trébucherait sur un téléphone sans fil.",
              "Tu es comme un phare en mer - hors service et d'une grande aide.",
              "Ta vie doit être une série de récompenses de participation gagnantes.",
              "C'est à cause de toi que les gens apportent des livres aux fêtes.",
              "Si être adorablement ringard était un crime, tu serais toujours en liberté."
            ]
        }
    };

    var selectedLanguageKey = "selectedLanguage";
    var selectedLanguage = config.get(selectedLanguageKey, 'en');

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

    function sendBombMessages(message, count, isRandom) {
        logActivity(message, count);

        var warningDisplayed = config.getBoolean(warningDisplayedConfigId, false);

        if (!warningDisplayed && count > 20 && antiBanEnabled) {
            displayMessage(translations[selectedLanguage].warning);
            config.setBoolean(warningDisplayedConfigId, true, true);
        }

        for (var i = 0; i < count; i++) {
            var variedMessage;

            if (antiBanEnabled && isRandom) {
                variedMessage = getRandomizedMessage(message);
            } else if (isRandom) {
                variedMessage = message;
            } else if (antiBanEnabled) {
                variedMessage = getRandomizedMessage(message);
            } else {
                variedMessage = message;
            }

            messaging.sendChatMessage(conversationId, variedMessage, function () {});

            if (antiBanEnabled) {
                var randomDelay = Math.floor(Math.random() * 4000) + 1000;
                backgroundTask(randomDelay);
            }
        }
        
        displayMessage(translations[selectedLanguage].messageSent + count + " messages");
    }

    function createConversationToolboxUI() {
        im.create("conversationToolbox", function (builder, args) {
            try {
                conversationId = args["conversationId"];


        builder.textInput(translations[selectedLanguage].enterMessages, "", function (value) {
            bombCount = parseInt(value, 10) || 0;
        }).singleLine(true);

        builder.textInput(translations[selectedLanguage].enterMessage, "", function (value) {
            bombMessage = value;
        }).singleLine(true);

        builder.row(function (builder) {
            builder.text("🛡️ " + translations[selectedLanguage].enableAntiBan);
            builder.switch(antiBanEnabled, function (value) {
                antiBanEnabled = value;
                config.setBoolean(antiBanConfigId, value, true);
            });
        })
        .arrangement("spaceBetween")
        .fillMaxWidth()
        .padding(4);

        builder.row(function (builder) {
            builder.button("💥 " + translations[selectedLanguage].messageBomb, function () {
                if (bombCount > 0 && bombMessage) {
                    sendBombMessages(bombMessage, bombCount, false);
                } else {
                    displayMessage(translations[selectedLanguage].pleaseEnterValid);
                }
            });

            builder.button("🎈 " + translations[selectedLanguage].funPop, function () {
                var randomMessage = translations[selectedLanguage].predefinedMessages[Math.floor(Math.random() * translations[selectedLanguage].predefinedMessages.length)];
                var randomCount = Math.floor(Math.random() * (100 - 20 + 1)) + 20;
                sendBombMessages(randomMessage, randomCount, true);
            });
        })
        .arrangement("spaceBetween")
        .fillMaxWidth()
        .padding(4);

        var languages = ["English", "Portuguese", "Punjabi", "German", "Russian", "Arabic", "French"];
        var languageCodes = ['en', 'pt', 'pa', 'de', 'ru', 'ar', 'fr'];
        var oldSelectedLanguage = config.get(selectedLanguageKey, 'en');
        var oldSelectedIndex = languageCodes.indexOf(oldSelectedLanguage);

        builder.row(function (builder) {
            var text = builder.text("Language: " + languages[oldSelectedIndex]);
            builder.slider(0, languages.length - 1, languages.length - 1, oldSelectedIndex, function (value) {
                var newLanguage = languageCodes[value];
                text.label("Language: " + languages[value]);
                config.set(selectedLanguageKey, newLanguage, true);
                selectedLanguage = newLanguage;
                createConversationToolboxUI();
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

    function getIfAntiBanEnabled() {
        return config.getBoolean(antiBanConfigId, false);
    }

    function initializeWarningDisplayed() {
        config.setBoolean(warningDisplayedConfigId, false, true);
    }

    module.onSnapMainActivityCreate = activity => {
        showStartupToast();
    }

    function start() {
        antiBanEnabled = getIfAntiBanEnabled();
        initializeWarningDisplayed();
        createConversationToolboxUI();
    }

    start();
})();
