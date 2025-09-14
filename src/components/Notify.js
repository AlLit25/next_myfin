'use client'

import {useEffect} from "react";

export default function Notify({ show, text, setShowDefault }) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                setShowDefault(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [show]);

    if (!show && text.length === 0) return null;

    return (
        <div
            className={`c-modal ${show ? "fade-in" : "fade-out"}`}
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div className="modal-dialog text-center">
                <div className="alert alert-primary pt-3" role="alert">
                    {text}
                </div>
            </div>
        </div>
    );
}