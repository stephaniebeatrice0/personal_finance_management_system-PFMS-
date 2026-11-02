<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTransactionsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'transaction_type_id' => ['required', 'integer', 'exists:par_transaction_types,id'],
            'transaction_category_id' => [
                'required',
                'integer',
                Rule::exists('par_transaction_categories', 'id')
                    ->where('transaction_type_id', $this->input('transaction_type_id')),
            ],
            'amount' => ['required', 'numeric', 'min:0.01', 'max:9999999999.99'],
            'description' => ['nullable', 'string', 'max:255'],
            'transaction_date' => ['required', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'transaction_category_id.exists' => 'The selected category does not belong to the selected transaction type.',
        ];
    }
}
