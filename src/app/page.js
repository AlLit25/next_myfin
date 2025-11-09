'use client';

import { useState, useEffect } from 'react';
import { checkAuth, removeCookies } from '@/lib/DbHelper';
import LoginForm from '@/components/LoginForm';
import Load from "@/components/Load";
import MainMenu from "@/components/MainMenu";

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
        <div className="container-fluid mt-4">
            {isAuthenticated ? <MainMenu /> : <LoginForm />}
            <div className="text-center mt-4">
                <p>LiVi Analytics</p>
            </div>
        </div>
    );
}