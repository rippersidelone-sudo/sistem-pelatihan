import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Create({ auth, permissions = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        status: 'active',
        permissions: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.roles.store'));
    };

    const togglePermission = (id) => {
        if (data.permissions.includes(id)) {
            setData('permissions', data.permissions.filter((p) => p !== id));
        } else {
            setData('permissions', [...data.permissions, id]);
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Role" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold">Create New Role</h3>
                            <Link href={route('admin.roles.index')} className="text-gray-600 hover:text-gray-900">
                                ← Back to Roles
                            </Link>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Role Name */}
                            <div>
                                <InputLabel htmlFor="name" value="Role Name *" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* Slug */}
                            <div>
                                <InputLabel htmlFor="slug" value="Slug *" />
                                <TextInput
                                    id="slug"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="e.g., branch-coordinator"
                                    required
                                />
                                <InputError message={errors.slug} className="mt-2" />
                            </div>

                            {/* Description */}
                            <div>
                                <InputLabel htmlFor="description" value="Description" />
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            {/* Permissions */}
                            {permissions.length > 0 && (
                                <div>
                                    <InputLabel value="Permissions" />
                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        {permissions.map((perm) => (
                                            <label key={perm.id} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={data.permissions.includes(perm.id)}
                                                    onChange={() => togglePermission(perm.id)}
                                                />
                                                <span>{perm.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Status */}
                            <div>
                                <InputLabel value="Status *" />
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                <InputError message={errors.status} />
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Link
                                    href={route('admin.roles.index')}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
                                >
                                    {processing ? 'Creating...' : 'Create Role'}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
