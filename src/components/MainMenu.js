import NavButton from "@/components/NavButton";

export default function MainMenu() {
    return (
        <div className="d-block">
            <NavButton href={"/income"} color={'primary'} text={'Дохід'}/>
            <NavButton href={"/expense"} color={'primary'} text={'Витрати'}/>
            <NavButton href={"/statistic"} color={'primary'} text={'Звіт'}/>
            <NavButton href={"/balance"} color={'primary'} text={'Баланс'}/>

            <div>
                <ul>
                    <li>Відображення головної інформації на головному екрані</li>
                </ul>
            </div>
        </div>
    );
}