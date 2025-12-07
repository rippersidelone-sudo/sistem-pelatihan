import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ auth, batch, categories, trainers }) {
    const formatTime = (t) => t ? t.slice(0,5) : '';
    const { data, setData, put, processing, errors } = useForm({
        title: batch.title || '',
        category_id: batch.category_id || '',
        trainer_id: batch.trainer_id || '',
        start_date: batch.start_date || '',
        start_time: formatTime(batch.start_time),
        end_date: batch.end_date || '',
        end_time: formatTime(batch.end_time),
        min_participants: batch.min_participants || '',
        max_participants: batch.max_participants || 30,
        zoom_link: batch.zoom_link || '',
        assignment_description: batch.assignment_description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('coordinator.batches.update', batch.id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Batch" />

            <div className="py-8">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">

                        {/* HEADER – SAMA PERSIS DENGAN CREATE (HIJAU GRADIENT) */}
                        <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Edit Batch</h2>
                                    <p className="text-green-100 text-sm mt-1">
                                        Ubah detail batch pelatihan
                                    </p>
                                </div>
                                <Link
                                    href={route('coordinator.batches.index')}
                                    className="text-white hover:text-green-100 transition"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* FORM – 100% SAMA DENGAN CREATE */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">

                            {/* Judul Batch */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Judul Batch *
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                    placeholder="Contoh: Python Game Developer - Batch Januari 2026"
                                    required
                                />
                                {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
                            </div>

                            {/* Kategori & Trainer */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Kategori Pelatihan *
                                    </label>
                                    <select
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                        required
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="mt-2 text-sm text-red-600">{errors.category_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Trainer Pengajar *
                                    </label>
                                    <select
                                        value={data.trainer_id}
                                        onChange={(e) => setData('trainer_id', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                        required
                                    >
                                        <option value="">Pilih Trainer</option>
                                        {trainers && trainers.length > 0 ? (
                                            trainers.map((trainer) => (
                                                <option key={trainer.id} value={trainer.id}>
                                                    {trainer.full_name}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>Tidak ada trainer tersedia</option>
                                        )}
                                    </select>
                                    {errors.trainer_id && <p className="mt-2 text-sm text-red-600">{errors.trainer_id}</p>}
                                </div>
                            </div>

                            {/* Tanggal & Jam Mulai/Selesai */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Tanggal Mulai *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                        required
                                    />
                                    {errors.start_date && <p className="mt-2 text-sm text-red-600">{errors.start_date}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Tanggal Selesai *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                        required
                                    />
                                    {errors.end_date && <p className="mt-2 text-sm text-red-600">{errors.end_date}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Jam Mulai *
                                    </label>
                                    <input
                                        type="time"
                                        value={data.start_time}
                                        onChange={(e) => setData('start_time', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                        required
                                    />
                                    {errors.start_time && <p className="mt-2 text-sm text-red-600">{errors.start_time}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Jam Selesai *
                                    </label>
                                    <input
                                        type="time"
                                        value={data.end_time}
                                        onChange={(e) => setData('end_time', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                        required
                                    />
                                    {errors.end_time && <p className="mt-2 text-sm text-red-600">{errors.end_time}</p>}
                                </div>
                            </div>

                            {/* Kuota Peserta */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Minimal Peserta
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={data.min_participants}
                                        onChange={(e) => setData('min_participants', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                        placeholder="Contoh: 10"
                                    />
                                    {errors.min_participants && <p className="mt-2 text-sm text-red-600">{errors.min_participants}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Maksimal Peserta *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={data.max_participants}
                                        onChange={(e) => setData('max_participants', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                        placeholder="Contoh: 30"
                                        required
                                    />
                                    {errors.max_participants && <p className="mt-2 text-sm text-red-600">{errors.max_participants}</p>}
                                </div>
                            </div>

                            {/* Zoom Link */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Link Zoom (Opsional)
                                </label>
                                <input
                                    type="url"
                                    value={data.zoom_link}
                                    onChange={(e) => setData('zoom_link', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                    placeholder="https://zoom.us/j/..."
                                />
                                {errors.zoom_link && <p className="mt-2 text-sm text-red-600">{errors.zoom_link}</p>}
                            </div>

                            {/* Deskripsi Tugas Akhir */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Deskripsi Tugas Akhir / Proyek (Opsional)
                                </label>
                                <textarea
                                    rows={4}
                                    value={data.assignment_description}
                                    onChange={(e) => setData('assignment_description', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
                                    placeholder="Jelaskan tugas akhir atau proyek yang harus disubmit peserta..."
                                />
                                {errors.assignment_description && <p className="mt-2 text-sm text-red-600">{errors.assignment_description}</p>}
                            </div>

                            {/* Info Box */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="ml-3 text-sm text-blue-800">
                                        <p className="font-semibold mb-1">Perhatian</p>
                                        <p>Perubahan pada batch akan langsung berlaku untuk semua peserta terdaftar.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                                <Link
                                    href={route('coordinator.batches.index')}
                                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Menyimpan...
                                        </span>
                                    ) : (
                                        'Simpan Perubahan'
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