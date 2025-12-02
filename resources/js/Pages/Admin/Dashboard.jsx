    import { Head, Link } from '@inertiajs/react';
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
    import { useEffect, useRef } from 'react';
    import Chart from 'chart.js/auto';

    export default function Dashboard({ auth, stats, recentBatches, recentUsers }) {
        const trendChartRef = useRef(null);
        const statusChartRef = useRef(null);
        const distribusiChartRef = useRef(null);
        const trendChartInstance = useRef(null);
        const statusChartInstance = useRef(null);
        const distribusiChartInstance = useRef(null);

        // Data untuk charts
        const trendData = {
            labels: ['Jul', 'Agu', 'Sep', 'Okt', 'Nov'],
            datasets: [
                {
                    label: 'Batch',
                    data: [10, 8, 6, 10, 7],
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Peserta',
                    data: [45, 75, 60, 95, 65],
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                }
            ]
        };

        const statusData = {
            labels: ['Scheduled 33%', 'Ongoing 33%', 'Completed 33%'],
            datasets: [{
                data: [33, 33, 33],
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
                borderWidth: 0
            }]
        };

        const distribusiData = {
            labels: ['JKT-PST', 'BDG', 'SBY'],
            datasets: [{
                label: 'Peserta',
                data: [2, 1, 0],
                backgroundColor: '#3B82F6',
                borderRadius: 8
            }]
        };

        useEffect(() => {
            // Tren Bulanan Chart
            if (trendChartRef.current) {
                if (trendChartInstance.current) {
                    trendChartInstance.current.destroy();
                }
                trendChartInstance.current = new Chart(trendChartRef.current, {
                    type: 'line',
                    data: trendData,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'bottom'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: '#f0f0f0'
                                }
                            },
                            x: {
                                grid: {
                                    color: '#f0f0f0'
                                }
                            }
                        }
                    }
                });
            }

            // Status Batch Chart
            if (statusChartRef.current) {
                if (statusChartInstance.current) {
                    statusChartInstance.current.destroy();
                }
                statusChartInstance.current = new Chart(statusChartRef.current, {
                    type: 'pie',
                    data: statusData,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'right'
                            }
                        }
                    }
                });
            }

            // Distribusi Peserta Chart
            if (distribusiChartRef.current) {
                if (distribusiChartInstance.current) {
                    distribusiChartInstance.current.destroy();
                }
                distribusiChartInstance.current = new Chart(distribusiChartRef.current, {
                    type: 'bar',
                    data: distribusiData,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return 'Peserta: ' + context.parsed.y;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: '#f0f0f0'
                                }
                            },
                            x: {
                                grid: {
                                    display: false
                                }
                            }
                        }
                    }
                });
            }

            return () => {
                if (trendChartInstance.current) trendChartInstance.current.destroy();
                if (statusChartInstance.current) statusChartInstance.current.destroy();
                if (distribusiChartInstance.current) distribusiChartInstance.current.destroy();
            };
        }, []);

        const statCards = [
            { label: 'Total Batch', value: stats.total_batches, icon: '📚' },
            { label: 'Batch Aktif', value: stats.active_batches, icon: '📈' },
            { label: 'Total peserta', value: stats.total_participants, icon: '👥' },
            { label: 'Lulus', value: stats.total_participants, icon: '🏆' },
            { label: 'Cabang Aktif', value: stats.total_categories, icon: '📁' },
            { label: 'Sertifikat', value: stats.total_participants, icon: '📄' }
        ];

        return (
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">Master Dashboard</h2>
                        <p className="text-sm text-gray-500 mt-1">Overview semua batch dan cabang pelatihan</p>
                    </div>
                }
            >
                <Head title="Master Dashboard" />

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                            {statCards.map((stat, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-sm text-gray-600">{stat.label}</div>
                                        <span className="text-xl">{stat.icon}</span>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Tren Bulanan Chart */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold mb-4 text-gray-900">Tren Bulanan</h3>
                                <div className="h-72">
                                    <canvas ref={trendChartRef}></canvas>
                                </div>
                            </div>

                            {/* Status Batch Pie Chart */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold mb-4 text-gray-900">Status Batch</h3>
                                <div className="h-72">
                                    <canvas ref={statusChartRef}></canvas>
                                </div>
                            </div>
                        </div>

                        {/* Distribusi Peserta per Cabang */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900">Distribusi Peserta per Cabang</h3>
                            <div className="h-72">
                                <canvas ref={distribusiChartRef}></canvas>
                            </div>
                        </div>

                        {/* Batch Terbaru */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900">Batch Terbaru</h3>
                            <div className="space-y-3">
                                {recentBatches.map((batch) => {
                                    const statusColors = {
                                        scheduled: 'bg-blue-500',
                                        ongoing: 'bg-yellow-500',
                                        completed: 'bg-green-500',
                                        cancelled: 'bg-red-500'
                                    };
                                    
                                    const statusLabels = {
                                        scheduled: 'SCHEDULED',
                                        ongoing: 'ONGOING',
                                        completed: 'COMPLETED',
                                        cancelled: 'CANCELLED'
                                    };

                                    return (
                                        <div key={batch.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">{batch.title}</h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {batch.category?.name || 'TRN-2025-00' + batch.id} • {new Date(batch.start_date).toLocaleDateString('id-ID')} • {batch.participants_count || 0} peserta
                                                </p>
                                            </div>
                                            <span className={`${statusColors[batch.status] || 'bg-gray-500'} text-white text-xs font-semibold px-3 py-1 rounded`}>
                                                {statusLabels[batch.status]?.toUpperCase() || batch.status.toUpperCase()}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }