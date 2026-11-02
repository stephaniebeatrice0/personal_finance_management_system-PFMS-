<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('money_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_type_id')
                ->constrained('par_transaction_types')
                ->restrictOnDelete();
            $table->foreignId('transaction_category_id')
                ->constrained('par_transaction_categories')
                ->restrictOnDelete();
            $table->decimal('amount', 12, 2);
            $table->string('description')->nullable();
            $table->date('transaction_date')->index();

            $table->foreignId('created_by')
                ->constrained('users')
                ->restrictOnDelete();
            $table->timestamp('created_on')->useCurrent();

            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamp('updated_on')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('money_transactions');
    }
};
