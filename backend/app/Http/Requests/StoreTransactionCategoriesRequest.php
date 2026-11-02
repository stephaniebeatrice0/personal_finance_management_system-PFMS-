<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTransactionCategoriesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'transaction_type_id' => ['required', 'integer', 'exists:par_transaction_types,id'],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('par_transaction_categories', 'name')
                    ->where('transaction_type_id', $this->input('transaction_type_id')),
            ],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }
}
