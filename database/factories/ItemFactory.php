<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Item>
 */
class ItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => 1, // Assuming items are created for the only user in tests
            'name' => $this->faker->word(),
            'description' => $this->faker->sentence(),
            'image' => 'favicon.svg'
        ];
    }

    /**
     * State to set a specific user_id.
     */
    public function forUser(int $userId): static
    {
        return $this->state(fn () => ['user_id' => $userId]);
    }
}
