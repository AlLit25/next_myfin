'use client'

import NavButton from "@/components/NavButton";
import {useState} from "react";
import {getCurrentDay} from "@/lib/DateHelper";
import {insertData} from "@/lib/DbHelper";
import Notify from "@/components/Notify";


export default function Income() {
    const [dateInfo, setDateInfo] = useState(getCurrentDay());
    const [incomeSum, setIncomeSum] = useState('');
    const [blockBtn, setBlock] = useState(false);
    const [showNotify, setShowNotify] = useState(false);
    const [textNotify, setTextNotify] = useState('');

    function addIncome() {
        setBlock(true);
        if (Number(incomeSum) > 0) {
            insertData(dateInfo.from, incomeSum, 'income', '', '').then(res => {
                setShowNotify(true);

                if (res) {
                    setIncomeSum('');
                    setTextNotify('Данні додано успішно');
                } else {
                    setTextNotify('Не вдалось додати дані');
                }

                setBlock(false);
            });
        } else {
            setShowNotify(true);
            setTextNotify('Поле сумма не може бути порожнім');
            setBlock(false);
        }
    }

    return (
        <div>
            <Notify show={showNotify} text={textNotify} setShowDefault={setShowNotify} />
            <div className="mt-3 text-center">
                <h1>Дохід</h1>
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
                <input type="number"
                       className="i-default form-control"
                       value={incomeSum}
                       onChange={(e) => setIncomeSum(e.target.value)}
                       min="0"
                />
            </div>
            <div className="d-flex justify-content-center mt-3">
                <button type="button" className="btn btn-success b-default" disabled={blockBtn}
                        onClick={addIncome}>Додати</button>
            </div>
        </div>
    );
}
