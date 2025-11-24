<?php

namespace App\Services;

use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\ImageManager;
use Ramsey\Uuid\Uuid;
use Illuminate\Support\Facades\Storage;

class ImageStorageService
{
    private ImageManager $imageManager;

    public function __construct()
    {
        $this->imageManager = new ImageManager(Driver::class);
    }

    public function storeImages(array $images, string $pathPrefix, ?string $oldImage = null): array
    {
        // Remove old image if provided
        if ($oldImage) {
            $relativeOldImage = str_replace('/storage/', '', $oldImage);
            Storage::disk('public')->delete($relativeOldImage);
        }

        $storedPaths = [];

        foreach ($images as $image) {
            $processedImage = $this->imageManager->read($image)
                ->encode(new WebpEncoder(quality: 80));

            $filename = Uuid::uuid4()->toString() . '.webp';
            $path = $pathPrefix . '/' . $filename;

            Storage::disk('public')->put($path, $processedImage);
            $storedPaths[] = $path;
        }

        return $storedPaths;
    }
}
