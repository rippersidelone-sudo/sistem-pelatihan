// resources/js/Pages/Admin/Roles/Show.jsx
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, role }) {
    // Define role-specific styling and permissions
    const roleConfig = {
        'master-hq': { 
            color: 'red',
            icon: '👑',
            permissions: [
                'Full system access',
                'User management (Create, Edit, Delete)',
                'Role & Permission management',
                'Batch oversight (View all)',
                'Global reports & analytics',
                'Audit log access',
                'Data export (CSV, PDF)',
                'System configuration'
            ]
        },
        'training-coordinator': { 
            color: 'blue',
            icon: '📊',
            permissions: [
                'Dashboard access',
                'Create & manage training batches',
                'Create & manage categories',
                'Approve/Reject participant registrations',
                'Monitor batch progress',
                'Assign trainers',
                'View reports',
                'Export batch data'
            ]
        },
        'trainer': { 
            color: 'green',
            icon: '👨‍🏫',
            permissions: [
                'Dashboard access',
                'View assigned batches',
                'Validate participant attendance',
                'Upload training materials',
                'Grade submissions',
                'Provide feedback to participants',
                'View batch reports'
            ]
        },
        'branch-coordinator': { 
            color: 'purple',
            icon: '🏢',
            permissions: [
                'Dashboard access',
                'Monitor branch participants',
                'View participant progress',
                'Download branch reports',
                'Inform teachers about trainings'
            ]
        },
        'participant': { 
            color: 'yellow',
            icon: '🎓',
            permissions: [
                'Dashboard access',
                'Browse available trainings',
                'Register for trainings',
                'Check-in attendance',
                'Submit assignments',
                'Provide feedback',
                'View personal training history',
                'Download certificates'
            ]
        },
    };

    const config = roleConfig[role.slug] || { 
        color: 'gray',
        icon: '👤',
        permissions: []
    };

    const colorClasses = {
        red: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-500', text: 'text-red-700' },
        blue: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-500', text: 'text-blue-700' },
        green: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-500', text: 'text-green-700' },
        purple: { bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-500', text: 'text-purple-700' },
        yellow: { bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-500', text: 'text-yellow-700' },
        gray: { bg: 'bg-gray-50', border: 'border-gray-200', badge: 'bg-gray-500', text: 'text-gray-700' },
    };

    const colors = colorClasses[config.color];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">Role Details</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage permissions and view users in this role</p>
                    </div>
                    <Link
                        href={route('admin.roles.index')}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Roles
                    </Link>
                </div>
            }
        >
            <Head title={`Role: ${role.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Role Header Card */}
                    <div className={`${colors.bg} ${colors.border} border-2 rounded-xl p-8`}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="text-6xl">
                                    {config.icon}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        {role.name}
                                    </h1>
                                    <p className={`text-lg ${colors.text}`}>
                                        {role.description}
                                    </p>
                                    <div className="flex items-center space-x-4 mt-3">
                                        <span className={`${colors.badge} text-white text-sm font-semibold px-4 py-1.5 rounded-full`}>
                                            {role.users?.length || 0} Active Users
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Slug: <code className="bg-white px-2 py-1 rounded">{role.slug}</code>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Permissions */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Permissions & Capabilities
                            </h3>
                            
                            <div className="space-y-2">
                                {config.permissions.map((permission, index) => (
                                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition">
                                        <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm text-gray-700">{permission}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="space-y-4">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-4">Quick Stats</h4>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Total Users</div>
                                        <div className="text-3xl font-bold text-gray-900">{role.users?.length || 0}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Active Users</div>
                                        <div className="text-3xl font-bold text-green-600">
                                            {role.users?.filter(u => u.status === 'active').length || 0}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Inactive Users</div>
                                        <div className="text-3xl font-bold text-gray-400">
                                            {role.users?.filter(u => u.status === 'inactive').length || 0}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="text-sm text-blue-800">
                                        <p className="font-semibold mb-1">Role Information</p>
                                        <p>This role is system-defined and cannot be deleted. You can view users and their permissions.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Users List */}
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Users with this Role ({role.users?.length || 0})
                                </h3>
                                <Link
                                    href={route('admin.users.create', { role: role.slug })}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    + Add User to Role
                                </Link>
                            </div>
                        </div>

                        {role.users && role.users.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Branch
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {role.users.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                                            {user.full_name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {user.full_name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.branch || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                        user.status === 'active' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <Link
                                                        href={route('admin.users.edit', user.id)}
                                                        className="text-blue-600 hover:text-blue-900 font-medium"
                                                    >
                                                        Edit
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No users</h3>
                                <p className="mt-1 text-sm text-gray-500">Get started by adding a user to this role.</p>
                                <div className="mt-6">
                                    <Link
                                        href={route('admin.users.create', { role: role.slug })}
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        Add User
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