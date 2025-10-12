import React, { useEffect, useRef, useState } from 'react';
import '../../../public/style/Modal.css';
import {category} from "@/lib/supabase";
import {deleteData, editSum} from "@/lib/DbHelper";
import {getHomePath} from "@/lib/DbHelper";

export default function Modal({ isOpen, onClose, selectedDate, selectedItems }) {
    const baseLink = getHomePath();
    const modalRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [editBtnShow, setEditBtnShow] = useState(false);
    const [delElem, setDelElem] = useState(false);
    const [editedItems, setEditedItems] = useState([]);
    const originalItemsRef = useRef([]);

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

    useEffect(() => {
        if (editBtnShow) {
            setEditedItems(selectedItems.map(item => ({ ...item })));
        }
    }, [editBtnShow, selectedItems]);

    useEffect(() => {
        if (editBtnShow && selectedItems.length > 0) {
            originalItemsRef.current = JSON.parse(JSON.stringify(selectedItems));
            setEditedItems(selectedItems.map(item => ({ ...item })));
        }
    }, [editBtnShow, selectedItems]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className={`custom-modal-overlay ${isVisible ? 'show' : ''}`}>
            <div className="custom-modal" ref={modalRef}>
                {(
                    <div className="custom-modal-header">
                        <h5 className="">
                            {`Деталі витрат за ${selectedDate ? new Date(selectedDate).toLocaleDateString('uk-UA') : ''}`}
                            <img src={baseLink+"icons/edit.svg"} alt="Редагувати"
                                 width="24" height="24" className="edit-btn" onClick={editAction}
                                 style={{ marginLeft: '8px', verticalAlign: 'middle' }}/>
                        </h5>
                        <button className="custom-modal-close-btn" aria-label="Close"
                                onClick={closeModal}>
                            <svg width="24" height="24" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                )}
                <div className="custom-modal-body">
                    {selectedDate && selectedItems.length > 0 ? (
                        <ul>
                            {(editBtnShow ? editedItems : selectedItems).map(item => (
                                <li key={item.id}>
                                    {editBtnShow
                                        ? (<input className="i-w" type="number" value={item.sum}
                                            onChange={(e) =>
                                                updateSum(item.id, e.target.value)}/>)
                                        : (item.sum)
                                    }
                                    {' UAH - '}{category[item.category]}

                                    {item.comment && (
                                        <span>{' (' + item.comment + ')'}</span>
                                    )}
                                    {editBtnShow && (
                                        <img
                                            src={baseLink+"icons/delete.svg"}
                                            alt="Видалити"
                                            width="24"
                                            height="24"
                                            className="delete-btn"
                                            onClick={() => deleteItem(item.id)}
                                            style={{ marginLeft: '8px', verticalAlign: 'middle', cursor: 'pointer' }}
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Немає витрат за цей день.</p>
                    )}
                </div>
                <div className="custom-modal-footer">
                    <button
                        className={`btn btn-success fade ${editBtnShow ? 'show' : ''}`}
                        onClick={handleSave}
                        disabled={!editBtnShow}>
                        Зберегти
                    </button>
                </div>
            </div>
        </div>
    );

    function closeModal() {
        setIsVisible(false);
        setEditBtnShow(false);

        if (delElem) {
            location.reload();
        }
    }

    function editAction() {
        const state = !editBtnShow;
        setEditBtnShow(state);
        if (delElem) {
            location.reload();
        }
    }

    function updateSum(id, newSum) {
        const numSum = parseFloat(newSum) || 0;
        setEditedItems(prev => prev.map(item =>
            item.id === id ? { ...item, sum: numSum } : item
        ));
    }

    function deleteItem(id) {
        deleteData(id).then(() => {
            setEditedItems(prev => prev.filter(item => item.id !== id));
            setDelElem(true);
        });
    }

    async function handleSave() {
        if (!editBtnShow) {
            setIsVisible(false);
            return;
        }

        const hasChanges = JSON.stringify(editedItems) !== JSON.stringify(originalItemsRef.current);

        if (!hasChanges) {
            setEditBtnShow(false);
            setIsVisible(false);
            return;
        }

        setEditBtnShow(false);

        const updatePromises = [];

        editedItems.forEach((itemNew) => {
            const itemOld = originalItemsRef.current.find(item => item.id === itemNew.id);

            if (itemOld && itemNew.sum !== itemOld.sum) {
                updatePromises.push(editSum(itemOld.id, itemNew.sum));
            }
        });

        if (updatePromises.length > 0) {
            try {
                await Promise.all(updatePromises);
                originalItemsRef.current = [...editedItems];
                location.reload();

            } catch (error) {
                console.error('Помилка під час оновлення даних:', error);
            }
        }
        else if (delElem) {
            location.reload();
        }
        else {
            setEditBtnShow(false);
            setIsVisible(false);
        }
    }
};


