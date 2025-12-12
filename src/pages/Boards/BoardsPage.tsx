import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Grid, List, Filter, MoreVertical, Users, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { boardsAPI } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Board } from '../../types';

export const BoardsPage: React.FC = () => {
    const { user } = useAuth();
    const [boards, setBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newBoard, setNewBoard] = useState({
        name: '',
        description: '',
        isPublic: false,
    });
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadBoards();
    }, []);

    const loadBoards = async () => {
        try {
            const response = await boardsAPI.getAll();
            setBoards(response.data.data);
        } catch (err: any) {
            setError('Ошибка загрузки досок');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBoard = async () => {
        if (!newBoard.name.trim()) {
            setError('Введите название доски');
            return;
        }

        setCreating(true);
        setError('');

        try {
            await boardsAPI.create({
                name: newBoard.name,
                description: newBoard.description || undefined,
                isPublic: newBoard.isPublic,
            });

            setNewBoard({ name: '', description: '', isPublic: false });
            setShowCreateModal(false);
            loadBoards();
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Ошибка создания доски');
        } finally {
            setCreating(false);
        }
    };

    const filteredBoards = boards.filter(board =>
        board.name.toLowerCase().includes(search.toLowerCase()) ||
        (board.description && board.description.toLowerCase().includes(search.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Загрузка досок...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Доски проектов</h1>
                    <p className="text-gray-600 mt-1">
                        Управляйте вашими проектами и задачами
                    </p>
                </div>

                <Button
                    onClick={() => setShowCreateModal(true)}
                    icon={<Plus className="w-4 h-4" />}
                >
                    Новая доска
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder="Поиск досок..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                                ? 'bg-primary-100 text-primary-600'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Grid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                                ? 'bg-primary-100 text-primary-600'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                        <Button variant="outline" icon={<Filter className="w-4 h-4" />}>
                            Фильтры
                        </Button>
                    </div>
                </div>
            </div>

            {/* Boards Grid/List */}
            {filteredBoards.length === 0 ? (
                <Card className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <Plus className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="mt-6 text-lg font-medium text-gray-900">
                        {search ? 'Ничего не найдено' : 'Нет досок'}
                    </h3>
                    <p className="mt-2 text-gray-600 max-w-md mx-auto">
                        {search
                            ? 'Попробуйте изменить поисковый запрос'
                            : 'Создайте свою первую доску для управления проектами'
                        }
                    </p>
                    <Button
                        className="mt-4"
                        onClick={() => setShowCreateModal(true)}
                        icon={<Plus className="w-4 h-4" />}
                    >
                        Создать доску
                    </Button>
                </Card>
            ) : (
                <div className={viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }>
                    {filteredBoards.map((board) => (
                        <Card key={board.id} hover clickable className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900">{board.name}</h3>
                                    {board.description && (
                                        <p className="text-gray-600 mt-2">{board.description}</p>
                                    )}
                                </div>
                                <button className="p-1 hover:bg-gray-100 rounded-lg">
                                    <MoreVertical className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    {board.isPublic ? (
                                        <>
                                            <Users className="w-4 h-4 text-success-600" />
                                            <span className="text-sm text-gray-600">Публичная</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-600">Приватная</span>
                                        </>
                                    )}
                                </div>

                                <Link
                                    to={`/boards/${board.id}`}
                                    className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                                >
                                    Открыть →
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create Board Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Создать новую доску
                        </h3>

                        {error && (
                            <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg">
                                <p className="text-danger-700 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <Input
                                label="Название доски"
                                value={newBoard.name}
                                onChange={(e) => setNewBoard({ ...newBoard, name: e.target.value })}
                                placeholder="Введите название"
                                autoFocus
                            />

                            <Input
                                label="Описание (опционально)"
                                value={newBoard.description}
                                onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
                                placeholder="Краткое описание"
                            />

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isPublic"
                                    checked={newBoard.isPublic}
                                    onChange={(e) => setNewBoard({ ...newBoard, isPublic: e.target.checked })}
                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                                    Сделать доску публичной
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Button
                                onClick={handleCreateBoard}
                                className="flex-1"
                                loading={creating}
                                disabled={!newBoard.name.trim()}
                            >
                                Создать
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1"
                            >
                                Отмена
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};