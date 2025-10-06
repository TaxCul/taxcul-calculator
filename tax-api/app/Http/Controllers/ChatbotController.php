<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AIService;

class ChatbotController extends Controller {
    protected $aiService;

    public function __construct(AIService $aiService) {
        $this->aiService = $aiService;
    }

    public function chat(Request $request) {
        $request->validate(['query' => 'required|string']);
        $userInput = $request->input('query');
        $response = $this->aiService->getResponse($userInput);
        return response()->json(['response' => $response]);
    }
}
