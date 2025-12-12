import React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Plus, Users, Calendar, Paperclip } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const BoardDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const columns = [
        { id: 1, name: 'К выполнению', color: 'bg-gray-200' },
        { id: 2, name: 'В процессе', color: 'bg-blue-200' },
        { id: 3, name: 'На проверке', color: 'bg-yellow-200' },
        { id: 4, name: 'Готово', color: 'bg-green-200' },
    ];

    const tasks = [
        { id: 1, title: 'Дизайн главной страницы', columnId: 1, priority: 'high' },
        { id: 2, title: 'API для пользователей', columnId: 2, priority: 'medium' },
        { id: 3, title: 'Тестирование модуля', columnId: 3, priority: 'low' },
        { id: 4, title: 'Документация', columnId: 4, priority: 'medium' },
    ];

    return (
        <div className="page-container">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/boards" className="p-2 hover:bg-gray-100 rounded-lg">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Веб-сайт компании
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Разработка нового корпоративного сайта
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" icon={<Users className="w-4 h-4" />}>
                            Участники
                        </Button>
                        <Button icon={<Plus className="w-4 h-4" />}>
                            Новая задача
                        </Button>
                    </div>
                </div>

                {/* Board info */}
                <div className="flex items-center gap-6 mt-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>8 участников</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Срок: 15 декабря</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4" />
                        <span>12 файлов</span>
                    </div>
                </div>
            </div>

            {/* Columns */}
            <div className="flex gap-6 overflow-x-auto pb-4">
                {columns.map((column) => (
                    <div key={column.id} className="flex-shrink-0 w-80">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                                <h3 className="font-semibold text-gray-900">{column.name}</h3>
                                <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                                    {tasks.filter(t => t.columnId === column.id).length}
                                </span>
                            </div>
                            <button className="p-1 hover:bg-gray-100 rounded">
                                <MoreVertical className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {tasks
                                .filter(task => task.columnId === column.id)
                                .map((task) => (
                                    <Card key={task.id} hover clickable className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{task.title}</h4>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded ${task.priority === 'high'
                                                        ? 'bg-danger-100 text-danger-800'
                                                        : task.priority === 'medium'
                                                            ? 'bg-warning-100 text-warning-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {task.priority === 'high' ? 'Высокий' :
                                                            task.priority === 'medium' ? 'Средний' : 'Низкий'}
                                                    </span>
                                                </div>
                                            </div>
                                            <button className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreVertical className="w-4 h-4 text-gray-500" />
                                            </button>
                                        </div>
                                    </Card>
                                ))}

                            <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" />
                                Добавить задачу
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};