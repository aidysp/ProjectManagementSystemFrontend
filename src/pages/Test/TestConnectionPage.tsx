import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Wifi, Server, Database } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { testAPI, authAPI, boardsAPI } from '../../services/api';

export const TestConnectionPage: React.FC = () => {
    const [results, setResults] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState<Record<string, boolean>>({});
    const [userData, setUserData] = useState<string>('');
    const [boardsData, setBoardsData] = useState<string>('');

    const tests = [
        {
            key: 'backend',
            label: 'Бэкенд API',
            icon: <Server />,
            test: () => testAPI.health()
        },
        {
            key: 'database',
            label: 'База данных',
            icon: <Database />,
            test: () => testAPI.testDb()
        },
    ];

    const runTest = async (key: string, testFn: () => Promise<any>) => {
        setLoading(prev => ({ ...prev, [key]: true }));

        try {
            const response = await testFn();
            setResults(prev => ({
                ...prev,
                [key]: {
                    success: true,
                    data: response.data,
                    status: response.status
                }
            }));
        } catch (error: any) {
            setResults(prev => ({
                ...prev,
                [key]: {
                    success: false,
                    error: error.message,
                    status: error.response?.status
                }
            }));
        } finally {
            setLoading(prev => ({ ...prev, [key]: false }));
        }
    };

    const runAllTests = async () => {
        for (const test of tests) {
            await runTest(test.key, test.test);
        }
    };

    const testAuth = async () => {
        setLoading(prev => ({ ...prev, auth: true }));
        try {
            // Тест регистрации
            const registerRes = await authAPI.register({
                email: `test${Date.now()}@example.com`,
                password: 'password123',
                name: 'Test User'
            });

            setUserData(`✅ Зарегистрирован: ${registerRes.data.data.email}`);

            // Тест получения досок
            const boardsRes = await boardsAPI.getAll();
            setBoardsData(`✅ Досок: ${boardsRes.data.count}`);

        } catch (error: any) {
            setUserData(`❌ Ошибка: ${error.message}`);
        } finally {
            setLoading(prev => ({ ...prev, auth: false }));
        }
    };

    useEffect(() => {
        runAllTests();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
                        <Wifi className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Тестирование подключения
                    </h1>
                    <p className="text-gray-600">
                        Проверка связи между фронтендом и бэкендом
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {tests.map((test) => (
                        <div key={test.key} className="card">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                                        {test.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{test.label}</h3>
                                        <p className="text-sm text-gray-500">localhost:8000</p>
                                    </div>
                                </div>

                                {results[test.key] ? (
                                    results[test.key].success ? (
                                        <div className="flex items-center gap-2 text-success-600">
                                            <CheckCircle className="w-5 h-5" />
                                            <span className="font-medium">Работает</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-danger-600">
                                            <XCircle className="w-5 h-5" />
                                            <span className="font-medium">Ошибка</span>
                                        </div>
                                    )
                                ) : loading[test.key] ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                                ) : null}
                            </div>

                            {results[test.key] && (
                                <div className={`p-3 rounded-lg text-sm ${results[test.key].success
                                    ? 'bg-success-50 border border-success-200 text-success-700'
                                    : 'bg-danger-50 border border-danger-200 text-danger-700'
                                    }`}>
                                    {results[test.key].success ? (
                                        <pre className="whitespace-pre-wrap">
                                            {JSON.stringify(results[test.key].data, null, 2)}
                                        </pre>
                                    ) : (
                                        <p>{results[test.key].error}</p>
                                    )}
                                </div>
                            )}

                            <Button
                                onClick={() => runTest(test.key, test.test)}
                                loading={loading[test.key]}
                                variant="outline"
                                className="w-full mt-4"
                            >
                                Проверить снова
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Тест аутентификации */}
                <div className="card mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Тест аутентификации и данных
                    </h3>

                    <div className="space-y-4">
                        <Button
                            onClick={testAuth}
                            loading={loading.auth}
                            className="w-full"
                        >
                            Протестировать регистрацию и получение данных
                        </Button>

                        {userData && (
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700">{userData}</p>
                            </div>
                        )}

                        {boardsData && (
                            <div className="p-3 bg-success-50 border border-success-200 rounded-lg">
                                <p className="text-sm text-success-700">{boardsData}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Инструкция */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Что делать если не работает?
                    </h3>

                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                            <p>Убедитесь, что бэкенд запущен на порту 8000</p>
                        </div>

                        <div className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                            <p>Проверьте CORS настройки в бэкенде</p>
                        </div>

                        <div className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                            <p>Откройте DevTools (F12) → вкладка Network → проверьте запросы</p>
                        </div>

                        <div className="flex items-start gap-2">
                            <div className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                            <p>Проверьте консоль на наличие ошибок CORS</p>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <Link to="/login" className="flex-1">
                            <Button className="w-full">
                                Перейти к входу
                            </Button>
                        </Link>

                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => window.location.reload()}
                        >
                            Обновить страницу
                        </Button>
                    </div>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>Frontend: http://localhost:5173</p>
                    <p>Backend API: http://localhost:8000</p>
                </div>
            </div>
        </div>
    );
};