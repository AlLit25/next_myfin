'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DB } from '../lib/supabase';
import Cookies from 'js-cookie';

export default function LoginForm () {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const { data, error } = await DB.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                return;
            }

            Cookies.set('supabase-auth-token', JSON.stringify(data.session), {
                expires: 1, // Cookie дійсне 1 день
                path: '/', // Доступне на всьому сайті
                secure: process.env.NODE_ENV === 'production', // Безпечне тільки в продакшені (HTTPS)
                sameSite: 'Strict', // Захист від CSRF
            });

            location.reload();
        } catch (err) {
            setError('Помилка авторизації: ' + err.message);
        }
    };

    return (
        <div className="d-block">
            <form onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="d-flex justify-content-center m-4">
                    <div className="w-50">
                        <label className="form-label">Email</label>
                        <input
                            className="form-control form-control-lg"
                            type="email"
                            placeholder="email@com.ua"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="d-flex justify-content-center m-4">
                    <div className="w-50">
                        <label className="form-label">Пароль</label>
                        <input
                            className="form-control form-control-lg"
                            type="password"
                            placeholder=""
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="d-flex justify-content-center m-4">
                    <button type="submit" className="btn btn-primary">Увійти</button>
                </div>
            </form>
        </div>
    );
}