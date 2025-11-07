export function getCurrentDay() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return {
        from: formatDate(today),
        to: formatDate(tomorrow)
    };
}

export function getCurrentMonth() {
    const today = new Date();

    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return {
        from: formatDate(firstDay),
        to: formatDate(lastDay)
    };
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function formatDateForShow(date, dayFormat = 'none') {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const dayOfWeek = date.getDay();
    const fullDays = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота'];
    const shortDays = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

    if (dayFormat === 'short') {
        return shortDays[dayOfWeek] + ', ' + `${day}.${month}.${year}`;
    } else if (dayFormat === 'full') {
        return fullDays[dayOfWeek] + ', ' + `${day}.${month}.${year}`;
    } else if (dayFormat === 'nameDay') {
        return shortDays[dayOfWeek];
    }
}