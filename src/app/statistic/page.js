'use client';

import NavButton from "@/components/NavButton";
import {getStatistic, removeCookies} from "@/lib/DbHelper";
import {useEffect, useState} from "react";
import Load from "@/components/Load";
import {getCurrentDay} from "@/lib/DateHelper";
import {sort} from "next/dist/build/webpack/loaders/css-loader/src/utils";

export default function Statistic() {
    const [data, setData] = useState({ income: [], expense: [] }); // Ініціалізуємо як об’єкт
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getData() {
            try {
                const defaultDate = getCurrentDay();

                const rawData = await getStatistic(defaultDate.from, defaultDate.to);

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
        }

        getData();
    }, []);

    if (isLoading) {
        return <Load />;
    }

    return (
        <div className="container mt-5">
            <div className="text-center">
                <h1>Статистика</h1>
            </div>
            <div className="d-block mb-3">
                <NavButton href="/" color="secondary" text="На головну" />
            </div>
            <div>
                {error ? (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                ) : data.income.length > 0 ? (
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th colSpan="2">Дохід</th>
                        </tr>
                        <tr>
                            <th>Сума</th>
                            <th>Дата створення</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.income.map((item) => (
                            <tr key={item.id}>
                                <td>{item.sum}</td>
                                <td>{new Date(item.created_at).toLocaleDateString('uk-UA')}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="alert alert-info" role="alert">
                        Дані відсутні
                    </div>
                )}
            </div>
        </div>
    );
}
