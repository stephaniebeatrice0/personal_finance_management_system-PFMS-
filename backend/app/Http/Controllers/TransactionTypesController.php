<?php

namespace App\Http\Controllers;

use App\Models\TransactionType;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransactionTypesRequest;
use App\Http\Requests\UpdateTransactionTypesRequest;
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
    public function store(StoreTransactionTypesRequest $request): JsonResponse
    {
        $type = TransactionType::create(
            array_merge($request->validated(), ['created_by' => $request->user()->id])
        );

        return response()->json($type->load('categories'), 201);
    }
    public function update(UpdateTransactionTypesRequest $request, TransactionType $transactionType): JsonResponse
    {
        $transactionType->update(
            array_merge($request->validated(), ['altered_by' => $request->user()->id])
        );

        return response()->json($transactionType->load('categories'));
    }
}
