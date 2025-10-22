"use client";

import Load from "@/components/Load";
import React, {useState} from "react";
import {getHomePath, insertData} from "@/lib/DbHelper";
import {getCurrentDay} from "@/lib/DateHelper";
import Notify from "@/components/Notify";
import {getDateFromMainPage, refreshDataOnMainPage, refreshStatisticOnMainPage} from "@/lib/BaseHelper";
import Link from "next/link";

export default function IncomeMainPage({setTextNotify, setShowNotify}) {
    const [incomeSum, setIncomeSum] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const homePath = getHomePath();

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
                ? (<Load header={false} />)
                : (<>
                    <div className="row">
                        <div className="col-md-7 mb-2 col-sm-12">
                            <input type="number"
                                   className="form-control"
                                   value={incomeSum}
                                   placeholder="сума доходу"
                                   onChange={(e) => setIncomeSum(e.target.value)}
                                   min="0"
                            />
                        </div>
                        <div className="col-md-5 col-sm-12 text-center">
                            <button type="button" className="btn btn-success"
                                    onClick={addIncome}>Додати дохід</button>
                            <Link href={`${homePath}income`} className="next-btn-inline">
                                <svg className="feather feather-chevron-right"
                                     fill="none" height="24"
                                     stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                     strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                    <polyline points="9 18 15 12 9 6"/>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </>)}
        </div>
    );
}