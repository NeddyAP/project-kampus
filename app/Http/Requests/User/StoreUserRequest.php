<?php

namespace App\Http\Requests\User;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'string', Rule::in(array_keys(User::getRoleNames()))],
            // Admin profile fields
            'employee_id' => ['required_if:role,admin', 'nullable', 'string', 'unique:admin_profiles,employee_id'],
            'department' => ['required_if:role,admin', 'nullable', 'string'],
            'position' => ['required_if:role,admin', 'nullable', 'string'],
            'employment_status' => ['required_if:role,admin', 'nullable', Rule::in(['Tetap', 'Kontrak', 'Magang'])],
            'join_date' => ['required_if:role,admin', 'nullable', 'date'],
            'phone_number' => ['nullable', 'string'],
            'address' => ['nullable', 'string'],
            'supervisor_name' => ['nullable', 'string'],
            'work_location' => ['required_if:role,admin', 'nullable', 'string'],
            // Dosen profile fields
            'nip' => ['required_if:role,dosen', 'nullable', 'string', 'unique:dosen_profiles,nip'],
            'bidang_keahlian' => ['required_if:role,dosen', 'nullable', 'string'],
            'pendidikan_terakhir' => ['required_if:role,dosen', 'nullable', 'string'],
            'jabatan_akademik' => ['required_if:role,dosen', 'nullable', 'string'],
            'status_kepegawaian' => ['required_if:role,dosen', 'nullable', Rule::in(['PNS', 'Non-PNS'])],
            'tahun_mulai_mengajar' => ['required_if:role,dosen', 'nullable', 'integer', 'min:1900', 'max:' . date('Y')],
            // Mahasiswa profile fields
            'nim' => ['required_if:role,mahasiswa', 'nullable', 'string', 'unique:mahasiswa_profiles,nim'],
            'program_studi' => ['required_if:role,mahasiswa', 'nullable', 'string'],
            'angkatan' => ['required_if:role,mahasiswa', 'nullable', 'integer', 'min:2000', 'max:' . (date('Y') + 1)],
            'status_akademik' => ['required_if:role,mahasiswa', 'nullable', Rule::in(['Aktif', 'Cuti', 'Lulus'])],
            'semester' => ['required_if:role,mahasiswa', 'nullable', 'integer', 'min:1', 'max:14'],
            'dosen_pembimbing_id' => [
                'nullable',
                function ($attribute, $value, $fail) {
                    // Only validate if role is mahasiswa and a value is provided
                    if ($this->role === 'mahasiswa' && $value !== null) {
                        $dosenExists = User::whereHas('roles', function ($query) {
                            $query->where('name', 'dosen');
                        })->where('id', $value)->exists();

                        if (!$dosenExists) {
                            $fail('Dosen pembimbing tidak valid.');
                        }
                    }
                }
            ],
            'ipk' => ['nullable', 'numeric', 'min:0', 'max:4.00'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama wajib diisi',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah terdaftar',
            'password.required' => 'Password wajib diisi',
            'password.min' => 'Password minimal 8 karakter',
            'role.required' => 'Role wajib dipilih',
            'role.in' => 'Role tidak valid',
            // Admin validation messages
            'employee_id.required_if' => 'ID Pegawai wajib diisi untuk admin',
            'employee_id.unique' => 'ID Pegawai sudah terdaftar',
            'department.required_if' => 'Departemen wajib diisi untuk admin',
            'position.required_if' => 'Jabatan wajib diisi untuk admin',
            'employment_status.required_if' => 'Status kepegawaian wajib dipilih untuk admin',
            'join_date.required_if' => 'Tanggal bergabung wajib diisi untuk admin',
            'work_location.required_if' => 'Lokasi kerja wajib diisi untuk admin',
            // Dosen validation messages
            'nip.required_if' => 'NIP wajib diisi untuk dosen',
            'nip.unique' => 'NIP sudah terdaftar',
            'bidang_keahlian.required_if' => 'Bidang keahlian wajib diisi untuk dosen',
            'pendidikan_terakhir.required_if' => 'Pendidikan terakhir wajib diisi untuk dosen',
            'jabatan_akademik.required_if' => 'Jabatan akademik wajib diisi untuk dosen',
            'status_kepegawaian.required_if' => 'Status kepegawaian wajib dipilih untuk dosen',
            'tahun_mulai_mengajar.required_if' => 'Tahun mulai mengajar wajib diisi untuk dosen',
            // Mahasiswa validation messages
            'nim.required_if' => 'NIM wajib diisi untuk mahasiswa',
            'nim.unique' => 'NIM sudah terdaftar',
            'program_studi.required_if' => 'Program studi wajib diisi untuk mahasiswa',
            'angkatan.required_if' => 'Angkatan wajib diisi untuk mahasiswa',
            'status_akademik.required_if' => 'Status akademik wajib dipilih untuk mahasiswa',
            'semester.required_if' => 'Semester wajib diisi untuk mahasiswa',
            'ipk.max' => 'IPK maksimal 4.00',
        ];
    }
}
