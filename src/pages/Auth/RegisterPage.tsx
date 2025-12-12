import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const registerSchema = z.object({
    name: z.string().min(2, 'Минимум 2 символа').max(50, 'Максимум 50 символов'),
    email: z.string().email('Некорректный email'),
    password: z.string().min(6, 'Минимум 6 символов'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.register(data);
            const { token, ...userData } = response.data.data;

            login(token, userData);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Ошибка регистрации. Попробуйте другой email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Создать аккаунт
                    </h1>
                    <p className="text-gray-600">
                        Присоединяйтесь к системе управления проектами
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
                            label="Имя"
                            placeholder="Ваше имя"
                            icon={<User className="w-4 h-4" />}
                            error={errors.name?.message}
                            {...register('name')}
                        />

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

                        <div className="text-sm text-gray-600">
                            <p className="mb-2">Требования к паролю:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Минимум 6 символов</li>
                                <li>Рекомендуется использовать цифры и буквы</li>
                            </ul>
                        </div>

                        <Button
                            type="submit"
                            loading={loading}
                            className="w-full py-3"
                            icon={<UserPlus className="w-5 h-5" />}
                        >
                            Зарегистрироваться
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-center text-gray-600">
                            Уже есть аккаунт?{' '}
                            <Link
                                to="/login"
                                className="text-primary-600 hover:text-primary-500 font-medium"
                            >
                                Войти
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Создавая аккаунт, вы соглашаетесь с нашими условиями использования.
                    </p>
                </div>
            </div>
        </div>
    );
};