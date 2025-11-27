<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\User;

class PublicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // TODO: Change to invokable controller

        $request = request();
        $search = $request->filled('search') ? trim($request->search) : null;

        $query = Item::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $searchTerm = "%{$search}%";
                $q->where('items.name', 'like', $searchTerm)
                    ->orWhere('items.description', 'like', $searchTerm);
            });
        }

        $items = $query
            ->with('criteria')
            ->orderBy('items.id', 'desc')
            ->paginate(12);
        $user = User::first();

        return inertia('public/index', [
            'items' => $items,
            'search_query' => $search ?? '',
            'company_data' => [
                'name' => $user?->company_name ?? config('app.name'),
                'email' => $user?->company_email ?? '',
                'description' => $user?->company_description ?? '',
                'address' => $user?->company_address ?? '',
                'currency' => $user?->currency ?? '',
                'logo' => $user?->logo ?? '',
            ]
        ]);
    }
}
