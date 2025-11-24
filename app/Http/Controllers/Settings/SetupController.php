<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\StoreSetupRequest;
use App\Http\Requests\Settings\UpdateSetupRequest;
use App\Services\ImageStorageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SetupController extends Controller
{
    private ImageStorageService $imageStorageService;

    public function __construct(ImageStorageService $imageStorageService)
    {
        $this->imageStorageService = $imageStorageService;
    }

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
            $storedPaths = $this->imageStorageService->storeImages(
                [$request->file('logo')],
                'logos'
            );

            $request->user()->logo = $storedPaths[0];
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
            $storedPaths = $this->imageStorageService->storeImages(
                [$request->file('logo')],
                'logos',
                $request->user()->logo
            );

            $request->user()->logo = $storedPaths[0];
        }

        $request->user()->save();

        return redirect()->route('setup.edit');
    }
}
