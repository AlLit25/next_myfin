import NavButton from '../components/NavButton'

export default function Home() {
  // const BASE_PATH = process.env.NODE_ENV === 'production' ? '/next_myfin' : '';

  return (
    <div>
        <div className="mt-3 text-center">
            <h1>МАФІН</h1>
        </div>
        <div className="d-block">
            <NavButton href={"/income"} color={'primary'} text={'Дохід'} />
            <NavButton href={"/expense"} color={'primary'} text={'Витрати'} />
            <NavButton href={"/statistic"} color={'primary'} text={'Статистика'} />
            <NavButton href={"/balance"} color={'primary'} text={'Баланс'} />
        </div>
    </div>
  );
}
