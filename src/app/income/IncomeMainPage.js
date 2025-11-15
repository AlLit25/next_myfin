"use client";

import Load from "@/components/Load";
import React, {useState} from "react";
import {insertData} from "@/lib/DbHelper";
import {getDateFromMainPage, refreshDataOnMainPage} from "@/lib/BaseHelper";

export default function IncomeMainPage({setTextNotify, setShowNotify}) {
    const [incomeSum, setIncomeSum] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    function addIncome() {
        setIsLoading(true);
        if (Number(incomeSum) > 0) {
            const dateInfo = getDateFromMainPage();

            if (dateInfo === null) {
                setShowNotify(true);
                setTextNotify('Необхідно обрати дату');
                setIsLoading(false);
            }

            insertData(dateInfo, incomeSum, 'income', '', '').then(res => {
                setShowNotify(true);

                if (res) {
                    setIncomeSum('');
                    setTextNotify('Данні додано успішно');
                } else {
                    setTextNotify('Не вдалось додати дані');
                }

                setIsLoading(false);
                refreshDataOnMainPage();
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
                ? (<Load />)
                : (<>
                    <div className="row">
                        <div className="mb-2 col-sm-12 d-flex justify-content-center">
                            <input type="number"
                                   className="form-control i-default"
                                   value={incomeSum}
                                   placeholder="сума доходу"
                                   onChange={(e) => setIncomeSum(e.target.value)}
                                   min="0"
                            />
                        </div>
                        <div className="col-sm-12 text-center">
                            <button type="button" className="btn btn-success"
                                    onClick={addIncome}>Додати дохід</button>
                        </div>
                    </div>
                </>)}
        </div>
    );
}