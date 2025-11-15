import {useState} from "react";
import {getCurrentDay} from "@/lib/DateHelper";

export default function SelectDate() {
    const [dateInfo, setDateInfo] = useState(getCurrentDay());
    const today = new Date().toISOString().split('T')[0];

    return (<div className="mb-1">
            <input type="date"
                   className="form-control i-default"
                   data-date="mainPage"
                   value={dateInfo.from}
                   max={today}
                   onChange={(e) =>
                       setDateInfo({ ...dateInfo, from: e.target.value })}/>
    </div>
    );
}