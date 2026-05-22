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
            <div className="w-64 bg-white shadow-xl fixed h-full overflow-y-auto">
                <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-indigo-600">
                    <h1 className="text-xl font-bold text-white tracking-tight">CRM System</h1>
                    <p className="text-blue-100 text-sm mt-1">Manage your business</p>
                </div>
                
                <nav className="p-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`block px-4 py-3 mb-3 rounded-xl transition-all duration-200 ${
                                location.pathname === item.path
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-gray-100 hover:translate-x-1'
                            }`}
                        >
                            <span className="font-medium block">{item.name}</span>
                        </Link>
                    ))}
                    
                    <hr className="my-4 border-gray-200" />
                    
                    <div className="px-4 py-3 bg-gray-50 rounded-xl mx-2 mb-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Logged in as</p>
                        <p className="font-semibold text-gray-800 text-sm mt-1 truncate">{user?.email}</p>
                        {userType && (
                            <p className="text-xs mt-2">
                                {userType === 'company' ? (
                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                                        Company: {companyName || 'Company'}
                                    </span>
                                ) : (
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                        Freelance
                                    </span>
                                )}
                            </p>
                        )}
                    </div>
                    
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                    >
                        Logout
                    </button>
                </nav>
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