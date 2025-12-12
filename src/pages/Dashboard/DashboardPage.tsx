import React from 'react';
import { Link } from 'react-router-dom';
import {
    Plus,
    TrendingUp,
    CheckCircle,
    Clock,
    Users,
    BarChart3
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const DashboardPage: React.FC = () => {
    const stats = [
        { label: 'Активные проекты', value: '12', icon: <TrendingUp />, change: '+2', color: 'text-primary-600' },
        { label: 'Выполнено задач', value: '156', icon: <CheckCircle />, change: '+24', color: 'text-success-600' },
        { label: 'В процессе', value: '23', icon: <Clock />, change: '-3', color: 'text-warning-600' },
        { label: 'Участников', value: '8', icon: <Users />, change: '+1', color: 'text-indigo-600' },
    ];

    const recentProjects = [
        { id: 1, name: 'Веб-сайт компании', progress: 85, tasks: 12, dueDate: '15 дек' },
        { id: 2, name: 'Мобильное приложение', progress: 45, tasks: 8, dueDate: '20 дек' },
        { id: 3, name: 'Дизайн система', progress: 100, tasks: 5, dueDate: '10 дек' },
        { id: 4, name: 'API документация', progress: 30, tasks: 15, dueDate: '25 дек' },
    ];

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Панель управления</h1>
                    <p className="text-gray-600">Обзор ваших проектов и активности</p>
                </div>
                <Button icon={<Plus className="w-4 h-4" />}>
                    Новый проект
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <Card key={index} hover>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                <p className={`text-sm font-medium ${stat.color} mt-1`}>
                                    {stat.change} с прошлой недели
                                </p>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.color.replace('text', 'bg')} bg-opacity-10`}>
                                {stat.icon}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Projects */}
                <div className="lg:col-span-2">
                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Недавние проекты</h2>
                            <Link to="/boards" className="text-sm text-primary-600 hover:text-primary-500">
                                Посмотреть все
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {recentProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-medium text-gray-900">{project.name}</h3>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${project.progress === 100
                                            ? 'bg-success-100 text-success-800'
                                            : 'bg-warning-100 text-warning-800'
                                            }`}>
                                            {project.progress === 100 ? 'Завершен' : `До ${project.dueDate}`}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm text-gray-600">
                                            <span>Прогресс</span>
                                            <span>{project.progress}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${project.progress === 100 ? 'bg-success-600' : 'bg-primary-600'
                                                    }`}
                                                style={{ width: `${project.progress}%` }}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <span>{project.tasks} задач</span>
                                            <Link
                                                to={`/boards/${project.id}`}
                                                className="text-primary-600 hover:text-primary-500"
                                            >
                                                Открыть →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Activity */}
                <div>
                    <Card>
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Активность</h2>

                        <div className="space-y-4">
                            {[
                                { user: 'Алексей', action: 'добавил задачу', project: 'Веб-сайт', time: '10 мин назад' },
                                { user: 'Мария', action: 'завершила проект', project: 'Дизайн система', time: '1 час назад' },
                                { user: 'Иван', action: 'прокомментировал', project: 'API документация', time: '2 часа назад' },
                                { user: 'Вы', action: 'создали доску', project: 'Мобильное приложение', time: 'вчера' },
                            ].map((activity, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        {activity.user.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-900">
                                            <span className="font-medium">{activity.user}</span>{' '}
                                            {activity.action}{' '}
                                            <span className="font-medium">{activity.project}</span>
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Статистика</h2>
                            <BarChart3 className="w-5 h-5 text-gray-400" />
                        </div>

                        <div className="space-y-3">
                            {[
                                { label: 'Эффективность', value: '78%', color: 'bg-success-600' },
                                { label: 'Соблюдение сроков', value: '92%', color: 'bg-primary-600' },
                                { label: 'Удовлетворенность', value: '85%', color: 'bg-indigo-600' },
                            ].map((stat, index) => (
                                <div key={index}>
                                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                        <span>{stat.label}</span>
                                        <span className="font-medium">{stat.value}</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${stat.color}`}
                                            style={{
                                                width: stat.value,
                                                maxWidth: '100%'
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};