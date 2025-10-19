'use client';

import '../../../public/style/Desctop.css';
import BalanceMainPage from "@/app/balance/BalanceMainPage";
import StatisticMainPage from "@/app/statistic/StatisticMainPage";
import IncomeMainPage from "@/app/income/IncomeMainPage";
import ExpenseMainPage from "@/app/expense/ExpenseMainPage";
import Notify from "@/components/Notify";
import {useState} from "react";

export default function Desktop() {
    const [showNotify, setShowNotify] = useState(false);
    const [textNotify, setTextNotify] = useState('');

    return (
        <div className="row">
            <Notify show={showNotify} text={textNotify} setShowDefault={setShowNotify} />
            <div className="col-6">
                <div className="d-block-desk">
                    <BalanceMainPage />
                </div>
                <div className="d-block-desk mt-2">
                    <StatisticMainPage />
                </div>
            </div>
            <div className="col-6">
                <div className="d-block-desk mt-2">
                    <IncomeMainPage setTextNotify={setTextNotify}  setShowNotify={setShowNotify} />
                </div>
                <div className="d-block-desk mt-2">
                    <ExpenseMainPage setTextNotify={setTextNotify}  setShowNotify={setShowNotify} />
                </div>
            </div>
        </div>
    );
}