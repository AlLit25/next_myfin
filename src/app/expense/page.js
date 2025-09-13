'use client'

import NavButton from "@/components/NavButton";
import {useState} from "react";
import {getCurrentDay} from "@/lib/DateHelper";
import {category} from "@/lib/supabase";

export default function Expense() {
    const [dateInfo, setDateInfo] = useState(getCurrentDay());

    return (
        <div>
            <div className="mt-3 text-center">
                <h1>Витрата</h1>
            </div>
            <div className="d-block">
                <NavButton href={"/"} color={'secondary'} text={'На головну'} />
            </div>
            <div className="d-flex justify-content-center mt-3">
                <input type="date"
                       className="i-default form-control"
                       value={dateInfo.from}
                       onChange={(e) =>
                           setDateInfo({ ...dateInfo, from: e.target.value })}/>
            </div>
            <div className="d-flex justify-content-center mt-3">
                <select className="form-control s-default">
                    {Object.entries(category).map(([code, label]) => (
                        <option key={code} value={code}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="d-flex justify-content-center mt-3">
                <input type="number"
                       className="i-default form-control"
                       min="0"
                />
            </div>
            <div className="d-flex justify-content-center mt-3">
                <textarea className="form-control t-default"></textarea>
            </div>
            <div className="d-flex justify-content-center mt-3">
                <button type="button" className="btn btn-success b-default">Додати</button>
            </div>
        </div>
    );
}
