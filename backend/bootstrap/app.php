<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if (! ($request->expectsJson() || $request->is('api/*'))) {
                return null;
            }

            $bearer = $request->bearerToken();
            $token  = $bearer ? PersonalAccessToken::findToken($bearer) : null;

            if ($token) {
                $globalMinutes = config('sanctum.expiration');

                $expired = ($token->expires_at && $token->expires_at->isPast())
                    || ($globalMinutes && $token->created_at->lte(now()->subMinutes($globalMinutes)));

                if ($expired) {
                    return response()->json([
                        'message' => 'Your session has expired, please login again to continue',
                        'code'    => 'token_expired',
                    ], 401);
                }
            }

            return response()->json([
                'message' => 'Unauthenticated, please login to access system',
                'code'    => 'unauthenticated',
            ], 401);
        });
    })->create();
