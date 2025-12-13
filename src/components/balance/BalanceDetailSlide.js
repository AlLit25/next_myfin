'use client'

import React, {useEffect, useState} from "react";
import {getOtherBalance} from "@/lib/DbHelper";
import {formatNumber} from "@/lib/BaseHelper";

export default function BalanceDetailSlide() {
    const [balances, setBalances] = useState([]);

    useEffect(() => {
        getOtherBalance().then(data => {
            if (data.data.length > 0) {
                const buffer = data.data.map(elem => ({
                    id: elem.id,
                    uah: Number(elem.uah) || 0,
                    name: elem.name
                }));
                setBalances(buffer);
            }
        });
    }, []);

    return (
        <div>
            <div className="text-center"><h2>Детальний баланс</h2></div>
            <div>
                <table className="table">
                    <tbody>
                    {balances.map(elem => (
                        <tr  key={elem.id}>
                            <td>{elem.name}</td>
                            <td>{formatNumber(elem.uah)} грн</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}