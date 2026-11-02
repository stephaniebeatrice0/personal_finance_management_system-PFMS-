<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransactionCategoriesRequest;
use App\Http\Requests\UpdateTransactionCategoriesRequest;
use App\Models\TransactionCategory as ModelsTransactionCategory;
use Illuminate\Http\JsonResponse;

class TransactionCategoriesController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(ModelsTransactionCategory::with('type')->orderBy('name')->get());
    }

    public function store(StoreTransactionCategoriesRequest $request): JsonResponse
    {
        $category = ModelsTransactionCategory::create(
            $request->validated() + ['created_by' => $request->user()->id]
        );

        return response()->json($category->load('type'), 201);
    }

    public function show(ModelsTransactionCategory $transactionCategory): JsonResponse
    {
        return response()->json($transactionCategory->load('type'));
    }

    public function update(UpdateTransactionCategoriesRequest $request, ModelsTransactionCategory $transactionCategory): JsonResponse
    {
        $transactionCategory->update(
            $request->validated() + ['altered_by' => $request->user()->id]
        );

        return response()->json($transactionCategory->load('type'));
    }

    public function destroy(ModelsTransactionCategory $transactionCategory): JsonResponse
    {
        if ($transactionCategory->transactions()->exists()) {
            return response()->json(['message' => 'Category is in use and cannot be deleted.'], 409);
        }

        $transactionCategory->delete();

        return response()->json(null, 204);
    }
}