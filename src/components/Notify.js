'use client'

import {useEffect, useState} from "react";

export default function Notify({ show, text, type }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (show === 'block') {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 2000);
           clearTimeout(timer);
        }
    }, [show]);

    return (
        <div
            className={isVisible ? 'c-modal' : 'd-none'}
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog text-center">
                <div className={`alert alert-${type} pt-3`} role="alert">
                    {text}
                </div>
            </div>
        </div>
    );
}