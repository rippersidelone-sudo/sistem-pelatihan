// resources/js/Components/MobileSidebar.jsx
import { Link } from '@inertiajs/react';

export default function MobileSidebar({ user, navigation, isOpen, onClose }) {
    if (!isOpen) return null;

    const getRoleInfo = () => {
        if (!user || !user.role) return { 
            initial: 'U', 
            title: 'User'
        };

        const roleSlug = user.role.slug;

        switch (roleSlug) {
            case 'master-hq':
                return { initial: 'A', title: 'Admin HQ' };
            case 'training-coordinator':
                return { initial: 'K', title: 'Koordinator Pelatihan' };
            case 'trainer':
                return { initial: 'T', title: 'Trainer' };
            case 'branch-coordinator':
                return { initial: 'B', title: 'PIC Branch' };
            case 'participant':
                return { initial: 'P', title: 'Peserta' };
            default:
                return { initial: 'U', title: 'User' };
        }
    };

    const roleInfo = getRoleInfo();

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className="fixed top-0 left-0 bottom-0 w-64 bg-green-600 text-white z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-green-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-lg">
                                    <span className="text-green-600">{roleInfo.initial}</span>
                                </div>
                                <div className="font-bold text-base">{roleInfo.title}</div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white hover:bg-green-700 rounded-lg p-2 transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={route(item.href)}
                                onClick={onClose}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                                    route().current(item.href)
                                        ? 'bg-white text-green-600 font-semibold'
                                        : 'text-white hover:bg-green-700'
                                }`}
                            >
                                {item.icon && <span>{item.icon}</span>}
                                <span className="text-sm">{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-green-700">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition font-semibold"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Logout</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}