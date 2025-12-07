import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
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

export default function Index({ auth, batches, stats, attendanceRate, batchAttendances, attendanceDetails, selectedBatchId }) {
    const [selectedBatch, setSelectedBatch] = useState(selectedBatchId || '');

    const batchOptions = [
        { value: '', label: 'Semua Batch' },
        ...batches.map(batch => ({ value: batch.id, label: `${batch.title} - ${new Date(batch.start_date).toLocaleDateString('id-ID')}` }))
    ];

    const handleBatchChange = (batchId) => {
        setSelectedBatch(batchId);
        router.get(route('coordinator.attendance.index'), { batch_id: batchId }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSelectedBatch('');
        router.get(route('coordinator.attendance.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'validated':
                return <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700">Validated</span>;
            case 'checked_in':
                return <span className="px-3 py-1 text-xs font-bold rounded-full bg-orange-100 text-orange-700">Check-in</span>;
            case 'absent':
                return <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-700">Belum Absen</span>;
            default:
                return <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-600">{status}</span>;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="font-semibold text-2xl text-gray-800 leading-tight">Monitoring Absensi</h2>
                    <p className="text-sm text-gray-600 mt-1">Monitoring kehadiran peserta di setiap batch pelatihan</p>
                </div>
            }
        >
            <Head title="Monitoring Absensi" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium text-gray-600">Total Peserta</div>
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">{stats.total_participants}</div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium text-gray-600">Validated</div>
                                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-green-600">{stats.validated}</div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium text-gray-600">Check-in</div>
                                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-orange-600">{stats.checked_in}</div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium text-gray-600">Absent</div>
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-gray-600">{stats.absent}</div>
                        </div>
                    </div>

                    {/* Attendance Rate + Filter */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <div className="flex items-center mb-4">
                            <svg className="w-6 h-6 text-gray-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-900">Tingkat Kehadiran Keseluruhan</h3>
                        </div>
                        
                        <div className="mb-3">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">Attendance Rate</span>
                                <span className="text-sm font-bold text-gray-900">{attendanceRate}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div 
                                    className="bg-green-500 h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${attendanceRate}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Batch - Model & Animasi seperti Categories */}
                    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-200">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="flex-1">
                                <AnimatedSelect
                                    value={selectedBatch}
                                    onChange={handleBatchChange}
                                    options={batchOptions}
                                    placeholder="Pilih Batch..."
                                />
                            </div>
                            <div className="flex-shrink-0">
                                {selectedBatch && (
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

                    {/* Kehadiran per Batch */}
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Kehadiran per Batch</h3>
                        <div className="space-y-4">
                            {batchAttendances.map(batch => (
                                <div key={batch.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="font-semibold text-gray-900">{batch.title}</h4>
                                        <span className="text-sm text-gray-600">
                                            {batch.validated} validated / {batch.checked_in} check-in / {batch.total} total
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                                            <div 
                                                className={`h-2 rounded-full transition-all duration-300 ${
                                                    batch.attendance_rate >= 75 ? 'bg-green-500' :
                                                    batch.attendance_rate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}
                                                style={{ width: `${batch.attendance_rate}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 min-w-[45px] text-right">
                                            {batch.attendance_rate}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detail Kehadiran Table */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Detail Kehadiran</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIP</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cabang</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Kehadiran</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in Time</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {attendanceDetails.length > 0 ? (
                                        attendanceDetails.map((attendance) => (
                                            <tr key={attendance.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {attendance.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {attendance.nip}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {attendance.batch}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {attendance.branch}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getStatusBadge(attendance.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {attendance.check_in_time ? 
                                                        new Date(attendance.check_in_time).toLocaleString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) : '-'
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                <p className="mt-2">Belum ada data kehadiran</p>
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