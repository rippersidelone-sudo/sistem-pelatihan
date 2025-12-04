import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, batches, categories, stats, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');

    const handleFilter = () => {
        router.get(route('coordinator.batches.index'), {
            search,
            status: selectedStatus,
        }, { 
            preserveState: true,
            replace: true 
        });
    };

    const handleDelete = (batchId) => {
        if (confirm('Apakah Anda yakin ingin menghapus batch ini?')) {
            router.delete(route('coordinator.batches.destroy', batchId));
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            scheduled: { bg: 'bg-cyan-500', text: 'text-white', label: 'SCHEDULED' },
            ongoing: { bg: 'bg-yellow-500', text: 'text-white', label: 'ONGOING' },
            completed: { bg: 'bg-green-500', text: 'text-white', label: 'COMPLETED' },
            cancelled: { bg: 'bg-red-500', text: 'text-white', label: 'CANCELLED' },
        };
        return badges[status] || { bg: 'bg-gray-500', text: 'text-white', label: status?.toUpperCase() };
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold text-2xl text-gray-800 leading-tight">Batch Management</h2>
                        <p className="text-sm text-gray-600 mt-1">Kelola batch pelatihan</p>
                    </div>
                    <Link
                        href={route('coordinator.batches.create')}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Buat Batch Baru</span>
                    </Link>
                </div>
            }
        >
            <Head title="Batch Management" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl shadow-sm p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-medium text-gray-600">Total Batch</div>
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{stats?.total_batches || 0}</div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-medium text-gray-600">Scheduled</div>
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-blue-600">{stats?.scheduled_batches || 0}</div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-medium text-gray-600">Ongoing</div>
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-yellow-600">{stats?.ongoing_batches || 0}</div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-medium text-gray-600">Completed</div>
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-green-600">{stats?.completed_batches || 0}</div>
                        </div>
                    </div>

                    {/* Filter Section */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari batch......"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                    className="pl-10 w-full rounded-lg border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="relative">
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => {
                                        setSelectedStatus(e.target.value);
                                        handleFilter();
                                    }}
                                    className="w-full rounded-lg border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Batch Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {batches && batches.length > 0 ? (
                            batches.map((batch) => {
                                const statusBadge = getStatusBadge(batch.status);
                                return (
                                    <div key={batch.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                        <div className="p-6">
                                            {/* Header with Title and Status */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                        {batch.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">{batch.code || `TRN-2025-${String(batch.id).padStart(3, '0')}`}</p>
                                                </div>
                                                <span className={`${statusBadge.bg} ${statusBadge.text} px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ml-2`}>
                                                    {statusBadge.label}
                                                </span>
                                            </div>

                                            {/* Category Badge */}
                                            {batch.category && (
                                                <div className="mb-4">
                                                    <span className="inline-block px-3 py-1 text-xs font-medium border border-gray-300 rounded-full text-gray-700">
                                                        {batch.category.name}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Details */}
                                            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    {new Date(batch.start_date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {batch.start_time || '09:00'} - {batch.end_time || '16:00'}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    {batch.participants_count || 0} / {batch.max_participants || 0} peserta
                                                </div>
                                            </div>

                                            {/* Trainer Info */}
                                            <div className="mb-4">
                                                <div className="text-xs text-gray-500 mb-1">Trainer</div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {batch.trainer?.full_name || 'Trainer Ahmad'}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                <Link
                                                    href={route('coordinator.batches.edit', batch.id)}
                                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-center text-sm font-medium"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(batch.id)}
                                                    className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition text-center text-sm font-medium"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full">
                                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                                    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    <p className="text-gray-500 font-medium mb-4">Tidak ada batch ditemukan</p>
                                    <Link
                                        href={route('coordinator.batches.create')}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Buat Batch Baru
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}