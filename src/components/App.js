import React from "react";
import { LgkPillComponent } from "lgk";

import VariableSection from "./VariableSection";
import Examples from "./Examples";

// As fallback. Should be overwritten by user's custom style
import "bootstrap/dist/css/bootstrap.css";

const bootstrapDir = require("../data/bootstrap.dir.json");
const bootstrapVariables = require("../data/bootstrap.variables.json");
const bootstrapVersion = require("bootstrap/package.json").version;

const appVersion = require("../../package.json").version;

const Sass = require("../lib/sass");
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
            customStyle: "",
            resultStyle: null,
            compileBusy: false,
            firstCompileBusy: true,
            btVariables: null
        };
    }

    setBtVariablesFromDefault(callback = () => { }) {
        const btVariables = JSON.parse(JSON.stringify(bootstrapVariables));

        btVariables.map(section => {
            section.variables = {};
        });

        this.setState({ btVariables: btVariables }, callback);
    }

    componentWillMount() {
        this.setBtVariablesFromDefault();
    }

    componentDidMount() {
        if (location.hash && location.hash.indexOf("btVariables") > -1) {
            this.compileFromHash();
        }
        else {
            this.compile();
        }
    }

    compileFromHash() {
        this.setState({ compileFromHashBusy: true });
        this.setStateFromHash(() => this.jsVariablesToSass(() => this.compile(() => this.setState({ compileFromHashBusy: false }))));
    }

    compile(callback = this.setHash) {
        const style = this.state.customStyle + bootstrapStyle;
        this.setState({ compileBusy: true });

        sass.compile(style, result => {
            this.setState({ compileBusy: false, firstCompileBusy: false });

            if (result.text) {
                this.setState({ resultStyle: result.text }, callback);
            }
        });
    }

    jsVariablesToSass(callback = () => { }) {
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

        this.setState({ customStyle: this.state.customStyle }, callback);
    }

    setHash() {
        const hashObject = {
            btVariables: this.state.btVariables
        };

        location.hash = encodeURIComponent(JSON.stringify(hashObject));
        window.onhashchange = () => this.compileFromHash();
    }

    setStateFromHash(callback = () => { }) {
        if (location.hash && location.hash.indexOf("btVariables") > -1) {
            const hashObject = JSON.parse(decodeURIComponent(location.hash.replace("#", "")));

            this.setState(hashObject, callback);
        }
    }

    render() {
        return (
            <div style={{ cursor: this.state.compileBusy ? "progress" : "" }}>
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

                    <main className="container-fluid">
                        <div className="row">
                            <div className="col-md-4">
                                {this.state.btVariables.map((section, i) =>
                                    Object.keys(bootstrapVariables[i].variables).length > 0 &&
                                    <VariableSection
                                        key={i}
                                        collapseDefaultValue={i == 1 ? true : false}
                                        sectionByDefault={bootstrapVariables[i]}
                                        sectionByState={section}
                                        onChange={({ target }, key) => {
                                            if (target.value == "") {
                                                delete this.state.btVariables[i].variables[key];
                                            }
                                            else {
                                                this.state.btVariables[i].variables[key] = target.value;
                                            }

                                            this.setState({ btVariables: this.state.btVariables }, this.jsVariablesToSass);
                                        }}
                                        onPauseTyping={() => this.compile()}
                                    />
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

                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        this.setBtVariablesFromDefault(this.compile);
                                    }}
                                >
                                    Reset
                                </button>

                                <Examples />
                            </div>
                        </div>
                    </main>

                    <footer className="container-fluid bg-light text-center py-3">
                        <div style={{ color: "#ffa400", fontSize: "2rem" }}><span className="icon-lgk-filled" /></div>
                        <span className="badge badge-dark">Version {appVersion}</span><br />
                        Made with <span className="icon-heart" /> in Germany by LGK.
                        Checkout my <a href="https://lgk.io/">website</a> or follow me on <a href="https://twitter.com/lgkonline">Twitter</a>.<br />
                        The code is <a href="https://github.com/lgkonline/customize-bootstrap/blob/master/LICENSE">MIT licensed</a>.<br />
                        <a href="https://lgk.io/site/#/contact">Contact</a> <a href="https://lgk.io/site/#/imprint">Imprint</a>
                    </footer>
                </div>


                {this.state.compileBusy &&
                    <div
                        className="progress"
                        style={{
                            position: "fixed",
                            top: "0", left: "0", right: "0",
                            borderRadius: "0",
                            height: "10px"
                        }}
                    >
                        <div className="progress-bar progress-bar-striped bg-success progress-bar-animated w-100" />
                    </div>
                }

                {this.state.firstCompileBusy &&
                    <div
                        className="alert alert-success appear lead"
                        style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            boxShadow: "0 1rem 3rem rgba(0,0,0,.3)"
                        }}
                    >
                        <span className="animation-spin icon-spinner2" />
                        <span>&nbsp;Compiling the stylesheet. Please wait a sec.</span>
                    </div>
                }
            </div>
        );
    }
}

export default App;