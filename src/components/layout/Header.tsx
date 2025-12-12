import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, Bell, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

interface HeaderProps {
    onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side */}
                    <div className="flex items-center">
                        <button
                            onClick={onMenuClick}
                            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
                        >
                            <Menu className="w-5 h-5 text-gray-600" />
                        </button>

                        <Link to="/dashboard" className="ml-2 lg:ml-0">
                            <h1 className="text-xl font-bold text-gray-900">
                                ProjectManagementSystem
                                <span className="text-primary-600">.</span>
                            </h1>
                        </Link>
                    </div>

                    {/* Center - Search */}
                    <div className="hidden md:flex flex-1 max-w-2xl mx-4">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="search"
                                placeholder="Поиск проектов, задач..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-2">
                        <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-danger-600 rounded-full"></span>
                        </button>

                        {/* User menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                            >
                                <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                    <p className="text-xs text-gray-500">{user?.role}</p>
                                </div>
                            </button>

                            {/* Dropdown menu */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-slide-in">
                                    <Link
                                        to="/profile"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <User className="w-4 h-4 mr-3" />
                                        Профиль
                                    </Link>
                                    <Link
                                        to="/settings"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <Settings className="w-4 h-4 mr-3" />
                                        Настройки
                                    </Link>
                                    <div className="border-t border-gray-200 my-1"></div>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setShowUserMenu(false);
                                        }}
                                        className="flex items-center w-full px-4 py-2 text-sm text-danger-600 hover:bg-danger-50"
                                    >
                                        <LogOut className="w-4 h-4 mr-3" />
                                        Выйти
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};