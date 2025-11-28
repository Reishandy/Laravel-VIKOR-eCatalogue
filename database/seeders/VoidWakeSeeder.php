<?php

namespace Database\Seeders;

use App\Models\Criterion;
use App\Models\Item;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VoidWakeSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create the Company / Admin User
        $user = User::firstOrCreate(
            ['email' => 'acquisitions@voidwake.net'],
            [
                'name' => 'Admin Void-Wake',
                'password' => 'SOME-secure-!password*2122)that$is-long',
                'email_verified_at' => now(),
                'company_name' => 'Void-Wake Dynamics',
                'company_email' => 'acquisitions@voidwake.net',
                'company_description' => "Void-Wake Dynamics represents the pinnacle of private maritime security. Originally a military contractor, our Civilian Sector division brings declassified naval technology to the private market. We specialize in armored hydrofoils, stealth-hull cruisers, and kinetic-interceptor craft designed for corporate asset protection, anti-piracy operations, and high-risk executive transport. We don't just build ships; we build floating fortresses for the lawless waters of tomorrow.",
                'company_address' => 'Dock 94-B, The Carbon Spire, Neo-Kowloon Freeport, Sector 7',
                'currency' => 'USD',
            ]
        );

        // 2. Define and Create Criteria
        // We delete existing criteria for this user to avoid duplicates if re-running
        Criterion::where('user_id', $user->id)->delete();

        $criteriaDefinitions = [
            [
                'name' => 'Acquisition Cost', // Serves as the "Price"
                'desc' => 'The total cost to purchase the vessel, including standard armament licensing.',
                'type' => 'cost',
                'unit' => 'USD',
                'max_value' => -1, // Infinite
            ],
            [
                'name' => 'Max Velocity',
                'desc' => 'Top speed achievable in open water under combat load.',
                'type' => 'benefit',
                'unit' => 'Knots',
                'max_value' => 150,
            ],
            [
                'name' => 'Hull Integrity',
                'desc' => 'Composite armor rating and structural density against kinetic impact.',
                'type' => 'benefit',
                'unit' => 'pts',
                'max_value' => 2000,
            ],
            [
                'name' => 'Radar Signature',
                'desc' => 'The effective detection radius. Lower values indicate superior stealth capabilities.',
                'type' => 'cost',
                'unit' => 'm^2',
                'max_value' => 1000, // Worst case
            ],
            [
                'name' => 'Kinetic Output',
                'desc' => 'Total offensive damage output potential per second (DPS).',
                'type' => 'benefit',
                'unit' => 'MW',
                'max_value' => 1000, // Hypothetical max
            ],
            [
                'name' => 'Crew Requirement',
                'desc' => 'Minimum personnel required for optimal operation. Lower indicates higher AI automation.',
                'type' => 'cost',
                'unit' => 'pers',
                'max_value' => -1, // Infinite
            ],
        ];

        $criteriaMap = []; // To store name => id mapping
        foreach ($criteriaDefinitions as $def) {
            $crit = Criterion::create([
                'user_id' => $user->id,
                'name' => $def['name'],
                'description' => $def['desc'],
                'type' => $def['type'],
                'unit' => $def['unit'],
                'max_value' => $def['max_value'],
            ]);
            $criteriaMap[$def['name']] = $crit->id;
        }

        // 3. Define Ships (Items) and their Stats
        $ships = [
            [
                'name' => 'Wraith-X1',
                'class' => 'Interceptor',
                'desc' => 'A hyper-light reconnaissance craft. Paper-thin armor, but moves faster than most radar systems can track.',
                'stats' => ['Acquisition Cost' => 4500000, 'Max Velocity' => 145, 'Hull Integrity' => 150, 'Radar Signature' => 12, 'Kinetic Output' => 25, 'Crew Requirement' => 2]
            ],
            [
                'name' => 'Razorback Mk.II',
                'class' => 'Interceptor',
                'desc' => 'Standard issue border patrol hydrofoil. Good balance of speed and budget, widely used by private security.',
                'stats' => ['Acquisition Cost' => 5200000, 'Max Velocity' => 130, 'Hull Integrity' => 220, 'Radar Signature' => 25, 'Kinetic Output' => 40, 'Crew Requirement' => 3]
            ],
            [
                'name' => 'Viper-Strike',
                'class' => 'Interceptor',
                'desc' => 'Sacrifices all crew comfort for raw kinetic output on a small frame. A glass cannon for hit-and-run ops.',
                'stats' => ['Acquisition Cost' => 6800000, 'Max Velocity' => 135, 'Hull Integrity' => 180, 'Radar Signature' => 20, 'Kinetic Output' => 85, 'Crew Requirement' => 2]
            ],
            [
                'name' => 'Ghost-Manta',
                'class' => 'Interceptor',
                'desc' => 'Experimental stealth coating makes this nearly invisible to sensors, though maintenance costs are astronomical.',
                'stats' => ['Acquisition Cost' => 12000000, 'Max Velocity' => 110, 'Hull Integrity' => 200, 'Radar Signature' => 5, 'Kinetic Output' => 30, 'Crew Requirement' => 4]
            ],
            [
                'name' => 'Cobalt Dart',
                'class' => 'Interceptor',
                'desc' => 'An older generation interceptor. Cheap and reliable, but struggles against modern targeting systems.',
                'stats' => ['Acquisition Cost' => 2500000, 'Max Velocity' => 95, 'Hull Integrity' => 250, 'Radar Signature' => 45, 'Kinetic Output' => 35, 'Crew Requirement' => 5]
            ],
            [
                'name' => 'Sentinel-Class Frigate',
                'class' => 'Frigate',
                'desc' => 'The backbone of corporate fleets. Reliable armor and weaponry, capable of sustained independent operations.',
                'stats' => ['Acquisition Cost' => 25000000, 'Max Velocity' => 65, 'Hull Integrity' => 600, 'Radar Signature' => 120, 'Kinetic Output' => 150, 'Crew Requirement' => 15]
            ],
            [
                'name' => 'Aegis-7',
                'class' => 'Frigate',
                'desc' => 'Heavily modified for defensive escorts. Features reinforced plating at the cost of significantly reduced speed.',
                'stats' => ['Acquisition Cost' => 28000000, 'Max Velocity' => 45, 'Hull Integrity' => 850, 'Radar Signature' => 150, 'Kinetic Output' => 120, 'Crew Requirement' => 20]
            ],
            [
                'name' => 'Neon-Tide',
                'class' => 'Frigate',
                'desc' => 'A luxury-combat hybrid. High automation reduces crew needs, popular with executive VIP transport.',
                'stats' => ['Acquisition Cost' => 45000000, 'Max Velocity' => 80, 'Hull Integrity' => 550, 'Radar Signature' => 80, 'Kinetic Output' => 110, 'Crew Requirement' => 6]
            ],
            [
                'name' => 'Vector-Z',
                'class' => 'Frigate',
                'desc' => 'Built for aggressive engagement. Short operational range, but punches above its weight class in firepower.',
                'stats' => ['Acquisition Cost' => 22000000, 'Max Velocity' => 70, 'Hull Integrity' => 500, 'Radar Signature' => 110, 'Kinetic Output' => 210, 'Crew Requirement' => 18]
            ],
            [
                'name' => 'Iron-Hull MK.IV',
                'class' => 'Frigate',
                'desc' => 'An outdated decommissioned military hull refurbished for civilian use. Slow, ugly, but incredibly tough.',
                'stats' => ['Acquisition Cost' => 15000000, 'Max Velocity' => 40, 'Hull Integrity' => 700, 'Radar Signature' => 300, 'Kinetic Output' => 130, 'Crew Requirement' => 30]
            ],
            [
                'name' => 'Titan-Prime',
                'class' => 'Dreadnought',
                'desc' => 'A floating fortress. Prohibitively expensive, but guarantees dominance in any sector it occupies.',
                'stats' => ['Acquisition Cost' => 150000000, 'Max Velocity' => 25, 'Hull Integrity' => 1800, 'Radar Signature' => 600, 'Kinetic Output' => 850, 'Crew Requirement' => 80]
            ],
            [
                'name' => 'Behemoth-C',
                'class' => 'Dreadnought',
                'desc' => 'A cargo-hauler converted into a missile platform. High firepower and hull, but moves like a tectonic plate.',
                'stats' => ['Acquisition Cost' => 85000000, 'Max Velocity' => 15, 'Hull Integrity' => 1500, 'Radar Signature' => 800, 'Kinetic Output' => 600, 'Crew Requirement' => 120]
            ],
            [
                'name' => 'Void-Breaker',
                'class' => 'Dreadnought',
                'desc' => 'Uses experimental railgun tech. Massive kinetic output, but requires a large specialized crew to operate.',
                'stats' => ['Acquisition Cost' => 180000000, 'Max Velocity' => 30, 'Hull Integrity' => 1200, 'Radar Signature' => 550, 'Kinetic Output' => 950, 'Crew Requirement' => 100]
            ],
            [
                'name' => 'Hydra-Platform',
                'class' => 'Dreadnought',
                'desc' => 'A stationary defense platform with limited mobility. The ultimate cost-effective solution for static defense.',
                'stats' => ['Acquisition Cost' => 60000000, 'Max Velocity' => 5, 'Hull Integrity' => 2000, 'Radar Signature' => 900, 'Kinetic Output' => 700, 'Crew Requirement' => 40]
            ],
            [
                'name' => 'Eclipse-Class Carrier',
                'class' => 'Dreadnought',
                'desc' => 'Serves as a mobile command center. Features advanced AI integration, drastically reducing crew needs for its size.',
                'stats' => ['Acquisition Cost' => 220000000, 'Max Velocity' => 35, 'Hull Integrity' => 1600, 'Radar Signature' => 650, 'Kinetic Output' => 500, 'Crew Requirement' => 25]
            ]
        ];

        // 4. Loop through ships, create Items, and attach Pivot Data
        $pivotData = [];

        foreach ($ships as $shipData) {
            // Create the Item
            $item = Item::create([
                'user_id' => $user->id,
                'name' => $shipData['name'],
                // Format: "Dreadnought - A floating fortress..."
                'description' => $shipData['class'] . " - " . $shipData['desc'],
                // Optional: You could assign random tech images here later if you have them
                'image' => null,
            ]);

            // Prepare Pivot Entries
            foreach ($shipData['stats'] as $critName => $value) {
                if (isset($criteriaMap[$critName])) {
                    $pivotData[] = [
                        'criterion_id' => $criteriaMap[$critName],
                        'item_id' => $item->id,
                        'value' => $value,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
        }

        // 5. Bulk Insert Pivot Data
        // Insert in chunks to be safe, though 15 * 6 = 90 rows is small enough for one go.
        foreach (array_chunk($pivotData, 1000) as $chunk) {
            DB::table('criterion_item')->insert($chunk);
        }
    }
}
