import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const userType = localStorage.getItem('userType');
    const companyName = localStorage.getItem('companyName');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Customers', path: '/customers' },
        { name: 'Appointments', path: '/appointments' },
        { name: 'Companies', path: '/companies' },
        { name: 'Sales Pipeline', path: '/kanban' }
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-lg fixed h-full overflow-y-auto">
                {/* Logo */}
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">CRM System</h1>
                    <p className="text-gray-400 text-xs mt-1">Manage your business</p>
                </div>

                {/* Navigation */}
                <nav className="px-4 py-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{ textDecoration: 'none' }}
                            className={`block px-4 py-2.5 mb-2 rounded-lg transition-all duration-200 font-medium ${
                                location.pathname === item.path
                                    ? 'bg-pink-500 text-white'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Divider */}
                <div className="border-t border-gray-100 mx-4 my-4"></div>

                {/* User Info */}
                <div className="px-6 py-4">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Logged in as</p>
                    <p className="font-semibold text-gray-700 text-sm mt-1 truncate">{user?.email}</p>
                    {userType && (
                        <p className="text-xs text-gray-400 mt-2">
                            {userType === 'company' ? `Company: ${companyName || 'N/A'}` : 'Freelance'}
                        </p>
                    )}
                </div>

                {/* Logout */}
                <div className="px-6 py-2">
                    <button
                        onClick={handleLogout}
                        style={{ textDecoration: 'none' }}
                        className="w-full text-left px-4 py-2.5 text-gray-500 font-medium hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-all duration-200"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-64 flex-1">
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;