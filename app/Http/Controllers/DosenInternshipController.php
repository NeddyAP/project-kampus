<?php

namespace App\Http\Controllers;

use App\Http\Requests\Supervision\CreateGuidanceScheduleRequest;
use App\Http\Requests\Supervision\RecordAttendanceRequest;
use App\Models\Internship;
use App\Models\InternshipSupervision;
use App\Services\InternshipSupervisionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DosenInternshipController extends Controller
{
    protected $supervisionService;

    public function __construct(InternshipSupervisionService $supervisionService)
    {
        $this->supervisionService = $supervisionService;
    }

    /**
     * Display a listing of the internships supervised by the authenticated dosen.
     */
    public function index(Request $request)
    {
        return Inertia::render('dosen/bimbingan/index');
    }

    public function create()
    {
        return Inertia::render('dosen/bimbingan/create');
    }

    public function upcoming(Request $request)
    {
        $user = Auth::user();
        $query = InternshipSupervision::with(['internship.mahasiswa'])
            ->where('dosen_id', $user->id)
            ->where('scheduled_at', '>=', now());

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%")
                    ->orWhereHas('internship.mahasiswa', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Date Filter
        if ($request->has('date')) {
            $query->whereDate('scheduled_at', $request->date);
        }

        // Sorting
        $sortField = $request->input('sort_field', 'scheduled_at');
        $sortOrder = $request->input('sort_order', 'asc');
        $allowedSortFields = ['scheduled_at', 'title', 'notes'];

        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortOrder);
        }

        // Pagination
        $perPage = $request->input('per_page', 10);
        $upcomingSupervisions = $query->paginate($perPage);

        return Inertia::render('dosen/bimbingan/upcoming', [
            'upcomingSupervisions' => $upcomingSupervisions,
            'filters' => $request->only(['search', 'date', 'sort_field', 'sort_order', 'per_page']),
        ]);
    }

    public function list(Request $request)
    {
        $dosenId = Auth::id(); // Mengambil ID dosen yang login

        $filters = $request->only(['search', 'status', 'category', 'sort_field', 'sort_order', 'per_page']);

        $query = Internship::query()
            ->where('dosen_id', $dosenId)
            ->with('mahasiswa'); // Sesuaikan dengan relasi yang ada

        // Filter berdasarkan pencarian
        if (! empty($filters['search'])) {
            $query->whereHas('mahasiswa', function (Builder $query) use ($filters) {
                $query->where('name', 'like', '%'.$filters['search'].'%');
            });
        }

        // Filter berdasarkan status
        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Filter berdasarkan kategori (KKL/KKN)
        if (! empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        // Pengurutan
        $sortField = $filters['sort_field'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortField, $sortOrder);

        $perPage = $filters['per_page'] ?? 10;
        $internships = $query->paginate($perPage)->withQueryString();

        return Inertia::render('dosen/bimbingan/list', [
            'internships' => $internships,
            'filters' => $filters,
        ]);
    }

    /**
     * Display the specified internship.
     */
    public function show(Internship $internship)
    {
        if ($internship->dosen_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $internship->load(['mahasiswa:id,name', 'logs.user:id,name', 'supervisions.dosen:id,name']);

        return Inertia::render('dosen/bimbingan/show', [
            'internship' => $internship,
        ]);
    }

    /**
     * Create a new guidance schedule for all supervised students.
     */
    public function createGuidanceSchedule(CreateGuidanceScheduleRequest $request)
    {
        $this->supervisionService->createGuidanceSchedule(
            $request->validated(),
            Auth::user()
        );

        return back()->with('message', 'Jadwal bimbingan berhasil dibuat untuk semua mahasiswa bimbingan.');
    }

    /**
     * Show the attendance form for a supervision.
     */
    public function showAttendanceForm(InternshipSupervision $supervision)
    {
        if ($supervision->dosen_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $mahasiswa = $this->supervisionService->getActiveStudents(Auth::user());

        return Inertia::render('dosen/bimbingan/attendance', [
            'supervision' => $supervision,
            'mahasiswa' => $mahasiswa,
        ]);
    }

    /**
     * Record attendance for the supervision.
     */
    public function recordAttendance(RecordAttendanceRequest $request, InternshipSupervision $supervision)
    {
        if ($supervision->dosen_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $this->supervisionService->recordAttendance(
            $request->validated()['data'],
            $supervision,
            Auth::user()
        );

        return redirect()
            ->route('dosen.bimbingan.index')
            ->with('message', 'Kehadiran bimbingan berhasil dicatat untuk semua mahasiswa.');
    }
}
