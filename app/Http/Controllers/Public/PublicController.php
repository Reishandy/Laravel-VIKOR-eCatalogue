<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Criterion;
use App\Models\Item;
use App\Models\User;
use Illuminate\Support\Collection;

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

        // Apply SPK weights logic for ranking/ordering
        if ($spkWeights) {
            $weights = json_decode($spkWeights, true);
            \Log::info('SPK Weights received:', $weights);

            // Get all items with criteria for ranking calculation
            $allItemsForRanking = $query
                ->with('criteria')
                ->get();

            // Apply VIKOR ranking
            $rankedItems = $this->applyVikorRanking($allItemsForRanking, $weights);

            // Get paginated items while preserving the ranking
            $page = $request->get('page', 1);
            $perPage = 12;

            // Create a custom paginator
            $currentPageItems = $rankedItems->slice(($page - 1) * $perPage, $perPage)->values();

            $items = new \Illuminate\Pagination\LengthAwarePaginator(
                $currentPageItems,
                $rankedItems->count(),
                $perPage,
                $page,
                ['path' => $request->url(), 'query' => $request->query()]
            );
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

    /**
     * Apply VIKOR ranking algorithm to items based on criteria weights
     */
    private function applyVikorRanking(Collection $items, array $weights)
    {
        if ($items->isEmpty() || empty($weights)) {
            return $items->map(function ($item) {
                $item->rank = 1;
                $item->vikor_score = 0;
                $item->vikor_s = 0;
                $item->vikor_r = 0;
                $item->vikor_q = 0;
                return $item;
            });
        }

        // Step 1: Prepare decision matrix and normalize weights
        $decisionMatrix = [];
        $criteriaIds = array_keys($weights);
        $normalizedWeights = $this->normalizeWeights($weights);

        // Get criteria types (benefit/cost)
        $criteriaTypes = Criterion::whereIn('id', $criteriaIds)
            ->pluck('type', 'id')
            ->toArray();

        // Build decision matrix
        foreach ($items as $item) {
            $row = [];
            foreach ($criteriaIds as $criterionId) {
                $criterionValue = $item->criteria->firstWhere('id', $criterionId)?->pivot?->value ?? 0;
                $row[$criterionId] = $criterionValue;
            }
            $decisionMatrix[$item->id] = $row;
        }

        // Step 2: Calculate best and worst values for each criterion
        $bestValues = [];
        $worstValues = [];

        foreach ($criteriaIds as $criterionId) {
            $values = array_column($decisionMatrix, $criterionId);
            if ($criteriaTypes[$criterionId] === 'benefit') {
                $bestValues[$criterionId] = max($values);
                $worstValues[$criterionId] = min($values);
            } else { // cost criterion
                $bestValues[$criterionId] = min($values);
                $worstValues[$criterionId] = max($values);
            }
        }

        // Step 3: Calculate S, R, and Q values for each alternative
        $sValues = [];
        $rValues = [];

        foreach ($decisionMatrix as $itemId => $criteriaValues) {
            $s = 0;
            $r = 0;

            foreach ($criteriaValues as $criterionId => $value) {
                $weight = $normalizedWeights[$criterionId];
                $best = $bestValues[$criterionId];
                $worst = $worstValues[$criterionId];

                // Avoid division by zero
                if ($best == $worst) {
                    $normalizedGap = 0;
                } else {
                    $normalizedGap = ($best - $value) / ($best - $worst);
                }

                $s += $weight * $normalizedGap;
                $r = max($r, $weight * $normalizedGap);
            }

            $sValues[$itemId] = $s;
            $rValues[$itemId] = $r;
        }

        // Step 4: Calculate Q values
        $sStar = min($sValues);
        $sMinus = max($sValues);
        $rStar = min($rValues);
        $rMinus = max($rValues);

        $qValues = [];
        $v = 0.5; // Default v parameter for VIKOR (can be adjusted)

        foreach ($sValues as $itemId => $s) {
            if ($sMinus == $sStar) {
                $sPart = 0;
            } else {
                $sPart = ($s - $sStar) / ($sMinus - $sStar);
            }

            if ($rMinus == $rStar) {
                $rPart = 0;
            } else {
                $rPart = ($rValues[$itemId] - $rStar) / ($rMinus - $rStar);
            }

            $qValues[$itemId] = $v * $sPart + (1 - $v) * $rPart;
        }

        // Step 5: Sort items by Q value (ascending - lower Q is better)
        $sortedItems = $items->sortBy(function ($item) use ($qValues) {
            return $qValues[$item->id] ?? 999;
        });

        // Step 6: Assign ranks and additional VIKOR data
        $rank = 1;
        $rankedItems = collect();

        foreach ($sortedItems as $item) {
            $item->rank = $rank++;
            $item->vikor_score = $qValues[$item->id] ?? 0;
            $item->vikor_s = $sValues[$item->id] ?? 0;
            $item->vikor_r = $rValues[$item->id] ?? 0;
            $item->vikor_q = $qValues[$item->id] ?? 0;
            $rankedItems->push($item);
        }

        return $rankedItems;
    }

    /**
     * Normalize weights so they sum to 1
     */
    private function normalizeWeights(array $weights)
    {
        $total = array_sum($weights);

        if ($total == 0) {
            return $weights;
        }

        $normalized = [];
        foreach ($weights as $criterionId => $weight) {
            $normalized[$criterionId] = $weight / $total;
        }

        return $normalized;
    }
}
