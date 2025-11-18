<?php

namespace App\Http\Requests\Item;

use App\Models\Criterion;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateItemRequest extends FormRequest
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
        $userId = auth()->id();

        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
            'fields' => 'required|array|min:1',
            'fields.*.id' => [
                'required',
                'integer',
                Rule::exists('criteria', 'id')->where('user_id', $userId)
            ],
            'fields.*.value' => [
                'required',
                'numeric',
                'min:1',
                function ($attribute, $value, $fail) {
                    // Extract the field index from the attribute name (e.g., "fields.0.value" -> 0)
                    $fieldIndex = explode('.', $attribute)[1];
                    $criterionId = $this->input("fields.{$fieldIndex}.id");

                    if ($criterionId) {
                        $criterion = Criterion::where('id', $criterionId)
                            ->where('user_id', auth()->id())
                            ->first();

                        if ($criterion) {
                            // Skip max value validation for infinite criteria (max_value = -1)
                            if ($criterion->max_value != -1 && $value > $criterion->max_value) {
                                $criterionName = $criterion->name;
                                $maxValue = $criterion->max_value;
                                $fail("The value for {$criterionName} must not exceed {$maxValue}.");
                            }

                            // Validate that price field (id=1) has a value
                            if ($criterion->id == 1 && empty($value)) {
                                $fail("Price field is required.");
                            }
                        } else {
                            $fail("Invalid criterion selected.");
                        }
                    }
                }
            ],
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
            'name.required' => 'Item name is required.',
            'name.string' => 'Item name must be a string.',
            'name.max' => 'Item name must not exceed 255 characters.',

            'description.string' => 'Description must be a string.',

            'image.image' => 'The file must be an image.',
            'image.mimes' => 'The image must be a JPEG, JPG, PNG, GIF, or WebP file.',
            'image.max' => 'The image size must not exceed 2MB.',

            'fields.required' => 'At least one criterion field is required.',
            'fields.array' => 'Fields must be provided as an array.',
            'fields.min' => 'At least one criterion field is required.',

            'fields.*.id.required' => 'Criterion ID is required for each field.',
            'fields.*.id.integer' => 'Criterion ID must be an integer.',
            'fields.*.id.exists' => 'Selected criterion does not exist or you do not have permission to use it.',

            'fields.*.value.required' => 'Value is required for each criterion.',
            'fields.*.value.numeric' => 'Value must be a number.',
            'fields.*.value.min' => 'Value must be at least 1.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        // Map field names to more readable names for error messages
        $attributes = [
            'fields.*.value' => 'criterion value',
        ];

        // Add specific attributes for each criterion if we have the data
        if ($this->has('fields')) {
            foreach ($this->input('fields') as $index => $field) {
                $criterionId = $field['id'] ?? null;
                if ($criterionId) {
                    $criterion = Criterion::find($criterionId);
                    if ($criterion) {
                        $attributes["fields.{$index}.value"] = strtolower($criterion->name) . ' value';
                    }
                }
            }
        }

        return $attributes;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation()
    {
        // Ensure fields is always an array, even if empty
        if (!$this->has('fields') || !is_array($this->fields)) {
            $this->merge([
                'fields' => []
            ]);
        }

        // Filter out any empty field entries and ensure proper data types
        $filteredFields = [];
        foreach (array_values($this->fields) as $index => $field) {
            if (!empty($field['id']) && isset($field['value'])) {
                $filteredFields[$index + 1] = [
                    'id' => (int)$field['id'],
                    'value' => is_numeric($field['value']) ? (float)$field['value'] : $field['value']
                ];
            }
        }

        $this->merge([
            'fields' => $filteredFields
        ]);
    }
}
