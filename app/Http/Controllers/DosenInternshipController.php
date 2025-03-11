<?php

namespace App\Http\Controllers;

use App\Http\Requests\Supervision\CreateGuidanceScheduleRequest;
use App\Http\Requests\Supervision\RecordAttendanceRequest;
use App\Models\Internship;
use App\Models\InternshipLog;
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
        $upcomingSupervisions = $this->supervisionService->getUpcomingSupervisions($user, [
            'search' => $request->supervision_search,
            'date' => $request->supervision_date,
            'per_page' => $request->supervision_per_page ?? 10,
        ]);

        return Inertia::render('dosen/bimbingan/upcoming', [
            'upcomingSupervisions' => $upcomingSupervisions,
        ]);
    }

    public function list(Request $request)
    {
        $user = Auth::user();
        $internships = $user->internshipBimbingan()
            ->with(['mahasiswa:id,name', 'logs'])
            ->when($request->search, function ($query, $search) {
                $query->whereHas('mahasiswa', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate($request->per_page ?? 10);

        return Inertia::render('dosen/bimbingan/list', [
            'internships' => $internships,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Display the specified internship.
     */
    public function show(Internship $internship)
    {
        // Ensure the internship is supervised by the authenticated dosen
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
        // Ensure the supervision is owned by the authenticated dosen
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
        // Ensure the supervision is owned by the authenticated dosen
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
