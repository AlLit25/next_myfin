import NavButton from "@/components/NavButton";

export default function Income() {
    return (
        <div>
            <div className="mt-3 text-center">
                <h1>Дохід</h1>
            </div>
            <div className="d-block">
                <NavButton href={"/"} color={'secondary'} text={'На головну'} />
            </div>
        </div>
    );
}
