<?php

namespace App\Controller;

use App\Service\Warframe;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class AjaxController
 * @package App\Controller
 * @Route("/ajax")
 */
class AjaxController extends AbstractController
{
    
    /**
     * @var Warframe
     */
    private $warframe;
    
    /**
     * AjaxController constructor.
     * @param Warframe $warframe
     */
    public function __construct(Warframe $warframe)
    {
        $this->warframe = $warframe;
    }
    
    /**
     * @Route("/sortie", name="GET_SORTIE", options={"expose":true})
     */
    public function sortie()
    {
        return new JsonResponse( $this->warframe->getSorties());
    }
}
