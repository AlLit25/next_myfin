import {category} from "@/lib/supabase";

export function getTotalSum(data) {
    let result = 0;

    data.map((item) => {
        result += item.sum;
    });

    return result;
}

export function getSortData(data) {
    let result = {};

    data.map((item) => {
        if (result[item.created_at] === undefined) {
            result[item.created_at] = [];
        }

        result[item.created_at].push(item);
    });

    return result;
}

export function getSortDataCat(data) {
    return data.reduce((result, item) => {
        const date = item.created_at;
        const category = item.category;
        const sum = item.sum;

        if (!result[date]) {
            result[date] = {};
        }

        result[date][category] = (result[date][category] || 0) + sum;

        return result;
    }, {});
}

export function getTotalSumInCat(data) {
    const totalSumCat = {};

    Object.keys(data).map((date) => {
        Object.keys(data[date]).map(codeCat => {
            if (totalSumCat[codeCat] === undefined) {
                totalSumCat[codeCat] = Number(data[date][codeCat]);
            } else {
                totalSumCat[codeCat] += Number(data[date][codeCat]);
            }
        })
    });

    return totalSumCat;
}

export function getDatesInRange(startDate, endDate) {
    const dates = [];
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    while (currentDate <= lastDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}

export function getDataForChart(totalSum, sumInCat) {
    const result = [];

    Object.keys(sumInCat).map(codeCat => {
        result.push({name: category[codeCat],
            value: sumInCat[codeCat],
            percentage: ((sumInCat[codeCat] / totalSum) * 100).toFixed(1)})
    });

    return result;
}

export function getSortDataDate(data) {
    return Object.keys(data).sort((a, b) => new Date(a) - new Date(b));
}

export function getExpenseOfDay(data, currentDate) {
    const dayExpense = [];

    data.map((item) => {
        if (item.created_at === currentDate) {
            dayExpense.push(item);
        }
    });

    return dayExpense;
}