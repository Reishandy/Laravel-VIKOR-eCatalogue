<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Criterion>
 */
class CriterionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => 1, // Assuming criteria are created for the only user in tests
            'name' => $this->faker->word(),
            'description' => $this->faker->sentence(),
            'type' => $this->faker->randomElement(['cost', 'benefit']),
            'max_value' => $this->faker->randomFloat(2, 1, 1000),
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
