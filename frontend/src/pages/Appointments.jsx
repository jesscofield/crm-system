import React, { useState, useEffect } from 'react';
import { appointmentService } from '../services/appointmentService';
import { customerService } from '../services/customerService';
import { toast } from 'react-toastify';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        dateTime: '',
        description: '',
        location: '',
        customerId: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [appointmentsData, customersData] = await Promise.all([
                appointmentService.getAll(),
                customerService.getAll()
            ]);
            setAppointments(appointmentsData);
            setCustomers(customersData);
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const appointmentData = {
                title: formData.title,
                dateTime: formData.dateTime,
                description: formData.description,
                location: formData.location,
                customer: { id: parseInt(formData.customerId) }
            };

            if (editingAppointment) {
                await appointmentService.update(editingAppointment.id, appointmentData);
                toast.success('Appointment updated successfully');
            } else {
                await appointmentService.create(appointmentData);
                toast.success('Appointment created successfully');
            }
            setShowModal(false);
            resetForm();
            loadData();
        } catch (error) {
            toast.error('Failed to save appointment');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            try {
                await appointmentService.delete(id);
                toast.success('Appointment deleted successfully');
                loadData();
            } catch (error) {
                toast.error('Failed to delete appointment');
            }
        }
    };

    const handleEdit = (appointment) => {
        setEditingAppointment(appointment);
        setFormData({
            title: appointment.title,
            dateTime: appointment.dateTime.slice(0, 16),
            description: appointment.description || '',
            location: appointment.location || '',
            customerId: appointment.customer?.id || ''
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingAppointment(null);
        setFormData({
            title: '',
            dateTime: '',
            description: '',
            location: '',
            customerId: ''
        });
    };

    const openCreateModal = () => {
        resetForm();
        setShowModal(true);
    };

    const formatDateTime = (dateTimeStr) => {
        return new Date(dateTimeStr).toLocaleString();
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Appointments</h1>
                <button
                    onClick={openCreateModal}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    + Add Appointment
                </button>
            </div>

            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : appointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No appointments yet. Click "Add Appointment" to create one.
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {appointments.map((appointment) => (
                                <tr key={appointment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{appointment.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatDateTime(appointment.dateTime)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{appointment.customer?.fullName || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{appointment.location || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button
                                            onClick={() => handleEdit(appointment)}
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(appointment.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal for Create/Edit */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-w-full">
                        <h2 className="text-xl font-bold mb-4">
                            {editingAppointment ? 'Edit Appointment' : 'Add Appointment'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={formData.dateTime}
                                    onChange={(e) => setFormData({...formData, dateTime: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Customer</label>
                                <select
                                    value={formData.customerId}
                                    onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select a customer</option>
                                    {customers.map((customer) => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.fullName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Office, Zoom, etc."
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                    placeholder="Meeting details..."
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                >
                                    {editingAppointment ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Appointments;