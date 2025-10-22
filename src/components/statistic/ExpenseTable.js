import {category} from "@/lib/supabase";
import {getTotalSum, getSortDataCat, getSortDataDate} from "@/lib/BaseHelper";
import React from 'react';

export default function ExpenseTable({data}) {
    if (data.length > 0) {
        const sortData = getSortDataCat(data);
        const totalSum  = getTotalSum(data);
        const sortedDates = getSortDataDate(sortData);

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
                    </tr>
                    </thead>
                    <tbody>
                    <GetExpenseItems data={sortedDates} sortData={sortData}/>
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

function GetExpenseItems({ data, sortData }) {
    if (!data || typeof data !== 'object') {
        return null;
    }

    return (
        <>
            {
                data.map(date => (
                    <React.Fragment key={date}>
                        <tr>
                            <td colSpan="3">
                                <b>{new Date(date).toLocaleDateString('uk-UA')}</b>
                            </td>
                        </tr>
                        {
                            Object.entries(category).map(([code]) => (
                                sortData[date][code] !== undefined
                                    ? <tr key={code}>
                                        <td>{category[code]}</td>
                                        <td>{sortData[date][code]}</td>
                                    </tr>
                                    : ''
                            ))
                        }
                    </React.Fragment>
                ))}
        </>
    );
}