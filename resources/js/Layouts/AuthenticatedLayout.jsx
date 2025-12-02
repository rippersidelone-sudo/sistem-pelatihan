// resources/js/Layouts/AuthenticatedLayout.jsx
import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const { auth } = usePage().props;
    
    // Get user from props or page props
    const currentUser = user || auth.user;

    // Get navigation based on role
    const getNavigation = () => {
        if (!currentUser || !currentUser.role) return [];

        const roleSlug = currentUser.role.slug;

        switch (roleSlug) {
            case 'master-hq':
                return [
                    { 
                        name: 'Master Dashboard', 
                        href: 'admin.dashboard',
                        icon: (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        )
                    },
                    { 
                        name: 'Batch Oversight', 
                        href: 'admin.batches.index',
                        icon: (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        )
                    },
                    { 
                        name: 'Role & Permission', 
                        href: 'admin.roles.index',
                        icon: (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        )
                    },
                    { 
                        name: 'Laporan Global', 
                        href: 'admin.reports',
                        icon: (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        )
                    },
                    { 
                        name: 'Audit Log', 
                        href: 'admin.reports',
                        icon: (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        )
                    },
                ];
            case 'training-coordinator':
                return [
                    { name: 'Dashboard', href: 'coordinator.dashboard' },
                    { name: 'Categories', href: 'coordinator.categories.index' },
                    { name: 'Batches', href: 'coordinator.batches.index' },
                    { name: 'Participants', href: 'coordinator.participants.index' },
                ];
            case 'trainer':
                return [
                    { name: 'Dashboard', href: 'trainer.dashboard' },
                    { name: 'My Batches', href: 'trainer.batches.index' },
                ];
            case 'branch-coordinator':
                return [
                    { name: 'Dashboard', href: 'branch.dashboard' },
                    { name: 'Participants', href: 'branch.participants.index' },
                    { name: 'Reports', href: 'branch.reports' },
                ];
            case 'participant':
                return [
                    { name: 'Dashboard', href: 'participant.dashboard' },
                    { name: 'Browse Training', href: 'participant.trainings.index' },
                    { name: 'My Trainings', href: 'participant.trainings.my' },
                    { name: 'History', href: 'participant.history' },
                ];
            default:
                return [];
        }
    };

    const navigation = getNavigation();

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className="w-64 bg-green-600 text-white flex-shrink-0 hidden lg:block sticky top-0 h-screen">
                <div className="h-full flex flex-col">
                    {/* Logo/Header */}
                    <div className="p-6 border-b border-green-700">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-600 font-bold text-lg">
                                A
                            </div>
                            <div>
                                <div className="font-bold text-lg">Admin HQ</div>
                                <div className="text-xs text-green-200">HQ Curriculum Admin</div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navigation.map((item) => {
                            // Check if current route matches the menu item
                            const isActive = route().current(item.href) || 
                                           (item.href.includes('roles') && route().current('admin.roles.*')) ||
                                           (item.href.includes('batches') && route().current('admin.batches.*')) ||
                                           (item.href.includes('reports') && route().current('admin.reports*'));
                            
                            return (
                                <Link
                                    key={item.name}
                                    href={route(item.href)}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-white text-green-600 font-semibold'
                                            : 'text-white hover:bg-green-700'
                                    }`}
                                >
                                    {item.icon && <span>{item.icon}</span>}
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-green-700">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors font-semibold"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Logout</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Navigation for Mobile */}
                <nav className="bg-white border-b border-gray-200 lg:hidden sticky top-0 z-10">
                    <div className="px-4">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <span className="text-xl font-bold text-gray-800">
                                    Training System
                                </span>
                            </div>

                            {/* Hamburger */}
                            <div className="flex items-center">
                                <button
                                    onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                                >
                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        <path
                                            className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Responsive Navigation Menu */}
                    <div className={(showingNavigationDropdown ? 'block' : 'hidden')}>
                        <div className="pt-2 pb-3 space-y-1">
                            {navigation.map((item) => {
                                const isActive = route().current(item.href) || 
                                               (item.href.includes('roles') && route().current('admin.roles.*')) ||
                                               (item.href.includes('batches') && route().current('admin.batches.*')) ||
                                               (item.href.includes('reports') && route().current('admin.reports*'));
                                
                                return (
                                    <Link
                                        key={item.name}
                                        href={route(item.href)}
                                        className={`block w-full ps-3 pe-4 py-2 border-l-4 text-start text-base font-medium focus:outline-none transition duration-150 ease-in-out ${
                                            isActive
                                                ? 'border-green-400 text-green-700 bg-green-50'
                                                : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Responsive Settings Options */}
                        <div className="pt-4 pb-1 border-t border-gray-200">
                            <div className="px-4">
                                <div className="font-medium text-base text-gray-800">{currentUser?.full_name}</div>
                                <div className="font-medium text-sm text-gray-500">{currentUser?.email}</div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <Link
                                    href={route('profile.edit')}
                                    className="block w-full ps-3 pe-4 py-2 border-l-4 border-transparent text-start text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out"
                                >
                                    Profile
                                </Link>
                                <Link
                                    method="post"
                                    href={route('logout')}
                                    as="button"
                                    className="block w-full ps-3 pe-4 py-2 border-l-4 border-transparent text-start text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out"
                                >
                                    Log Out
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Page Header */}
                {header && (
                    <header className="bg-white shadow-sm">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                    </header>
                )}

                {/* Page Content */}
                <main className="flex-1 bg-gray-100">{children}</main>
            </div>
        </div>
    );
}