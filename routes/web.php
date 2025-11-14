<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';

// TODO: Main todo
//  - Remove all unused routes and files
//  - Make registration one time only (if no account redirect to register, else to login)
//  - Check in login an register routes for account existence, or make a new middleware
//  - After registration redirect to setup page, if not done then force to do setup redirect
//  - Use middleware to check if setup is done or not,
//  - Include company details in setup (name, logo, address, locale/country, etc)
//  - Price should be by default exist and cant be removed and follow the locale currency (create this in setup registration)
//  - Also all date should follow locale date format
//  - I
//  - Performance optimizations UI/UX like prefetching, lazy loading, etc
//  - Animations and transitions with AOS?
