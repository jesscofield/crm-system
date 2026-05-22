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
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-md p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">CRM System</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Welcome, {user?.username || user?.fullName || 'User'}!</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto p-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                    <p className="text-gray-600">Welcome to your CRM system!</p>
                    <p className="text-gray-600 mt-2">Your email: {user?.email}</p>
                    
                    {/* Display user type */}
                    {userType && (
                        <p className="text-gray-600 mt-1">
                            Account type: {userType === 'company' ? `Company (${companyName || 'N/A'})` : 'Freelance'}
                        </p>
                    )}
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-100 p-4 rounded-lg">
                            <h3 className="font-bold text-blue-800">Customers</h3>
                            <p className="text-2xl font-bold">
                                {loading ? '...' : customerCount}
                            </p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg">
                            <h3 className="font-bold text-green-800">Appointments</h3>
                            <p className="text-2xl font-bold">0</p>
                        </div>
                        <div className="bg-purple-100 p-4 rounded-lg">
                            <h3 className="font-bold text-purple-800">Companies</h3>
                            <p className="text-2xl font-bold">0</p>
                        </div>
                    </div>

                    {/* Button to Customers page */}
                    <div className="mt-6 flex justify-center">
                        <Link
                            to="/customers"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
                        >
                            Manage Customers
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;