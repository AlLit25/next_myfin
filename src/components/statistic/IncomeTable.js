import React, {useState} from "react";
import {getTotalSum} from "@/lib/BaseHelper";

export default function IncomeTable({data}) {
    if (data.length > 0) {
        const totalSum = getTotalSum(data); // Припускаємо, що функція getTotalSum визначена

        return (
            <div>
                <div className="alert alert-success" role="alert">
                    Дохід <i>{totalSum}</i> UAH
                </div>

                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>Сума</th>
                        <th>Дата</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.sum}</td>
                            <td>{new Date(item.created_at).toLocaleDateString('uk-UA')}</td>
                        </tr>
                    ))}
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