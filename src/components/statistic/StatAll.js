'use client';

import React, {useEffect, useRef, useState} from 'react';
import {category} from "@/lib/supabase";
import {
    getDataForChart,
    getDatesInRange,
    getExpenseOfDay, getIncomeSumOfDay,
    getSortDataCat, getSumOfDay,
    getTotalSum,
    getTotalSumInCat
} from "@/lib/BaseHelper";
import Modal from '@/components/statistic/Modal';
import {formatDateForShow} from "@/lib/DateHelper";

export default function StatAll({ data, dateStart, dateEnd }) {
    const sortData = getSortDataCat(data.expense);
    const totalSum = getTotalSum(data.expense);
    const allDates = getDatesInRange(dateStart, dateEnd);
    const totalSumInCats = getTotalSumInCat(sortData);
    const chartData = getDataForChart(totalSum, totalSumInCats);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedItems, setSelectedItems] = useState({});
    const scrollRef = useRef(null);

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const todayDay = today.getDate();
    let targetStr = todayStr;

    if (todayDay > 10) {
        const targetDate = new Date(today);
        targetDate.setDate(targetDate.getDate() - 8);
        targetStr = targetDate.toISOString().split('T')[0];

        const targetIndex = allDates.findIndex(date => date === targetStr);

        useEffect(() => {
            if (scrollRef.current && targetIndex !== -1) {
                const container = scrollRef.current;
                const targetColumn = container.children[targetIndex];

                if (targetColumn) {
                    container.scrollLeft = targetColumn.offsetLeft;
                }
            }
        }, [targetIndex]);
    }

    const openDetail = (date) => {
        const dayExpense = getExpenseOfDay(data.expense, date);

        setSelectedDate(date);
        setSelectedItems(dayExpense || []);
        setIsModalOpen(true);
    };

    return (
        <div>
            {/*<div className="alert alert-danger" role="alert">*/}
            {/*    Витрати <i>{totalSum}</i> UAH*/}
            {/*</div>*/}
            <div className="d-flex mt-5">
                <CategoryColumns />
                <div ref={scrollRef} className="d-flex scrollable-table">
                    {allDates.map(date => (
                        <GetColumn
                            key={date}
                            date={date}
                            items={sortData[date] || {}}
                            originalData={data}
                            openDetail={openDetail}
                        />
                    ))}
                </div>
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

function GetColumn({ date, items, originalData, openDetail }) {
    const sumIncome = getSumOfDay(originalData.income, date);
    const sumExpense = getSumOfDay(originalData.expense, date);
    const dateObj = new Date(date);
    // console.log(items);
    return (
        <div className="colum-expense">
            <div className="colum-date" onClick={() => openDetail(date)}>
                {dateObj.toLocaleDateString('uk-UA')}
                ({formatDateForShow(dateObj, 'nameDay')})
            </div>
            <div className="v-light v-border text-center">
                {sumIncome > 0
                    ? <span className="value"><b>{sumIncome}</b></span>
                    : <span className="zero-value"></span>
                }
            </div>
            <div className="v-light v-border text-center">
                {sumExpense ? (
                    <span className="value" onClick={() => openDetail(date)}><b>{sumExpense}</b></span>
                ) : (
                    <span className="zero-value"></span>
                )}
            </div>
            {Object.entries(category).map(([code]) => {
                return (
                    <div key={code} className="v-light v-border text-center">
                        {items[code]
                            ? (<span className="value" onClick={() => openDetail(date)}>{items[code]}</span>)
                            : (<span className="zero-value"></span>)}
                    </div>
                );
            })}
        </div>
    );
}

function CategoryColumns() {
    return (
        <div className="category-column">
            <div className="v-light v-border">Дата</div>
            <div className="v-light v-border">Дохід</div>
            <div className="v-light v-border">Витрати</div>
            {Object.entries(category).map(([code, name]) => (
                <div key={code} className="v-light v-border">{name}</div>
            ))}
            {/*<div className="">Всього</div>*/}
        </div>
    );
}


