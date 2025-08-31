'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { DB } from '@/lib/supabase';
import LoginForm from '@/components/LoginForm';
import MainMenu from '@/components/MainMenu';

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            try {
                // Перевірка наявності cookie
                const authToken = Cookies.get('supabase-auth-token');

                if (!authToken) {
                    setIsAuthenticated(false);
                    setIsLoading(false);
                    return;
                }

                // Парсимо cookie
                let sessionData;
                try {
                    sessionData = JSON.parse(authToken);
                } catch (parseError) {
                    Cookies.remove('supabase-auth-token', { path: '/' });
                    setIsAuthenticated(false);
                    setIsLoading(false);
                    return;
                }

                // Перевірка наявності access_token і refresh_token
                if (!sessionData.access_token || !sessionData.refresh_token) {
                    Cookies.remove('supabase-auth-token', { path: '/' });
                    setIsAuthenticated(false);
                    setIsLoading(false);
                    return;
                }

                // Спроба встановити сесію з токена
                const { data: { session }, error } = await DB.auth.setSession({
                    access_token: sessionData.access_token,
                    refresh_token: sessionData.refresh_token,
                });

                if (error) {
                    // Якщо токен недійсний, пробуємо оновити
                    const { data: refreshData, error: refreshError } = await DB.auth.refreshSession({
                        refresh_token: sessionData.refresh_token,
                    });

                    if (refreshError) {
                        Cookies.remove('supabase-auth-token', { path: '/' });
                        setIsAuthenticated(false);
                        setIsLoading(false);
                        return;
                    }

                    // Оновлення cookie з новою сесією
                    Cookies.set('supabase-auth-token', JSON.stringify(refreshData.session), {
                        expires: 1, // 1 день
                        path: '/',
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'Strict',
                    });
                    setIsAuthenticated(true);
                } else if (session) {
                    setIsAuthenticated(true);
                }

                setIsLoading(false);
            } catch (err) {
                Cookies.remove('supabase-auth-token', { path: '/' });
                setIsAuthenticated(false);
                setIsLoading(false);
            }
        }

        checkAuth();
    }, []);

    if (isLoading) {
        return (
            <div className="container">
                <div className="m-5 text-center">
                    <p className="h1">МАФІН</p>
                </div>
                <div className="text-center">
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden"></span>
                    </div>
                    <h3>Завантаження...</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="m-5 text-center">
                <p className="h1">МАФІН</p>
            </div>
            {isAuthenticated ? <MainMenu /> : <LoginForm />}
        </div>
    );
}