import React from "react";
import { LgkPillComponent } from "lgk";

const Sass = require("./sass");
Sass.setWorkerUrl("sass.worker.js");

const sass = new Sass();

const style = `
$bgcolor: #ccc;

body { background-color: $bgcolor; }
`;

sass.compile(style, result => {
    console.log(result);

    document.getElementById("style").innerHTML = result.text;
});

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