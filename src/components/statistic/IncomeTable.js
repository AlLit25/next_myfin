import React, {useEffect, useRef, useState} from "react";
import {getTotalSum} from "@/lib/BaseHelper";
import {editSum} from "@/lib/DbHelper";

export default function IncomeTable({data}) {
    const [editBtnShow, setEditBtnShow] = useState(false);
    const [editedItems, setEditedItems] = useState(data);
    const originalItemsRef = useRef([]);

    useEffect(() => {
        if (editBtnShow) {
            setEditedItems(data.map(item => ({ ...item })));
        }
    }, [editBtnShow, data]);

    useEffect(() => {
        if (editBtnShow && data.length > 0) {
            originalItemsRef.current = JSON.parse(JSON.stringify(data)); // Глибока копія оригіналу
            setEditedItems(data.map(item => ({ ...item })));
        }
    }, [editBtnShow, data]);

    useEffect(() => {
        data = editBtnShow ? editedItems : data;
    }, [editBtnShow, editedItems, data]);

    if (data.length > 0) {
        const totalSum = getTotalSum(data);

        return (
            <div>
                <div className="alert alert-success" role="alert">
                    Дохід <i>{totalSum}</i> UAH
                    <img src="/icons/edit.svg" alt="Редагувати" width="24" height="24"
                         className="edit-btn" onClick={editAction}
                         style={{ marginLeft: '8px', verticalAlign: 'middle' }}/>
                    <button className={`m-2 btn btn-success fade ${editBtnShow ? 'show' : ''}`}
                            onClick={handleSave} disabled={!editBtnShow}>
                        Зберегти
                    </button>
                </div>

                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>Сума</th>
                        <th>Дата</th>
                    </tr>
                    </thead>
                    <tbody>
                    {editedItems.map((item) => (
                        <tr key={item.id}>
                            <td className="td-w-250 m-2">
                                {editBtnShow ? (
                                    <input
                                        className="i-w"
                                        type="number"
                                        value={item.sum}
                                        onChange={(e) => updateSum(item.id, e.target.value)}
                                    />
                                ) : (
                                    item.sum
                                )}
                            </td>
                            <td>{new Date(item.created_at).toLocaleDateString('uk-UA')}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    } else {
        return (
            <div className="alert alert-info" role="alert">
                Дані відсутні
            </div>
        );
    }

    function editAction() {
        const state = !editBtnShow;
        setEditBtnShow(state);
    }

    function updateSum(id, newSum) {
        const numSum = parseFloat(newSum) || 0;

        setEditedItems(prev => prev.map(item =>
                item.id === id
                    ? { ...item, sum: numSum }
                    : item
        ));
    }

    async function handleSave() {
        const hasChanges = JSON.stringify(editedItems) !== JSON.stringify(originalItemsRef.current);

        if (!hasChanges) {
            setEditBtnShow(false);
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
        } else {
            setEditBtnShow(false);
        }
    }
}