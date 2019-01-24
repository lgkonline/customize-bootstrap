import React from "react";

const btnStrokes = ["", "-outline"];
const bgTypes = ["primary", "secondary", "success", "info", "warning", "danger", "light", "dark"];

class CommonComponents extends React.Component {
    render() {
        return (
            <div>
                <section>
                    <h1 className="mt-4 mb-3">Buttons</h1>

                    {btnStrokes.map((btnStroke, i) =>
                        <div key={i} className="mb-3">
                            {bgTypes.map((bgType, j) =>
                                <button
                                    key={i + "-" + j}
                                    className={`btn btn${btnStroke}-${bgType} mr-1`}
                                >
                                    {bgType}
                                </button>
                            )}
                        </div>
                    )}
                </section>

                <div className="row">
                    <div className="col-md-6">
                        <section>
                            <h1 className="mt-4 mb-3">Alerts</h1>

                            {bgTypes.map((bgType, i) =>
                                <div
                                    key={i}
                                    className={`alert alert-${bgType} mb-3`}
                                >
                                    A simple primary alert with <a href="#" className="alert-link">an example link</a>. Give it a click if you like. ({bgType})
                            </div>
                            )}
                        </section>
                    </div>

                    <div className="col-md-6">
                        <section>
                            <h1 className="mt-4 mb-3">Cards</h1>

                            {bgTypes.map((bgType, i) =>
                                <div
                                    key={i}
                                    className={`card ${bgType !== "light" ? "text-white" : ""} bg-${bgType} mb-3`}
                                >
                                    <div className="card-header">Header</div>
                                    <div className="card-body">
                                        <h5 className="card-title">Card title {bgType}</h5>
                                        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        );
    }
}

export default CommonComponents;