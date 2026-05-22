import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Appointments from './pages/Appointments';
import Companies from './pages/Companies';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PrivateRoute = ({ children }) => {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" />;
};

function AppRoutes() {
    const { token } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes with Layout */}
            <Route path="/dashboard" element={
                <PrivateRoute>
                    <Layout>
                        <Dashboard />
                    </Layout>
                </PrivateRoute>
            } />
            <Route path="/customers" element={
                <PrivateRoute>
                    <Layout>
                        <Customers />
                    </Layout>
                </PrivateRoute>
            } />
            <Route path="/appointments" element={
                <PrivateRoute>
                    <Layout>
                        <Appointments />
                    </Layout>
                </PrivateRoute>
            } />
            <Route path="/companies" element={
                <PrivateRoute>
                    <Layout>
                        <Companies />
                    </Layout>
                </PrivateRoute>
            } />
            
            <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
                <ToastContainer position="top-right" autoClose={3000} />
            </AuthProvider>
        </Router>
    );
}

export default App;