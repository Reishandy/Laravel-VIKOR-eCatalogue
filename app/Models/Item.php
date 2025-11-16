<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Item extends Model
{
    /** @use HasFactory<\Database\Factories\ItemFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'description',
        'image',
    ];

    /**
     * The criteria that belong to the item.
     */
    public function criteria(): BelongsToMany
    {
        return $this->belongsToMany(Criterion::class, 'criterion_item')
                    ->withPivot('value');
    }
}
