<?php

namespace App\Http\Controllers;

use App\Models\TransactionType;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class TransactionTypesController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(TransactionType::orderBy('name')->get());
    }

    public function show(TransactionType $transactionType): JsonResponse
    {
        return response()->json($transactionType->load('categories'));
    }
}
