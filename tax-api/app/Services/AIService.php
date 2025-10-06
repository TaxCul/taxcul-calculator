<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class AIService {
    protected $client;
    protected $apiKey;
    protected $baseUrl;

    public function __construct() {
        $this->client = new Client();
        $this->apiKey = env('POE_API_KEY');
        $this->baseUrl = "https://api.poe.com/v1";
    }

    public function getResponse($userInput) {
        try {
            $response = $this->client->post("{$this->baseUrl}/chat/completions", [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'model' => 'Assistant',
                    'messages' => [
                        ['role' => 'user', 'content' => $userInput],
                    ],
                ],
            ]);

            $data = json_decode($response->getBody(), true);
            return $data['choices'][0]['message']['content'] ?? 'No response';
        } catch (RequestException $e) {
            return 'Error: ' . $e->getMessage();
        }
    }
}