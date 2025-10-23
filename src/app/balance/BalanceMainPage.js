"use client";

import React, {useEffect, useState} from "react";
import {getBalance} from "@/lib/DbHelper";
import Load from "@/components/Load";
import Link from "next/link";

export default function BalanceMainPage() {
    const [curBalance, setCurBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        refreshData();
    }, []);

    function refreshData() {
        setIsLoading(true);
        getBalance()
            .then(elem => {
                setCurBalance(elem.data.uah || 0);
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
            });
    }

    return (
        <div>
            {isLoading ? (
                <Load header={false} />
            ) : (
                <>
                    <div className="row">
                        <div className="col-9">
                            <h2>Баланс {curBalance} UAH</h2>
                        </div>
                        <div className="col-3 pt-2 text-end">
                            <span onClick={refreshData}
                                data-refresh="balance"
                                className="refresh-icon">
                                <svg id="Layer_1"
                                     version="1.1"
                                     viewBox="0 0 32 32"
                                     width="20px"
                                     height="20px"
                                     xmlSpace="preserve">
                                    <path
                                        fill="currentColor"
                                        d="M28,16c-1.219,0-1.797,0.859-2,1.766C25.269,21.03,22.167,26,16,26c-5.523,0-10-4.478-10-10S10.477,6,16,6  c2.24,0,4.295,0.753,5.96,2H20c-1.104,0-2,0.896-2,2s0.896,2,2,2h6c1.104,0,2-0.896,2-2V4c0-1.104-0.896-2-2-2s-2,0.896-2,2v0.518  C21.733,2.932,18.977,2,16,2C8.268,2,2,8.268,2,16s6.268,14,14,14c9.979,0,14-9.5,14-11.875C30,16.672,28.938,16,28,16z"/>
                                </svg>
                            </span>
                            <Link href="/balance" className="next-btn-inline">
                                <svg className="feather feather-chevron-right"
                                    fill="none"
                                    height="24"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

