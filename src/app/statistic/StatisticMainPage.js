"use client";

import React, {useEffect, useState} from "react";
import {formatDateForShow, getCurrentDay} from "@/lib/DateHelper";
import {getHomePath, getStatistic, removeCookies} from "@/lib/DbHelper";
import Load from "@/components/Load";
import {category} from "@/lib/supabase";
import Link from "next/link";

export default function StatisticMainPage() {
    const [data, setData] = useState({ income: [], expense: [] });
    const dateRange = getCurrentDay();
    const [isLoading, setIsLoading] = useState(true);
    const homePath = getHomePath();

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
            }
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    function refreshData() {
        setIsLoading(true);
        fetchData(dateRange.from, dateRange.to);
    }

    return (
        <div>
            {isLoading
                ? (<Load header={false} />)
                : (
                    <>
                        <div className="row">
                            <div className="col-6">
                                <h3>{formatDateForShow(new Date(), 'full')}</h3>
                            </div>
                            <div className="col-6 text-end">
                                <span
                                    onClick={refreshData}
                                    data-refresh="statistic"
                                    className="refresh-icon">
                                    <svg id="Layer_1"
                                        version="1.1"
                                        viewBox="0 0 32 32"
                                        width="20px"
                                        height="20px"
                                        xmlSpace="preserve">
                                        <path
                                            fill="currentColor"
                                            d="M28,16c-1.219,0-1.797,0.859-2,1.766C25.269,21.03,22.167,26,16,26c-5.523,0-10-4.478-10-10S10.477,6,16,6  c2.24,0,4.295,0.753,5.96,2H20c-1.104,0-2,0.896-2,2s0.896,2,2,2h6c1.104,0,2-0.896,2-2V4c0-1.104-0.896-2-2-2s-2,0.896-2,2v0.518  C21.733,2.932,18.977,2,16,2C8.268,2,2,8.268,2,16s6.268,14,14,14c9.979,0,14-9.5,14-11.875C30,16.672,28.938,16,28,16z"/>
                                    </svg>
                                </span>
                                <Link href={`${homePath}statistic`} className="next-btn-inline">
                                    <svg className="feather feather-chevron-right"
                                         fill="none" height="24"
                                         stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                         strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                        <polyline points="9 18 15 12 9 6"/>
                                    </svg>
                                </Link>
                            </div>
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
                    </>
                )}
        </div>
    );
}