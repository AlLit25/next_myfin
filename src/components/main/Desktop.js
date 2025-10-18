import '../../../public/style/Desctop.css';
import Link from "next/link";
import BalanceMainPage from "@/app/balance/BalanceMainPage";
import StatisticMainPage from "@/app/statistic/StatisticMainPage";
import IncomeMainPage from "@/app/income/IncomeMainPage";

export default function Desktop() {
    return (
        <div className="parent">
            <div className="d-block-desk div12">
                <BalanceMainPage />
            </div>
            <div className="d-block-desk div8">
                <IncomeMainPage />
            </div>
            <div className="d-block-desk div13">
                <StatisticMainPage />
            </div>
            <div className="d-block-desk div9">Додати витрати</div>
        </div>
    );
}