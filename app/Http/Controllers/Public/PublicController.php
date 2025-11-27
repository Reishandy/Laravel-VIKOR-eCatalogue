<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Criterion;
use App\Models\Item;
use App\Models\User;

class PublicController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke()
    {
        $request = request();
        $search = $request->filled('search') ? trim($request->search) : null;
        $spkWeights = $request->filled('spk_weights') ? $request->spk_weights : null;

        $query = Item::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $searchTerm = "%{$search}%";
                $q->where('items.name', 'like', $searchTerm)
                    ->orWhere('items.description', 'like', $searchTerm);
            });
        }

        // TODO: Apply SPK weights logic here for ranking/ordering
        if ($spkWeights) {
            $weights = json_decode($spkWeights, true);
            // You'll implement the SPK algorithm here later
            // For now, just receive the weights
            \Log::info('SPK Weights received:', $weights);

            // TODO: Add proper ranking logic later
            // For now, add rank field set to 1 when weights exist
            $items = $query
                ->with('criteria')
                ->orderBy('items.id', 'desc')
                ->paginate(12);

            // Add rank field to each item
            $items->getCollection()->transform(function ($item) {
                $item->rank = 1;
                return $item;
            });
        } else {
            $items = $query
                ->with('criteria')
                ->orderBy('items.id', 'desc')
                ->paginate(12);
        }

        $user = User::first();
        $criteria = Criterion::all();

        return inertia('public/index', [
            'items' => $items,
            'criteria' => $criteria,
            'search_query' => $search ?? '',
            'spk_weights' => $spkWeights,
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
