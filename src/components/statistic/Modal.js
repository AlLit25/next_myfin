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
                            <span onClick={editAction} className="edit-btn">
                                <svg width="24px" height="24px" viewBox="0 0 24 24"
                                     fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 4H7.2C6.0799 4 5.51984 4 5.09202 4.21799C4.71569 4.40974 4.40973 4.7157 4.21799 5.09202C4 5.51985 4 6.0799 4 7.2V16.8C4 17.9201 4 18.4802 4.21799 18.908C4.40973 19.2843 4.71569 19.5903 5.09202 19.782C5.51984 20 6.0799 20 7.2 20H16.8C17.9201 20 18.4802 20 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V12.5M15.5 5.5L18.3284 8.32843M10.7627 10.2373L17.411 3.58902C18.192 2.80797 19.4584 2.80797 20.2394 3.58902C21.0205 4.37007 21.0205 5.6364 20.2394 6.41745L13.3774 13.2794C12.6158 14.0411 12.235 14.4219 11.8012 14.7247C11.4162 14.9936 11.0009 15.2162 10.564 15.3882C10.0717 15.582 9.54378 15.6885 8.48793 15.9016L8 16L8.04745 15.6678C8.21536 14.4925 8.29932 13.9048 8.49029 13.3561C8.65975 12.8692 8.89125 12.4063 9.17906 11.9786C9.50341 11.4966 9.92319 11.0768 10.7627 10.2373Z"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                </svg>
                            </span>
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
                                        <span onClick={() => deleteItem(item.id)}
                                              className="delete-btn">
                                            <svg width="24px"
                                                 height="24px"
                                                 viewBox="0 0 24 24"
                                                 fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10.0303 8.96965C9.73741 8.67676 9.26253 8.67676 8.96964 8.96965C8.67675 9.26255 8.67675 9.73742 8.96964 10.0303L10.9393 12L8.96966 13.9697C8.67677 14.2625 8.67677 14.7374 8.96966 15.0303C9.26255 15.3232 9.73743 15.3232 10.0303 15.0303L12 13.0607L13.9696 15.0303C14.2625 15.3232 14.7374 15.3232 15.0303 15.0303C15.3232 14.7374 15.3232 14.2625 15.0303 13.9696L13.0606 12L15.0303 10.0303C15.3232 9.73744 15.3232 9.26257 15.0303 8.96968C14.7374 8.67678 14.2625 8.67678 13.9696 8.96968L12 10.9393L10.0303 8.96965Z"
                                                      stroke="currentColor"
                                                      fill="#1C274C"/>
                                                <path fillRule="evenodd"
                                                  clipRule="evenodd"
                                                      d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z"
                                                      stroke="currentColor"
                                                      fill="#1C274C"/>
                                            </svg>
                                        </span>
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


