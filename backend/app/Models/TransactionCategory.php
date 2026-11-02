<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;

class TransactionCategory extends Model
{
    protected $table = 'par_transaction_categories';

    const CREATED_AT = 'created_on';
    const UPDATED_AT = 'altered_on';

    protected $fillable = [
        'name',
        'transaction_type_id',
        'description',
        'created_by',
        'altered_by',
    ];

    public function type(): BelongsTo
    {
        return $this->belongsTo(TransactionType::class, 'transaction_type_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(MoneyTransaction::class, 'transaction_category_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function alteredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'altered_by');
    }
}
