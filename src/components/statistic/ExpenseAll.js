import {category} from "@/lib/supabase";
import {getDataForChart, getDatesInRange, getSortDataCat, getTotalSum, getTotalSumInCat} from "@/lib/BaseHelper";
import React from "react";
import PieChartComp from '@/components/statistic/PieChart';

export default function ExpenseAll({ data, dateStart, dateEnd }) {
    const sortData = getSortDataCat(data);
    const totalSum = getTotalSum(data);
    const allDates = getDatesInRange(dateStart, dateEnd);
    const totalSumInCats = getTotalSumInCat(sortData);
    const chartData = getDataForChart(totalSum, totalSumInCats);

    return (
        <div>
            <div className="alert alert-danger" role="alert">
                Витрати <i>{totalSum}</i> UAH
            </div>
            <div className="d-flex mb-5">
                <CategoryColumns />
                <div className="d-flex scrollable-table">
                    {allDates.map(date => (
                        <GetColumn
                            key={date}
                            date={date}
                            items={sortData[date] || {}}
                        />
                    ))}
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <PieChartComp data={chartData} />
            </div>
        </div>
    );
}

function GetColumn({ date, items }) {
    let sumDay = 0;
    let sumDayClass = 'v-normal'

    return (
        <div className="">
            <div className="m-1">{new Date(date).toLocaleDateString('uk-UA')}</div>
            <div>
                {Object.entries(category).map(([code]) => {
                    const sum = items[code] ? Number(items[code]) : 0;
                    let classVal = 'v-normal';

                    if (sum > 0) sumDay += sum;

                    if (sum === 0) {classVal = 'v-gold';}
                    else if (sum > 4000) {classVal = 'v-many';}

                    if (sumDay === 0) {sumDayClass = 'v-gold';}
                    else if (sumDay > 4000) {sumDayClass = 'v-many';}

                    return (
                    <div key={code} className={classVal}>
                        { sum
                            ? <span className="value">{sum}</span>
                            : <span className="zero-value"></span>}
                    </div>
                )})}
            </div>
            <div className={sumDayClass}>
            { sumDay
                ? <span className="value"><b>{sumDay}</b></span>
                : <span className="zero-value"></span>}
            </div>
        </div>
    );
}

function CategoryColumns() {
    return (
        <div className="category-column">
            <div className="m-1">Категорія/Дата</div>
            { Object.entries(category).map(([code, name]) => (
                <div key={code} className="v-light">{name}</div>
            ))}
            <div className="v-light">За день</div>
        </div>
    );
}

