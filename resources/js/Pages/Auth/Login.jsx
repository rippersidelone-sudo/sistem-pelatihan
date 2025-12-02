// resources/js/Pages/Auth/Login.jsx
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen bg-[#edf7ed] flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-4xl">

                    {/* Header atas - Icon toga persis seperti gambar asli */}
                    <div className="text-center mb-12">
                        <div className="mx-auto w-20 h-20 bg-green-600 rounded-3xl flex items-center justify-center shadow-xl">
                            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                            </svg>
                        </div>
                        <h1 className="mt-4 text-2xl font-bold text-gray-800">Sistem Pelatihan Guru</h1>
                        <p className="mt-1 text-gray-600">Silahkan login untuk melanjutkan</p>
                    </div>

                    {/* Card Login */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-5">

                            {/* Kiri: Logo Timedoor */}
                            <div className="md:col-span-2 bg-gradient-to-b from-green-50 to-white flex items-center justify-center py-16 px-8">
                                <img 
                                    src="/images/timedoor-logo.png" 
                                    alt="Timedoor Academy"
                                    className="w-full max-w-xs drop-shadow-lg"
                                />
                            </div>

                            {/* Kanan: Form Login */}
                            <div className="md:col-span-3 p-10 lg:p-14">
                                {/* JUDUL LOGIN SEKARANG DI TENGAH */}
                                <h2 className="text-center text-3xl font-bold text-gray-800 mb-12">
                                    Login
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-7">

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="text"
                                            value={data.username}
                                            onChange={(e) => setData('username', e.target.value)}
                                            placeholder="admin@gmail.com"
                                            className="w-full px-5 py- py-4 bg-gray-100 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-4 focus:ring-green-300 transition"
                                            required
                                        />
                                        {errors.username && (
                                            <p className="mt-2 text-sm text-red-600">{errors.username}</p>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full px-5 py-4 bg-gray-100 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-4 focus:ring-green-300 transition pr-14"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700"
                                            >
                                                {showPassword ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                        )}
                                    </div>

                                    {/* Tombol Login */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition"
                                    >
                                        {processing ? 'Memproses...' : 'Login'}
                                    </button>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}