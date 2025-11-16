<?php

namespace Database\Seeders;

use App\Models\Criterion;
use App\Models\Item;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user if it doesn't exist
         User::firstOrCreate(
             ['email' => 'test@example.com'],
             [
                 'name' => 'Admin',
                 'password' => 'password',
                 'email_verified_at' => now(),
             ]
         );

        // Create default criteria that every multi-criteria system should have
        $defaultCriteria = [
            [
                'name' => 'Quality',
                'description' => 'Build quality and materials',
                'type' => 'benefit',
                'max_value' => 10,
            ],
            [
                'name' => 'Features',
                'description' => 'Number of available features',
                'type' => 'benefit',
                'max_value' => 10,
            ],
            [
                'name' => 'Durability',
                'description' => 'Expected lifespan and robustness',
                'type' => 'benefit',
                'max_value' => 10,
            ]
        ];

        $criteria = collect();
        foreach ($defaultCriteria as $criterionData) {
            $criteria->push(Criterion::create($criterionData));
        }

        // Add 6 more random criteria
        $randomCriteria = Criterion::factory(6)->create();
        $allCriteria = $criteria->merge($randomCriteria);

        $items = Item::factory(50)->create();

        $attachments = [];
        foreach ($items as $item) {
            foreach ($allCriteria as $criterion) {
                $value = $this->generateMostRealisticValue($criterion, $item);

                $attachments[] = [
                    'item_id' => $item->id,
                    'criterion_id' => $criterion->id,
                    'value' => $value,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('criterion_item')->insert($attachments);
    }

    private function generateMostRealisticValue(Criterion $criterion, Item $item): int
    {
        $max = $criterion->max_value ?: 10;

        return match($criterion->name) {
            'Price' => $this->generateRealisticPrice($max, $item),
            'Quality' => $this->generateQualityScore($max, $item),
            'Features' => $this->generateFeaturesScore($max, $item),
            'Durability' => $this->generateDurabilityScore($max, $item),
            default => $this->generateGenericSmartValue($criterion, $max)
        };
    }

    private function generateRealisticPrice(int $maxPrice, Item $item): int
    {
        $categories = [
            'budget' => ['min' => 50, 'max' => 200, 'weight' => 4],
            'midrange' => ['min' => 201, 'max' => 500, 'weight' => 8],
            'premium' => ['min' => 501, 'max' => 800, 'weight' => 5],
            'luxury' => ['min' => 801, 'max' => $maxPrice, 'weight' => 3]
        ];

        return $this->getWeightedRandomValue($categories);
    }

    private function generateQualityScore(int $max, Item $item): int
    {
        // Quality often correlates with price indicators in the name
        $base = rand(3, $max);
        if (str_contains(strtolower($item->name), 'premium') ||
            str_contains(strtolower($item->name), 'professional')) {
            $base = min($max, $base + 2);
        }
        if (str_contains(strtolower($item->name), 'basic') ||
            str_contains(strtolower($item->name), 'economy')) {
            $base = max(1, $base - 2);
        }
        return $base;
    }

    private function generateFeaturesScore(int $max, Item $item): int
    {
        // Features often mentioned in description
        $base = rand(4, $max);
        $description = strtolower($item->description);

        $featureWords = ['feature', 'function', 'capability', 'option', 'mode'];
        $featureCount = 0;
        foreach ($featureWords as $word) {
            $featureCount += substr_count($description, $word);
        }

        return min($max, $base + min(3, $featureCount));
    }

    private function generateDurabilityScore(int $max, Item $item): int
    {
        // Durability often mentioned directly
        $base = rand(3, $max);
        $text = strtolower($item->name . ' ' . $item->description);

        if (str_contains($text, 'durable') || str_contains($text, 'robust') ||
            str_contains($text, 'long-lasting')) {
            $base = min($max, $base + 2);
        }
        if (str_contains($text, 'fragile') || str_contains($text, 'delicate')) {
            $base = max(1, $base - 2);
        }

        return $base;
    }

    private function generateGenericSmartValue(Criterion $criterion, int $max): int
    {
        return match($criterion->type) {
            'cost' => max(1, rand(1, (int)($max * 0.7))),
            'benefit' => rand(max(1, (int)($max * 0.4)), $max),
            default => rand(1, $max)
        };
    }

    private function getWeightedRandomValue(array $ranges): int
    {
        $totalWeight = array_sum(array_column($ranges, 'weight'));
        $random = rand(1, $totalWeight);
        $current = 0;

        foreach ($ranges as $range) {
            $current += $range['weight'];
            if ($random <= $current) {
                return rand($range['min'], $range['max']);
            }
        }

        return rand(100, 300); // fallback
    }
}
