'use client'

import NavButton from "@/components/NavButton";
import {useState} from "react";
import {getCurrentDay} from "@/lib/DateHelper";
import {category} from "@/lib/supabase";
import {insertData} from "@/lib/DbHelper";
import Notify from "@/components/Notify";

export default function Expense() {
    const [dateInfo, setDateInfo] = useState(getCurrentDay());
    const [expenseCat, setExpenseCat] = useState('');
    const [expenseSum, setExpenseSum] = useState('');
    const [expenseComment, setExpenseComment] = useState('');
    const [blockBtn, setBlock] = useState(false);
    const [showNotify, setShowNotify] = useState(false);
    const [textNotify, setTextNotify] = useState('');

    function addExpense() {
        setBlock(true);

        if (Number(expenseSum) > 0 && expenseCat.length > 0) {
            insertData(dateInfo.from, expenseSum, 'expense', expenseCat, expenseComment).then(res => {
                setShowNotify(true);

                if (res) {
                    setExpenseSum('');
                    setExpenseComment('');
                    setTextNotify('Данні додано успішно');
                } else {
                    setTextNotify('Не вдалось додати дані');
                }

                setBlock(false);
            });
        } else {
            setShowNotify(true);
            setTextNotify('Поле категорія та сумма не можуть бути порожніми');
            setBlock(false);
        }
    }

    return (
        <div>
            <Notify show={showNotify} text={textNotify} setShowDefault={setShowNotify} />
            <div className="mt-3 text-center">
                <h1>Витрата</h1>
            </div>
            <div className="d-block">
                <NavButton href={"/"} color={'secondary'} text={'На головну'} />
            </div>
            <div className="d-flex justify-content-center mt-3">
                <input type="date"
                       className="i-default form-control"
                       value={dateInfo.from}
                       onChange={(e) =>
                           setDateInfo({ ...dateInfo, from: e.target.value })}/>
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
                <input type="number"
                       className="i-default form-control"
                       min="0"
                       value={expenseSum}
                       onChange={(e) => setExpenseSum(e.target.value)}
                />
            </div>
            <div className="d-flex justify-content-center mt-3">
                <textarea className="form-control t-default"
                          onChange={(e)=>setExpenseComment(e.target.value)}
                          value={expenseComment}></textarea>
            </div>
            <div className="d-flex justify-content-center mt-3">
                <button type="button" className="btn btn-success b-default"
                        onClick={addExpense} disabled={blockBtn}>
                    Додати
                </button>
            </div>
        </div>
    );
}
