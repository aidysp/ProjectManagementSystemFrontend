import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { BoardsPage } from './pages/Boards/BoardsPage';
import { BoardDetailPage } from './pages/Boards/BoardDetailPage';
import { TestConnectionPage } from './pages/Test/TestConnectionPage';

const PrivateLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="lg:pl-64">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="min-h-[calc(100vh-4rem)]">
                    {children}
                </main>
            </div>
        </div>
    );
};



const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Загрузка...</p>
                </div>
            </div>
        );
    }

    return user ? <PrivateLayout>{children}</PrivateLayout> : <Navigate to="/login" />;
};

// Временный хук useAuth для PrivateRoute
const useAuth = () => {
    const user = localStorage.getItem('pms_user');
    return { user: user ? JSON.parse(user) : null, isLoading: false };
};


const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/test" element={<TestConnectionPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <DashboardPage />
                    </PrivateRoute>
                }
            />

            <Route
                path="/boards"
                element={
                    <PrivateRoute>
                        <BoardsPage />
                    </PrivateRoute>
                }
            />

            <Route
                path="/boards/:id"
                element={
                    <PrivateRoute>
                        <BoardDetailPage />
                    </PrivateRoute>
                }
            />

            <Route path="/" element={<Navigate to="/test" />} />
        </Routes>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
};

export default App;