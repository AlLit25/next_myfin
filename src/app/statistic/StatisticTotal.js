import React, {useEffect, useState} from "react";
import {formatNumber, getDatesInRange, getSortDataCat, getTotalSum, getTotalSumInCat} from "@/lib/BaseHelper";
import {getStatistic, removeCookies} from "@/lib/DbHelper";
import {formatDateForShow, getCurrentMonth} from "@/lib/DateHelper";
import {category} from "@/lib/supabase";
import Load from "@/components/Load";

export default function StatisticTotal() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({ income: [], expense: [] });
    const dateRange= getCurrentMonth();

    useEffect(() => {
        fetchData(dateRange.from, dateRange.to).then(dataFromDb => {
            setData(dataFromDb);
            setIsLoading(false);
        });
    }, []);

    const sortData = getSortDataCat(data.expense);
    const totalExpense = getTotalSum(data.expense);
    const totalIncome = getTotalSum(data.income);
    const totalSumInCats = getTotalSumInCat(sortData);

    async function fetchData (from, to) {
        try {
            const rawData = await getStatistic(from, to);

            if (rawData.error) {
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
                return sortData;
            }
        } catch (err) {
            return { income: [], expense: [] };
        }
    }

    return (
        isLoading
            ? <Load />
            : <div>
                <div className="text-center"><h2>Загальні витрати</h2></div>
                <div className="text-center">
                    <p>
                        {formatDateForShow(new Date(dateRange.from), 'short')} - {formatDateForShow(new Date(dateRange.to), 'short')}
                    </p>
                </div>
                <div><p>Загальні доходи:  <b>{formatNumber(totalIncome)}</b> грн</p></div>
                <div><p>Загальні витрати:  <b>{formatNumber(totalExpense)}</b> грн</p></div>
                <div>Загальні витрати по категоріям:  </div>
                <table className="table">
                    <tbody>
                    {Object.entries(category).map(([code, name]) => (
                        <tr  key={code}>
                            <td>{name}</td>
                            <td>{formatNumber(totalSumInCats[code])} грн</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
    );
}