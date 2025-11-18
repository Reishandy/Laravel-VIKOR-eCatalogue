<?php

namespace App\Http\Controllers\Criterion;

use App\Http\Controllers\Controller;
use App\Http\Requests\Criterion\StoreCriterionRequest;
use App\Http\Requests\Criterion\UpdateCriterionRequest;
use App\Models\Criterion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class
CriterionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $request = request();
        $query = Criterion::query();

        $total = $query->count();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%");
            });
        }

        $criteria = $query->orderBy('id', 'desc')
            ->paginate(10);

        return Inertia::render('criteria/index', [
            'criteria' => $criteria,
            'total' => $total,
        ]);
    }


    /**
     * Display the specified resource.
     */
    public function show(Criterion $criterion)
    {
        // TODO
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCriterionRequest $request): RedirectResponse
    {
        try {
            $criterion = Criterion::create([
                'user_id' => auth()->id(),
                'name' => $request->name,
                'description' => $request->description,
                'type' => $request->type,
                'max_value' => $request->is_infinite ? -1 : $request->max_value,
            ]);

            // Attach to all existing items with default value 0
            // 0 Will indicate to frontend that the value is not set yet
            $itemIds = $criterion->user->items()->pluck('id');
            if ($itemIds->isNotEmpty()) {
                $pivotData = $itemIds->map(function ($itemId) use ($criterion) {
                    return [
                        'item_id' => $itemId,
                        'criterion_id' => $criterion->id,
                        'value' => 0,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                })->toArray();

                DB::table('criterion_item')->insert($pivotData);
            }

            return redirect()->route('criteria.index')->with('success', 'Criterion created successfully.')
                ->with('description', $criterion->name . ' has been created.')
                ->with('timestamp', now()->timestamp);
        } catch (\Exception $exception) {
            return redirect()->route('criteria.index')->with('error', 'Failed to create criterion.')
                ->with('description', $exception->getMessage())
                ->with('timestamp', now()->timestamp);

        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCriterionRequest $request, Criterion $criterion)
    {
        try {
            $criterion->update([
                'name' => $request->name,
                'description' => $request->description,
                'type' => $request->type,
                'max_value' => $request->is_infinite ? -1 : $request->max_value,
            ]);

            // Update existing item criterion values if max_value is reduced
            if (!$request->is_infinite) {
                DB::table('criterion_item')
                    ->where('criterion_id', $criterion->id)
                    ->where('value', '>', $request->max_value)
                    ->update(['value' => $request->max_value]);
            }

            return redirect()->route('criteria.index')->with('success', 'Criterion updated successfully.')
                ->with('description', $criterion->name . ' has been updated.')
                ->with('timestamp', now()->timestamp);
        } catch (\Exception $exception) {
            return redirect()->route('criteria.index')->with('error', 'Failed to update criterion.')
                ->with('description', $exception->getMessage())
                ->with('timestamp', now()->timestamp);

        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Criterion $criterion)
    {
        try {
            if ($criterion->isPriceCriterion()) {
                return redirect()->route('criteria.index')->with('error', 'Cannot delete price criterion.')
                    ->with('description', 'The price criterion is essential and cannot be deleted.')
                    ->with('timestamp', now()->timestamp);
            }

            $criterion->delete();

            return redirect()->route('criteria.index')->with('success', 'Criterion deleted successfully.')
                ->with('description', $criterion->name . ' has been deleted.')
                ->with('timestamp', now()->timestamp);
        } catch (\Exception $exception) {
            return redirect()->route('criteria.index')->with('error', 'Failed to delete criterion.')
                ->with('description', $exception->getMessage())
                ->with('timestamp', now()->timestamp);
        }
    }
}
