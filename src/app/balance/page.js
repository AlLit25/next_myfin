"use client";

import NavButton from "@/components/NavButton";
import {useState} from "react";
import {getBalance, updateBalance} from "@/lib/DbHelper";
import Load from "@/components/Load";
import Notify from "@/components/Notify";

export default function Balance() {
    const [sumBalance, setSumBalance] = useState(0);
    const [inputs, setInputs] = useState([{ id: Date.now(), value: 0 }]);
    const [curBalance, setCurBalance] = useState(0);
    const [idBalance, setIdBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showNotify, setShowNotify] = useState(false);
    const [textNotify, setTextNotify] = useState('');

    function sumBalancePlus(value, index) {
        const newInputs = [...inputs];
        newInputs[index].value = Number(value);
        setInputs(newInputs);
        setSumBalance(newInputs.reduce((sum, input) => sum + input.value, 0));
    }

    function addInputBlock() {
        setInputs([...inputs, { id: Date.now(), value: 0 }]);
    }

    function removeInputBlock(id) {
        if (inputs.length > 1) {
            const newInputs = inputs.filter(input => input.id !== id);
            setInputs(newInputs);
            setSumBalance(newInputs.reduce((sum, input) => sum + input.value, 0));
        }
    }

    getBalance().then(elem => {
        setCurBalance(elem.data.uah || 0)
        setIdBalance(elem.data.id || 0)
        setIsLoading(false);
    });

    function saveBalance() {
        let update;
        if (sumBalance - curBalance !== 0) {
            update = confirm('Різниція не дорівнює 0. Продовжити?')
        } else {
            update = true;
        }

        if (update) {
            updateBalance(idBalance, sumBalance).then(result => {
                setShowNotify(true);
                if (result) {
                    setTextNotify('Дані оновлено');
                } else {
                    setTextNotify('Не вдалось оновити дані');
                }
            });
        }
    }

    return (
        isLoading
            ? <div>
                <div className="mt-3 text-center">
                    <h1>Баланс 0 UAH</h1>
                </div>
                <div className="d-block">
                    <NavButton href={"/"} color={'secondary'} text={'На головну'} />
                </div>
                <Load header={false} />
            </div>
            : <div>
                <Notify show={showNotify} text={textNotify} setShowDefault={setShowNotify} />
                <div className="mt-3 text-center">
                    <h1>Баланс {curBalance} UAH</h1>
                </div>
                <div className="d-block">
                    <NavButton href={"/"} color={'secondary'} text={'На головну'} />
                </div>
                <div className="d-block text-center">
                    <p>Перевірка баланс: {sumBalance} UAH</p>
                </div>
                <div className="mt-3 text-center">
                    <h4>Звірити</h4>
                </div>
                <div className="d-block">
                    {inputs.map((input, index) => (
                        <div key={input.id} className="d-flex justify-content-center mt-3">
                            <input
                                type="number"
                                className="i-default form-control"
                                value={input.value || ''}
                                onChange={(e) => sumBalancePlus(e.target.value, index)}
                                min="0"
                            />
                            <span className="m-2">
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    disabled={inputs.length === 1}
                                    onClick={() => removeInputBlock(input.id)}></button>
                            </span>
                        </div>
                    ))}
                </div>
                <div className="d-flex justify-content-center mt-3">
                    <button type="button" className="btn btn-success" onClick={addInputBlock}>Додати ще</button>
                </div>
                <div className="d-flex justify-content-center mt-5">
                    <p>Різниця: <span className="error-color">{ sumBalance - curBalance }</span> UAH</p>
                </div>
                <div className="d-flex justify-content-center mt-5">
                    <button type="button" className="btn btn-success b-default" onClick={saveBalance}>
                        <b>Записати</b>
                    </button>
                </div>
            </div>
    );
}
