<?php

use App\Http\Controllers\Criterion\CriterionController;
use App\Http\Controllers\Item\ItemController;
use App\Http\Controllers\Public\PublicController;
use Illuminate\Support\Facades\Route;

Route::get('/', PublicController::class)->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Please excuse this, I'm to lazy to change it everywhere (◡ ‿ ◡ ✿)
    Route::redirect('dashboard', '/items')->name('dashboard');

    Route::get('/criteria', [CriterionController::class, 'index'])->name('criteria.index');
    Route::post('/criteria', [CriterionController::class, 'store'])->name('criteria.store');
    Route::put('/criteria/{criterion}', [CriterionController::class, 'update'])->name('criteria.update');
    Route::delete('/criteria/{criterion}', [CriterionController::class, 'destroy'])->name('criteria.destroy');

    Route::get('/items', [ItemController::class, 'index'])->name('items.index');
    Route::post('/items', [ItemController::class, 'store'])->name('items.store');
    Route::post('/items/{item}', [ItemController::class, 'update'])->name('items.update');
    Route::delete('/items/{item}', [ItemController::class, 'destroy'])->name('items.destroy');
});

require __DIR__ . '/settings.php';
