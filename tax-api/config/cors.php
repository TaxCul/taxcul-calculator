<?php

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000'], // your Next.js frontend
    'allowed_headers' => ['*'],
    'supports_credentials' => false,
];
