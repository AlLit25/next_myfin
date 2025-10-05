import '../../../public/style/Desctop.css';
import Link from "next/link";

export default function Desktop() {
    return (
        <div className="parent">
            <div className="d-block-desk div12">Баланс загальний</div>
            <div className="d-block-desk div8">Додати дохід</div>
            <div className="d-block-desk div13">Звіт за сьгодні</div>
            <div className="d-block-desk div9">Додати витрати</div>
            <div className="d-block-desk div14 text-center">
                <Link href="/statistic" className="">
                    Детальний звіт
                </Link>
            </div>
        </div>
    );
}