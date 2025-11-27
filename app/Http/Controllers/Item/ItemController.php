<?php

namespace App\Http\Controllers\Item;

use App\Http\Controllers\Controller;
use App\Http\Requests\Item\StoreItemRequest;
use App\Http\Requests\Item\UpdateItemRequest;
use App\Models\Criterion;
use App\Models\Item;
use App\Services\ImageStorageService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ItemController extends Controller
{
    private ImageStorageService $imageStorageService;

    public function __construct(ImageStorageService $imageStorageService)
    {
        $this->imageStorageService = $imageStorageService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $request = request();
        $query = Item::query();

        $total = $query->count();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $items = $query->with('criteria')->orderBy('id', 'desc')->paginate(10);
        $criteria = Criterion::all();

        return Inertia::render('items/index', [
            'items' => $items,
            'criteria' => $criteria,
            'total' => $total,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreItemRequest $request)
    {
        try {
            DB::transaction(function () use ($request) {
                // Create the item
                $itemData = [
                    'user_id' => auth()->id(),
                    'name' => $request->name,
                    'description' => $request->description,
                ];

                // Handle image upload
                if ($request->hasFile('image') && $request->file('image')->isValid()) {
                    $storedPaths = $this->imageStorageService->storeImages(
                        [$request->file('image')],
                        'items'
                    );
                    $itemData['image'] = $storedPaths[0];
                }

                $item = Item::create($itemData);

                // Prepare pivot data for all criteria
                $pivotData = [];
                $criteria = Criterion::where('user_id', auth()->id())->get();

                foreach ($criteria as $criterion) {
                    // Find the submitted value for this criterion
                    $submittedField = collect($request->fields)->firstWhere('id', $criterion->id);
                    $value = $submittedField['value'] ?? 0;

                    // Validate against max_value if not infinite
                    if ($criterion->max_value != -1 && $value > $criterion->max_value) {
                        $value = $criterion->max_value;
                    }

                    $pivotData[$criterion->id] = [
                        'value' => $value,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                // Attach all criteria to the item
                $item->criteria()->attach($pivotData);
            });

            return redirect()->route('items.index')
                ->with('success', 'Item created successfully.')
                ->with('description', $request->name . ' has been created.')
                ->with('timestamp', now()->timestamp);

        } catch (\Exception $exception) {
            return redirect()->route('items.index')
                ->with('error', 'Failed to create item.')
                ->with('description', $exception->getMessage())
                ->with('timestamp', now()->timestamp);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateItemRequest $request, Item $item)
    {
        try {
            DB::transaction(function () use ($request, $item) {
                // Update basic item data
                $updateData = [
                    'name' => $request->name,
                    'description' => $request->description,
                ];

                // Handle image update
                if ($request->hasFile('image') && $request->file('image')->isValid()) {
                    $storedPaths = $this->imageStorageService->storeImages(
                        [$request->file('image')],
                        'items',
                        $item->image
                    );
                    $updateData['image'] = $storedPaths[0];
                } elseif ($request->has('remove_image') && $request->remove_image) {
                    if ($item->image) {
                        $this->imageStorageService->storeImages([], 'items', $item->image);
                    }
                    $updateData['image'] = null;
                }

                $item->update($updateData);

                // Update pivot values for all criteria
                $criteria = Criterion::where('user_id', auth()->id())->get();
                $pivotUpdates = [];

                foreach ($criteria as $criterion) {
                    // Find the submitted value for this criterion
                    $submittedField = collect($request->fields)->firstWhere('id', $criterion->id);

                    if ($submittedField) {
                        $value = $submittedField['value'];

                        // Validate against max_value if not infinite
                        if ($criterion->max_value != -1 && $value > $criterion->max_value) {
                            $value = $criterion->max_value;
                        }

                        $pivotUpdates[$criterion->id] = ['value' => $value];
                    }
                }

                // Sync the pivot data (update existing, don't detach missing)
                if (!empty($pivotUpdates)) {
                    $item->criteria()->syncWithoutDetaching($pivotUpdates);
                }
            });

            return redirect()->route('items.index')
                ->with('success', 'Item updated successfully.')
                ->with('description', $request->name . ' has been updated.')
                ->with('timestamp', now()->timestamp);

        } catch (\Exception $exception) {
            return redirect()->route('items.index')
                ->with('error', 'Failed to update item.')
                ->with('description', $exception->getMessage())
                ->with('timestamp', now()->timestamp);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $item)
    {
        try {
            DB::transaction(function () use ($item) {
                // Delete the image file if exists
                if ($item->image) {
                    Storage::disk('public')->delete($item->getRawOriginal('image'));
                }

                // Detach all criteria relationships
                $item->criteria()->detach();

                // Delete the item
                $item->delete();
            });

            return redirect()->route('items.index')
                ->with('success', 'Item deleted successfully.')
                ->with('description', $item->name . ' has been deleted.')
                ->with('timestamp', now()->timestamp);

        } catch (\Exception $exception) {
            return redirect()->route('items.index')
                ->with('error', 'Failed to delete item.')
                ->with('description', $exception->getMessage())
                ->with('timestamp', now()->timestamp);
        }
    }
}
