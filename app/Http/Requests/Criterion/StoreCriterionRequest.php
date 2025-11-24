<?php

namespace App\Http\Requests\Criterion;

use Illuminate\Foundation\Http\FormRequest;

class StoreCriterionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'unit' => 'nullable|string|max:50',
            'type' => 'required|string|in:benefit,cost',
            'max_value' => [
                'required',
                'numeric',
                function ($attribute, $value, $fail) {
                    if (!$this->boolean('is_infinite') && $value < 1) {
                        $fail('Max value must be at least 1.');
                    }
                },
            ],
            'is_infinite' => 'required|boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Name is required.',
            'name.string' => 'Name must be a string.',
            'name.max' => 'Name must not exceed 255 characters.',

            'description.string' => 'Description must be a string.',

            'unit.string' => 'Unit must be a string.',
            'unit.max' => 'Unit must not exceed 50 characters.',

            'type.required' => 'Type is required.',
            'type.string' => 'Type must be a string.',
            'type.in' => 'Type must be either benefit or cost.',

            'max_value.required' => 'Max value is required.',
            'max_value.numeric' => 'Max value must be a number.',

            'is_infinite.required' => 'Is infinite is required.',
            'is_infinite.boolean' => 'Is infinite must be true or false.',
        ];
    }
}
