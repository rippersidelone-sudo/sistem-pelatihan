import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function Create({ auth, roles }) {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        full_name: '',
        phone: '',
        role_id: '',
        branch: '',
        status: 'active',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    // Check if selected role needs branch
    const selectedRole = roles.find(r => r.id === parseInt(data.role_id));
    const needsBranch = selectedRole && ['branch-coordinator', 'participant'].includes(selectedRole.slug);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create User" />
            
            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold">Create New User</h3>
                                <Link
                                    href={route('admin.users.index')}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    ← Back to Users
                                </Link>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    {/* Username */}
                                    <div>
                                        <InputLabel htmlFor="username" value="Username *" />
                                        <TextInput
                                            id="username"
                                            type="text"
                                            value={data.username}
                                            onChange={(e) => setData('username', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="e.g., john_doe"
                                            required
                                        />
                                        <InputError message={errors.username} className="mt-2" />
                                        <p className="text-xs text-gray-500 mt-1">Username will be used for login</p>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <InputLabel htmlFor="email" value="Email *" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="e.g., john@example.com"
                                            required
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>

                                    {/* Full Name */}
                                    <div>
                                        <InputLabel htmlFor="full_name" value="Full Name *" />
                                        <TextInput
                                            id="full_name"
                                            type="text"
                                            value={data.full_name}
                                            onChange={(e) => setData('full_name', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="e.g., John Doe"
                                            required
                                        />
                                        <InputError message={errors.full_name} className="mt-2" />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <InputLabel htmlFor="phone" value="Phone Number" />
                                        <TextInput
                                            id="phone"
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="e.g., 081234567890"
                                        />
                                        <InputError message={errors.phone} className="mt-2" />
                                    </div>

                                    {/* Role */}
                                    <div>
                                        <InputLabel htmlFor="role_id" value="Role *" />
                                        <select
                                            id="role_id"
                                            value={data.role_id}
                                            onChange={(e) => setData('role_id', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            required
                                        >
                                            <option value="">Select Role</option>
                                            {roles.map((role) => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.role_id} className="mt-2" />
                                    </div>

                                    {/* Branch (conditional) */}
                                    {needsBranch && (
                                        <div>
                                            <InputLabel htmlFor="branch" value="Branch *" />
                                            <TextInput
                                                id="branch"
                                                type="text"
                                                value={data.branch}
                                                onChange={(e) => setData('branch', e.target.value)}
                                                className="mt-1 block w-full"
                                                placeholder="e.g., Jakarta, Denpasar, Surabaya"
                                                required={needsBranch}
                                            />
                                            <InputError message={errors.branch} className="mt-2" />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Branch is required for Branch Coordinator and Participant roles
                                            </p>
                                        </div>
                                    )}

                                    {/* Password */}
                                    <div>
                                        <InputLabel htmlFor="password" value="Password *" />
                                        <TextInput
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="Minimum 8 characters"
                                            required
                                        />
                                        <InputError message={errors.password} className="mt-2" />
                                    </div>

                                    {/* Password Confirmation */}
                                    <div>
                                        <InputLabel htmlFor="password_confirmation" value="Confirm Password *" />
                                        <TextInput
                                            id="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="mt-1 block w-full"
                                            placeholder="Re-enter password"
                                            required
                                        />
                                        <InputError message={errors.password_confirmation} className="mt-2" />
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <InputLabel htmlFor="status" value="Status *" />
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            required
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                        <InputError message={errors.status} className="mt-2" />
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex justify-end gap-3 pt-4 border-t">
                                        <Link
                                            href={route('admin.users.index')}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50 transition"
                                        >
                                            {processing ? 'Creating...' : 'Create User'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}