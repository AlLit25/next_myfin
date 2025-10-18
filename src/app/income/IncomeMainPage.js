"use client";

import Load from "@/components/Load";
import {useState} from "react";
import {insertData} from "@/lib/DbHelper";
import {getCurrentDay} from "@/lib/DateHelper";
import Notify from "@/components/Notify";

export default function IncomeMainPage() {
    const [incomeSum, setIncomeSum] = useState('');
    const [showNotify, setShowNotify] = useState(false);
    const [textNotify, setTextNotify] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    function addIncome() {
        setIsLoading(true);
        if (Number(incomeSum) > 0) {
            const dateInfo = getCurrentDay();
            insertData(dateInfo.from, incomeSum, 'income', '', '').then(res => {
                setShowNotify(true);

                if (res) {
                    setIncomeSum('');
                    setTextNotify('Данні додано успішно');
                } else {
                    setTextNotify('Не вдалось додати дані');
                }

                setIsLoading(false);
            });
        } else {
            setShowNotify(true);
            setTextNotify('Поле сумма не може бути порожнім');
            setIsLoading(false);
        }
    }

    return (
        <div>
            {isLoading
                ? (<Load header={false} />)
                : (<>
                    <div className="row">
                        <Notify show={showNotify} text={textNotify} setShowDefault={setShowNotify} />
                        <div className="mt-3 text-center">
                            <h1>Додати дохід</h1>
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
                            <button type="button" className="btn btn-success b-default"
                                    onClick={addIncome}>Додати</button>
                        </div>
                    </div>
                </>)}
        </div>
    );
}