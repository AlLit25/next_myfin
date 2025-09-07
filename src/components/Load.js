export default function Load({header = true}) {
    return (
        <div className="container">
            { header ? (
                <div className="m-5 text-center">
                    <p className="h1">LiVi Analytics</p>
                </div>
            ) : '' }
            <div className="text-center">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden"></span>
                </div>
                <h3>Завантаження...</h3>
            </div>
        </div>

    );
}