<?php
/**
 * Created by PhpStorm.
 * User: Robin
 * Date: 08/06/2019
 * Time: 13:30
 */

namespace App\Model;

class Discord
{
    /**
     * @var string|null
     */
    private $content;

    /**
     * @var string|null
     */
    private $username;

    /**
     * @var string|null
     */
    private $avatar_url;

    /**
     * @var boolean|null
     */
    private $tts;

    /**
     * @var string|null
     */
    private $file;

    /**
     * @var array|null
     */
    private $embeds;

    /**
     * @var string|null
     */
    private $payload_json;

    /**
     * @return string|null
     */
    public function getContent(): ?string
    {
        return $this->content;
    }

    /**
     * @param string $content
     * @return Discord
     */
    public function setContent(string $content): Discord
    {
        $this->content = $content;
        return $this;
    }

    /**
     * @return null|string
     */
    public function getUsername(): ?string
    {
        return $this->username;
    }

    /**
     * @param null|string $username
     * @return Discord
     */
    public function setUsername(?string $username): Discord
    {
        $this->username = $username;
        return $this;
    }

    /**
     * @return null|string
     */
    public function getAvatarUrl(): ?string
    {
        return $this->avatar_url;
    }

    /**
     * @param null|string $avatar_url
     * @return Discord
     */
    public function setAvatarUrl(?string $avatar_url): Discord
    {
        $this->avatar_url = $avatar_url;
        return $this;
    }

    /**
     * @return bool|null
     */
    public function getTts(): ?bool
    {
        return $this->tts;
    }

    /**
     * @param bool|null $tts
     * @return Discord
     */
    public function setTts(?bool $tts): Discord
    {
        $this->tts = $tts;
        return $this;
    }

    /**
     * @return null|string
     */
    public function getFile(): ?string
    {
        return $this->file;
    }

    /**
     * @param null|string $file
     * @return Discord
     */
    public function setFile(?string $file): Discord
    {
        $this->file = $file;
        return $this;
    }

    /**
     * @return null|array
     */
    public function getEmbeds(): ?array
    {
        return $this->embeds;
    }

    /**
     * @param null|array $embeds
     * @return Discord
     */
    public function setEmbeds(?array $embeds): Discord
    {
        $this->embeds = $embeds;
        return $this;
    }

    /**
     * @return null|string
     */
    public function getPayloadJson(): ?string
    {
        return $this->payload_json;
    }

    /**
     * @param null|string $payload_json
     * @return Discord
     */
    public function setPayloadJson(?string $payload_json): Discord
    {
        $this->payload_json = $payload_json;
        return $this;
    }



}