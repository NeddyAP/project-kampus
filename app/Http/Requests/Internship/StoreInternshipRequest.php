<?php

namespace App\Http\Requests\Internship;

use App\Models\Internship;
use Illuminate\Foundation\Http\FormRequest;

class StoreInternshipRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'dosen_id' => 'required|exists:users,id',
            'category' => 'required|in:' . implode(',', [Internship::CATEGORY_KKL, Internship::CATEGORY_KKN]),
            'company_name' => 'required|string|max:255',
            'company_address' => 'required|string|max:500',
            'company_phone' => 'required|string|max:20',
            'supervisor_name' => 'required|string|max:255',
            'supervisor_phone' => 'required|string|max:20',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'cover_letter' => 'required|file|mimes:pdf|max:2048',
        ];
    }
}
