const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const routes = require('./js/fos_js_routes.json');
const Routing = require('./../vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router.min.js');
//var $ = jQuery = require('jquery/dist/jquery.min');

var jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM();
const {document} = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

Routing.setRoutingData(routes);

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (message.content === '!sorties') {
        $.ajax({
            url: 'https://api.warframestat.us/pc/sortie',
            method: "GET",
            crossOrigin: true,
            success: function (data) {
                message.channel.send({embed: getEmbedSortie(data)});
            }
        })
    }
});

client.login(auth.token);


function getEmbedSortie(data) {
    const embed = {
        color: 0x0099ff,
        title: data.boss + ' en ' + data.faction,
        //url: 'https://discord.js.org',
        /*author: {
            name: 'Some name',
            icon_url: 'https://i.imgur.com/wSTFkRM.png',
            url: 'https://discord.js.org',
        },*/
        //description: 'Some description here',
        /*thumbnail: {
            url: 'https://i.imgur.com/wSTFkRM.png',
        },*/
        fields: [],
        /*image: {
            url: 'https://i.imgur.com/wSTFkRM.png',
        },*/
        timestamp: new Date(data.expiry),
        /*footer: {
            text: 'Fin d\'événement dans ' + new Date(data.expiry),
            //icon_url: 'https://i.imgur.com/wSTFkRM.png',
        },*/
    };
    $.each(data.variants, function (key, value) {
        embed.fields.push({
            name: "Mission => " + value.missionType,
            value: "Modifier => " + value.modifier + "\n Lieu => " + value.node,
        });
        /*embed.fields.push({
            name: '\u200b',
            value: '\u200b',
        });*/
    });

    return embed;
}