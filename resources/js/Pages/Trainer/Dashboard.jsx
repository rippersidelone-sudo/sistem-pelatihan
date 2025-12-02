import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Trainer Dashboard</h2>}
        >
            <Head title="Trainer Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome Message */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Welcome back, {auth.user.full_name}!
                            </h3>
                            <p className="text-gray-600 mt-1">
                                Manage your training sessions, validate attendance, and review submissions.
                            </p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Link
                                    href={route('trainer.batches.index')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md text-center transition"
                                >
                                    View My Batches
                                </Link>
                                <Link
                                    href={route('trainer.batches.index')}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md text-center transition"
                                >
                                    Validate Attendance
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h4 className="font-semibold text-blue-900 mb-2">Getting Started</h4>
                        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                            <li>View your assigned training batches</li>
                            <li>Upload training materials and recordings</li>
                            <li>Validate participant attendance</li>
                            <li>Review and grade submissions</li>
                            <li>Provide feedback to participants</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}