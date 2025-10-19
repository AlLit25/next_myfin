"use client";

import {useState} from "react";
import {getBalance, getHomePath} from "@/lib/DbHelper";
import Load from "@/components/Load";

export default function BalanceMainPage() {
    const [curBalance, setCurBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const homePath = getHomePath();

    getBalance().then(elem => {
        setCurBalance(elem.data.uah || 0);
        setIsLoading(false);
    });

    return (
        <div>
            {isLoading
                ? (<Load header={false} />)
                : (<>
                    <div className="row">
                        <h2 className="col-8">Баланс {curBalance} UAH</h2>
                        <a className="col-4 text-end" href={homePath+"balance"}>Звірити</a>
                    </div>
                </>)}
        </div>
    );
}

