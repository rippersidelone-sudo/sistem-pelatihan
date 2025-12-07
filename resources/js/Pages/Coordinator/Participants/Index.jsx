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

export default function Index({ auth, registrations, stats, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');

    const handleFilter = () => {
        router.get(route('coordinator.participants.index'), {
            search,
            status: selectedStatus,
        }, { 
            preserveState: true,
            replace: true 
        });
    };

    const handleApprove = (registrationId) => {
        if (confirm('Apakah Anda yakin ingin menyetujui pendaftaran ini?')) {
            router.patch(route('coordinator.participants.approve', registrationId));
        }
    };

    const handleReject = (registrationId) => {
        if (confirm('Apakah Anda yakin ingin menolak pendaftaran ini?')) {
            router.patch(route('coordinator.participants.reject', registrationId));
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { bg: 'bg-orange-500', text: 'text-white', label: 'PENDING' },
            approved: { bg: 'bg-blue-500', text: 'text-white', label: 'APPROVED' },
            rejected: { bg: 'bg-red-500', text: 'text-white', label: 'REJECTED' },
        };
        return badges[status] || { bg: 'bg-gray-500', text: 'text-white', label: status?.toUpperCase() };
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="font-semibold text-2xl text-gray-800 leading-tight">Validasi Peserta</h2>
                    <p className="text-sm text-gray-600 mt-1">Kelola persetujuan pendaftaran peserta pelatihan</p>
                </div>
            }
        >
            <Head title="Validasi Peserta" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-medium text-gray-600">Pending</div>
                                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-orange-500">{stats?.pending || 0}</div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-medium text-gray-600">Approved</div>
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-blue-500">{stats?.approved || 0}</div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-medium text-gray-600">Rejected</div>
                                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-red-500">{stats?.rejected || 0}</div>
                        </div>
                    </div>

                    {/* Filter Section */}
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
                                    placeholder="Cari nama, email, atau NIP..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm font-medium"
                                />
                            </div>

                            <div className="w-full md:w-64">
                                <AnimatedSelect
                                    value={selectedStatus}
                                    onChange={(v) => setSelectedStatus(v)}
                                    options={[{ value: '', label: 'Semua Status' }, { value: 'pending', label: 'Pending' }, { value: 'approved', label: 'Approved' }, { value: 'rejected', label: 'Rejected' }]}
                                    placeholder="Pilih Status..."
                                />
                            </div>

                            <div className="flex-shrink-0">
                                {(search || selectedStatus) && (
                                    <button
                                        onClick={() => {
                                            setSearch('');
                                            setSelectedStatus('');
                                            router.get(route('coordinator.participants.index'), {}, {
                                                preserveState: true,
                                                replace: true
                                            });
                                        }}
                                        className="px-5 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium flex items-center gap-2"
                                        title="Reset Filter"
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

                    {/* Table Section */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nama
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            NIP
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cabang
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Batch
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tanggal Daftar
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {registrations && registrations.length > 0 ? (
                                        registrations.map((registration) => {
                                            const statusBadge = getStatusBadge(registration.status);
                                            return (
                                                <tr key={registration.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {registration.user?.full_name || registration.participant_name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {registration.user?.nip || registration.nip || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {registration.user?.email || registration.email}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {registration.branch || registration.user?.branch || 'Jakarta Pusat'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {registration.batch?.title || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(registration.created_at).toLocaleDateString('id-ID', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`${statusBadge.bg} ${statusBadge.text} px-3 py-1 text-xs font-bold rounded-full`}>
                                                            {statusBadge.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {registration.status === 'pending' ? (
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={() => handleApprove(registration.id)}
                                                                    className="text-green-600 hover:text-green-900"
                                                                    title="Approve"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(registration.id)}
                                                                    className="text-red-600 hover:text-red-900"
                                                                    title="Reject"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                className="text-gray-600 hover:text-gray-900"
                                                                title="View Details"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center">
                                                    <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    <p className="text-gray-500 font-medium">Tidak ada pendaftaran ditemukan</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}