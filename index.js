const Discord = require('discord.js');
const client = new Discord.Client();
const {prefix, token} = require('./auth.json');

var jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM();
const {document} = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);
var moment = require('moment');
moment.locale('fr');

client.once('ready', () => {
    client.user.setStatus(`Dispo : ${prefix}help`);
    console.log('Ready!');

    client.user.setActivity(`Runing : ${prefix}help`, {type: 'PLAYING'});
});

client.on('message', message => {
    const cmd = message.content;
    if (!cmd.startsWith(prefix)) return;
    switch (cmd) {
        case `${prefix}sorties`:
            sorties(message);
            break;
        case `${prefix}help`:
            help(message);
            break;
        default:
            help(message);
            break;
    }
});

client.login(token);

function help(message) {
    var embed = {
        color: 0x0099ff,
        title: 'Liste des commandes',
        fields: [{
            name: `${prefix}sorties`,
            value: 'Liste les 3 sorties du jour'
        }, {
            name: `${prefix}help`,
            value: 'Affiche cet aide'
        }, {
            name: 'Des recommendations ?',
            value: 'https://github.com/N445/warframe-discord-bot/issues/new'
        }],
        timestamp: new Date(),
    };
    message.channel.send({embed: embed});
}

function sorties(message) {
    $.ajax({
        url: 'https://api.warframestat.us/pc/sortie',
        method: "GET",
        crossOrigin: true,
        success: function (data) {
            message.channel.send({embed: getEmbedSortie(data)});
        }
    })
}

function getEmbedSortie(data) {
    var embed = {
        color: 0x0099ff,
        title: data.boss + ' en ' + data.faction,
        fields: [],
        footer: {
            text: 'Expire dans ' + moment(new Date(data.expiry)).fromNow(),
        },
    };
    $.each(data.variants, function (key, value) {
        embed.fields.push({
            name: "Mission => " + value.missionType,
            value: "Modifier => " + value.modifier + "\n Lieu => " + value.node,
        });
    });

    return embed;
}

/*
var embed = {
    color: 0x0099ff,
    title: data.boss + ' en ' + data.faction,
    url: 'https://discord.js.org',
    author: {
        name: 'Some name',
        icon_url: 'https://i.imgur.com/wSTFkRM.png',
        url: 'https://discord.js.org',
    },
    description: 'Some description here',
    thumbnail: {
        url: 'https://i.imgur.com/wSTFkRM.png',
    },
    fields: [
        {
            name: "Mission => " + value.missionType,
            value: "Modifier => " + value.modifier + "\n Lieu => " + value.node,
        },
        {
            name: '\u200b',
            value: '\u200b',
        }
    ],
    image: {
        url: 'https://i.imgur.com/wSTFkRM.png',
    },
    timestamp: new Date(data.expiry),
    footer: {
        text: 'Fin d\'événement dans ' + new Date(data.expiry),
        icon_url: 'https://i.imgur.com/wSTFkRM.png',
    },
};
*/