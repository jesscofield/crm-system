import axios from 'axios';

const API_URL = 'http://localhost:8080/api/customers';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

export const customerService = {
    getAll: async () => {
        const response = await axios.get(API_URL, getAuthHeader());
        console.log('Service response:', response.data);  // ← ADD THIS
        return response.data;
    },

    create: async (customer) => {
        const response = await axios.post(API_URL, customer, getAuthHeader());
        return response.data;
    },

    update: async (id, customer) => {
        const response = await axios.put(`${API_URL}/${id}`, customer, getAuthHeader());
        return response.data;
    },

    delete: async (id) => {
        await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    }
};