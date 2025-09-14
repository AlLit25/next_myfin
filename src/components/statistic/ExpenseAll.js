import {category} from "@/lib/supabase";
import {getTotalSum} from "@/lib/BaseHelper";
import React from "react";

export default function ExpenseAll({ data }) {
    const sortData = getSortData(data);
    const totalSum  = getTotalSum(data);

    const sortedDates = Object.keys(sortData).sort((a, b) => new Date(a) - new Date(b));

    return (
        <div>
            <div className="alert alert-danger" role="alert">
                Витрати <i>{totalSum}</i> UAH
            </div>
            <div className="d-flex mb-5">
                <CategoryColumns />
                <div className="d-flex scrollable-table">
                    {sortedDates.map(date => (
                        <GetColumn key={date} date={date} items={sortData[date]} />
                    ))}
                </div>
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

function getSortData(data) {
    return data.reduce((result, item) => {
        const date = item.created_at;
        const category = item.category;
        const sum = item.sum;

        if (!result[date]) {
            result[date] = {};
        }

        result[date][category] = (result[date][category] || 0) + sum;

        return result;
    }, {});
}
