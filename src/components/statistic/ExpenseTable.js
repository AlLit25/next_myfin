import {category} from "@/lib/supabase";
import {getTotalSum} from "@/lib/BaseHelper";
import React, {useState} from 'react';

export default function ExpenseTable({data}) {
    if (data.length > 0) {
        const totalSum  = getTotalSum(data);
        const sortData = getSortData(data);

        return (
            <div>
                <div className="alert alert-danger" role="alert">
                    Витрати <i>{totalSum}</i> UAH
                </div>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>Категорія</th>
                        <th>Сума</th>
                        <th>Коментар</th>
                    </tr>
                    </thead>
                    <tbody>
                    <GetExpenseItems data={sortData}/>
                    </tbody>
                </table>
            </div>
        );
    } else {
        return (
            <div className="alert alert-info" role="alert">
                Дані відсутні
            </div>
        );
    }
}

function GetExpenseItems({ data }) {
    if (!data || typeof data !== 'object') {
        return null;
    }

    return (
        <>
            {Object.keys(data).map((date) => (
                <React.Fragment key={date}>
                    <tr>
                        <td colSpan="3">
                            <b>{new Date(date).toLocaleDateString('uk-UA')}</b>
                        </td>
                    </tr>
                    {data[date].map((item) => (
                        <tr key={item.id}>
                            <td>{category[item.category]}</td>
                            <td>{item.sum}</td>
                            <td>{item.comment}</td>
                        </tr>
                    ))}
                </React.Fragment>
            ))}
        </>
    );
}

function getSortData(data) {
    let result = {};

    data.map((item) => {
        if (result[item.created_at] === undefined) {
            result[item.created_at] = [];
        }

        result[item.created_at].push(item);
    });

    return result;
}