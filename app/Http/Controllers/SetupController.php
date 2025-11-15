<?php

namespace App\Http\Controllers;

use App\Http\Requests\Settings\StoreSetupRequest;
use App\Http\Requests\Settings\UpdateSetupRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SetupController extends Controller
{
    /**
     * Display the setup page
     */
    public function index(): Response
    {
        return Inertia::render('settings/setup');
    }

    /**
     * Store a setup detail in storage.
     */
    public function store(StoreSetupRequest $request): RedirectResponse
    {
        // TODO
        dd($request);
    }

    /**
     * Update setup detail in storage.
     */
    public function update(UpdateSetupRequest $request): RedirectResponse
    {
        // TODO
        dd($request);
    }
}
