import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
// Komponen Dropdown Animasi (Reusable)
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
                        <ChevronDownIcon
                            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                            aria-hidden="true"
                        />
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 scale-95 -translate-y-2"
                        enterTo="opacity-100 scale-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 scale-100 translate-y-0"
                        leaveTo="opacity-0 scale-95 -translate-y-2"
                    >
                        <Listbox.Options className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto py-2 text-sm font-medium focus:outline-none ring-0">
                            {options.map((option) => (
                                <Listbox.Option
                                    key={option.value}
                                    value={option.value}
                                    className={({ active }) =>
                                        `relative cursor-pointer select-none py-2.5 px-4 transition-colors ${
                                            active ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                                        }`
                                    }
                                >
                                    {({ selected, active }) => (
                                        <div className="flex items-center justify-between">
                                            <span className={`block truncate ${selected ? 'font-bold' : 'font-medium'}`}>
                                                {option.label}
                                            </span>
                                            {selected && (
                                                <CheckIcon className="w-5 h-5 text-blue-600" aria-hidden="true" />
                                            )}
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

export default function Index({ auth, batches, categories, stats, filters, flash }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');

    const handleFilter = () => {
        router.get(route('coordinator.batches.index'), {
            search,
            status: selectedStatus,
        }, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setSearch('');
        setSelectedStatus('');
        router.get(route('coordinator.batches.index'), {}, { preserveState: true, replace: true });
    };

    const handleDelete = (batchId) => {
        if (confirm('Apakah Anda yakin ingin menghapus batch ini?')) {
            router.delete(route('coordinator.batches.destroy', batchId));
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            scheduled: { bg: 'bg-cyan-100 text-cyan-800', label: 'Scheduled' },
            ongoing: { bg: 'bg-yellow-100 text-yellow-800', label: 'Ongoing' },
            completed: { bg: 'bg-green-100 text-green-800', label: 'Completed' },
            cancelled: { bg: 'bg-red-100 text-red-800', label: 'Cancelled' },
        };
        return badges[status] || { bg: 'bg-gray-100 text-gray-800', label: status?.toUpperCase() || 'Unknown' };
    };

    // Tooltip Custom – Fix nabrak & terpotong
    const Tooltip = ({ children, text }) => {
        const [show, setShow] = useState(false);

        return (
            <div className="relative inline-block w-full">
                <div
                    onMouseEnter={() => setShow(true)}
                    onMouseLeave={() => setShow(false)}
                    className="block w-full"
                >
                    {children}
                </div>

                {show && text && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-3 px-4 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg shadow-2xl whitespace-nowrap z-50 pointer-events-none animate-in fade-in duration-200">
                        {text}
                        {/* Panah ke bawah */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
                    </div>
                )}
            </div>
        );
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
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Buat Batch Baru
                    </Link>
                </div>
            }
        >
            <Head title="Batch Management" />

            {/* Flash Messages */}
            {flash?.success && (
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-4">
                    <div className="bg-green-50 border border-green-200 text-green-800 px-5 py-3 rounded-lg flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {flash.success}
                    </div>
                </div>
            )}
            {flash?.error && (
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mb-6">
                    <div className="bg-red-50 border border-red-200 text-red-800 px-5 py-3 rounded-lg flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {flash.error}
                    </div>
                </div>
            )}

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                        {[
                            { label: "Total Batch", value: stats?.total_batches || 0, icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
                            { label: "Scheduled", value: stats?.scheduled_batches || 0, color: "blue" },
                            { label: "Ongoing", value: stats?.ongoing_batches || 0, color: "yellow" },
                            { label: "Completed", value: stats?.completed_batches || 0, color: "green" },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-semibold text-gray-600">{stat.label}</span>
                                    <svg className={`w-7 h-7 text-${stat.color || 'gray'}-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon || "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"} />
                                    </svg>
                                </div>
                                <div className={`text-3xl font-bold text-${stat.color ? stat.color + '-600' : 'gray-900'}`}>
                                    {stat.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-8">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari batch..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm font-medium"
                                />
                            </div>
                            <div className="w-full md:w-64">
                                <AnimatedSelect
                                    value={selectedStatus}
                                    onChange={(v) => { setSelectedStatus(v); handleFilter(); }}
                                    options={[{ value: '', label: 'Semua Status' }, { value: 'scheduled', label: 'Scheduled' }, { value: 'ongoing', label: 'Ongoing' }, { value: 'completed', label: 'Completed' }, { value: 'cancelled', label: 'Cancelled' }]}
                                    placeholder="Pilih Status..."
                                />
                            </div>
                            <div className="flex-shrink-0">
                                {(search || selectedStatus) && (
                                    <button
                                        onClick={handleReset}
                                        className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Batch Cards Grid – FINAL FIX */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {batches && batches.length > 0 ? (
                            batches.map((batch) => {
                                const statusBadge = getStatusBadge(batch.status);

                                return (
                                    <div
                                        key={batch.id}
                                        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full group relative"
                                        style={{ overflow: 'visible' }} // Biar tooltip tidak terpotong
                                    >
                                        <div className="p-6 flex-1 flex flex-col">
                                            {/* Header: Title + Status */}
                                            <div className="flex items-start justify-between gap-3 mb-4">
                                                <div className="flex-1 min-w-0">
                                                    {/* JUDUL + TOOLTIP CANTIK */}
                                                    <Tooltip text={batch.title}>
                                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition truncate">
                                                            {batch.title}
                                                        </h3>
                                                    </Tooltip>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {batch.code || `TRN-2025-${String(batch.id).padStart(3, '0')}`}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${statusBadge.bg}`}>
                                                    {statusBadge.label}
                                                </span>
                                            </div>

                                            {/* Category Badge */}
                                            {batch.category && (
                                                <div className="mb-4">
                                                    <span className="inline-block px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                                                        {batch.category.name}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Details */}
                                            <div className="space-y-3 flex-1">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <svg className="w-4 h-4 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>{new Date(batch.start_date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <svg className="w-4 h-4 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>{(batch.start_time ? batch.start_time.slice(0,5) : '09:00')} - {(batch.end_time ? batch.end_time.slice(0,5) : '16:00')}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <svg className="w-4 h-4 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    <span>{batch.participants_count || 0} / {batch.max_participants || 0} peserta</span>
                                                </div>
                                            </div>

                                            {/* Trainer */}
                                            <div className="mt-6 pt-4 border-t border-gray-100">
                                                <p className="text-xs font-medium text-gray-500 mb-1">Trainer</p>
                                                <Tooltip text={batch.trainer?.full_name || 'Trainer belum ditentukan'}>
                                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                                        {batch.trainer?.full_name || 'Trainer belum ditentukan'}
                                                    </p>
                                                </Tooltip>
                                            </div>
                                        </div>

                                        {/* Footer Action */}
                                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={route('coordinator.batches.edit', batch.id)}
                                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition text-center text-sm font-medium"
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.754 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
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