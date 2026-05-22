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

    // Navigation items
    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: '📊' },
        { name: 'Customers', path: '/customers', icon: '👥' },
        { name: 'Appointments', path: '/appointments', icon: '📅' },
        { name: 'Companies', path: '/companies', icon: '🏢' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md fixed h-full overflow-y-auto">
                <div className="p-4 border-b">
                    <h1 className="text-xl font-bold text-blue-600">CRM System</h1>
                </div>
                
                <nav className="p-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition ${
                                location.pathname === item.path
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <span>{item.icon}</span>
                            <span>{item.name}</span>
                        </Link>
                    ))}
                    
                    <hr className="my-4 border-gray-200" />
                    
                    <div className="px-4 py-3 text-sm text-gray-500">
                        <p>Logged in as:</p>
                        <p className="font-medium text-gray-700">{user?.email}</p>
                        {userType && (
                            <p className="text-xs mt-1">
                                {userType === 'company' ? `🏢 ${companyName || 'Company'}` : '👤 Freelance'}
                            </p>
                        )}
                    </div>
                    
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 mt-4 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                        <span>🚪</span>
                        <span>Logout</span>
                    </button>
                </nav>
            </div>

            {/* Main Content - with margin to account for fixed sidebar */}
            <div className="ml-64 flex-1">
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;