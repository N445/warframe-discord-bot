Discord BOT Warframe
=

Installation
==

Créate auth.json file in root dir

```json
{
  "prefix": "prefix",
  "token": "token"
}
```

```bash
yarn install
node index.js
```

Commandes
==
```bash
news
    Liste les dernières news

alerts
    Liste les alertes

sorties
    Liste les 3 sorties du jour

syndicateMission [-o=desc] [-l=2]
    Liste les missions syndicate
    -o défini l'ordre d'affichage
    -l (L minuscule) défini un nombre max de résultat

w!help
    Affiche cet aide
```

Sources
==
Warframe API => https://docs.warframestat.us

Discord API => https://discordjs.guide/creating-your-bot/commands-with-user-input.html#basic-arguments

Discord Guid => https://discordjs.guide