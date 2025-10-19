'use client';

import { useState, useEffect } from 'react';
import { checkAuth, removeCookies } from '@/lib/DbHelper';
import LoginForm from '@/components/LoginForm';
import MainMenu from '@/components/MainMenu';
import Load from "@/components/Load";
import MainPage from "@/app/main/page";

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function initializeAuth() {
            try {
                const authSuccess = await checkAuth();

                if (authSuccess) {
                    setIsAuthenticated(true);
                } else {
                    removeCookies();
                    setIsAuthenticated(false);
                }

                setIsLoading(false);
            } catch (err) {
                removeCookies();
                setIsAuthenticated(false);
                setIsLoading(false);
            }
        }

        initializeAuth();
    }, []);

    if (isLoading) {
        return (<Load />);
    }

    return (
        <div className="container">
            <div className="m-5 text-center">
                <p className="h1">LiVi Analytics</p>
            </div>
            {isAuthenticated ? <MainPage /> : <LoginForm />}
        </div>
    );
}