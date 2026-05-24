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

    return (
        <div>
            {/* Welcome Banner - Pink to Green */}
            <div className="bg-gradient-to-r from-pink-400 via-pink-300 to-green-400 rounded-2xl p-6 mb-8 text-white shadow-lg">
                <div className="flex items-center gap-3">
                    <span className="text-4xl">˶ᵔ ᵕ ᵔ˶</span>
                    <div>
                        <h1 className="text-2xl font-bold">Welcome back, {user?.username || user?.fullName || 'User'}!</h1>
                        <p className="text-white/90 mt-1">Here's what's happening with your business today.</p>
                    </div>
                </div>
                {userType && (
                    <div className="mt-3">
                        {userType === 'company' ? (
                            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                                Company Account • {companyName || 'N/A'}
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                                Freelance Account
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-pink-400 to-pink-500 p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white text-lg">Customers</h3>
                        <span className="text-4xl">𖠋𖠋</span>
                    </div>
                    <p className="text-4xl font-bold text-white mt-3">{loading ? '...' : customerCount}</p>
                    <p className="text-pink-100 text-sm mt-2">Total customers</p>
                </div>

                <div className="bg-gradient-to-br from-green-400 to-green-500 p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white text-lg">Appointments</h3>
                        <span className="text-4xl">🗓 </span>
                    </div>
                    <p className="text-4xl font-bold text-white mt-3">0</p>
                    <p className="text-green-100 text-sm mt-2">Upcoming meetings</p>
                </div>

                <div className="bg-gradient-to-br from-teal-400 to-teal-500 p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white text-lg">Companies</h3>
                        <span className="text-4xl">🏠︎</span>
                    </div>
                    <p className="text-4xl font-bold text-white mt-3">0</p>
                    <p className="text-teal-100 text-sm mt-2">Partner companies</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span>⚡︎</span> Quick Actions
                </h2>
                <div className="flex flex-wrap gap-4">
                    <Link
                        to="/customers"
                        className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        + Add Customer
                    </Link>
                    <Link
                        to="/appointments"
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        Schedule Appointment
                    </Link>
                    <Link
                        to="/kanban"
                        className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        View Sales Pipeline
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;