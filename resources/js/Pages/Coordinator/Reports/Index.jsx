// resources/js/Pages/Coordinator/Reports/Index.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

function AnimatedSelect({ value, onChange, options, placeholder = "Pilih..." }) {
    const selected = options.find(opt => opt.value === value) || options[0];
    return (
        <Listbox value={value} onChange={onChange}>
            {({ open }) => (
                <div className="relative">
                    <Listbox.Button className="relative w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all flex items-center justify-between cursor-pointer">
                        <span className={`block truncate ${selected ? 'text-gray-900' : 'text-gray-500'}`}>
                            {selected?.label || placeholder}
                        </span>
                        <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                    </Listbox.Button>
                    <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 scale-95 -translate-y-2" enterTo="opacity-100 scale-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 scale-100 translate-y-0" leaveTo="opacity-0 scale-95 -translate-y-2">
                        <Listbox.Options className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto py-2 text-sm font-medium focus:outline-none ring-0">
                            {options.map((option) => (
                                <Listbox.Option key={option.value} value={option.value} className={({ active }) => `relative cursor-pointer select-none py-2.5 px-4 transition-colors ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}`}>
                                    {({ selected }) => (
                                        <div className="flex items-center justify-between">
                                            <span className={`block truncate ${selected ? 'font-bold' : 'font-medium'}`}>{option.label}</span>
                                            {selected && <CheckIcon className="w-5 h-5 text-blue-600" />}
                                        </div>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            )}
        </Listbox>
    );
}

import Chart from 'chart.js/auto';

export default function Index({ auth, stats, batches, participants, categories }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedPeriod, setSelectedPeriod] = useState('all');
    const [selectedBranch, setSelectedBranch] = useState('all');

    const batchStatusChartRef = useRef(null);
    const participantStatusChartRef = useRef(null);
    const branchChartRef = useRef(null);
    const categoryChartRef = useRef(null);
    const chartInstances = useRef({});

    const destroyCharts = () => {
        Object.values(chartInstances.current).forEach(chart => chart?.destroy());
        chartInstances.current = {};
    };

    useEffect(() => {
        if (activeTab === 'overview') {
            destroyCharts();

            if (batchStatusChartRef.current) {
                chartInstances.current.batchStatus = new Chart(batchStatusChartRef.current, {
                    type: 'pie',
                    data: {
                        labels: ['Scheduled', 'Ongoing', 'Completed'],
                        datasets: [{
                            data: [stats?.scheduled_batches || 0, stats?.ongoing_batches || 0, stats?.completed_batches || 0],
                            backgroundColor: ['#3B82F6', '#10B981', '#6B7280'],
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
                });
            }

            if (participantStatusChartRef.current) {
                chartInstances.current.participantStatus = new Chart(participantStatusChartRef.current, {
                    type: 'pie',
                    data: {
                        labels: ['Approved', 'Ongoing', 'Completed'],
                        datasets: [{
                            data: [stats?.approved_participants || 0, stats?.ongoing_participants || 0, stats?.completed_participants || 0],
                            backgroundColor: ['#F59E0B', '#3B82F6', '#8B5CF6'],
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
                });
            }

            if (branchChartRef.current && stats?.branch_data) {
                chartInstances.current.branch = new Chart(branchChartRef.current, {
                    type: 'bar',
                    data: {
                        labels: stats.branch_data.map(b => b.name),
                        datasets: [
                            { label: 'Lulus', data: stats.branch_data.map(b => b.passed), backgroundColor: '#10B981' },
                            { label: 'Total Peserta', data: stats.branch_data.map(b => b.total), backgroundColor: '#3B82F6' }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'bottom' } },
                        scales: { y: { beginAtZero: true } }
                    }
                });
            }
        }

        return () => destroyCharts();
    }, [activeTab, stats]);

    useEffect(() => {
        if (activeTab === 'performa' && categoryChartRef.current && categories) {
            destroyCharts();
            chartInstances.current.category = new Chart(categoryChartRef.current, {
                type: 'bar',
                data: {
                    labels: categories.map(c => c.name),
                    datasets: [
                        { label: 'Batch', data: categories.map(c => c.batch_count), backgroundColor: '#3B82F6' },
                        { label: 'Lulus', data: categories.map(c => c.passed_count), backgroundColor: '#8B5CF6' },
                        { label: 'Peserta', data: categories.map(c => c.participant_count), backgroundColor: '#10B981' }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } },
                    scales: { y: { beginAtZero: true } }
                }
            });
        }
        return () => { if (activeTab !== 'performa') destroyCharts(); };
    }, [activeTab, categories]);

    const getStatusBadge = (status) => {
        const badges = { scheduled: 'bg-cyan-100 text-cyan-700', ongoing: 'bg-yellow-100 text-yellow-700', completed: 'bg-green-100 text-green-700' };
        return badges[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <AuthenticatedLayout user={auth.user} header={
            <div>
                <h2 className="font-semibold text-2xl text-gray-800 leading-tight">Laporan Pelatihan</h2>
                <p className="text-sm text-gray-600 mt-1">Analisis dan rekap data pelatihan</p>
            </div>
        }>
            <Head title="Laporan Pelatihan" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {/* ... stats cards tetap sama ... */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-600">Total Batch</span>
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{stats?.total_batches || 0}</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-600">Batch Selesai</span>
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{stats?.completed_batches || 0}</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-600">Total Peserta</span>
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{stats?.total_participants || 0}</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-600">Peserta Lulus</span>
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{stats?.passed_participants || 0}</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-600">Sertifikat</span>
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{stats?.certificates || 0}</div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-600">Avg Attendance</span>
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00 2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{stats?.avg_attendance || 0}%</div>
                        </div>
                    </div>

                    {/* Filter Bar – Mirip Categories Index */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-8">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <AnimatedSelect value={selectedPeriod} onChange={setSelectedPeriod} options={[
                                        { value: 'all', label: 'Semua Periode' },
                                        { value: 'today', label: 'Hari Ini' },
                                        { value: 'week', label: 'Minggu Ini' },
                                        { value: 'month', label: 'Bulan Ini' },
                                        { value: 'year', label: 'Tahun Ini' },
                                    ]} placeholder="Pilih Periode..." />
                                </div>
                                <div>
                                    <AnimatedSelect value={selectedBranch} onChange={setSelectedBranch} options={[
                                        { value: 'all', label: 'Semua Cabang' },
                                        { value: 'jkt', label: 'Jakarta Pusat' },
                                        { value: 'bdg', label: 'Bandung' },
                                        { value: 'sby', label: 'Surabaya' },
                                        { value: 'mdn', label: 'Medan' },
                                    ]} placeholder="Pilih Cabang..." />
                                </div>
                            </div>
                            {(selectedPeriod !== 'all' || selectedBranch !== 'all') && (
                                <div className="flex-shrink-0">
                                    <button onClick={() => { setSelectedPeriod('all'); setSelectedBranch('all'); }}
                                        className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Reset
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                        <div className="border-b border-gray-200">
                            <div className="flex">
                                {[
                                    { id: 'overview', label: 'Overview' },
                                    { id: 'batch', label: 'Batch' },
                                    { id: 'peserta', label: 'Peserta' },
                                    { id: 'performa', label: 'Performa' },
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 px-6 py-4 text-sm font-semibold transition ${
                                            activeTab === tab.id
                                                ? 'bg-white text-gray-900 border-b-2 border-blue-600'
                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 space-y-8">

                            {/* Overview Tab – DIPISAH PER CARD */}
                            {activeTab === 'overview' && (
                                <>
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Distribusi Status Batch</h3>
                                        <div className="h-80">
                                            <canvas ref={batchStatusChartRef}></canvas>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Distribusi Status Peserta</h3>
                                        <div className="h-80">
                                            <canvas ref={participantStatusChartRef}></canvas>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Peserta Per Cabang</h3>
                                        <div className="h-80">
                                            <canvas ref={branchChartRef}></canvas>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Batch Tab */}
                            {activeTab === 'batch' && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6">Daftar Batch Pelatihan</h3>
                                    <div className="space-y-4">
                                        {batches && batches.length > 0 ? (
                                            batches.map(batch => (
                                                <div key={batch.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="font-bold text-gray-900">{batch.title}</h4>
                                                        <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${getStatusBadge(batch.status)}`}>
                                                            {batch.status}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                                        <div><span className="font-semibold">Kode:</span> {batch.code}</div>
                                                        <div><span className="font-semibold">Kategori:</span> {batch.category}</div>
                                                        <div><span className="font-semibold">Tanggal:</span> {batch.date_range}</div>
                                                        <div><span className="font-semibold">Peserta:</span> {batch.participants_count} peserta</div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-16 text-gray-500">
                                                <p className="text-lg">Tidak ada data batch</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Peserta Tab */}
                            {activeTab === 'peserta' && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6">Ringkasan Peserta</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        {[
                                            { label: 'Registered', value: stats?.registered_participants || 0, color: 'gray' },
                                            { label: 'Approved', value: stats?.approved_participants || 1, color: 'blue' },
                                            { label: 'Ongoing', value: stats?.ongoing_participants || 1, color: 'yellow' },
                                            { label: 'Completed', value: stats?.completed_participants || 1, color: 'green' },
                                            { label: 'Failed', value: stats?.failed_participants || 0, color: 'red' },
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center">
                                                <div className={`text-4xl font-bold text-${item.color}-600 mb-2`}>{item.value}</div>
                                                <div className="text-sm font-semibold text-gray-700">{item.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Performa Tab – DIPISAH PER CARD */}
                            {activeTab === 'performa' && (
                                <>
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Performa Per Kategori</h3>
                                        <div className="h-80">
                                            <canvas ref={categoryChartRef}></canvas>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">Completion Rate</h3>
                                            <div className="space-y-4">
                                                {categories && categories.map(cat => (
                                                    <div key={cat.id}>
                                                        <div className="flex justify-between text-sm font-semibold mb-2">
                                                            <span>{cat.name}</span>
                                                            <span>{cat.completion_rate}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div className={`h-2 rounded-full ${cat.completion_rate === 100 ? 'bg-green-500' : 'bg-gray-300'}`} style={{ width: `${cat.completion_rate}%` }}></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                            <h3 className="text-lg font-bold text-gray-900 mb-4">Highlights</h3>
                                            <div className="space-y-3">
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                    <div className="text-green-900 font-bold">Tingkat Kelulusan</div>
                                                    <div className="text-2xl font-bold text-green-600">{stats?.avg_attendance || 33}%</div>
                                                </div>
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                    <div className="text-blue-900 font-bold">Rata-rata Peserta per Batch</div>
                                                    <div className="text-2xl font-bold text-blue-600">{stats?.avg_participants_per_batch || 1} peserta</div>
                                                </div>
                                                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                                    <div className="text-purple-900 font-bold">Total Kategori Aktif</div>
                                                    <div className="text-2xl font-bold text-purple-600">{categories?.length || 4} kategori</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}