<?php

namespace App\Http\Requests\Supervision;

use Illuminate\Foundation\Http\FormRequest;

class RecordAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'data' => 'required|array',
            'data.*.status' => 'required|in:HADIR,IZIN,SAKIT,TIDAK_HADIR',
            'data.*.notes' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'data.required' => 'Data kehadiran wajib diisi',
            'data.array' => 'Format data kehadiran tidak valid',
            'data.*.status.required' => 'Status kehadiran wajib diisi',
            'data.*.status.in' => 'Status kehadiran tidak valid',
            'data.*.notes.max' => 'Catatan maksimal 1000 karakter',
        ];
    }
} 