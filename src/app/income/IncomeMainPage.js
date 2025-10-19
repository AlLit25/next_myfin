"use client";

import Load from "@/components/Load";
import {useState} from "react";
import {insertData} from "@/lib/DbHelper";
import {getCurrentDay} from "@/lib/DateHelper";
import Notify from "@/components/Notify";
import {refreshStatisticOnMainPage} from "@/lib/BaseHelper";

export default function IncomeMainPage({setTextNotify, setShowNotify}) {
    const [incomeSum, setIncomeSum] = useState('');
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
                refreshStatisticOnMainPage();
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
                        <div className="col-8">
                            <input type="number"
                                   className="form-control"
                                   value={incomeSum}
                                   placeholder="сума доходу"
                                   onChange={(e) => setIncomeSum(e.target.value)}
                                   min="0"
                            />
                        </div>
                        <div className="col-4">
                            <button type="button" className="btn btn-success"
                                    onClick={addIncome}>Додати дохід</button>
                        </div>
                    </div>
                </>)}
        </div>
    );
}