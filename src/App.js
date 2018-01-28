import React from "react";
import { LgkPillComponent } from "lgk";

const bootstrapStyle = require("bootstrap/scss/bootstrap.scss");
const variablesStyle = require("bootstrap/scss/_variables.scss");

console.log(variablesStyle);

document.getElementById("style").innerHTML = bootstrapStyle.toString();

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