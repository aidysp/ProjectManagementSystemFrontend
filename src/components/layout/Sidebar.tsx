import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Grid3X3,
    CheckSquare,
    Users,
    Calendar,
    FileText,
    Settings
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarItem {
    icon: React.ReactNode;
    label: string;
    path: string;
    badge?: number;
}

const sidebarItems: SidebarItem[] = [
    { icon: <LayoutDashboard />, label: 'Панель управления', path: '/dashboard' },
    { icon: <Grid3X3 />, label: 'Доски', path: '/boards' },
    { icon: <CheckSquare />, label: 'Задачи', path: '/tasks' },
    { icon: <Users />, label: 'Команда', path: '/team' },
    { icon: <Calendar />, label: 'Календарь', path: '/calendar' },
    { icon: <FileText />, label: 'Документы', path: '/documents' },
    { icon: <Settings />, label: 'Настройки', path: '/settings' },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-transform duration-300',
                    'w-64 transform',
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">
                            Project Management
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Управление проектами</p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 overflow-y-auto">
                        <ul className="space-y-1">
                            {sidebarItems.map((item) => (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        onClick={onClose}
                                        className={({ isActive }) =>
                                            cn(
                                                'flex items-center px-4 py-3 rounded-lg transition-colors',
                                                isActive
                                                    ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            )
                                        }
                                    >
                                        <span className="w-5 h-5 mr-3">{item.icon}</span>
                                        <span className="font-medium">{item.label}</span>
                                        {item.badge && (
                                            <span className="ml-auto bg-primary-100 text-primary-600 text-xs font-medium px-2 py-1 rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="px-4 py-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900">Нужна помощь?</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Обратитесь в службу поддержки
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};