import React from "react";
import { LgkPillComponent } from "lgk";
import ClipboardButton from "react-clipboard.js";

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
            outputStyle: "",
            resultStyle: null,
            compileBusy: false,
            firstCompileBusy: true,
            btVariables: null,
            activeTab: 0,
            search: "",
            customStyle: ""
        };
    }

    setBtVariablesFromDefault(callback = () => { }) {
        const btVariables = JSON.parse(JSON.stringify(bootstrapVariables));

        Object.keys(btVariables).map(i => {
            btVariables[i].variables = {};
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
        const style = this.state.outputStyle + bootstrapStyle;
        this.setState({ compileBusy: true });

        sass.compile(style, result => {
            this.setState({ compileBusy: false, firstCompileBusy: false });

            if (result.text) {
                this.setState({ resultStyle: result.text }, callback);
            }
        });
    }

    jsVariablesToSass(callback = () => { }) {
        this.state.outputStyle = "";

        Object.keys(this.state.btVariables).map(i => {
            const section = this.state.btVariables[i];

            if (Object.keys(section.variables).length > 0) {
                this.state.outputStyle += `// ${section.sectionName}\n//\n\n`;

                Object.keys(section.variables).map(key => {
                    this.state.outputStyle += key + ": " + section.variables[key] + ";\n";
                });

                this.state.outputStyle += "\n\n";
            }
        });

        this.state.outputStyle = this.state.customStyle + "\n\n" + this.state.outputStyle;

        if (this.state.outputStyle != "") {
            this.state.outputStyle = `// Open the following link to edit this config on Customize Bootstrap\n// ${location.href}\n\n` + this.state.outputStyle;
        }

        this.setState({ outputStyle: this.state.outputStyle }, callback);
    }

    setHash() {
        let btVariables = {};

        // Only put variables to hash that changed, so the URL doesn't get to long
        Object.keys(this.state.btVariables).map(i => {
            const section = this.state.btVariables[i];

            if (Object.keys(section.variables).length > 0) {
                btVariables[i] = section;
            }
        });

        const hashObject = {
            btVariables: btVariables,
            activeTab: this.state.activeTab,
            customStyle: this.state.customStyle
        };

        location.hash = encodeURIComponent(JSON.stringify(hashObject));
        window.onhashchange = () => this.compileFromHash();
    }

    setStateFromHash(callback = () => { }) {
        if (location.hash && location.hash.indexOf("btVariables") > -1) {
            const hashObject = JSON.parse(decodeURIComponent(location.hash.replace("#", "")));

            // Combine values from hash with current state
            hashObject.btVariables = Object.assign(this.state.btVariables, hashObject.btVariables);

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
                                <div className="input-group mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={this.state.search}
                                        onChange={({ target }) => this.setState({ search: target.value })}
                                        placeholder="Search..."
                                    />

                                    {this.state.search != "" &&
                                        <div className="input-group-append">
                                            <button className="btn btn-outline-secondary" onClick={() => this.setState({ search: "" })}>
                                                <span className="icon-cross" />
                                            </button>
                                        </div>
                                    }
                                </div>

                                {Object.keys(this.state.btVariables).map((i, j) =>
                                    Object.keys(bootstrapVariables[i].variables).length > 0 &&
                                    <VariableSection
                                        key={i}
                                        collapseDefaultValue={j == 1 ? true : false}
                                        sectionByDefault={bootstrapVariables[i]}
                                        sectionByState={this.state.btVariables[i]}
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
                                        search={this.state.search}
                                    />
                                )}
                            </div>

                            <div className="col-md-8">
                                <div className="form-group">
                                    <textarea
                                        className="form-control"
                                        value={this.state.customStyle}
                                        onChange={({ target }) => this.setState({ customStyle: target.value }, this.setHash)}
                                        placeholder="Here you can insert custom CSS, for example to import a webfont."
                                        spellCheck={false}
                                    />
                                </div>

                                <div className="form-group">
                                    <textarea
                                        className="form-control"
                                        value={this.state.outputStyle}
                                        readOnly
                                        disabled
                                        placeholder="No compiled stylesheet yet. Change some variables and see what will happen."
                                        style={{ minHeight: "200px", wordWrap: "inherit" }}
                                        spellCheck={false}
                                    />
                                </div>

                                <button
                                    className="btn btn-secondary mr-3"
                                    onClick={() => {
                                        this.setBtVariablesFromDefault(this.compile);
                                    }}
                                >
                                    <span className="icon-undo2" /> Reset
                                </button>

                                <ClipboardButton
                                    className={"btn mr-3 btn-" + (this.state.copyConfigSuccess ? "success" : "secondary")}
                                    data-clipboard-text={location.href}
                                    onSuccess={() => this.setState({ copyConfigSuccess: true }, () => {
                                        setTimeout(() => this.setState({ copyConfigSuccess: false }), 3000);
                                    })}
                                >
                                    {this.state.copyConfigSuccess ?
                                        <span><span className="icon-checkmark" /> Nice, you copied the URL. Now you can share it.</span>
                                        :
                                        <span><span className="icon-share" /> Share this config</span>
                                    }

                                </ClipboardButton>

                                <ClipboardButton
                                    className={"btn btn-" + (this.state.copyCodeSuccess ? "success" : "secondary")}
                                    data-clipboard-text={this.state.outputStyle}
                                    onSuccess={() => this.setState({ copyCodeSuccess: true }, () => {
                                        setTimeout(() => this.setState({ copyCodeSuccess: false }), 3000);
                                    })}
                                >
                                    {this.state.copyCodeSuccess ?
                                        <span><span className="icon-checkmark" /> Nice, you copied the code. Have fun with it.</span>
                                        :
                                        <span><span className="icon-copy" /> Copy the code</span>
                                    }

                                </ClipboardButton>

                                <Examples
                                    activeTab={this.state.activeTab}
                                    onClick={(i) => this.setState({ activeTab: i }, this.setHash)}
                                />
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