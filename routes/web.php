<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('setup', function () {
        return Inertia::render('settings/setup');
    })->name('setup');

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard'); // TODO: Remove dashboard?
});

require __DIR__.'/settings.php';

// TODO: Main todo
//  - Remove all unused routes and files
//  - Make registration one time only (if no account redirect to register, else to login)
//  - Email verification
//  - Setup is done in the re
//  - Include company details in setup (name, logo, address, locale/country, etc)
//  - Price should be by default exist and cant be removed and follow the locale currency (create this in setup registration)
//  - Also all date should follow locale date format
//  - I
//  - Route middleware protection
//  - Deleting account should delete all data since this is only one account
//  - Add warning to the items that there is field missing
//  - Make the logo use default but after the user upload change all logos to the user logo even in favicon
//  - Modify logout button to be red
//  - Make sure all interactable elements have hover at least cursor pointer and for button pressed animation
//  - Table has searching, sorting, and pagination
//  - I
//  - Performance optimizations UI/UX like prefetching, lazy loading, etc
//  - Animations and transitions with AOS?
//  - Dark mode for the public routes?
//  - Tests the full flow once all is done
