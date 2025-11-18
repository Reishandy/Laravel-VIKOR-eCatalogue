<?php

use App\Http\Controllers\Criterion\CriterionController;
use App\Http\Controllers\Item\ItemController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard'); // TODO: Remove dashboard?

    Route::get('/criteria', [CriterionController::class, 'index'])->name('criteria.index');
    Route::get('/criteria/{criterion}', [CriterionController::class, 'show'])->name('criteria.show');
    Route::post('/criteria', [CriterionController::class, 'store'])->name('criteria.store');
    Route::put('/criteria/{criterion}', [CriterionController::class, 'update'])->name('criteria.update');
    Route::delete('/criteria/{criterion}', [CriterionController::class, 'destroy'])->name('criteria.destroy');

    Route::get('/items', [ItemController::class, 'index'])->name('items.index');
    Route::get('/items/{item}', [ItemController::class, 'show'])->name('items.show');
    Route::post('/items', [ItemController::class, 'store'])->name('items.store');
    Route::put('/items/{item}', [ItemController::class, 'update'])->name('items.update');
    Route::delete('/items/{item}', [ItemController::class, 'destroy'])->name('items.destroy');
});

require __DIR__ . '/settings.php';

// TODO: Main todo
//  - Remove all unused routes and files
//  - Email verification
//  - Price should be by default exist and cant be removed and follow the locale currency (create this in setup registration)
//  - Also all date should follow locale date format
//  - I
//  - Add warning to the items that there is field missing
//  - Make the logo use default but after the user upload change all logos to the user logo even in favicon
//  - Make sure all interactable elements have hover at least cursor pointer and for button pressed animation
//  - Add favicon and such
//  - Add meta tags for SEO and related
//  - Add hover / popover info for criterion types in table, create/edit forms, and item create/edit forms?
//  - Add db index
//  - I
//  - Obfuscate protected routes URLs?
//  - Performance optimizations UI/UX like prefetching, lazy loading, etc
//  - Animations and transitions with AOS?
//  - Dark mode for the public routes?
//  - Tests the full flow once all is done
//  - PWA support
