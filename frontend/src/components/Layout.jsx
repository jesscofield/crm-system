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
            <div className="w-64 bg-white shadow-md fixed h-full overflow-y-auto">
                <div className="p-4 border-b">
                    <h1 className="text-xl font-bold text-blue-600">CRM System</h1>
                </div>
                
                <nav className="p-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-3 mb-2 rounded-xl transition-all duration-200 ${
                                location.pathname === item.path
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                    
                    <hr className="my-4 border-gray-200" />
                    
                    <div className="px-4 py-3 text-sm text-gray-500">
                        <p>Logged in as:</p>
                        <p className="font-medium text-gray-700">{user?.email}</p>
                        {userType && (
                            <p className="text-xs mt-1">
                                {userType === 'company' ? `Company: ${companyName || 'Company'}` : 'Freelance'}
                            </p>
                        )}
                    </div>
                    
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 mt-4 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                        <span>Logout</span>
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