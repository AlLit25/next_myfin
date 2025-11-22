'use client'

import {useEffect, useState} from "react";
import {getOtherBalance} from "@/lib/DbHelper";


export default function BalanceCategoryCompact() {
    const [balanceCategory, setBalanceCategory] = useState([]);

    useEffect(() => {
        getOtherBalance().then(data => {
            if (data.data.length > 0) {
                const buffer = [];

                data.data.map(elem =>  {
                    buffer.push({id: elem.id, uah: elem.uah || 0, name: elem.name});
                });

                setBalanceCategory(buffer);
            }
        });

    }, [balanceCategory]);

    return (
        <div className="d-flex horizontal-scroll">
            {balanceCategory.map(elem => {
                return (
                    <div className="" key={elem.id}>
                        <span className="no-wrap p-2"><b>{elem.name}</b>: {elem.uah} грн</span>
                    </div>
                );
            })}
        </div>
    );
}