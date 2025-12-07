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

// Tooltip Custom – Sama persis seperti di Batches
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
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
                </div>
            )}
        </div>
    );
};

export default function Index({ auth, categories, stats, filters, flash }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [sort, setSort] = useState(filters?.sort || 'latest');
    const [prereqFilter, setPrereqFilter] = useState(filters?.filter || 'all');

    const handleFilter = () => {
        router.get(route('coordinator.categories.index'), {
            search,
            sort,
            filter: prereqFilter,
        }, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setSearch('');
        setSort('latest');
        setPrereqFilter('all');
        router.get(route('coordinator.categories.index'), {}, { preserveState: true, replace: true });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus kategori ini? Tindakan ini tidak bisa dibatalkan.')) {
            router.delete(route('coordinator.categories.destroy', id), {
                onError: () => {
                    alert('Gagal menghapus: Kategori mungkin sudah memiliki batch atau menjadi prerequisite kategori lain.');
                }
            });
        }
    };

    const sortOptions = [
        { value: 'latest', label: 'Terbaru' },
        { value: 'oldest', label: 'Terlama' },
        { value: 'name_asc', label: 'A to Z' },
        { value: 'name_desc', label: 'Z to A' },
    ];

    const prereqOptions = [
        { value: 'all', label: 'Semua' },
        { value: 'with', label: 'Ada Prerequisite' },
        { value: 'without', label: 'Tanpa Prerequisite' },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-2xl text-gray-800 leading-tight">Manajemen Kategori Pelatihan</h2>
                        <p className="text-sm text-gray-600 mt-1">Kelola kategori dan prerequisite pelatihan</p>
                    </div>
                    <Link
                        href={route('coordinator.categories.create')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Kategori
                    </Link>
                </div>
            }
        >
            <Head title="Kategori Pelatihan" />

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
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-4">
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
                        {[
                            { label: "Total Kategori", value: stats?.total || 0, icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z", color: "gray" },
                            { label: "Tanpa Prerequisite", value: stats?.without_prerequisite || 0, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "green" },
                            { label: "Dengan Prerequisite", value: stats?.with_prerequisite || 0, icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "orange" },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="text-sm font-semibold text-gray-600">{stat.label}</div>
                                    <svg className={`w-8 h-8 text-${stat.color}-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                                    </svg>
                                </div>
                                <div className={`text-4xl font-bold text-${stat.color}-600`}>{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Filter Bar – SUDAH DIUBAH: TANPA TOMBOL CARI + RESET SELALU DI KANAN */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-8">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari kategori atau deskripsi..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm font-medium"
                                />
                            </div>

                            {/* Sort */}
                            <div className="w-full md:w-64">
                                <AnimatedSelect
                                    value={sort}
                                    onChange={(v) => { setSort(v); handleFilter(); }}
                                    options={sortOptions}
                                    placeholder="Urutkan..."
                                />
                            </div>

                            {/* Prerequisite Filter */}
                            <div className="w-full md:w-64">
                                <AnimatedSelect
                                    value={prereqFilter}
                                    onChange={(v) => { setPrereqFilter(v); handleFilter(); }}
                                    options={prereqOptions}
                                    placeholder="Filter Prerequisite..."
                                />
                            </div>

                            {/* Reset Button – SELALU DI KANAN, TIDAK TURUN */}
                            <div className="flex-shrink-0">
                                {(search || sort !== 'latest' || prereqFilter !== 'all') && (
                                    <button
                                        onClick={handleReset}
                                        className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium flex items-center gap-2 whitespace-nowrap"
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

                    {/* Grid Kategori – TIDAK ADA SPACE KOSONG */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories && categories.length > 0 ? (
                            categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden group flex flex-col h-full relative"
                                    style={{ overflow: 'visible' }}
                                >
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center justify-between mb-4 min-h-[2rem]">
                                            <div className="flex-1 min-w-0 mr-3">
                                                <Tooltip text={category.name}>
                                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                                        {category.name}
                                                    </h3>
                                                </Tooltip>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
                                                <Link href={route('coordinator.categories.edit', category.id)} className="text-blue-600 hover:text-blue-800 transition" title="Edit">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </Link>
                                                <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-800 transition" title="Hapus">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </div>

                                        {category.prerequisites?.length > 0 && (
                                            <div className="mb-4">
                                                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                                                    Ada Prerequisite
                                                </span>
                                            </div>
                                        )}

                                        <p className="text-sm text-gray-600 mb-5 leading-relaxed break-words line-clamp-3">
                                            {category.description || 'Tidak ada deskripsi'}
                                        </p>

                                        {category.prerequisites?.length > 0 && (
                                            <div className="mt-auto">
                                                <p className="text-xs font-semibold text-gray-500 mb-2">Prerequisite:</p>
                                                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-2">
                                                    {category.prerequisites.map((prereq) => (
                                                        <div key={prereq.id} className="text-sm text-gray-700 leading-tight break-words">
                                                            • {prereq.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {(!category.prerequisites || category.prerequisites.length === 0) && (
                                            <div className="flex-1 min-h-0" />
                                        )}
                                    </div>

                                    <div className="px-6 py-3 bg-gray-50/70 text-xs text-gray-500 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>Dibuat: {new Date(category.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>Oleh: {category.creator?.full_name || 'Koordinator'}</span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                                        <Link href={route('coordinator.categories.show', category.id)} className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition flex items-center gap-1">
                                            Lihat Detail
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                        <span className="text-sm font-semibold text-gray-700">
                                            {category.batches_count || 0} Batch
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-20">
                                <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2m-6 0h6" />
                                </svg>
                                <p className="text-lg text-gray-500">Tidak ada kategori yang sesuai filter</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}