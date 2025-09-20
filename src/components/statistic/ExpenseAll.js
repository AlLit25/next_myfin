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
    return (
        <div className="">
            <div className="m-1">{new Date(date).toLocaleDateString('uk-UA')}</div>
            <div>
                {Object.entries(category).map(([code]) => (
                    <div key={code} className="expense-border">
                        { items[code]
                            ? <span className="value">{items[code]}</span>
                            : <span className="zero-value"></span>}
                    </div>
                ))}
            </div>
        </div>
    );
}

function CategoryColumns() {
    return (
        <div className="category-column">
            <div className="m-1">Категорія/Дата</div>
            { Object.entries(category).map(([code, name]) => (
                <div key={code} className="expense-border">{name}</div>
            ))}
        </div>
    );
}

