'use client';

import React, { useState } from 'react';
import {category} from "@/lib/supabase";
import {
    getDataForChart,
    getDatesInRange,
    getExpenseOfDay,
    getSortDataCat,
    getTotalSum,
    getTotalSumInCat
} from "@/lib/BaseHelper";
import PieChartComp from '@/components/statistic/PieChart';
import Modal from '@/components/statistic/Modal';

export default function ExpenseAll({ data, dateStart, dateEnd }) {
    const sortData = getSortDataCat(data);
    const totalSum = getTotalSum(data);
    const allDates = getDatesInRange(dateStart, dateEnd);
    const totalSumInCats = getTotalSumInCat(sortData);
    const chartData = getDataForChart(totalSum, totalSumInCats);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedItems, setSelectedItems] = useState({});

    const openDetail = (date) => {
        const dayExpense = getExpenseOfDay(data, date);

        setSelectedDate(date);
        setSelectedItems(dayExpense || []);
        setIsModalOpen(true);
    };


    return (
        <div>
            <div className="alert alert-danger" role="alert">
                Витрати <i>{totalSum}</i> UAH
            </div>
            <div className="d-flex mt-5">
                <CategoryColumns />
                <div className="d-flex scrollable-table">
                    {allDates.map(date => (
                        <GetColumn
                            key={date}
                            date={date}
                            items={sortData[date] || {}}
                            openDetail={openDetail}
                        />
                    ))}
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <PieChartComp data={chartData} />
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedDate={selectedDate}
                selectedItems={selectedItems}
            />
        </div>
    );
}

function GetColumn({ date, items, openDetail }) {
    let sumDay = 0;
    let sumDayClass = 'v-normal';

    return (
        <div className="colum-expense">
            <div className="m-1 colum-date" onClick={() => openDetail(date)}>
                {new Date(date).toLocaleDateString('uk-UA')}
            </div>
            <div>
                {Object.entries(category).map(([code]) => {
                    const sum = items[code] ? Number(items[code]) : 0;
                    let classVal = 'v-normal';

                    if (sum > 0) sumDay += sum;

                    if (sum === 0) {
                        classVal = 'v-gold';
                    } else if (sum > 4000) {
                        classVal = 'v-many';
                    }

                    if (sumDay === 0) {
                        sumDayClass = 'v-gold';
                    } else if (sumDay > 4000) {
                        sumDayClass = 'v-many';
                    }

                    return (
                        <div key={code} className={classVal + " v-border"}>
                            {sum ? (
                                <span className="value" onClick={() => openDetail(date)}>{sum}</span>
                            ) : (
                                <span className="zero-value"></span>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="">
                {sumDay ? (
                    <span className="value"><b>{sumDay}</b></span>
                ) : (
                    <span className="zero-value"></span>
                )}
            </div>
        </div>
    );
}

function CategoryColumns() {
    return (
        <div className="category-column">
            <div className="m-1">Категорія/Дата</div>
            {Object.entries(category).map(([code, name]) => (
                <div key={code} className="v-light v-border">{name}</div>
            ))}
            <div className="">За день</div>
        </div>
    );
}


