<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTransactionCategoriesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $category = $this->route('transaction_category');
        $typeId = $this->input('transaction_type_id', $category->transaction_type_id);

        return [
            'transaction_type_id' => ['sometimes', 'integer', 'exists:par_transaction_types,id'],
            'name' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('par_transaction_categories', 'name')
                    ->where('transaction_type_id', $typeId)
                    ->ignore($category->id),
            ],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }
}
