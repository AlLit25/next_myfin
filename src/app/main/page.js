
import { isMobile } from 'react-device-detect';
import Mobile from "@/components/main/Mobile";
import Desktop from "@/components/main/Desktop";

export default function MainPage() {

    return (<div>
        <div className="text-center">
            <h1>LiVi Analytic</h1>
        </div>
        { isMobile ? <Mobile /> : <Desktop /> }
    </div>);
}