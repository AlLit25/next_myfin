'use client';

import NavButton from "@/components/NavButton";
import {getStatistic, removeCookies} from "@/lib/DbHelper";
import {useEffect, useState} from "react";
import { isMobile } from 'react-device-detect';
import Load from "@/components/Load";
import {getCurrentDay, getCurrentMonth} from "@/lib/DateHelper";
import IncomeTable from "@/components/statistic/IncomeTable";
import ExpenseTable from "@/components/statistic/ExpenseTable";
import ExpenseAll from "@/components/statistic/ExpenseAll";

export default function Statistic() {
    const [data, setData] = useState({ income: [], expense: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [dateRange, setDateRange] = useState(isMobile
        ? getCurrentDay()
        : getCurrentMonth());

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

    // Завантаження даних при першому рендері
    useEffect(() => {
        fetchData(dateRange.from, dateRange.to);
    }, []);

    // Обробник кліку на кнопку "Відобразити"
    const showData = () => {
        const fromInput = document.querySelector('input[data-date-from]').value;
        const toInput = document.querySelector('input[data-date-to]').value;

        if (fromInput && toInput) {
            setDateRange({ from: fromInput, to: toInput });
            fetchData(fromInput, toInput);
        } else {
            setError('Будь ласка, виберіть обидві дати');
        }
    };

    return (
        <div className="container mt-5">
            <div className="text-center">
                <h1>Статистика</h1>
            </div>
            <div className="d-block mb-3">
                <NavButton href="/" color="secondary" text="На головну" />
            </div>
            <div className="row mt-3 mb-3">
                <div className="col-4">
                    <input type="date"
                           className="form-control"
                           value={dateRange.from}
                           data-date-from=""
                           onChange={(e) =>
                               setDateRange({ ...dateRange, from: e.target.value })}/>
                </div>
                <div className="col-4">
                    <input type="date"
                           className="form-control"
                           data-date-to=""
                           value={dateRange.to}
                           onChange={(e) =>
                               setDateRange({ ...dateRange, to: e.target.value })}/>
                </div>
                <div className="col-4">
                    <button type="button"
                            className="btn btn-success"
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
                        <IncomeTable data={data.income} />
                        { isMobile
                            ? <ExpenseTable data={data.expense} />
                            : <ExpenseAll data={data.expense} dateStart={dateRange.from} dateEnd={dateRange.to} />}
                    </div>}
            </div>
        </div>
    );
}
