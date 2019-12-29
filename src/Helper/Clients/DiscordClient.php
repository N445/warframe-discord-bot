<?php
/**
 * Created by PhpStorm.
 * User: Robin
 * Date: 07/06/2019
 * Time: 19:39
 */

namespace App\Helper\Clients;

use GuzzleHttp\Client;

class DiscordClient extends Client
{
    const WEB_HOOK_GLORY_OWL         = 'https://discordapp.com/api/webhooks/586614783097307183/IjYdWeNZKYFTY8TcZFEb-KbaiPeBZOp0b21eGiXDLvnGrzc36mh29msuY3N81I8YDTQ3';
    const WEB_HOOK_GLORY_OWL_ALMANAX = 'https://discordapp.com/api/webhooks/587657137870602261/377UbI33A2IHd307PbiXavt8cD9bvuom9NCx-JmddI19XVnp4ne6UgF1txsXr2_tcBAY';
    const WEB_HOOK_DEV               = 'https://discordapp.com/api/webhooks/577967665981947934/R7b7x2pFNCgy8OdA70uOs_okzaHRT6LVcNI_uBQijSHd1ouScZZS93zWtuyPQQicgFGG';
}