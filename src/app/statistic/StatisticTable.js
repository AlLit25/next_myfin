'use client';

import {getStatistic, removeCookies} from "@/lib/DbHelper";
import {useEffect, useState} from "react";
import Load from "@/components/Load";
import {getCurrentMonth} from "@/lib/DateHelper";
import ExpenseAll from "@/components/statistic/ExpenseAll";
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
