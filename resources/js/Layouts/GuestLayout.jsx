// resources/js/Layouts/GuestLayout.jsx
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gradient-to-br from-green-100 via-green-50 to-teal-50">
            {/* Main Card Container */}
            <div className="w-full sm:max-w-md px-6 py-4 overflow-hidden relative z-10">
                {children}
            </div>

            {/* Footer */}
            <div className="mt-6 text-center text-sm text-gray-600 relative z-10">
                <p>&copy; 2025 Training Next Level System - Timedoor Academy</p>
                <p className="text-xs text-gray-500 mt-1">All rights reserved.</p>
            </div>

            {/* Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>
        </div>
    );
}