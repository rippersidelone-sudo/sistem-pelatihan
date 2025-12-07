// resources/js/Pages/Coordinator/Categories/Show.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, category, batches }) {
    const getStatusBadge = (status) => {
        const badges = {
            scheduled: 'bg-cyan-100 text-cyan-700',
            ongoing: 'bg-yellow-100 text-yellow-700',
            completed: 'bg-green-100 text-green-700',
        };
        return badges[status] || 'bg-gray-100 text-gray-700';
    };

    const getStatusText = (status) => {
        const texts = {
            scheduled: 'Scheduled',
            ongoing: 'Ongoing',
            completed: 'Completed',
        };
        return texts[status] || status;
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Detail: ${category.name}`} />

            <div className="py-8">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Detail Kategori</h2>
                                    <p className="text-green-100 text-sm mt-1">
                                        Informasi lengkap kategori pelatihan
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

                        {/* Body */}
                        <div className="p-8 space-y-8">

                            {/* Nama Kategori + Badge Count */}
                            <div className="text-center">
                                <h1 className="text-4xl font-bold text-gray-900 mb-3">{category.name}</h1>
                                
                                <div className="mand flex items-center justify-center gap-3 flex-wrap">
                                    {category.prerequisites?.length > 0 ? (
                                        <span className="inline-flex items-center gap-2 px-5 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            Memiliki Prerequisite
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 px-5 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Tanpa Prerequisite
                                        </span>
                                    )}

                                    <span className="inline-flex items-center gap-2 px-5 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        {batches?.length || 0} Batch
                                    </span>
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Deskripsi</label>
                                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 min-h-[100px]">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {category.description || (
                                            <span className="text-gray-400 italic">Tidak ada deskripsi untuk kategori ini.</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Prerequisite */}
                            {category.prerequisites?.length > 0 && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                                        Prerequisite (Syarat Pelatihan)
                                    </label>
                                    <div className="space-y-3">
                                        {category.prerequisites.map((prereq, i) => (
                                            <div key={prereq.id} className="flex items-center gap-4 bg-orange-50 rounded-lg px-5 py-4 border border-orange-200">
                                                <div className="w-9 h-9 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                                    {i + 1}
                                                </div>
                                                <span className="font-medium text-gray-900">{prereq.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Menjadi Prerequisite Untuk */}
                            {category.prerequisite_for?.length > 0 && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-4">
                                        Menjadi Prerequisite Untuk
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {category.prerequisite_for.map((cat) => (
                                            <span key={cat.id} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                </svg>
                                                {cat.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* List Batch */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Batch Pelatihan ({batches?.length || 0})
                                    </label>
                                    {batches?.length > 0 && (
                                        <Link href={route('coordinator.batches.index')} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                            Lihat Semua Batch
                                        </Link>
                                    )}
                                </div>

                                {batches && batches.length > 0 ? (
                                    <div className="space-y-3">
                                        {batches.map((batch) => (
                                            <div key={batch.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200 hover:shadow-md transition">
                                                <div className="flex items-center justify-between mb-3">
                                                    <Link href={route('coordinator.batches.show', batch.id)} className="text-lg font-bold text-gray-900 hover:text-blue-600 transition">
                                                        {batch.title}
                                                    </Link>
                                                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${getStatusBadge(batch.status)}`}>
                                                        {getStatusText(batch.status)}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>{new Date(batch.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                    </div>

                                                    {batch.trainer && (
                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            <span>{batch.trainer.name}</span>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                        <span>{batch.participants_count}/{batch.max_participants} peserta</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-lg p-12 text-center border-2 border-dashed border-gray-300">
                                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        <p className="text-gray-500 font-medium mb-2">Belum ada batch</p>
                                        <p className="text-gray-400 text-sm">Kategori ini belum memiliki batch pelatihan</p>
                                    </div>
                                )}
                            </div>

                            {/* Metadata */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t-2 border-gray-100 text-center">
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Dibuat Oleh</p>
                                    <p className="mt-1 font-bold text-gray-900">{category.creator?.name || 'Admin'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Dibuat Pada</p>
                                    <p className="mt-1 font-bold text-gray-900">
                                        {new Date(category.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Terakhir Diperbarui</p>
                                    <p className="mt-1 font-bold text-gray-900">
                                        {new Date(category.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            {/* Footer: Tombol Kembali di kiri + Aksi Utama di tengah */}
                            <div className="pt-8 border-t-2 border-gray-100">
                                <div className="flex items-center justify-between">
                                    {/* Tombol Kembali - Pojok Kiri */}
                                    <Link
                                        href={route('coordinator.categories.index')}
                                        className="inline-flex items-center gap-3 text-green-600 hover:text-green-700 font-semibold transition group"
                                    >
                                        <svg className="w-6 h-6 group-hover:-translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Kembali ke Daftar Kategori
                                    </Link>

                                    {/* Tombol Aksi Utama - Tengah */}
                                    <div className="flex gap-4">
                                        <Link
                                            href={route('coordinator.batches.index')}
                                            className="px-7 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition"
                                        >
                                            Kelola Batch
                                        </Link>

                                        <Link
                                            href={route('coordinator.categories.edit', category.id)}
                                            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition shadow-sm hover:shadow"
                                        >
                                            Edit Kategori
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}