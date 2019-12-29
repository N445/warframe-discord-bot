<?php

namespace App\Command;

use App\Helper\Clients\DiscordClient;
use App\Model\Discord;
use App\Service\DiscordApi;
use App\Service\Warframe;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class WarframeCommand extends Command
{
    protected static $defaultName = 'app:warframe';

    
    /**
     * @var DiscordApi
     */
    private $discordApi;
    /**
     * @var Warframe
     */
    private $warframe;
    
    /**
     * WarframeCommand constructor.
     * @param string|null $name
     * @param DiscordApi $discordApi
     * @param Warframe $warframe
     */
    public function __construct(string $name = null, DiscordApi $discordApi, Warframe $warframe)
    {
        $this->discordApi = $discordApi;
        $this->warframe = $warframe;
        parent::__construct($name);
    }
    
    protected function configure()
    {
        $this
            ->setDescription('Warframe');
    }
    
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        
        $data = $this->warframe->getSorties();
        
        dump($data);
        
        $embeds = array_map(function ($variant) {
            return [
                "title" => $variant->node,
                "description" => sprintf('
                Description : %s
                Modifier : %s', $variant->modifierDescription, $variant->modifier
                ),
                "color" => DiscordApi::COLOR_SUCCESS,
            ];
        }, $data->variants);
        
        $message = new Discord();
        $message
            ->setContent('Les  sorties du jour')
            ->setUsername('Warframe')
            //->setAvatarUrl('http://tgo.robin-parisot.fr/images/the-glory-owl.png')
            ->setEmbeds($embeds);
        
        $this->discordApi->setWebHook(DiscordClient::WEB_HOOK_DEV);
        $this->discordApi->sendMessage($message);
        
        $io->success('You have a new command! Now make it your own! Pass --help to see your options.');
        
        return 0;
    }
}
