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
    Route::get('/criteria/{criterion}', [CriterionController::class, 'show'])->name('criteria.show');
    Route::post('/criteria', [CriterionController::class, 'store'])->name('criteria.store');
    Route::put('/criteria/{criterion}', [CriterionController::class, 'update'])->name('criteria.update');
    Route::delete('/criteria/{criterion}', [CriterionController::class, 'destroy'])->name('criteria.destroy');

    Route::get('/items', [ItemController::class, 'index'])->name('items.index');
    Route::get('/items/{item}', [ItemController::class, 'show'])->name('items.show');
    Route::post('/items', [ItemController::class, 'store'])->name('items.store');
    Route::post('/items/{item}', [ItemController::class, 'update'])->name('items.update');
    Route::delete('/items/{item}', [ItemController::class, 'destroy'])->name('items.destroy');
});

require __DIR__ . '/settings.php';

// TODO: Main todo
//  - Remove all unused routes and files
//  - Email verification
//  - Price should be by default exist and cant be removed and follow the locale currency (create this in setup registration)
//  - Also all date should follow locale date format
//  - I
//  - Make the logo use default but after the user upload change all logos to the user logo even in favicon
//  - Make sure all interactable elements have hover at least cursor pointer and for button pressed animation
//  - Add meta tags for SEO and related
//  - Add db index
//  - Make sure that company logo is shown in the public routes
//  - I
//  - Obfuscate protected routes URLs?
//  - Performance optimizations UI/UX like prefetching, lazy loading, etc
//  - Animations and transitions with AOS?
//  - Dark mode for the public routes?
//  - Tests the full flow once all is done
//  - PWA support
//  - I
//  - Change admin to looks like the public site?
