import React from "react";
import { LgkPillComponent } from "lgk";

class App extends React.Component {
    render() {
        return (
            <div>
                <LgkPillComponent black />

                <div className="jumbotron jumbotron-fluid bg-primary">
                    <div className="container">
                        <h1 className="display-4">Customize Bootstrap</h1>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;