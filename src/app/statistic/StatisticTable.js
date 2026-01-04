'use client';

import {getStatistic, removeCookies} from "@/lib/DbHelper";
import {useEffect, useState} from "react";
import Load from "@/components/Load";
import {getCurrentMonth} from "@/lib/DateHelper";
import StatAll from "@/components/statistic/StatAll";

export default function StatisticTable() {
    const [data, setData] = useState({ income: [], expense: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [dateRange, setDateRange] = useState(getCurrentMonth());

    const fetchData = async (from, to) => {
        try {
            setIsLoading(true);
            setError(null);
            const rawData = await getStatistic(from, to);

            if (rawData.error) {
                setError(rawData.error);
                setData({ income: [], expense: [] });
            } else {
                const sortData = { income: [], expense: [] };
                (rawData.data || []).forEach((item) => {
                    if (item.type === "expense") {
                        sortData.expense.push(item);
                    } else if (item.type === "income") {
                        sortData.income.push(item);
                    }
                });
                setData(sortData);
            }
            setIsLoading(false);
        } catch (err) {
            setError('Помилка завантаження даних');
            setData({ income: [], expense: [] });
            setIsLoading(false);
            removeCookies();
            location.replace('/');
        }
    };

    useEffect(() => {
        fetchData(dateRange.from, dateRange.to);
    }, []);

    const showData = () => {
        const fromInput = document.querySelector('input[data-date-from]').value;
        const toInput = document.querySelector('input[data-date-to]').value;

        if (fromInput && toInput) {
            setDateRange({ from: fromInput, to: toInput });
            fetchData(fromInput, toInput);
        }
    };

    function exportHandler() {
        if (data.expense.length > 0) {
            exportPivotWithStatsToCSV(data.expense, data.income);
        }
    }

    const exportPivotWithStatsToCSV = (expense, income) => {
        const allData = [...expense, ...income];
        if (allData.length === 0) return;

        // 1. Визначаємо діапазон дат
        const dates = allData.map(d => new Date(d.created_at));
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
        const start = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
        const end = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0);

        const dateLabels = [];
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            dateLabels.push(d.toISOString().split('T')[0]);
        }

        // 2. Унікальні категорії та розрахунок загальних витрат
        const categories = [...new Set(expense.map(e => e.category))].filter(Boolean).sort();
        const totalExpensesSum = expense.reduce((acc, curr) => acc + Number(curr.sum), 0);

        // 3. Заголовки (додаємо нові колонки в кінець)
        const headerRow = ["Категорія / Дата", ...dateLabels, "ВСЬОГО", "% від витрат"];

        // Допоміжна функція для сум
        const getSumForDate = (dataArray, date, category = null) => {
            return dataArray
                .filter(item => item.created_at === date && (category === null || item.category === category))
                .reduce((acc, curr) => acc + Number(curr.sum), 0);
        };

        const rows = [];

        // --- РЯДОК ДОХОДУ ---
        const incomeValues = dateLabels.map(date => getSumForDate(income, date));
        const totalIncome = incomeValues.reduce((a, b) => a + b, 0);
        rows.push(["ДОХІД", ...incomeValues.map(v => v || ""), totalIncome, "-"]);

        // --- РЯДКИ ВИТРАТ ---
        categories.forEach(cat => {
            const dailyValues = dateLabels.map(date => getSumForDate(expense, date, cat));
            const totalCatSum = dailyValues.reduce((a, b) => a + b, 0);
            const percentage = totalExpensesSum > 0
                ? ((totalCatSum / totalExpensesSum) * 100).toFixed(2) + "%"
                : "0%";

            rows.push([
                cat,
                ...dailyValues.map(v => v || ""),
                totalCatSum,
                percentage
            ]);
        });

        // 4. РЯДОК "РАЗОМ ВИТРАТИ" (опціонально, для зручності)
        const totalDailyExpenses = dateLabels.map(date => getSumForDate(expense, date));
        rows.push(["ВСЬОГО ВИТРАТ", ...totalDailyExpenses.map(v => v || ""), totalExpensesSum, "100%"]);

        // 5. Генерація та скачування
        const csvContent = [
            headerRow.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n");

        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `detailed_report_${minDate.getMonth() + 1}.csv`;
        link.click();
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-4 col-sm-12 mt-2 text-center">
                    <input type="date"
                           className="form-control"
                           value={dateRange.from}
                           data-date-from=""
                           onChange={(e) =>
                               setDateRange({ ...dateRange, from: e.target.value })}/>
                </div>
                <div className="col-md-4 col-sm-12 mt-2 text-center">
                    <input type="date"
                           className="form-control"
                           data-date-to=""
                           value={dateRange.to}
                           onChange={(e) =>
                               setDateRange({ ...dateRange, to: e.target.value })}/>
                </div>
                <div className="col-md-4 col-sm-12 mt-2 text-end">
                    <button type="button"
                            className="btn btn-success"
                            data-refresh="statistics_table"
                            onClick={showData}>
                        Відобразити
                    </button>
                    <button type="button"
                            className="btn btn-success mr"
                            data-refresh="statistics_table"
                            onClick={exportHandler}>
                        У файл
                    </button>
                </div>
            </div>
            <div>
                {error ? (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                ) : isLoading
                    ?  <Load header={false} />
                    : <div>
                        <StatAll data={data} dateStart={dateRange.from} dateEnd={dateRange.to} />
                    </div>}
            </div>
        </div>
    );
}
