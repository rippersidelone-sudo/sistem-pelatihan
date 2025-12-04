// resources/js/Pages/Coordinator/Dashboard.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function Dashboard({ auth, stats, upcomingBatches, pendingParticipants }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const statusData = {
        labels: ['Scheduled', 'Ongoing', 'Completed'],
        datasets: [{
            label: 'Batch Count',
            data: [stats?.scheduled_batches || 0, stats?.ongoing_batches || 0, stats?.completed_batches || 0],
            backgroundColor: '#3B82F6',
            borderRadius: 8,
            barThickness: 80,
        }]
    };

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) chartInstance.current.destroy();
            chartInstance.current = new Chart(chartRef.current, {
                type: 'bar',
                data: statusData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: '#f0f0f0' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }
        return () => chartInstance.current?.destroy();
    }, [stats]);

    const hasPending = pendingParticipants?.length > 0;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="font-semibold text-2xl text-gray-800 leading-tight">Dashboard Coordinator</h2>
                    <p className="text-sm text-gray-600 mt-1">Selamat datang, Koordinator Pelatihan</p>
                </div>
            }
        >
            <Head title="Coordinator Dashboard" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* REVIEW PENDAFTARAN — KARTU BESAR (hanya muncul kalau ada pending) */}
                    {hasPending && (
                        <div className="mb-8">
                            <div className="bg-white rounded-2xl shadow-lg border border-orange-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-5">
                                            <div className="bg-white/20 p-4 rounded-2xl">
                                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold">Menunggu Persetujuan</h3>
                                                <p className="text-lg opacity-90">{pendingParticipants.length} pendaftar baru</p>
                                            </div>
                                        </div>
                                        <Link
                                            href={route('coordinator.participants.index')}
                                            className="px-6 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition shadow-md"
                                        >
                                            Review Semua →
                                        </Link>
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-50">
                                    <div className="space-y-4">
                                        {pendingParticipants.slice(0, 5).map((p) => (
                                            <div key={p.id} className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm hover:shadow transition">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                        {p.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900">{p.name}</div>
                                                        <div className="text-sm text-gray-600">{p.email}</div>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(p.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                        {pendingParticipants.length > 5 && (
                                            <div className="text-center pt-4">
                                                <Link href={route('coordinator.participants.index')} className="text-orange-600 font-medium hover:text-orange-700">
                                                    Lihat {pendingParticipants.length - 5} pendaftar lainnya →
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                        <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-medium text-gray-600">Total Batch</div>
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{stats?.total_batches || 0}</div>
                        </div>
                        {/* Scheduled, Ongoing, Completed, Pending Approval, Total Peserta — tetap sama */}
                        <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-medium text-gray-600">Scheduled</div>
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-blue-600">{stats?.scheduled_batches || 0}</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-medium text-gray-600">Ongoing</div>
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-yellow-600">{stats?.ongoing_batches || 0}</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-medium text-gray-600">Completed</div>
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-green-600">{stats?.completed_batches || 0}</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-medium text-gray-600">Pending Approval</div>
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-orange-600">{stats?.pending_registrations || 0}</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-medium text-gray-600">Total Peserta</div>
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-purple-600">{stats?.total_participants || 0}</div>
                        </div>
                    </div>

                    {/* Chart + Batch Mendatang */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Status Batch</h3>
                            <div className="h-80"><canvas ref={chartRef}></canvas></div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Batch Mendatang</h3>
                                <Link href={route('coordinator.batches.index')} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                    Lihat Semua →
                                </Link>
                            </div>
                            {/* Daftar batch mendatang tetap sama seperti sebelumnya */}
                            <div className="space-y-4">
                                {upcomingBatches?.length > 0 ? (
                                    upcomingBatches.slice(0, 5).map(batch => (
                                        <div key={batch.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900 mb-2">{batch.title}</h4>
                                                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                                                        <span className="flex items-center">
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            {new Date(batch.start_date).toLocaleDateString('id-ID')}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                            </svg>
                                                            {batch.participants_count || 0}/{batch.max_participants} peserta
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                                    batch.status === 'scheduled' ? 'bg-cyan-100 text-cyan-700' :
                                                    batch.status === 'ongoing' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                    {batch.status.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        <p className="mt-2 text-sm">Belum ada batch mendatang</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* QUICK ACTIONS DIHAPUS TOTAL — Dashboard sekarang 100% overview only */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}