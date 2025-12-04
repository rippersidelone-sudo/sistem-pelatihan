// resources/js/Pages/Coordinator/Batches/Create.jsx
import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Create({ categories, trainers }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        category_id: '',
        trainer_id: '',
        start_date: '',
        end_date: '',
        min_participants: '',
        max_participants: '',
        zoom_link: '',
        assignment_description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('coordinator.batches.store'));
    };

    return (
        <>
            <Head title="Tambah Batch Baru" />
            {/* Background */}
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
                {/* Dekorasi halus */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                    <div className="absolute bottom-0 -right-40 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                </div>

                {/* Tombol Kembali (Fixed, kecil, elegan) */}
                <div className="fixed top-7 left-7 z-50">
                    <Link
                        href={route('coordinator.batches.index')}
                        className="group flex items-center gap-3 bg-white/95 backdrop-blur-lg px-5 py-3 rounded-2xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                        <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg group-hover:scale-110 transition-transform">
                            <ArrowLeftIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium text-gray-700 text-sm">Kembali</span>
                    </Link>
                </div>

                {/* Main Card */}
                <div className="max-w-5xl mx-auto px-6 pt-28 pb-16">
                    <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-10 py-9 text-white">
                            <h1 className="text-3xl font-bold tracking-tight">Tambah Batch Baru</h1>
                            <p className="text-blue-100 mt-2 text-lg opacity-90">
                                Isi detail batch pelatihan dengan lengkap
                            </p>
                        </div>

                        {/* Form - DIKECILKAN */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Judul Batch */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Batch</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 text-base bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                    placeholder="Contoh: Python Game Developer Batch 1"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                            </div>

                            {/* Tanggal */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Mulai</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 text-base bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                    />
                                    {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Selesai</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 text-base bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                    />
                                    {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
                                </div>
                            </div>

                            {/* Kategori & Trainer */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori Pelatihan</label>
                                    <select
                                        className="w-full px-4 py-3 text-base bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {categories?.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Trainer</label>
                                    <select
                                        className="w-full px-4 py-3 text-base bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                                        value={data.trainer_id}
                                        onChange={(e) => setData('trainer_id', e.target.value)}
                                    >
                                        <option value="">Pilih Trainer</option>
                                        {trainers?.map((tr) => (
                                            <option key={tr.id} value={tr.id}>{tr.name}</option>
                                        ))}
                                    </select>
                                    {errors.trainer_id && <p className="text-red-500 text-sm mt-1">{errors.trainer_id}</p>}
                                </div>
                            </div>

                            {/* Kuota Peserta */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Minimal Peserta</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="w-full px-4 py-3 text-base bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                                        placeholder="Jumlah minimal peserta"
                                        value={data.min_participants}
                                        onChange={(e) => setData('min_participants', e.target.value)}
                                    />
                                    {errors.min_participants && <p className="text-red-500 text-sm mt-1">{errors.min_participants}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Maksimal Peserta</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full px-4 py-3 text-base bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                                        placeholder="Jumlah maksimal peserta"
                                        value={data.max_participants}
                                        onChange={(e) => setData('max_participants', e.target.value)}
                                    />
                                    {errors.max_participants && <p className="text-red-500 text-sm mt-1">{errors.max_participants}</p>}
                                </div>
                            </div>

                            {/* Zoom & Deskripsi Tugas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Link Zoom <span className="text-gray-500 font-normal">(opsional)</span>
                                    </label>
                                    <input
                                        type="url"
                                        className="w-full px-4 py-3 text-base bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                                        placeholder="Tambahkan link Zoom jika ada..."
                                        value={data.zoom_link}
                                        onChange={(e) => setData('zoom_link', e.target.value)}
                                    />
                                    {errors.zoom_link && <p className="text-red-500 text-sm mt-1">{errors.zoom_link}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Deskripsi Tugas Akhir <span className="text-gray-500 font-normal">(opsional)</span>
                                    </label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-4 py-3 text-base bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                                        placeholder="Jelaskan tugas akhir atau proyek yang harus disubmit..."
                                        value={data.assignment_description}
                                        onChange={(e) => setData('assignment_description', e.target.value)}
                                    />
                                    {errors.assignment_description && <p className="text-red-500 text-sm mt-1">{errors.assignment_description}</p>}
                                </div>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                                <Link
                                    href={route('coordinator.batches.index')}
                                    className="px-6 py-3 text-gray-600 font-medium hover:text-gray-900 transition"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-10 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Batch'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}