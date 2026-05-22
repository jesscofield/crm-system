import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { customerService } from '../services/customerService';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [customerCount, setCustomerCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const userType = localStorage.getItem('userType');
    const companyName = localStorage.getItem('companyName');

    useEffect(() => {
        const loadCustomerCount = async () => {
            try {
                const customers = await customerService.getAll();
                setCustomerCount(customers.length);
            } catch (error) {
                console.error('Failed to load customer count:', error);
            } finally {
                setLoading(false);
            }
        };
        loadCustomerCount();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.username || user?.fullName || 'User'}</p>
                {userType && (
                    <p className="text-gray-500 text-sm mt-1">
                        Account: {userType === 'company' ? `Company (${companyName || 'N/A'})` : 'Freelance'}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-md transform hover:scale-105 transition-all duration-200">
                    <h3 className="font-semibold text-white text-lg">Customers</h3>
                    <p className="text-4xl font-bold text-white mt-2">{loading ? '...' : customerCount}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-md transform hover:scale-105 transition-all duration-200">
                    <h3 className="font-semibold text-white text-lg">Appointments</h3>
                    <p className="text-4xl font-bold text-white mt-2">0</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-md transform hover:scale-105 transition-all duration-200">
                    <h3 className="font-semibold text-white text-lg">Companies</h3>
                    <p className="text-4xl font-bold text-white mt-2">0</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <Link
                        to="/customers"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                    >
                        Manage Customers
                    </Link>
                    <Link
                        to="/appointments"
                        className="bg-green-500 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                    >
                        View Appointments
                    </Link>
                    <Link
                        to="/kanban"
                        className="bg-purple-500 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                    >
                        Sales Pipeline
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;