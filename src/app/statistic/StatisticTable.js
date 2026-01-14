'use client';

import {getStatistic, removeCookies} from "@/lib/DbHelper";
import {useEffect, useState} from "react";
import Load from "@/components/Load";
import {getCurrentMonth} from "@/lib/DateHelper";
import StatAll from "@/components/statistic/StatAll";
import {category} from "@/lib/supabase";

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

    // const exportPivotWithStatsToCSV = (expense, income) => {
    //     const allData = [...expense, ...income];
    //     if (allData.length === 0) return;
    //
    //     const dates = allData.map(d => new Date(d.created_at));
    //     const minDate = new Date(Math.min(...dates));
    //     const maxDate = new Date(Math.max(...dates));
    //     const start = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    //     const end = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0);
    //
    //     const dateLabels = [];
    //
    //     for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    //         dateLabels.push(d.toISOString().split('T')[0]);
    //     }
    //
    //     const categories = [...new Set(expense.map(e => e.category))].filter(Boolean).sort();
    //     const totalExpensesSum = expense.reduce((acc, curr) => acc + Number(curr.sum), 0);
    //     const headerRow = ["Категорія / Дата", ...dateLabels, "ВСЬОГО", "% від витрат"];
    //
    //     const getSumForDate = (dataArray, date, category = null) => {
    //         return dataArray
    //             .filter(item => item.created_at === date && (category === null || item.category === category))
    //             .reduce((acc, curr) => acc + Number(curr.sum), 0);
    //     };
    //
    //     const rows = [];
    //     const incomeValues = dateLabels.map(date => getSumForDate(income, date));
    //     const totalIncome = incomeValues.reduce((a, b) => a + b, 0);
    //
    //     rows.push(["ДОХІД", ...incomeValues.map(v => v || ""), totalIncome, "-"]);
    //
    //     categories.forEach(cat => {
    //         const dailyValues = dateLabels.map(date => getSumForDate(expense, date, cat));
    //         const totalCatSum = dailyValues.reduce((a, b) => a + b, 0);
    //         const percentage = totalExpensesSum > 0
    //             ? ((totalCatSum / totalExpensesSum) * 100).toFixed(2) + "%"
    //             : "0%";
    //
    //         rows.push([
    //             category[cat],
    //             ...dailyValues.map(v => v || ""),
    //             totalCatSum,
    //             percentage
    //         ]);
    //     });
    //
    //     const totalDailyExpenses = dateLabels.map(date => getSumForDate(expense, date));
    //     rows.push(["ВСЬОГО ВИТРАТ", ...totalDailyExpenses.map(v => v || ""), totalExpensesSum, "100%"]);
    //
    //     const csvContent = [
    //         headerRow.join(","),
    //         ...rows.map(r => r.join(","))
    //     ].join("\n");
    //
    //     const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    //     const url = URL.createObjectURL(blob);
    //     const link = document.createElement("a");
    //     link.href = url;
    //     link.download = `detailed_report_${minDate.getMonth() + 1}.csv`;
    //     link.click();
    // };
    const exportPivotWithStatsToCSV = function(expense, income) {
        const allData = expense.concat(income);
        if (allData.length === 0) return;

        // 1. Визначаємо діапазон дат
        let minDate = new Date(allData[0].created_at);
        let maxDate = new Date(allData[0].created_at);

        for (let i = 0; i < allData.length; i++) {
            let d = new Date(allData[i].created_at);
            if (d < minDate) minDate = d;
            if (d > maxDate) maxDate = d;
        }

        const start = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
        const end = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0);

        const daysOfWeek = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
        const dateLabels = [];
        const rawDates = [];

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            let day = String(d.getDate()).padStart(2, '0');
            let month = String(d.getMonth() + 1).padStart(2, '0');
            let year = d.getFullYear();
            let dayName = daysOfWeek[d.getDay()];

            dateLabels.push(day + "." + month + "." + year + " (" + dayName + ")");
            rawDates.push(d.toISOString().split('T')[0]);
        }

        // 2. Підготовка даних
        const expenseMap = {};
        const incomeMap = {};
        const dailyTotalExpense = {};
        let totalExpensesSum = 0;
        let totalIncomeSum = 0;

        for (let i = 0; i < expense.length; i++) {
            let item = expense[i];
            let sum = Number(item.sum) || 0;
            let catId = item.category; // припускаємо, що тут ID/ключ
            let date = item.created_at;

            if (!expenseMap[catId]) expenseMap[catId] = {};
            expenseMap[catId][date] = (expenseMap[catId][date] || 0) + sum;
            dailyTotalExpense[date] = (dailyTotalExpense[date] || 0) + sum;
            totalExpensesSum += sum;
        }

        for (let i = 0; i < income.length; i++) {
            let item = income[i];
            let sum = Number(item.sum) || 0;
            let date = item.created_at;
            incomeMap[date] = (incomeMap[date] || 0) + sum;
            totalIncomeSum += sum;
        }

        // 3. Формування рядків
        const headerRow = ["Категорія / Дата"].concat(dateLabels, ["ВСЬОГО", "% від витрат"]);
        const rows = [];

        // Дохід
        const incomeRow = ["ДОХІД"];
        for (let i = 0; i < rawDates.length; i++) {
            incomeRow.push(incomeMap[rawDates[i]] || "");
        }
        incomeRow.push(totalIncomeSum, "-");
        rows.push(incomeRow);

        // ВСЬОГО ВИТРАТ (Візуально виділяємо назву)
        const totalExpRow = ["ВСЬОГО ВИТРАТ"];
        for (let i = 0; i < rawDates.length; i++) {
            totalExpRow.push(dailyTotalExpense[rawDates[i]] || "");
        }
        totalExpRow.push(totalExpensesSum, "100%");
        rows.push(totalExpRow);

        // 4. Рядки ВСІХ категорій зі словника
        const allCategoryKeys = Object.keys(category);

        for (let i = 0; i < allCategoryKeys.length; i++) {
            let catId = allCategoryKeys[i];
            let catName = category[catId];
            let catRow = [catName];
            let catTotal = 0;

            for (let j = 0; j < rawDates.length; j++) {
                // Беремо дані з карти, якщо вони там є, інакше 0
                let val = 0;
                if (expenseMap[catId] && expenseMap[catId][rawDates[j]]) {
                    val = expenseMap[catId][rawDates[j]];
                }
                catRow.push(val || "");
                catTotal += val;
            }

            let percentage = totalExpensesSum > 0
                ? ((catTotal / totalExpensesSum) * 100).toFixed(2) + "%"
                : "0.00%";

            catRow.push(catTotal, percentage);
            rows.push(catRow);
        }

        // 5. Експорт
        let csvString = headerRow.join(",") + "\n";
        for (let i = 0; i < rows.length; i++) {
            csvString += rows[i].join(",") + "\n";
        }

        const blob = new Blob(["\uFEFF" + csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "detailed_report.csv";
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
                            className="btn btn-success ml"
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
