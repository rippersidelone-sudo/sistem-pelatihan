import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Index({ auth, roles, users, roleStats, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [roleFilter, setRoleFilter] = useState(filters.role || "");

    const [showAddUserModal, setShowAddUserModal] = useState(false);

    const handleDeleteUser = (userId) => {
        if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            router.delete(route('admin.roles.users.destroy', userId));
        }
    };

    const applyFilter = () => {
        router.get(route('admin.roles.index'), {
            search: search,
            role: roleFilter,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilter = () => {
        setSearch("");
        setRoleFilter("");

        router.get(route('admin.roles.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const permissionMatrix = [
        {
            resource: 'Batch Management',
            admin: '✓',
            coordinator: '✓',
            trainer: 'View',
            branch: 'View',
            participant: '–'
        },
        {
            resource: 'User Management',
            admin: '✓',
            coordinator: '–',
            trainer: '–',
            branch: '–',
            participant: '–'
        },
        {
            resource: 'Attendance Management',
            admin: '✓',
            coordinator: '✓',
            trainer: '✓',
            branch: 'View',
            participant: 'Self'
        },
        {
            resource: 'Upload Materials',
            admin: '✓',
            coordinator: '✓',
            trainer: '✓',
            branch: '–',
            participant: '–'
        },
        {
            resource: 'Global Reports',
            admin: '✓',
            coordinator: '✓',
            trainer: 'Own',
            branch: 'Branch',
            participant: 'Self'
        }
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Role & Permission Management</h2>
                    <p className="text-sm text-gray-500 mt-1">Kelola user dan permission sistem</p>
                </div>
            }
        >
            <Head title="Role & Permission" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* --- Role Stats Cards --- */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm text-gray-600">HQ Curriculum Admin</div>
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{roleStats.hq_curriculum_admin}</div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm text-gray-600">Training Coordinator</div>
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{roleStats.training_coordinator}</div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm text-gray-600">Trainer / Facilitator</div>
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 0 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{roleStats.trainer}</div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm text-gray-600">Branch PIC</div>
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 0 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{roleStats.branch_pic}</div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm text-gray-600">Participant</div>
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 0 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{roleStats.participant}</div>
                        </div>
                    </div>

                    {/* ---------------------- FILTER BAR ---------------------- */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                            {/* Search */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cari Nama
                                </label>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Cari user..."
                                />
                            </div>

                            {/* Role Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Filter Role
                                </label>
                                <select
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Semua Role</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>{role.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-end gap-3">
                                <button
                                    onClick={applyFilter}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Search
                                </button>

                                <button
                                    onClick={resetFilter}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                                >
                                    Reset
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* ---------------------- USER LIST TABLE ---------------------- */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Daftar User</h3>
                            <button 
                                onClick={() => setShowAddUserModal(true)}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="font-medium">Tambah User</span>
                            </button>
                        </div>

                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.data.length > 0 ? users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {user.full_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user.role?.name || 'N/A'}
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
                                                <div className="flex items-center space-x-3">
                                                    <Link
                                                        href={route('admin.users.edit', user.id)}
                                                        className="text-gray-600 hover:text-gray-900"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414
                                                            a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                            />
                                                        </svg>
                                                    </Link>

                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5
                                                            4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1
                                                            1v3M4 7h16"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                Tidak ada user ditemukan
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        <div className="flex justify-between items-center mt-4 px-2">
                            {users.links.map((link, index) => (
                                <button
                                    key={index}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.visit(link.url, { preserveScroll: true })}
                                    className={
                                        "px-3 py-1 mx-1 rounded " +
                                        (link.active
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300")
                                    }
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>

                    </div>

                    {/* Permission Matrix */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Permission Matrix</h3>
                        
                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Coordinator</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trainer</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Branch PIC</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Participant</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {permissionMatrix.map((permission, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {permission.resource}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                                                {permission.admin === '✓' ? (
                                                    <svg className="w-5 h-5 mx-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : permission.admin}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                                                {permission.coordinator === '✓' ? (
                                                    <svg className="w-5 h-5 mx-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : permission.coordinator}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                                                {permission.trainer === '✓' ? (
                                                    <svg className="w-5 h-5 mx-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : permission.trainer}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                                                {permission.branch}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                                                {permission.participant}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
