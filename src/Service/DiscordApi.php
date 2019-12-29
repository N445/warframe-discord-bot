<?php
/**
 * Created by PhpStorm.
 * User: Robin
 * Date: 08/06/2019
 * Time: 13:21
 */

namespace App\Service;

use App\Helper\Clients\DiscordClient;
use App\Model\Discord;

class DiscordApi
{

    const COLOR_PRIMARY = '31743';
    const COLOR_INFO    = '1548984';
    const COLOR_WARNING = '16761095';
    const COLOR_DANGER  = '14431557';
    const COLOR_SUCCESS = '2664261';

    /**
     * @var DiscordClient
     */
    private $discordClient;

    private $webhook;

    public function __construct(DiscordClient $discordClient)
    {
        $this->discordClient = $discordClient;
    }

    public function setWebHook($webhook)
    {
        $this->webhook = $webhook;
    }

    /**
     * @param Discord $discord
     */
    public function sendMessage(Discord $discord)
    {
        $query = [
            'content'    => $discord->getContent(),
            'username'   => $discord->getUsername(),
            'avatar_url' => $discord->getAvatarUrl(),
            'file'       => $discord->getFile(),
            'embeds'     => $discord->getEmbeds(),
            "tts"        => $discord->getTts(),
        ];

        $query = $this->clearNullValues($query);

        $this->discordClient->post($_ENV['APP_ENV'] == 'dev' ? DiscordClient::WEB_HOOK_DEV : $this->webhook, ['json' => $query]);
    }

    private function clearNullValues($query)
    {
        $result = [];
        foreach ($query as $key => $item) {
            if (null !== $item) {
                $result[$key] = $item;
            }
        }
        return $result;
    }
}
