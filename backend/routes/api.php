<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MoneyTransactionsController;
use App\Http\Controllers\TransactionCategoriesController;
use App\Http\Controllers\TransactionTypesController;
use App\Http\Controllers\UsersController;

//Public
Route::post('login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('users', [UsersController::class, 'store'])->middleware('throttle:10,1');

// Authenticated
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);

    // Users
     Route::apiResource('users', UsersController::class)->except(['store']);

    // Transactions
    Route::apiResource('transaction-types', TransactionTypesController::class)
        ->only(['index', 'show']);
    Route::apiResource('transaction-categories', TransactionCategoriesController::class);
    Route::apiResource('transactions', MoneyTransactionsController::class);
});
