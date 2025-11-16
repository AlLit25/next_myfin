"use client";

import NavButton from "@/components/NavButton";
import {useEffect, useMemo, useState} from "react";
import {getBalance, getOtherBalance, getStatisticsBalance, updateBalance, updateUsd} from "@/lib/DbHelper";
import Load from "@/components/Load";
import Notify from "@/components/Notify";
import {log} from "next/dist/server/typescript/utils";

export default function Balance() {
    const [sumBalance, setSumBalance] = useState(0);
    const [curBalance, setCurBalance] = useState(0);
    const [curBalanceUsd, setCurBalanceUsd] = useState(0);
    const [idBalance, setIdBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showNotify, setShowNotify] = useState(false);
    const [textNotify, setTextNotify] = useState('');
    const [exchangeRate, setExchangeRate] = useState(42.05);
    const [balances, setBalances] = useState([]);

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

            setIsLoading(false);
        });

    }, []);

    const handleChange = (id, newValue) => {
        setBalances(prevBalances =>
            prevBalances.map(elem =>
                elem.id === id ? { ...elem, uah: newValue } : elem
            )
        );
    };

    const totalSum = useMemo(() => {
        return balances.reduce((acc, elem) => {
            const value = parseFloat(elem.uah) || 0;
            return acc + value;
        }, 0);
    }, [balances]);

    return (
        isLoading
            ? <Load />
            : <div>
                <Notify show={showNotify} text={textNotify} setShowDefault={setShowNotify} />
                <div className="mt-3 text-center">
                    <h1>Баланс {curBalance} UAH</h1>
                </div>
                <div className="d-block text-center">
                    {balances.map(elem => (
                        <div key={elem.id} className="row m-1">
                            <div className="col-6 text-end mt-2">
                                <span>{elem.name}</span>
                            </div>
                            <div className="col-6 col-md-2">
                                <input className="form-control"
                                    type="text" value={elem.uah}
                                    onChange={(e) =>
                                        handleChange(elem.id, e.target.value)} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="d-flex justify-content-center mt-3">
                    <p>Загальна: <span className="error-color">{totalSum}</span> UAH</p>
                </div>
                <div className="d-flex justify-content-center mt-3">
                    <p>Різниця: <span className="error-color">{ totalSum - curBalance }</span> UAH</p>
                </div>
                <div className="d-flex justify-content-center">
                    <button type="button" className="btn btn-success b-default" onClick={saveBalance}>
                        <b>Записати</b>
                    </button>
                </div>
                <div className="d-flex justify-content-center mt-5">
                    <span className="m-2">USD</span>
                    <input
                        type="number"
                        className="form-control"
                        style={{ width: "130px" }}
                        value={curBalanceUsd}
                        onChange={e =>setCurBalanceUsd(e.target.value)}
                        min="0"
                    />
                    <button className="btn btn-success m-1" onClick={saveUsd}>Оновити</button>
                </div>
                <div className="d-flex justify-content-center m-1">
                    <span className="m-2">Курс</span>
                    <input
                        type="number"
                        className="form-control"
                        style={{ width: "100px" }}
                        value={exchangeRate}
                        onChange={e => setExchangeRate(e.target.value)}
                        min="0"
                    />
                    <span className="m-2"> У гривні: {curBalanceUsd*exchangeRate}</span>
                </div>
                <div className="d-block">
                    <NavButton href={"/"} color={'secondary'} text={'На головну'} />
                </div>
            </div>
    );

    function saveBalance() {
        let update;
        if (curBalance - sumBalance !== 0) {
            update = confirm('Різниція не дорівнює 0. Продовжити?')
        } else {
            update = true;
        }

        if (update) {
            balances.map(elem => {
               updateBalance(elem.id, elem.uah).then(res => console.log(res));
            });
            updateBalance(idBalance, totalSum).then(result => {
                setShowNotify(true);
                if (result) {
                    setTextNotify('Дані оновлено');
                } else {
                    setTextNotify('Не вдалось оновити дані');
                }
            });
        }
    }

    function saveUsd() {
        updateUsd(idBalance, curBalanceUsd).then(result => {
            setShowNotify(true);
            if (result) {
                setTextNotify('Дані оновлено');
            } else {
                setTextNotify('Не вдалось оновити дані');
            }
        });
    }
}
