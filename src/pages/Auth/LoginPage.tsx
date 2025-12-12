import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext'

const loginSchema = z.object({
    email: z.string().email('Некорректный email'),
    password: z.string().min(6, 'Минимум 6 символов'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.login(data);
            const { token, ...userData } = response.data.data;

            login(token, userData);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Ошибка входа. Проверьте данные.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Project Management System
                    </h1>
                    <p className="text-gray-600">
                        Войдите в свой аккаунт
                    </p>
                </div>

                <div className="card shadow-xl">
                    {error && (
                        <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg animate-fade-in">
                            <p className="text-danger-700 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            icon={<Mail className="w-4 h-4" />}
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <Input
                            label="Пароль"
                            type="password"
                            placeholder="••••••••"
                            icon={<Lock className="w-4 h-4" />}
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">Запомнить меня</span>
                            </label>

                            <a href="#" className="text-sm text-primary-600 hover:text-primary-500">
                                Забыли пароль?
                            </a>
                        </div>

                        <Button
                            type="submit"
                            loading={loading}
                            className="w-full py-3"
                            icon={<LogIn className="w-5 h-5" />}
                        >
                            Войти
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-center text-gray-600">
                            Нет аккаунта?{' '}
                            <Link
                                to="/register"
                                className="text-primary-600 hover:text-primary-500 font-medium"
                            >
                                Зарегистрироваться
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        © 2024 Project Management System. Все права защищены.
                    </p>
                </div>
            </div>
        </div>
    );
};