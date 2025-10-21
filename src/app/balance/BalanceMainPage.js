"use client";

import React, {useState} from "react";
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
                        <div className="col-11">
                            <h2>Баланс {curBalance} UAH</h2>
                        </div>
                        <div className="col-1 pt-2">
                            <a href={homePath + 'balance'} className="next-btn-inline">
                                <svg className="feather feather-chevron-right"
                                     fill="none" height="24"
                                     stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                     strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                                    <polyline points="9 18 15 12 9 6"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </>)}
        </div>
    );
}

