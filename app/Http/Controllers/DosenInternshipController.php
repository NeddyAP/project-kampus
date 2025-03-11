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

        $upcomingSupervisions = $this->supervisionService->getUpcomingSupervisions($user, [
            'search' => $request->supervision_search,
            'date' => $request->supervision_date,
            'per_page' => $request->supervision_per_page ?? 10,
        ]);

        $guidances = InternshipSupervision::with(['internship.mahasiswa'])
            ->whereHas('internship', function ($query) {
                $query->where('dosen_id', auth()->id());
            })
            ->latest()
            ->get()
            ->map(function ($guidance) {
                return [
                    'id' => $guidance->id,
                    'title' => $guidance->title,
                    'notes' => $guidance->notes,
                    'created_at' => $guidance->created_at,
                    'internship' => [
                        'id' => $guidance->internship->id,
                        'category' => $guidance->internship->category,
                        'company_name' => $guidance->internship->company_name,
                        'status' => $guidance->internship->status,
                        'mahasiswa' => [
                            'id' => $guidance->internship->mahasiswa->id,
                            'name' => $guidance->internship->mahasiswa->name,
                        ],
                    ],
                ];
            });

        $attendances = InternshipLog::where('type', 'ATTENDANCE')
            ->whereHas('internship', function ($query) {
                $query->where('dosen_id', auth()->id());
            })
            ->with(['internship.mahasiswa'])
            ->latest()
            ->get();

        return Inertia::render('Dosen/Bimbingan/Index', [
            'internships' => $internships,
            'upcomingSupervisions' => $upcomingSupervisions,
            'guidances' => $guidances,
            'attendances' => $attendances,
            'filters' => $request->only(['search', 'status', 'supervision_search', 'supervision_date']),
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

        return Inertia::render('Dosen/Bimbingan/Show', [
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

        return Inertia::render('Dosen/Bimbingan/Attendance', [
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
