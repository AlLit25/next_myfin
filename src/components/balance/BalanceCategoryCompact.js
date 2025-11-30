'use client'

import {useEffect, useState} from "react";
import {getBalance, getOtherBalance, insertDataNoSync, updateBalance, updateUsd} from "@/lib/DbHelper";
import Load from "@/components/Load";

export default function BalanceCategoryCompact() {
    const [balances, setBalances] = useState([]);
    const [curBalance, setCurBalance] = useState(0);
    const [curBalanceUsd, setCurBalanceUsd] = useState(0);
    const [curTotal, setCurTotal] = useState(0);
    const [diffBalance, setDiffBalance] = useState(0);
    const [idBalance, setIdBalance] = useState(0);
    const [stateBtn, setStateBtn] = useState(false);
    const [exchangeRate, setExchangeRate] = useState(42.05);
    const [isLoading, setIsLoading] = useState(true);

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

        getBalance().then(elem => {
            if (elem.data !== null) {
                setCurBalance(Number(elem.data.uah) || 0);
                setCurBalanceUsd(Number(elem.data.usd) || 0);
                setIdBalance(elem.data.id || 0);
            }
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        if (balances.length > 0) {
            calcDiffBalance();
        }
    }, [balances, curBalance]);

    const half = Math.ceil(balances.length / 2);
    const leftBalances = balances.slice(0, half);
    const rightBalances = balances.slice(half);

    function calcDiffBalance() {
        const totalSum = balances.reduce((sum, elem) => sum + (Number(elem.uah) || 0), 0);
        setCurTotal(totalSum);
        setDiffBalance(totalSum - curBalance);
    }

    function handleChange(id, newValue) {
        const parsedValue = Number(newValue) || 0;
        setBalances(prevBalances => {
            const newBalances = prevBalances.map(elem =>
                elem.id === id ? { ...elem, uah: parsedValue } : elem
            );
            calcDiffBalance();
            return newBalances;
        });
    }

    async function saveBalance() {
        try {
            setStateBtn(true);
            const totalSum = balances.reduce((sum, elem) => sum + (Number(elem.uah) || 0), 0);
            const currentDiff = totalSum - curBalance;

            if (confirm('Підтвердіть збереження даних. Різниця: '+currentDiff+' грн')) {
                await Promise.all(
                    balances.map(elem => updateBalance(elem.id, elem.uah))
                );

                await updateBalance(idBalance, totalSum).then();

                if (currentDiff < 0) {
                    const expenseAmount = Math.abs(currentDiff);
                    const today = new Date().toISOString().split('T')[0];

                    await insertDataNoSync(today, expenseAmount, 'expense', 'ot',
                        `Автоматична корекція балансу: від'ємна різниця ${currentDiff} грн`
                    );
                }
                location.reload();
            } else {
                setStateBtn(false);
            }
        } catch (error) {
            console.error('Помилка збереження:', error);
        }
    }

    async function saveUsd() {
        if (confirm('Оновити поточний баланс USD?')) {
            await updateUsd(idBalance, curBalanceUsd);
            location.reload();
        }
    }

    console.log(balances.length);

    return (
        isLoading
            ? <Load />
            : <div>
                <div className="row">
                    <div className="col-6">
                        {leftBalances.map(elem => (
                            <div className="row mt-1" key={elem.id}>
                                <div className="col-6"><b>{elem.name}</b></div>
                                <div className="col-6">
                                    <input
                                        className="form-control"
                                        type="number"
                                        step="0.01"
                                        value={elem.uah}
                                        onChange={(e) => handleChange(elem.id, e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="col-6">
                        {rightBalances.map(elem => (
                            <div className="row mt-1" key={elem.id}>
                                <div className="col-6"><b>{elem.name}</b></div>
                                <div className="col-6">
                                    <input
                                        className="form-control"
                                        type="number"
                                        step="0.01"
                                        value={elem.uah}
                                        onChange={(e) => handleChange(elem.id, e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-2">Загалом: {curTotal} грн</div>
                    <div className="col-2">Різниця: {diffBalance} грн</div>
                    <div className="col-2">
                        <div className="text-end mt-1">
                            <button type="button" className="btn btn-success btn-sm"
                                    disabled={stateBtn}
                                    onClick={saveBalance}>
                                <b>Записати</b>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-6 d-flex justify-content-end">
                        <span className="m-2">USD</span>
                        <input
                            type="number"
                            className="form-control"
                            style={{ width: "130px" }}
                            value={curBalanceUsd}
                            onChange={e =>setCurBalanceUsd(e.target.value)}
                            min="0"
                        />
                        <span className="m-2">Курс</span>
                        <input
                            type="number"
                            className="form-control"
                            style={{ width: "100px" }}
                            value={exchangeRate}
                            onChange={e => setExchangeRate(e.target.value)}
                            min="0"
                        />
                    </div>
                    <div className="col-6 d-flex justify-content-start">
                        <span className="m-2"> У гривні: {curBalanceUsd*exchangeRate}</span>
                        <button className="btn btn-success" onClick={saveUsd}>Оновити</button>
                    </div>
                </div>
            </div>
    );
}