"use client";

import {category} from "@/lib/supabase";
import Load from "@/components/Load";
import {useState} from "react";
import {insertData} from "@/lib/DbHelper";
import {getCurrentDay} from "@/lib/DateHelper";
import {refreshStatisticOnMainPage} from "@/lib/BaseHelper";

export default function ExpenseMainPage({setTextNotify, setShowNotify}) {
    const [isLoading, setIsLoading] = useState(false);
    const [expenseCat, setExpenseCat] = useState('');
    const [expenseSum, setExpenseSum] = useState('');
    const [expenseComment, setExpenseComment] = useState('');

    function addExpense() {
        setIsLoading(true);

        if (Number(expenseSum) > 0 && expenseCat.length > 0) {
            const dateInfo = getCurrentDay();
            insertData(dateInfo.from, expenseSum, 'expense', expenseCat, expenseComment).then(res => {
                setShowNotify(true);

                if (res) {
                    setExpenseSum('');
                    setExpenseComment('');
                    setTextNotify('Данні додано успішно');
                } else {
                    setTextNotify('Не вдалось додати дані');
                }

                setIsLoading(false);
                refreshStatisticOnMainPage();
            });
        } else {
            setShowNotify(true);
            setTextNotify('Поле категорія та сумма не можуть бути порожніми');
            setIsLoading(false);
        }
    }

    return (
        <div>
        {isLoading
            ? (<Load header={false} />)
            : (<>
                <div className="d-flex justify-content-center mt-3">
                    <input type="number"
                           className="i-default form-control"
                           min="0"
                           placeholder="сума витрати"
                           value={expenseSum}
                           onChange={(e) => setExpenseSum(e.target.value)}
                    />
                </div>
                <div className="d-flex justify-content-center mt-3">
                    <select className="form-control s-default"
                            value={expenseCat}
                            onChange={(e) => setExpenseCat(e.target.value)}>
                        <option key={''} value={''}>Обрати</option>
                        {Object.entries(category).map(([code, label]) => (
                            <option key={code} value={code}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="d-flex justify-content-center mt-3">
                    <textarea className="form-control t-default"
                              onChange={(e)=>setExpenseComment(e.target.value)}
                              value={expenseComment}></textarea>
                </div>
                <div className="d-flex justify-content-center mt-3">
                    <button type="button" className="btn btn-success b-default"
                            onClick={addExpense}>
                        Додати витрату
                    </button>
                </div>
            </>)}
        </div>
    );
}