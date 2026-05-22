import React, { useState, useEffect } from 'react';
import { customerService } from '../services/customerService';
import { toast } from 'react-toastify';
import axios from 'axios';

const Kanban = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [draggedCustomer, setDraggedCustomer] = useState(null);

    const stages = [
        { id: 'lead', name: 'Lead', bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100', border: 'border-yellow-300', textColor: 'text-yellow-800' },
        { id: 'contact', name: 'Contact Made', bg: 'bg-gradient-to-br from-blue-50 to-blue-100', border: 'border-blue-300', textColor: 'text-blue-800' },
        { id: 'meeting', name: 'Meeting', bg: 'bg-gradient-to-br from-purple-50 to-purple-100', border: 'border-purple-300', textColor: 'text-purple-800' },
        { id: 'proposal', name: 'Proposal', bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100', border: 'border-indigo-300', textColor: 'text-indigo-800' },
        { id: 'closed', name: 'Closed Won', bg: 'bg-gradient-to-br from-green-50 to-green-100', border: 'border-green-300', textColor: 'text-green-800' }
    ];

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        setLoading(true);
        try {
            const data = await customerService.getAll();
            // Ensure each customer has a stage (default to 'lead' if not set)
            const customersWithStage = data.map(c => ({ ...c, stage: c.stage || 'lead' }));
            setCustomers(customersWithStage);
        } catch (error) {
            toast.error('Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    const getCustomersByStage = (stageId) => {
        return customers.filter(c => c.stage === stageId);
    };

    const handleDragStart = (customer) => {
        setDraggedCustomer(customer);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (stageId) => {
        if (!draggedCustomer) return;
        
        try {
            // Update in database
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:8080/api/customers/${draggedCustomer.id}`,
                { ...draggedCustomer, stage: stageId },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            // Update local state
            const updatedCustomers = customers.map(c => 
                c.id === draggedCustomer.id ? { ...c, stage: stageId } : c
            );
            setCustomers(updatedCustomers);
            
            toast.success(`${draggedCustomer.fullName} moved to ${stages.find(s => s.id === stageId)?.name}`);
        } catch (error) {
            toast.error('Failed to update customer stage');
        }
        
        setDraggedCustomer(null);
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Sales Pipeline</h1>
                <p className="text-gray-500 text-sm mt-1">Drag and drop customers through your sales stages</p>
            </div>

            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {stages.map((stage) => (
                        <div
                            key={stage.id}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(stage.id)}
                            className={`${stage.bg} border-2 ${stage.border} rounded-xl p-4 min-h-[500px] transition-all duration-200`}
                        >
                            <div className="mb-3 pb-2 border-b border-gray-300">
                                <h3 className={`font-bold text-lg ${stage.textColor}`}>
                                    {stage.name}
                                </h3>
                                <span className="text-xs text-gray-500">
                                    {getCustomersByStage(stage.id).length} customers
                                </span>
                            </div>
                            
                            <div className="space-y-2">
                                {getCustomersByStage(stage.id).map((customer) => (
                                    <div
                                        key={customer.id}
                                        draggable
                                        onDragStart={() => handleDragStart(customer)}
                                        className="bg-white rounded-lg p-3 shadow-sm cursor-move hover:shadow-md transition-all duration-200 border border-gray-200"
                                    >
                                        <p className="font-semibold text-gray-800">{customer.fullName}</p>
                                        <p className="text-xs text-gray-500 mt-1">{customer.email}</p>
                                        {customer.phone && (
                                            <p className="text-xs text-gray-400 mt-1">{customer.phone}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            {getCustomersByStage(stage.id).length === 0 && (
                                <div className="text-center py-8 text-gray-400 text-sm">
                                    Drop customers here
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Kanban;