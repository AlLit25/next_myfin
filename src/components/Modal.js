import React, { useEffect, useRef, useState } from 'react';
import '../../public/style/Modal.css';

export default function Modal({ isOpen, onClose, title, children }) {
    const modalRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [editBtnShow, setEditBtnShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 50);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isVisible && isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isVisible, isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    function editAction() {
        const state = !editBtnShow;
        console.log(state);
        setEditBtnShow(state);
    }

    return (
        <div className={`custom-modal-overlay ${isVisible ? 'show' : ''}`}>
            <div className="custom-modal" ref={modalRef}>
                {title && (
                    <div className="custom-modal-header">
                        <h5 className="">
                            {title} <img src="/icons/edit.svg" alt="Редагувати"
                            width="24" height="24" className="edit-btn" onClick={editAction}
                            style={{ marginLeft: '8px', verticalAlign: 'middle' }}/>
                        </h5>
                        <button
                            className="custom-modal-close-btn"
                            onClick={() => setIsVisible(false)}
                            aria-label="Close"
                        >
                            <svg
                                width="24"
                                height="24"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                )}
                <div className="custom-modal-body">{children}</div>
                <div className="custom-modal-footer">
                    <button className={`btn btn-success fade ${editBtnShow ? 'show' : ''}`}>Зберегти</button>
                </div>
            </div>
        </div>
    );
};
