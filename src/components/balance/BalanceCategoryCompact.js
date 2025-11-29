'use client'

import {useEffect, useState} from "react";
import {getBalance, getOtherBalance, updateBalance} from "@/lib/DbHelper";


export default function BalanceCategoryCompact() {
    const [balances, setBalances] = useState([]);
    const [curBalance, setCurBalance] = useState(0);
    const [curBalanceUsd, setCurBalanceUsd] = useState(0);
    const [idBalance, setIdBalance] = useState(0);

    useEffect(() => {
        getOtherBalance().then(data => {
            if (data.data.length > 0) {
                const buffer = [];

                data.data.map(elem =>  {
                    buffer.push({id: elem.id, uah: elem.uah || 0, name: elem.name});
                });

                setBalances(buffer);
            }
        });

        getBalance().then(elem => {
            if (elem.data !== null) {
                setCurBalance(elem.data.uah || 0)
                setCurBalanceUsd(Number(elem.data.usd) || 0)
                setIdBalance(elem.data.id || 0)
            }
        });

    }, []);

    return (
        <div className="row">
            <div className="col-6">
                {balances.map(elem => {
                    return (
                        <div className="row mt-1" key={elem.id}>
                            <div className="col-6"><b>{elem.name}</b></div>
                            <div className="col-6">
                                <input className="form-control"
                                       type="text" value={elem.uah}
                                       onChange={(e) =>
                                           handleChange(elem.id, e.target.value)} />
                            </div>
                        </div>
                    );
                })}
                <div className="text-end mt-1">
                    <button type="button" className="btn btn-success btn-sm" onClick={saveBalance}>
                        <b>Записати</b>
                    </button>
                </div>
            </div>
            <div className="col-6"></div>
        </div>
    );

    function handleChange(id, newValue) {
        setBalances(prevBalances =>
            prevBalances.map(elem =>
                elem.id === id ? { ...elem, uah: newValue } : elem
            )
        );
    }

    function saveBalance() {
        // let update;
        // if (curBalance - sumBalance !== 0) {
        //     update = confirm('Різниція не дорівнює 0. Продовжити?')
        // } else {
        //     update = true;
        // }
        let totalSum = 0;
        // if (update) {
            balances.map(elem => {
                totalSum += elem.uah;
                updateBalance(elem.id, elem.uah).then(res => console.log(res));
            });
            updateBalance(idBalance, totalSum).then(result => {
                console.log(result);
            });
    }
}