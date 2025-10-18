"use client";

import {useEffect, useState} from "react";
import {formatDateForShow, getCurrentDay} from "@/lib/DateHelper";
import {getStatistic, removeCookies} from "@/lib/DbHelper";
import Load from "@/components/Load";
import {category} from "@/lib/supabase";

export default function StatisticMainPage() {
    const [data, setData] = useState({ income: [], expense: [] });
    const dateRange = getCurrentDay();
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async (from, to) => {
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
                setData(sortData);
                console.log(data);
                console.log(sortData);
            }
            setIsLoading(false);
        } catch (err) {
            location.reload();
        }
    };

    useEffect(() => {
        fetchData(dateRange.from, dateRange.to);
    }, []);

    return (
        <div>
            {isLoading
                ? (<Load header={false} />)
                : (
                    <>
                        <div className="row">
                            <h3 className="col-8">{formatDateForShow(new Date(), 'full')}</h3>
                            <a className="col-4 text-end" href="/statistic">Детально</a>
                        </div>
                        <div>
                            Дохід: {data['income'].length > 0
                            ? (<ul>{data['income'].map(elem => (<li key={elem.id}>{elem.sum} UAH</li>))}</ul>)
                            : 'відсутній'}
                        </div>
                        <div>
                            Витрати: {data['expense'].length > 0
                            ? (<ul>
                                {data['expense'].map(elem => (
                                <li key={elem.id}>
                                    {elem.sum} UAH ({category[elem.category]})
                                </li>
                                ))}
                            </ul>)
                            : 'відсутні'}
                        </div>
                        <div>
                            <div className="text-end">

                            </div>
                        </div>
                    </>
                )}
        </div>
    );
}