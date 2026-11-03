<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TransactionType extends Model
{
    protected $table = 'par_transaction_types';

    protected $fillable = [
        'name',
        'description',
        'created_by',
        'updated_by',
    ];

    public function categories(): HasMany
    {
        return $this->hasMany(TransactionCategory::class, 'transaction_type_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(MoneyTransaction::class, 'transaction_type_id');
    }
}
