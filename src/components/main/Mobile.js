'use client';

import '../../../public/style/Desctop.css';
import '../../../public/style/Mobile.css';
import BalanceMainPage from "@/app/balance/BalanceMainPage";
import StatisticMainPage from "@/app/statistic/StatisticMainPage";
import IncomeMainPage from "@/app/income/IncomeMainPage";
import ExpenseMainPage from "@/app/expense/ExpenseMainPage";
import Notify from "@/components/Notify";
import { useState, useRef } from "react";

export default function Mobile() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showNotify, setShowNotify] = useState(false);
    const [textNotify, setTextNotify] = useState('');

    const trackRef = useRef(null);
    const startX = useRef(0);
    const currentX = useRef(0);
    const isDragging = useRef(false);

    const totalSlides = 2;

    const handleTouchStart = (e) => {
        startX.current = e.touches[0].clientX;
        currentX.current = startX.current;
        isDragging.current = true;
        if (trackRef.current) {
            trackRef.current.style.transition = 'none';
        }
    };

    const handleTouchMove = (e) => {
        if (!isDragging.current) return;

        currentX.current = e.touches[0].clientX;
        const deltaX = currentX.current - startX.current;
        const translateX = -currentSlide * 50 + (deltaX / window.innerWidth) * 100;

        if (trackRef.current) {
            trackRef.current.style.transform = `translateX(${translateX}%)`;
        }
    };

    const handleTouchEnd = () => {
        if (!isDragging.current) return;

        isDragging.current = false;

        if (trackRef.current) {
            trackRef.current.style.transition = 'transform 0.3s ease-in-out';
        }

        const deltaX = currentX.current - startX.current;
        const threshold = 50;

        let newSlide = currentSlide;

        if (Math.abs(deltaX) > threshold) {
            if (deltaX > 0 && currentSlide > 0) {
                newSlide = currentSlide - 1;
            }
            else if (deltaX < 0 && currentSlide < totalSlides - 1) {
                newSlide = currentSlide + 1;
            }
        }
        setCurrentSlide(newSlide);

        if (trackRef.current) {
            trackRef.current.style.transform = `translateX(-${newSlide * 50}%)`;
        }
    };

    return (
        <div className="row">
            <Notify show={showNotify} text={textNotify} setShowDefault={setShowNotify} />
            <div className="col-12">
                <div className="slider-container">
                    <div className="slider-track d-flex"
                        ref={trackRef}
                        style={{ transform: `translateX(-${currentSlide * 50}%)` }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}>
                        <div className="slide p-3">
                            <div className="d-block-desk" style={{ width: '100%' }}>
                                <BalanceMainPage />
                            </div>
                            <div className="d-block-desk mt-3" style={{ width: '100%' }}>
                                <StatisticMainPage />
                            </div>
                        </div>
                        <div className="slide p-3">
                            <div className="d-block-desk" style={{ width: '100%' }}>
                                <IncomeMainPage setTextNotify={setTextNotify} setShowNotify={setShowNotify} />
                            </div>
                            <div className="d-block-desk mt-3" style={{ width: '100%' }}>
                                <ExpenseMainPage setTextNotify={setTextNotify} setShowNotify={setShowNotify} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="dots">
                    {[0, 1].map((slide) => (
                        <span
                            key={slide}
                            className={`dot ${currentSlide === slide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(slide)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}