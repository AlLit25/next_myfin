import Cookies from 'js-cookie';
import { DB, TABLE } from './supabase';
import {redirect} from "next/navigation";

function getAuthToken() {
    const authToken = Cookies.get('supabase-auth-token');

    if (!authToken) {
        return null;
    }

    return authToken;
}

export async function checkAuth() {
    try {
        const authToken = getAuthToken();

        let sessionData;

        try {
            sessionData = JSON.parse(authToken);

            if (!sessionData.access_token || !sessionData.refresh_token) {
                redirect('/');
            }
        } catch (parseError) {
            redirect('/');
        }

        const { data: { session }, error } = await DB.auth.setSession({
            access_token: sessionData.access_token,
            refresh_token: sessionData.refresh_token,
        });

        if (error) {
            const { data: refreshData, error: refreshError } = await DB.auth.refreshSession({
                refresh_token: sessionData.refresh_token,
            });

            if (refreshError) {
                redirect('/');
            } else {
                saveCookies(session);
            }

            return refreshData.session;
        } else {
            return session;
        }
    } catch (err) {
        console.error('Помилка перевірки автентифікації:', err.message, err.line);
        redirect('/');
    }
}

export function saveCookies(session) {
    Cookies.set('supabase-auth-token', JSON.stringify(session), {
        expires: 1,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
    });
}

export function removeCookies() {
    Cookies.remove('supabase-auth-token', { path: '/' });
}

export async function getStatistic(from, to) {
    const result = { data: null, error: '' };

    try {
        const isAuthenticated = await checkAuth();

        if (!isAuthenticated) {
            result.error = 'Користувач не авторизований';
            return result;
        }

        const { data, error } = await DB.from(TABLE.main)
            .select('*')
            .gte('created_at', from)
            .lte('created_at', to);
        if (error) {
            result.error = `Помилка отримання даних із ${TABLE.main}: `+error.message;
            return result;
        }

        result.data = data;
    } catch (err) {
        result.error = 'Виняток у getStatistic: ' + err.message;
    }

    return result;
}

export async function insertData(date, sum, type, category, comment) {
    try {
        const isAuthenticated = await checkAuth();

        if (!isAuthenticated) {
            throw 'Користувач не авторизований';
        }

        const session = JSON.parse(getAuthToken());
        const data = {
            'sum': sum,
            'type': type,
            'user_id': session.user.id,
            'created_at': new Date(date),
            'category': category || null,
            'comment': comment || null,
        }

        const { error } = await DB.from(TABLE.main).insert([data]);

        if (error) {
            throw error;
        }

        return true;
    } catch (err) {
        console.error('Помилка запиту:', err.message);
        return false;
    }
}

export async function updateBalance(id, sum) {
    try {
        const isAuthenticated = await checkAuth();

        if (!isAuthenticated) {
            throw 'Користувач не авторизований';
        }

        const session = JSON.parse(getAuthToken());
        const data = {
            'uah': sum,
            'user_id': session.user.id,
            'last_check': new Date(),
        }

        const { error } = await DB.from(TABLE.balance)
            .update(data)
            .eq('id', id);

        if (error) {
            throw error;
        }

        return true;
    } catch (err) {
        console.error('Помилка запиту:', err.message);
        return false;
    }
}

export async function createBalance(sum) {
    const result = { data: null, error: '' };

    try {
        const isAuthenticated = await checkAuth();

        if (!isAuthenticated) {
            result.error = 'Користувач не авторизований';
            return result;
        }
        const session = JSON.parse(getAuthToken());
        const data = {
            uah: sum,
            user_id: session.user.id,
            last_check: new Date().toISOString(),
            created_at: new Date().toISOString(),
        };

        const { data: createdData, error } = await DB.from(TABLE.balance)
            .insert([data])
            .select();

        if (error) {
            result.error = `Помилка створення в ${TABLE.balance}: ${error.message} (код: ${error.code || 'невідомий'})`;
        }

    } catch (err) {
        result.error = 'Помилка запиту: '+err.message;
    }

    return result;
}

export async function getBalance() {
    const result = { data: null, error: '' };

    try {
        const isAuthenticated = await checkAuth();

        if (!isAuthenticated) {
            result.error = 'Користувач не авторизований';
            return result;
        }

        const session = JSON.parse(getAuthToken());
        const { data, error } = await DB.from(TABLE.balance)
            .select('*')
            .eq('user_id', session.user.id)
            .single();
        if (error) {
            result.error = `Помилка отримання даних із ${TABLE.balance}: `+error.message;
            return result;
        }

        result.data = data;
    } catch (err) {
        result.error = 'Виняток у getBalance: ' + err.message;
    }

    return result;
}

// Видалення даних із таблиці
// export async function deleteData(table, id, setError) {
//     try {
//         const { error } = await DB.from(table).delete().eq('id', id);
//         if (error) {
//             console.error(`Помилка видалення з ${table}:`, error.message);
//             setError(error.message);
//             return false;
//         }
//         return true;
//     } catch (err) {
//         console.error('Помилка запиту:', err.message);
//         setError('Помилка запиту: ' + err.message);
//         return false;
//     }
// }