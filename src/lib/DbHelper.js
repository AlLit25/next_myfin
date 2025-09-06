import Cookies from 'js-cookie';
import { DB, TABLE } from './supabase';

function getAuthToken() {
    const authToken = Cookies.get('supabase-auth-token');

    if (!authToken) {
        return null;
    }

    return authToken;
}

// Перевірка автентифікації та оновлення сесії
export async function checkAuth() {
    try {
        const authToken = getAuthToken();

        let sessionData;

        try {
            sessionData = JSON.parse(authToken);
        } catch (parseError) {
            return false;
        }

        if (!sessionData.access_token || !sessionData.refresh_token) {
            return false;
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
                return false;
            } else {
                saveCookies(session);
            }

            return refreshData.session;
        } else {
            return session;
        }
    } catch (err) {
        console.error('Помилка перевірки автентифікації:', err.message);
        return false;
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
            result.error = `Помилка отримання даних із ${table}:`, error.message;
            return result;
        }

        result.data = data;
    } catch (err) {
        result.error = 'Виняток у fetchData: ' + err.message;
    }

    return result;
}

// Додавання даних до таблиці
// export async function insertData(data, setError) {
//     try {
//         const { error } = await DB.from(TABLE.main).insert([data]);
//         if (error) {
//             console.error(`Помилка додавання до ${table}:`, error.message);
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