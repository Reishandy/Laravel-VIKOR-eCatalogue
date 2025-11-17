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
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCriterionRequest $request, Criterion $criterion)
    {
        //
        dd($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Criterion $criterion)
    {
        //
        dd($criterion);

        // TODO: No delete private criterion by isPriceCriterion
    }
}
