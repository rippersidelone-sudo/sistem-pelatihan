// resources/js/Pages/Coordinator/Categories/Create.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Create({ auth, categories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        prerequisites: [],
    });

    const [searchQuery, setSearchQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('coordinator.categories.store'));
    };

    const togglePrerequisite = (categoryId) => {
        setData('prerequisites', data.prerequisites.includes(categoryId)
            ? data.prerequisites.filter(id => id !== categoryId)
            : [...data.prerequisites, categoryId]
        );
    };

    const removePrerequisite = (categoryId) => {
        setData('prerequisites', data.prerequisites.filter(id => id !== categoryId));
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedCategories = categories.filter(cat =>
        data.prerequisites.includes(cat.id)
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Tambah Kategori Pelatihan" />

            <div className="py-8">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Tambah Kategori Pelatihan</h2>
                                    <p className="text-green-100 text-sm mt-1">
                                        Buat kategori baru dan atur prerequisite jika diperlukan
                                    </p>
                                </div>
                                <Link
                                    href={route('coordinator.categories.index')}
                                    className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                                >
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-7">
                            {/* Nama Kategori */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nama Kategori <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-base"
                                    placeholder="Contoh: Python Game Developer"
                                    required
                                />
                                {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Deskripsi
                                </label>
                                <textarea
                                    rows={4}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none text-base"
                                    placeholder="Jelaskan tentang kategori pelatihan ini..."
                                />
                                {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
                                <p className="mt-2 text-xs text-gray-500">
                                    Opsional. Berikan deskripsi singkat untuk membantu peserta memahami kategori ini.
                                </p>
                            </div>

                            {/* Prerequisites - Upgrade Visual */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Prerequisite (Syarat Pelatihan)
                                </label>
                                <p className="text-xs text-gray-500 mb-5">
                                    Pilih kategori yang harus diselesaikan terlebih dahulu. Kosongkan jika tidak ada syarat.
                                </p>

                                {/* Selected Prerequisites - Card Cantik */}
                                {selectedCategories.length > 0 && (
                                    <div className="mb-6 p-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-green-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="text-sm font-bold text-green-900">
                                                Prerequisite Terpilih ({selectedCategories.length})
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            {selectedCategories.map((cat) => (
                                                <div
                                                    key={cat.id}
                                                    className="flex items-center justify-between bg-white rounded-lg px-5 py-3.5 shadow-sm border border-green-100 hover:shadow transition"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span className="font-medium text-gray-800">{cat.name}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removePrerequisite(cat.id)}
                                                        className="text-red-500 hover:text-red-700 transition hover:scale-110"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Search & List */}
                                <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-green-300 transition">
                                    <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Cari kategori..."
                                                className="w-full pl-11 pr-5 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm font-medium"
                                            />
                                            <svg className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="max-h-80 overflow-y-auto">
                                        {filteredCategories.length > 0 ? (
                                            filteredCategories.map((category) => (
                                                <label
                                                    key={category.id}
                                                    className="flex items-center px-6 py-4 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-0 transition"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={data.prerequisites.includes(category.id)}
                                                        onChange={() => togglePrerequisite(category.id)}
                                                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                    />
                                                    <div className="ml-4 flex-1">
                                                        <div className="font-semibold text-gray-900">{category.name}</div>
                                                        {category.description && (
                                                            <div className="text-sm text-gray-600 mt-1 line-clamp-1">
                                                                {category.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {data.prerequisites.includes(category.id) && (
                                                        <svg className="w-6 h-6 text-green-600 ml-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </label>
                                            ))
                                        ) : (
                                            <div className="px-6 py-12 text-center">
                                                <div className="text-gray-400">
                                                    <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2m-6 0h6" />
                                                    </svg>
                                                </div>
                                                <p className="mt-3 text-sm text-gray-500">
                                                    {searchQuery ? 'Kategori tidak ditemukan' : 'Belum ada kategori lain tersedia'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {errors.prerequisites && <p className="mt-3 text-sm text-red-600">{errors.prerequisites}</p>}
                            </div>

                            {/* Info Box - Lebih Elegan */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-bold text-blue-900">Tentang Prerequisite</p>
                                        <p className="text-sm text-blue-800 mt-1">
                                            Prerequisite adalah kategori yang wajib diselesaikan sebelum peserta dapat mendaftar kategori ini. 
                                            Sistem akan otomatis mengecek riwayat pelatihan peserta.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex justify-end gap-4 pt-6 border-t-2 border-gray-200">
                                <Link
                                    href={route('coordinator.categories.index')}
                                    className="px-8 py-3.5 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold transition transform hover:scale-105"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-10 py-3.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        'Simpan Kategori'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}