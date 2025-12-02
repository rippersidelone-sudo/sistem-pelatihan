import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, stats, upcomingBatches, pendingRegistrations }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Coordinator Dashboard</h2>}
        >
            <Head title="Coordinator Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Message */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Welcome back, {auth.user.full_name}!
                            </h3>
                            <p className="text-gray-600 mt-1">
                                Manage training batches, categories, and participant registrations.
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-sm text-gray-500">Total Batches</div>
                            <div className="text-3xl font-bold mt-2">{stats?.total_batches || 0}</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-sm text-gray-500">Scheduled Batches</div>
                            <div className="text-3xl font-bold mt-2 text-blue-600">{stats?.scheduled_batches || 0}</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-sm text-gray-500">Ongoing Batches</div>
                            <div className="text-3xl font-bold mt-2 text-green-600">{stats?.ongoing_batches || 0}</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-sm text-gray-500">Completed Batches</div>
                            <div className="text-3xl font-bold mt-2 text-gray-600">{stats?.completed_batches || 0}</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-sm text-gray-500">Total Categories</div>
                            <div className="text-3xl font-bold mt-2">{stats?.total_categories || 0}</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="text-sm text-gray-500">Pending Registrations</div>
                            <div className="text-3xl font-bold mt-2 text-orange-600">{stats?.pending_registrations || 0}</div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Link
                                    href={route('coordinator.batches.create')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md text-center transition"
                                >
                                    Create New Batch
                                </Link>
                                <Link
                                    href={route('coordinator.categories.create')}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md text-center transition"
                                >
                                    Create Category
                                </Link>
                                <Link
                                    href={route('coordinator.participants.index')}
                                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-md text-center transition"
                                >
                                    Review Registrations
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Batches */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Upcoming Batches</h3>
                                <Link
                                    href={route('coordinator.batches.index')}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    View All
                                </Link>
                            </div>
                            {upcomingBatches && upcomingBatches.length > 0 ? (
                                <div className="space-y-3">
                                    {upcomingBatches.map((batch) => (
                                        <div key={batch.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{batch.title}</h4>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Category: {batch.category?.name || 'N/A'}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Trainer: {batch.trainer?.full_name || 'N/A'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(batch.start_date).toLocaleDateString()}
                                                    </span>
                                                    <div className="mt-1">
                                                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                                            {batch.participants?.length || 0} / {batch.max_participants}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">No upcoming batches</p>
                            )}
                        </div>
                    </div>

                    {/* Pending Registrations */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Pending Registrations</h3>
                            {pendingRegistrations && pendingRegistrations.length > 0 ? (
                                <div className="space-y-3">
                                    {pendingRegistrations.map((registration) => (
                                        <div key={registration.id} className="border rounded-lg p-4 flex justify-between items-center">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">
                                                    {registration.user?.full_name || 'N/A'}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    Batch: {registration.batch?.title || 'N/A'}
                                                </p>
                                            </div>
                                            <Link
                                                href={route('coordinator.participants.index')}
                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                Review
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">No pending registrations</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}