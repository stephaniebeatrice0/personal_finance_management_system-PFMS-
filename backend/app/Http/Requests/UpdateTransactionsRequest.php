<?php

namespace App\Http\Requests;

use App\Components\Transactions\Models\TransactionCategory;
use App\Models\TransactionCategory as ModelsTransactionCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateTransactionsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'transaction_type_id' => ['sometimes', 'integer', 'exists:par_transaction_types,id'],
            'transaction_category_id' => ['sometimes', 'integer', 'exists:par_transaction_categories,id'],
            'amount' => ['sometimes', 'numeric', 'min:0.01', 'max:9999999999.99'],
            'description' => ['nullable', 'string', 'max:255'],
            'transaction_date' => ['sometimes', 'date'],
        ];
    }

    /**
     * On update either field may be omitted, so compare the final
     * type/category pair against the stored values.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if ($validator->errors()->isNotEmpty()) {
                return;
            }

            $transaction = $this->route('transaction');

            $typeId = $this->input('transaction_type_id', $transaction->transaction_type_id);
            $categoryId = $this->input('transaction_category_id', $transaction->transaction_category_id);

            $matches = ModelsTransactionCategory::where('id', $categoryId)
                ->where('transaction_type_id', $typeId)
                ->exists();

            if (! $matches) {
                $validator->errors()->add(
                    'transaction_category_id',
                    'The selected category does not belong to the selected transaction type.'
                );
            }
        });
    }
}
