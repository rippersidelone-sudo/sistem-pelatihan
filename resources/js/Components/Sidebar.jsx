// resources/js/Components/Sidebar.jsx
import { Link, usePage } from '@inertiajs/react';

export default function Sidebar({ user, navigation }) {
    const { url } = usePage(); 

    const isActive = (href) => {
    if (!href) return false;

    try {
        const current = route().current();

        if (current === href) return true;

        if (href === 'coordinator.batches.index') {
            return current?.startsWith('coordinator.batches');
        }

        if (href === 'coordinator.categories.index') {
            return current?.startsWith('coordinator.categories');
        }

        if (href === 'coordinator.participants.index') {
            return current?.startsWith('coordinator.participants');
        }

        if (href === 'coordinator.attendance.monitor') {
            return current === 'coordinator.attendance.monitor';
        }
        if (href === 'coordinator.reports.dashboard') {
            return current === 'coordinator.reports.dashboard';
        }

        return current?.startsWith(href + '.');
    } catch (e) {
        return false;
    }
};

    const roleInfo = {
        'master-hq': { title: 'Master HQ', initial: 'A', subtitle: 'Administrator' },
        'training-coordinator': { title: 'Koordinator Pelatihan', initial: 'K', subtitle: 'Training Coordinator' },
        'trainer': { title: 'Trainer', initial: 'T', subtitle: 'Pengajar' },
        'branch-coordinator': { title: 'Branch Coord', initial: 'B', subtitle: 'Koordinator Cabang' },
        'participant': { title: user?.name?.[0] || 'P', initial: 'P', subtitle: 'Peserta' },
    };

    const info = roleInfo[user?.role?.slug] || { title: 'User', initial: 'U', subtitle: '' };

    return (
        <div className="w-64 bg-green-600 text-white flex-shrink-0 hidden lg:flex flex-col sticky top-0 h-screen">
            {/* Header */}
            <div className="p-6 border-b border-green-700">
                <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                        <span className="text-green-600">{info.initial}</span>
                    </div>
                    <div>
                        <div className="font-bold text-base">{info.title}</div>
                        <div className="text-xs text-green-100 opacity-90">{info.subtitle}</div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        href={route(item.href)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive(item.href)
                                ? 'bg-white text-green-600 font-semibold shadow-md'
                                : 'text-green-100 hover:bg-green-700 hover:text-white'
                        }`}
                    >
                        {item.icon}
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
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 font-semibold shadow-md transition"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                </Link>
            </div>
        </div>
    );
}