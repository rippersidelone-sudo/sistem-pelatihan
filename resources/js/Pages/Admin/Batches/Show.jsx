import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, batch }) {
    const getStatusBadge = (status) => {
        const badges = {
            scheduled: 'bg-blue-100 text-blue-800',
            ongoing: 'bg-green-100 text-green-800',
            completed: 'bg-gray-100 text-gray-800',
            cancelled: 'bg-red-100 text-red-800',
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            present: 'bg-green-100 text-green-800',
            absent: 'bg-red-100 text-red-800',
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Batch Details</h2>}
        >
            <Head title={`Batch: ${batch.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Back Button */}
                    <Link
                        href={route('admin.batches.index')}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                        ← Back to Batches
                    </Link>

                    {/* Batch Info */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{batch.title}</h3>
                                    <p className="text-gray-600 mt-1">Batch ID: {batch.id}</p>
                                </div>
                                <span className={`px-3 py-1 text-sm rounded-full ${getStatusBadge(batch.status)}`}>
                                    {batch.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Training Information</h4>
                                    <dl className="space-y-2 text-sm">
                                        <div className="flex">
                                            <dt className="w-32 text-gray-600">Category:</dt>
                                            <dd className="font-medium">{batch.category?.name || 'N/A'}</dd>
                                        </div>
                                        <div className="flex">
                                            <dt className="w-32 text-gray-600">Trainer:</dt>
                                            <dd className="font-medium">{batch.trainer?.full_name || 'N/A'}</dd>
                                        </div>
                                        <div className="flex">
                                            <dt className="w-32 text-gray-600">Start Date:</dt>
                                            <dd className="font-medium">{new Date(batch.start_date).toLocaleString()}</dd>
                                        </div>
                                        <div className="flex">
                                            <dt className="w-32 text-gray-600">End Date:</dt>
                                            <dd className="font-medium">{new Date(batch.end_date).toLocaleString()}</dd>
                                        </div>
                                    </dl>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Participant Information</h4>
                                    <dl className="space-y-2 text-sm">
                                        <div className="flex">
                                            <dt className="w-32 text-gray-600">Min Participants:</dt>
                                            <dd className="font-medium">{batch.min_participants}</dd>
                                        </div>
                                        <div className="flex">
                                            <dt className="w-32 text-gray-600">Max Participants:</dt>
                                            <dd className="font-medium">{batch.max_participants}</dd>
                                        </div>
                                        <div className="flex">
                                            <dt className="w-32 text-gray-600">Current:</dt>
                                            <dd className="font-medium">{batch.participants?.length || 0}</dd>
                                        </div>
                                        {batch.zoom_link && (
                                            <div className="flex">
                                                <dt className="w-32 text-gray-600">Zoom Link:</dt>
                                                <dd>
                                                    <a href={batch.zoom_link} target="_blank" rel="noopener noreferrer" 
                                                       className="text-blue-600 hover:text-blue-800">
                                                        Join Meeting
                                                    </a>
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            </div>

                            {batch.assignment_description && (
                                <div className="mt-6 pt-6 border-t">
                                    <h4 className="font-semibold text-gray-700 mb-2">Assignment</h4>
                                    <p className="text-sm text-gray-600">{batch.assignment_description}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Participants List */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Participants ({batch.participants?.length || 0})</h3>
                            {batch.participants && batch.participants.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Branch</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registration Status</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completion Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {batch.participants.map((participant) => (
                                                <tr key={participant.id}>
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                        {participant.user?.full_name || participant.full_name || 'N/A'}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">
                                                        {participant.user?.email || participant.email || 'N/A'}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">
                                                        {participant.user?.branch || participant.branch || 'N/A'}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(participant.pivot?.registration_status || participant.registration_status)}`}>
                                                            {participant.pivot?.registration_status || participant.registration_status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(participant.pivot?.completion_status || participant.completion_status)}`}>
                                                            {participant.pivot?.completion_status || participant.completion_status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">No participants yet</p>
                            )}
                        </div>
                    </div>

                    {/* Materials */}
                    {batch.materials && batch.materials.length > 0 && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Training Materials ({batch.materials.length})</h3>
                                <div className="space-y-3">
                                    {batch.materials.map((material) => (
                                        <div key={material.id} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{material.title}</h4>
                                                    <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        Type: {material.type} | Uploaded by: {material.uploader?.full_name}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Attendance Summary */}
                    {batch.attendances && batch.attendances.length > 0 && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Attendance Summary</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <div className="text-sm text-green-600">Present</div>
                                        <div className="text-2xl font-bold text-green-700">
                                            {batch.attendances.filter(a => a.status === 'present').length}
                                        </div>
                                    </div>
                                    <div className="bg-red-50 rounded-lg p-4">
                                        <div className="text-sm text-red-600">Absent</div>
                                        <div className="text-2xl font-bold text-red-700">
                                            {batch.attendances.filter(a => a.status === 'absent').length}
                                        </div>
                                    </div>
                                    <div className="bg-yellow-50 rounded-lg p-4">
                                        <div className="text-sm text-yellow-600">Pending</div>
                                        <div className="text-2xl font-bold text-yellow-700">
                                            {batch.attendances.filter(a => a.status === 'pending').length}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}