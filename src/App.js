import React from "react";
import { LgkPillComponent } from "lgk";

import LoadingScreen from "./LoadingScreen";
import Album from "./examples/Album";

const bootstrapDir = require("./bootstrap.dir.json");
const bootstrapVariables = require("./bootstrap.variables.json");
const bootstrapVersion = require("bootstrap/package.json").version;

const Sass = require("./sass");
Sass.setWorkerUrl("sass.worker.js");

const sass = new Sass();

const bootstrapStyle = require("bootstrap/scss/bootstrap.scss").toString();

let typingTimer;

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

        const btVariables = JSON.parse(JSON.stringify(bootstrapVariables));

        btVariables.map(section => {
            section.variables = {};
        });

        this.state = {
            customStyle: "",
            resultStyle: null,
            compileBusy: false,
            btVariables: btVariables
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

    jsVariablesToSass() {
        this.state.customStyle = "";

        this.state.btVariables.map(section => {
            if (Object.keys(section.variables).length > 0) {
                this.state.customStyle += `// ${section.sectionName}\n//\n\n`;

                Object.keys(section.variables).map(key => {
                    this.state.customStyle += key + ": " + section.variables[key] + ";\n";
                });

                this.state.customStyle += "\n\n";
            }
        });

        this.setState({ customStyle: this.state.customStyle });
    }

    render() {
        return (
            <div style={{ cursor: this.state.compileBusy ? "progress" : "" }}>
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
                            <div className="container text-center">
                                <h1 className="display-3">Customize Bootstrap</h1>

                                <p className="lead">
                                    Optimized for Bootstrap version {bootstrapVersion}
                                </p>
                            </div>
                        </div>

                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-4">
                                    {this.state.btVariables.map((section, i) =>
                                        Object.keys(bootstrapVariables[i].variables).length > 0 &&
                                        <div key={i} className="card mb-3">
                                            <div className="card-body">
                                                <h5 className="card-title">{section.sectionName}</h5>

                                                {Object.keys(bootstrapVariables[i].variables).map(key =>
                                                    <div key={key} className="form-group row">
                                                        <label
                                                            htmlFor={"var-" + key}
                                                            className="col-sm-4 col-form-label"
                                                        >
                                                            {key}
                                                        </label>

                                                        <div className="col-sm-8">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id={"var-" + key}
                                                                placeholder={bootstrapVariables[i].variables[key]}
                                                                value={this.state.btVariables[i].variables[key] || ""}
                                                                onChange={({ target }) => {

                                                                    if (target.value == "") {
                                                                        delete this.state.btVariables[i].variables[key];
                                                                    }
                                                                    else {
                                                                        this.state.btVariables[i].variables[key] = target.value;
                                                                    }

                                                                    this.setState({ btVariables: this.state.btVariables }, this.jsVariablesToSass);
                                                                }}
                                                                onKeyUp={() => {
                                                                    clearTimeout(typingTimer);
                                                                    typingTimer = setTimeout(() => {
                                                                        this.compile();
                                                                    }, 1000);
                                                                }}
                                                                onKeyDown={() => clearTimeout(typingTimer)}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="col-md-8">
                                    <div className="form-group">
                                        <textarea
                                            className="form-control"
                                            value={this.state.customStyle}
                                            readOnly
                                            disabled
                                            placeholder="No compiled stylesheet yet. Change some variables and see what will happen."
                                            style={{ minHeight: "200px" }}
                                            spellCheck={false}
                                        />
                                    </div>

                                    <button className="btn btn-primary btn-lg" onClick={() => this.compile()}>Compile manually</button>

                                    {this.state.compileBusy &&
                                        <h4 className="mx-3 text-primary d-inline-block">
                                            <span className="animation-spin icon-spinner2" />
                                        </h4>
                                    }

                                    <h1 className="display-4 mt-4 mb-3">Examples</h1>

                                    <Album />
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <LoadingScreen />
                }
            </div>
        );
    }
}

export default App;