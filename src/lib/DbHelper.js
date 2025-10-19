import Cookies from 'js-cookie';
import { DB, TABLE } from './supabase';
import { useRouter } from 'next/router';

function getAuthToken() {
    const authToken = Cookies.get('supabase-auth-token');

    if (!authToken) {
        return null;
    }

    return authToken;
}

export async function checkAuth(pathname = null) { // pathname з роутера або пропсів
    try {
        const authToken = getAuthToken();

        let sessionData;

        try {
            if (authToken === null) {
                return null;
            }

            sessionData = JSON.parse(authToken);

            if (sessionData !== null) {
                if (!sessionData.access_token || !sessionData.refresh_token) {
                    await goToLogin(pathname);
                    return null;
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
                        return null;
                    } else {
                        saveCookies(refreshData.session); // припускаю, що saveCookies існує
                        return refreshData.session;
                    }
                } else {
                    return session;
                }
            } else {
                return null;
            }
        } catch (parseError) {
            return null;
        }
    } catch (err) {
        console.error('Помилка перевірки автентифікації:', err.message, err.stack);
        return null;
    }
}

// Асинхронна функція редіректу (використовує роутер; викликається тільки на клієнті)
// export async function goToLogin(pathname = null) {
//     if (typeof window === 'undefined') {
//         return;
//     }
//
//     const router = useRouter(); // це хук, тож функцію викликайте в компоненті або передавайте роутер як параметр
//     // Альтернатива: передайте роутер як параметр: goToLogin(pathname, router)
//
//     const currentPathname = pathname || window.location.pathname;
//     const homePath = getHomePath(currentPathname); // передаємо pathname
//
//     if (currentPathname !== homePath) {
//         await router.push(homePath); // асинхронний push для кращого UX
//     }
// }

// Функція для шляху домашньої сторінки (тепер приймає pathname як параметр)
export function getHomePath(pathname = null) {
    const currentPathname = pathname || (typeof window !== 'undefined' ? window.location.pathname : '/');

    let homePath;

    if (currentPathname.startsWith('/next_myfin')) {
        homePath = '/next_myfin/';
    } else {
        homePath = '/';
    }

    return homePath;
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

        await syncBalance(sum, type);

        return true;
    } catch (err) {
        console.error('Помилка запиту:', err.message);
        return false;
    }
}

export async function editSum(id, sum) {
    try {
        const isAuthenticated = await checkAuth();

        if (!isAuthenticated) {
            throw 'Користувач не авторизований';
        }

        const session = JSON.parse(getAuthToken());
        const data = {
            'sum': sum,
            'user_id': session.user.id,
        }

        const { error } = await DB.from(TABLE.main)
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

async function syncBalance(sum, type) {
    const balance = await getBalance();
    let balanceSum = 0;

    if (balance.data.id > 0) {
        balanceSum = type === 'expense' ? balance.data.uah - Number(sum) : balance.data.uah + Number(sum);
        await updateBalance(balance.data.id, balanceSum);
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

export async function deleteData(id) {
    try {
        const isAuthenticated = await checkAuth();

        if (!isAuthenticated) {
            throw new Error('Користувач не авторизований');
        }

        const session = JSON.parse(getAuthToken());
        const { error } = await DB.from(TABLE.main).delete()
            .eq('id', id).eq('user_id', session.user.id);

        if (error) {
            return false;
        }

        return true;
    } catch (err) {
        return false;
    }
}