import {isMobile} from "react-device-detect";
import Mobile from "@/components/main/Mobile";
import Desktop from "@/components/main/Desktop";

export default function MainMenu() {
    return (isMobile ? <div className="static"><Mobile /></div> : <div><Desktop /></div> );
}