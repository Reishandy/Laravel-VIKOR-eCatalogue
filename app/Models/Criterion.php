<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Criterion extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'type',
        'max_value',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::deleting(function (Criterion $criterion) {
            if ($criterion->isPriceCriterion()) {
                throw new \Exception('Price criterion cannot be deleted.');
            }
        });
    }

    /**
     * Check if this is the price criterion.
     */
    public function isPriceCriterion(): bool
    {
        return $this->name === 'Price';
    }

    /**
     * The items that belong to the criterion.
     */
    public function items(): BelongsToMany
    {
        return $this->belongsToMany(Item::class, 'criterion_item')
            ->withPivot('value');
    }
}
