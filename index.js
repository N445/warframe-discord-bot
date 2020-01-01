const Discord = require('discord.js');
const client = new Discord.Client();
const Emoji = require("discord-emoji");
const Items = require('warframe-items')
const Patchlogs = require('warframe-patchlogs')
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
    // Si le message ne commence pas parle préfix ou si il est envoyé par le bot alors on zappe
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const options = [];
    const args = message.content.slice(prefix.length).split(' ');
    const cmd = args.shift().toLowerCase();

    $.each(args, function (key, value) {
        options[value.split('=')[0]] = value.split('=')[1];
    });

    // Parcours les actions et appèle dynamiquement les fonctions qui correspondent
    if (cmd in getActions()) {
        getActions()[cmd].action(message, options);
    } else {
        helpFunction(message, options);
    }
});

client.login(token);

const newsFunction = function news(message, options) {
    runUrl(function (data) {
        data = data.news;
        const embed = getBaseEmbed();
        embed.setTitle('Les news').setTimestamp(new Date());
        $.each(data.reverse(), function (key, value) {
            embed.addField(moment(new Date(value.date)).fromNow(), value.message);
        });

        message.channel.send({embed: embed});
    });
}

const alertsFunction = function alerts(message, options) {
    runUrl(function (data) {
        data = data.alerts;

        const embed = getBaseEmbed();
        embed.setTitle('Les alertes');

        $.each(data, function (key, value) {
            embed.addField(value.mission.reward.asString, `Description => ${value.mission.description} \n
                    Lieu => ${value.mission.node} \n
                    Type => ${value.mission.type} \n
                    Faction => ${value.mission.faction} \n
                    Fin => ${moment(new Date(value.expiry)).fromNow()} \n
                    <================================================>
                    `);
        });
        message.channel.send({embed: embed});
    });
}

const sortiesFunction = function sorties(message, options) {
    runUrl(function (data) {
        data = data.sortie;
        const embed = getBaseEmbed();
        embed.setTitle(data.boss + ' en ' + data.faction)
            .setFooter('Expire dans ' + moment(new Date(data.expiry)).fromNow());

        $.each(data.variants, function (key, value) {
            embed.addField("Mission => " + value.missionType, "Modifier => " + value.modifier + "\n Lieu => " + value.node);
        });

        message.channel.send({embed: embed});
    });
}

const syndicateMissionFunction = function syndicateMission(message, options) {
    runUrl(function (data) {
        var data = data.syndicateMissions;

        if ('desc' === options['-o']) {
            data = data.reverse();
        }

        //limit = 2;
        if (options['-l'] != undefined) {
            var limit = options['-l'];
        }

        if (limit != undefined) {
            data = data.slice(0, limit);
        }

        const embed = getBaseEmbed();
        embed.setTitle('Missions syndicates');

        $.each(data, function (key, mission) {
            embed.addField(mission.syndicate, `Fin => ${moment(new Date(mission.expiry)).fromNow()}`, true);
        });
        message.channel.send({embed: embed});
    });
}

const changeLogFunction = function changeLog(message, options) {
    var limit = 6;
    var search = {};
    if (options['-n'] != undefined) {
        search.name = options['-n'];
    }
    if (options['-t'] != undefined) {
        search.type = options['-n'];
    }
    if (options['-l'] != undefined) {
        limit = options['-l'];
    }
    console.log(isEmpty(search), search);
    if (!isEmpty(search)) {
        patchs = Patchlogs.getItemChanges(search);
    } else {
        patchs = Patchlogs.posts;
    }

    $.each(patchs.slice(0, limit), function (key, value) {
        console.log(value);
    })

}

const helpFunction = function help(message, options) {
    const embed = getBaseEmbed();
    embed.setTitle('Liste des commandes')
        .setTimestamp(new Date())
    ;

    $.each(getActions(), function (commande, value) {
        var helpCmd = value.altLabel ? value.altLabel : commande
        embed.addField(prefix + helpCmd, value.description);
    });
    embed.addField('Des recommendations ?', 'https://github.com/N445/warframe-discord-bot/issues/new');

    message.channel.send({embed: embed});
}

const testFunction = function (message, option) {
    /*const items = new Items().filter(i => i.name === 'Baza');
    $.each(items, function (key, value) {
        console.log(value);
    })*/
    const patchs = Patchlogs.getItemChanges({'name': 'Ivara Prime', 'type': 'warframe'});
    $.each(patchs, function (key, value) {
        console.log(value);
    })
    message.channel.send(Emoji.nature.cat);
}

function getBaseEmbed() {
    return new Discord.MessageEmbed()
        .setTitle('Warframe bot')
        .setColor('BLUE')
        .attachFiles(['./assets/images/bot-logo.jpg'])
        .setAuthor('Warframe bot', 'attachment://bot-logo.jpg', 'https://github.com/N445/warframe-discord-bot')
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

function getActions() {
    return {
        'news': {
            action: newsFunction,
            description: 'Liste les dernières news'
        },
        'alerts': {
            action: alertsFunction,
            description: 'Liste les alertes'
        },
        'sorties': {
            action: sortiesFunction,
            description: 'Liste les 3 sorties du jour'
        },
        'syndicatemission': {
            action: syndicateMissionFunction,
            altLabel: 'syndicateMission [-o=desc] [-l=2]',
            description: 'Liste les missions syndicate\n **-o** défini l\'ordre d\'affichage\n**-l** (L minuscule) défini un nombre max de résultat'
        },
        'changelog': {
            action: changeLogFunction,
            description: 'changelog'
        },
        'help': {
            action: helpFunction,
            description: 'Affiche cet aide'
        },
        'test': {
            action: testFunction,
            description: 'Commande de test'
        },
    };
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
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