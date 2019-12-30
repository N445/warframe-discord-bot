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
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const options = [];
    const args = message.content.slice(prefix.length).split(' ');
    const cmd = args.shift().toLowerCase();

    $.each(args, function (key, value) {
        options[value.split('=')[0]] = value.split('=')[1];
    });

    switch (cmd) {
        case `news`:
            news(message, options);
            break;
        case `alerts`:
            alerts(message, options);
            break;
        case `sorties`:
            sorties(message, options);
            break;
        case `syndicatemission`:
            syndicateMission(message, options);
            break;
        case `help`:
            help(message, options);
            break;
        default:
            help(message, options);
            break;
    }
});

client.login(token);

function news(message, options) {
    runUrl(function (data) {
        data = data.news;
        var embed = {
            color: 0x0099ff,
            title: 'Les news',
            fields: [],
            timestamp: new Date(),
        };
        $.each(data.reverse(), function (key, value) {
            embed.fields.push({
                name: moment(new Date(value.date)).fromNow(),
                value: value.message,
            });
        });

        message.channel.send({embed: embed});
    });
}

function alerts(message, options) {
    runUrl(function (data) {
        data = data.alerts;
        var embed = {
            color: 0x0099ff,
            title: 'Les alertes',
            fields: [],
            timestamp: new Date(),
        };
        $.each(data, function (key, value) {
            embed.fields.push({
                name: value.mission.reward.asString,
                value: `Description => ${value.mission.description} \n
                    Lieu => ${value.mission.node} \n
                    Type => ${value.mission.type} \n
                    Faction => ${value.mission.faction} \n
                    Fin => ${moment(new Date(value.expiry)).fromNow()} \n
                    <================================================>
                    `,
            });
        });
        message.channel.send({embed: embed});
    });
}

function sorties(message, options) {
    runUrl(function (data) {
        data = data.sortie;
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

        message.channel.send({embed: embed});
    });
}

function syndicateMission(message, options) {
    runUrl(function (data) {
        var data = data.syndicateMissions;

        if ('desc' === options['-o']) {
            data = data.reverse();
        }

        //limit = 2;
        if (options['-l'] != undefined) {
            var limit = options['-l'];
        }

        if(limit != undefined){
            data = data.slice(0, limit);
        }

        var embed = {
            color: 0x0099ff,
            title: 'Missions syndicates',
            fields: [],
            timestamp: new Date(),
        };
        $.each(data, function (key, mission) {
            /*var jobs = '';
            $.each(mission.jobs, function (key, job) {
                jobs += `Type => **${job.type}** \n`;
            });*/

            embed.fields.push({
                name: mission.syndicate,
                //value: `${jobs} \n Fin => ${moment(new Date(mission.expiry)).fromNow()}`,
                value: `Fin => ${moment(new Date(mission.expiry)).fromNow()}`,
                inline: true,
            });
        });
        message.channel.send({embed: embed});
    });
}

function help(message, options) {
    var embed = {
        color: 0x0099ff,
        title: 'Liste des commandes',
        fields: [{
            name: `${prefix}news`,
            value: 'Liste les dernières news'
        }, {
            name: `${prefix}alerts`,
            value: 'Liste les alertes'
        }, {
            name: `${prefix}sorties`,
            value: 'Liste les 3 sorties du jour'
        }, {
            name: `${prefix}syndicateMission [-o=desc] [-l=2]`,
            value: 'Liste les missions syndicate\n **-o** défini l\'ordre d\'affichage\n**-l** (L minuscule) défini un nombre max de résultat'
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

function runUrl(handleData) {
    $.ajax({
        url: 'https://api.warframestat.us/pc',
        method: "GET",
        crossOrigin: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Accept-Language', 'fr');
        },
        success: function (data) {
            handleData(data);
        }
    })
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