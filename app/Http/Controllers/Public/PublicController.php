<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Item;

class PublicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
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
            ->orderBy('items.id', 'desc')
            ->paginate(10);

        return inertia('public/index', [
            'items' => $items,
            'search_query' => $search ?? '',
        ]);
    }
}
