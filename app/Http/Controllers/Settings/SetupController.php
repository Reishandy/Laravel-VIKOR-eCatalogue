<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\StoreSetupRequest;
use App\Http\Requests\Settings\UpdateSetupRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
     * Show the company setup settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/setup-edit');
    }

    /**
     * Store a setup detail in storage.
     */
    public function store(StoreSetupRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();
        unset($validatedData['logo']);
        $request->user()->fill($validatedData);

        if ($request->hasFile('logo') && $request->file('logo') !== null) {
            // Delete the old logo if it exists
            if ($request->user()->logo) {
                Storage::disk('public')->delete($request->user()->logo);
            }

            $request->user()->logo = $request->file('logo')->store('logos', 'public');
        }

        $request->user()->save();

        return to_route('dashboard');
    }

    /**
     * Update setup detail in storage.
     */
    public function update(UpdateSetupRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();
        unset($validatedData['logo']);
        $request->user()->fill($validatedData);

        if ($request->hasFile('logo') && $request->file('logo') !== null) {
            // Delete the old logo if it exists
            if ($request->user()->logo) {
                Storage::disk('public')->delete($request->user()->logo);
            }

            $request->user()->logo = $request->file('logo')->store('logos', 'public');
        }

        $request->user()->save();

        return to_route('setup.edit');
    }
}
