import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Branch Coordinator Dashboard</h2>}
        >
            <Head title="Branch Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Message */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Welcome back, {auth.user.full_name}!
                            </h3>
                            <p className="text-gray-600 mt-1">
                                Branch: <span className="font-semibold">{auth.user.branch}</span>
                            </p>
                            <p className="text-gray-600 mt-1">
                                Monitor participants from your branch and track their training progress.
                            </p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Link
                                    href={route('branch.participants.index')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md text-center transition"
                                >
                                    View Branch Participants
                                </Link>
                                <Link
                                    href={route('branch.reports')}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md text-center transition"
                                >
                                    View Reports
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                        <h4 className="font-semibold text-indigo-900 mb-2">Branch Responsibilities</h4>
                        <ul className="text-sm text-indigo-800 space-y-1 list-disc list-inside">
                            <li>Monitor participants from {auth.user.branch} branch</li>
                            <li>Track training completion status</li>
                            <li>Inform teachers about upcoming trainings</li>
                            <li>Generate branch reports</li>
                            <li>Coordinate with HQ and coordinators</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}