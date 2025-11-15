<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard'); // TODO: Remove dashboard?
});

require __DIR__.'/settings.php';

// TODO: Main todo
//  - Remove all unused routes and files
//  - Email verification
//  - Price should be by default exist and cant be removed and follow the locale currency (create this in setup registration)
//  - Also all date should follow locale date format
//  - I
//  - Route middleware protection
//  - Add warning to the items that there is field missing
//  - Make the logo use default but after the user upload change all logos to the user logo even in favicon
//  - Make sure all interactable elements have hover at least cursor pointer and for button pressed animation
//  - Table has searching, sorting, and pagination
//  - Add <Head title="title" /> to every page
//  - Add favicon and such
//  - Add meta tags for SEO and related
//  - Check the side bar for appearance and prefetch
//  - Dont forget to change the form handling in settings
//  - I
//  - Obfuscate protected routes URLs?
//  - Performance optimizations UI/UX like prefetching, lazy loading, etc
//  - Animations and transitions with AOS?
//  - Dark mode for the public routes?
//  - Tests the full flow once all is done
//  - PWA support
