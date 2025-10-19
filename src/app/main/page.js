"use client"

import { isMobile } from 'react-device-detect';
import Mobile from "@/components/main/Mobile";
import Desktop from "@/components/main/Desktop";

export default function MainPage() {
    return (
        <div>
            { isMobile ? <Mobile /> : <Desktop /> }
        </div>
    );
}