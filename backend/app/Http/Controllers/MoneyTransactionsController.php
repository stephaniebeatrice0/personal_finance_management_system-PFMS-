<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransactionsRequest as RequestsStoreTransactionsRequest;
use App\Http\Requests\UpdateTransactionsRequest as RequestsUpdateTransactionsRequest;
use App\Models\MoneyTransaction;
use Illuminate\Http\JsonResponse;

class MoneyTransactionsController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            MoneyTransaction::with(['type', 'category'])
                ->latest('transaction_date')
                ->get()
        );
    }

    public function store(RequestsStoreTransactionsRequest $request): JsonResponse
    {
        $transaction = MoneyTransaction::create(
            $request->validated() + ['created_by' => $request->user()->id]
        );

        return response()->json($transaction->load(['type', 'category']), 201);
    }

    public function show(MoneyTransaction $transaction): JsonResponse
    {
        return response()->json($transaction->load(['type', 'category']));
    }

    public function update(RequestsUpdateTransactionsRequest $request, MoneyTransaction $transaction): JsonResponse
    {
        $transaction->update(
            $request->validated() + ['updated_by' => $request->user()->id]
        );

        return response()->json($transaction->load(['type', 'category']));
    }

    public function destroy(MoneyTransaction $transaction): JsonResponse
    {
        $transaction->delete();

        return response()->json(null, 204);
    }
}