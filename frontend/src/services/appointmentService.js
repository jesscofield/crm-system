import axios from 'axios';

const API_URL = 'http://localhost:8080/api/appointments';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

export const appointmentService = {
    getAll: async () => {
        const response = await axios.get(API_URL, getAuthHeader());
        return response.data;
    },

    getById: async (id) => {
        const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
        return response.data;
    },

    create: async (appointment) => {
        const response = await axios.post(API_URL, appointment, getAuthHeader());
        return response.data;
    },

    update: async (id, appointment) => {
        const response = await axios.put(`${API_URL}/${id}`, appointment, getAuthHeader());
        return response.data;
    },

    delete: async (id) => {
        await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    }
};