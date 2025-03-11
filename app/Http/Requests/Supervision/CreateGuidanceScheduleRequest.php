<?php

namespace App\Http\Requests\Supervision;

use Illuminate\Foundation\Http\FormRequest;

class CreateGuidanceScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'notes' => 'required|string',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|date_format:H:i',
            'attachment' => 'nullable|file|max:5120', // 5MB max
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul bimbingan wajib diisi',
            'notes.required' => 'Catatan bimbingan wajib diisi',
            'date.required' => 'Tanggal bimbingan wajib diisi',
            'date.after_or_equal' => 'Tanggal bimbingan harus hari ini atau setelahnya',
            'time.required' => 'Waktu bimbingan wajib diisi',
            'time.date_format' => 'Format waktu tidak valid',
            'attachment.max' => 'Ukuran file lampiran maksimal 5MB',
        ];
    }
}
