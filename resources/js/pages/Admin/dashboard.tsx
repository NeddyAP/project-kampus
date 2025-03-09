import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import { Activity, GraduationCap, School2, Users } from 'lucide-react';

interface Props {
    stats: {
        users: {
            total: number;
            dosen: number;
            mahasiswa: number;
        };
        internships: {
            total: number;
            menunggu: number;
            berjalan: number;
            selesai: number;
        };
    };
    recentActivities: Array<{
        id: number;
        description: string;
        causer_name: string;
        created_at: string;
    }>;
    recentInternships: Array<{
        id: number;
        mahasiswa_name: string;
        dosen_name: string | null;
        type: string;
        status: string;
        created_at: string;
    }>;
}

const Dashboard = ({ stats, recentActivities, recentInternships }: Props) => {
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Statistik Pengguna */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.users.total}</div>
                            <p className="text-muted-foreground text-xs">Total pengguna sistem</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Dosen</CardTitle>
                            <School2 className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.users.dosen}</div>
                            <p className="text-muted-foreground text-xs">Dosen pembimbing</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Mahasiswa</CardTitle>
                            <GraduationCap className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.users.mahasiswa}</div>
                            <p className="text-muted-foreground text-xs">Mahasiswa aktif</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Magang</CardTitle>
                            <Activity className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.internships.total}</div>
                            <p className="text-muted-foreground text-xs">Program magang aktif</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Statistik Magang */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Aktivitas Terbaru */}
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Aktivitas Terbaru</CardTitle>
                            <CardDescription>Aktivitas pengguna dalam sistem</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex gap-4">
                                        <div className="text-muted-foreground w-14 text-sm">{formatDate(activity.created_at, { dayOnly: true })}</div>
                                        <div>
                                            <div className="font-medium">{activity.description}</div>
                                            {activity.causer_name && <div className="text-muted-foreground text-sm">oleh {activity.causer_name}</div>}
                                        </div>
                                    </div>
                                ))}

                                {recentActivities.length === 0 && <div className="text-muted-foreground text-center">Belum ada aktivitas</div>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Magang Terbaru */}
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Magang Terbaru</CardTitle>
                            <CardDescription>Pengajuan magang terbaru</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {recentInternships.map((internship) => (
                                    <div key={internship.id} className="flex gap-4">
                                        <div className="text-muted-foreground w-14 text-sm">
                                            {formatDate(internship.created_at, { dayOnly: true })}
                                        </div>
                                        <div>
                                            <div className="font-medium">{internship.mahasiswa_name}</div>
                                            <div className="text-muted-foreground text-sm">
                                                {internship.type} - {internship.status.replace(/_/g, ' ')}
                                            </div>
                                            {internship.dosen_name && (
                                                <div className="text-muted-foreground text-sm">Pembimbing: {internship.dosen_name}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {recentInternships.length === 0 && (
                                    <div className="text-muted-foreground text-center">Belum ada pengajuan magang</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default Dashboard;
