<?php

namespace App\Service;

use App\Client\Warframe as WarframeClient;

class Warframe
{
    /**
     * @var WarframeClient
     */
    private $warframeClient;
    
    /**
     * Warframe constructor.
     * @param WarframeClient $warframeClient
     */
    public function __construct(WarframeClient $warframeClient)
    {
        $this->warframeClient = $warframeClient;
    }
    
    /**
     * @return mixed
     */
    public function getSorties()
    {
        
        $result = $this->warframeClient->get('/pc/sortie', [
            'headers' => [
                'Accept-Language' => 'fr',
            ],
        ]);
        return json_decode($result->getBody()->getContents());
    }
}