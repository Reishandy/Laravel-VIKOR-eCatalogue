<?php

namespace App\Http\Controllers\Criterion;

use App\Http\Controllers\Controller;
use App\Http\Requests\Criterion\StoreCriterionRequest;
use App\Http\Requests\Criterion\UpdateCriterionRequest;
use App\Models\Criterion;
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
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCriterionRequest $request) // : RedirectResponse
    {
        //
        dd($request->all());

        // TODO: Return redirect with flash message, also on error too so wrap in try catch
        // TODO: IS infinite handling
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCriterionRequest $request, Criterion $criterion)
    {
        //
        dd($request->all());

        // TODO: No edit price criterion by isPriceCriterion
        // TODO: IS infinite handling
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Criterion $criterion)
    {
        //
        // dd($criterion);
        // TODO: Remove testing throw an exception
        try {
            throw new \Exception('Delete criterion not implemented yet.');
        } catch (\Exception $exception) {
            return redirect()->route('criteria.index')->with('error', 'Failed to delete criterion.')
                ->with('description', $exception->getMessage())
                ->with('timestamp', now()->timestamp);
        }


        // TODO: No delete price criterion by isPriceCriterion
    }
}
