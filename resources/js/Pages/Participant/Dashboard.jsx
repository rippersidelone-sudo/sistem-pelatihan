import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Dashboard</h2>}
        >
            <Head title="Dashboard" />

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
                                Explore available trainings and track your learning progress.
                            </p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Link
                                    href={route('participant.trainings.index')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md text-center transition"
                                >
                                    Browse Training
                                </Link>
                                <Link
                                    href={route('participant.trainings.my')}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md text-center transition"
                                >
                                    My Trainings
                                </Link>
                                <Link
                                    href={route('participant.history')}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-md text-center transition"
                                >
                                    Training History
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <h4 className="font-semibold text-green-900 mb-2">How to Register</h4>
                            <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
                                <li>Browse available training programs</li>
                                <li>Check prerequisites (if any)</li>
                                <li>Click "Register" on your chosen training</li>
                                <li>Wait for coordinator approval</li>
                                <li>Attend the training session</li>
                            </ol>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h4 className="font-semibold text-blue-900 mb-2">Training Requirements</h4>
                            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                                <li>Check-in attendance during session</li>
                                <li>Submit assignments on time</li>
                                <li>Complete training feedback form</li>
                                <li>Meet all requirements to receive certificate</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}