import React from "react";
import { LgkPillComponent } from "lgk";

import Loading from "./Loading";

const bootstrapDir = require("./bootstrap.json");
const bootstrapVersion = require("bootstrap/package.json").version;

const Sass = require("./sass");
Sass.setWorkerUrl("sass.worker.js");

const sass = new Sass();

const bootstrapStyle = require("bootstrap/scss/bootstrap.scss").toString();

function loopDir(dir) {
    dir.children.map(child => {

        if (child.children) {
            loopDir(child);
        }
        else {
            if (child.name[0] == "_") {
                const path = child.path.replace(/\\/g, "/");

                sass.writeFile(path, require("bootstrap/scss/" + path).toString());
            }
        }
    });
}

loopDir(bootstrapDir);

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            customStyle: `$primary: blue !default;`,
            resultStyle: null,
            compileBusy: false
        };
    }

    componentDidMount() {
        this.compile();
    }

    compile() {
        const style = this.state.customStyle + bootstrapStyle;
        this.setState({ compileBusy: true });

        sass.compile(style, result => {
            this.setState({ compileBusy: false });

            // console.log(result);

            if (result.text) {
                this.setState({ resultStyle: result.text });
            }
        });
    }

    render() {
        return (
            <div>
                {this.state.resultStyle ?
                    <div className="appear">
                        <style
                            type="text/css"
                            dangerouslySetInnerHTML={{
                                __html: `
                                    .appear {
                                        animation: appear .5s;
                                    }
                                    
                                    @keyframes appear {
                                        from {
                                            opacity: 0;
                                        }
                                        to {
                                            opacity: 1;
                                        }
                                    }
                                    
                                    ${this.state.resultStyle}
                                `
                            }}
                        />

                        <LgkPillComponent black />

                        <div className="jumbotron jumbotron-fluid bg-primary text-white">
                            <div className="container">
                                <h1 className="display-4">Customize Bootstrap</h1>

                                <p className="lead">
                                    Optimized for Bootstrap version {bootstrapVersion}
                                </p>
                            </div>
                        </div>

                        <div className="container">
                            <div className="form-group">
                                <textarea
                                    className="form-control"
                                    value={this.state.customStyle}
                                    onChange={({ target }) => {
                                        this.setState({ customStyle: target.value }, () => {
                                            if (!this.state.compileBusy) {
                                                this.compile();
                                            }
                                        });
                                    }}
                                    style={{ minHeight: "200px" }}
                                    spellCheck={false}
                                />
                            </div>

                            <button className="btn btn-primary btn-lg" onClick={() => this.compile()}>Compile manually</button>
                        </div>
                    </div>
                    :
                    <Loading />
                }
            </div>
        );
    }
}

export default App;