import NavButton from "@/components/NavButton";

export default function MainMenu() {
    return (
        <div className="d-block">
            <NavButton href={"/income"} color={'primary'} text={'Дохід'}/>
            <NavButton href={"/expense"} color={'primary'} text={'Витрати'}/>
            <NavButton href={"/statistic"} color={'primary'} text={'Статистика'}/>
            {/*<NavButton href={"/balance"} color={'primary'} text={'Баланс'}/>*/}
        </div>
    );
}