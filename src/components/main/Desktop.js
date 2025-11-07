'use client';

import '../../../public/style/Desktop.css';
import BalanceMainPage from "@/app/balance/BalanceMainPage";
import StatisticMainPage from "@/app/statistic/StatisticMainPage";
import IncomeMainPage from "@/app/income/IncomeMainPage";
import ExpenseMainPage from "@/app/expense/ExpenseMainPage";
import Notify from "@/components/Notify";
import {useState} from "react";
import SelectDate from "@/components/main/SelectDate";
import StatisticTable from "@/app/statistic/StatisticTable";

export default function Desktop() {
    const [showNotify, setShowNotify] = useState(false);
    const [textNotify, setTextNotify] = useState('');

    return (
        <div className="container-fluid">
            <div className="row mb-4">
                <Notify show={showNotify} text={textNotify} setShowDefault={setShowNotify} />
                <div className="col-6">
                    <div className="d-block-desk-no-hover">
                        <BalanceMainPage />
                        <StatisticMainPage />
                    </div>
                </div>
                <div className="col-6">
                    <div className="d-block-desk-no-hover">
                        <div className="d-flex justify-content-center">
                            <SelectDate />
                        </div>

                        <div className="d-flex justify-content-center">
                            <span>Дохід</span>
                        </div>
                        <IncomeMainPage setTextNotify={setTextNotify}  setShowNotify={setShowNotify} />

                        <div className="d-flex justify-content-center">
                            <span>Витрати</span>
                        </div>
                        <ExpenseMainPage setTextNotify={setTextNotify}  setShowNotify={setShowNotify} />
                    </div>
                </div>
            </div>
            <div className="row m-1">
                <div className="d-block-desk-no-hover">
                    <StatisticTable />
                </div>
            </div>
        </div>
    );
}