import React from "react";
import PropTypes from "prop-types";
import { SketchPicker } from "react-color";

import TextFieldWithTimer from "./TextFieldWithTimer";
import DollarBtn from "./DollarBtn";

const bootstrapTypes = require("../data/bootstrap.types.json");

// let typingTimer;

class Variable extends React.Component {
    constructor() {
        super();

        this.state = {
            showColorPicker: false
        };
    }

    render() {
        return (
            <div className="form-group row">
                <label
                    htmlFor={"var-" + this.props.varKey}
                    className="col-sm-4 col-form-label"
                >
                    {this.props.varKey}
                </label>

                <div className="col-sm-8">
                    <div className="input-group">
                        <DollarBtn
                            varByState={this.props.sectionByState[this.props.varKey]}
                            varByDefault={this.props.sectionByDefault[this.props.varKey]}
                        />

                        <TextFieldWithTimer
                            type="text"
                            className="form-control"
                            id={"var-" + this.props.varKey}
                            placeholder={this.props.sectionByDefault[this.props.varKey]}
                            onDoubleClick={() => {
                                if (!this.props.sectionByState[this.props.varKey]) {
                                    this.props.onChange(this.props.sectionByDefault[this.props.varKey].replace(" !default", ""), this.props.varKey);
                                }
                            }}
                            title={(!this.props.sectionByState[this.props.varKey]) ? "Hint: double click to take the default value" : ""}
                            value={this.props.sectionByState[this.props.varKey] || ""}
                            onChange={value => {
                                this.props.onChange(value, this.props.varKey);
                            }}
                        />

                        {bootstrapTypes.color.indexOf(this.props.varKey) > -1 &&
                            <div className="input-group-append">
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => this.setState({ showColorPicker: !this.state.showColorPicker })}
                                >
                                    <span className={this.state.showColorPicker ? "icon-cross" : "icon-droplet"} />
                                </button>
                            </div>
                        }

                        {bootstrapTypes.boolean.indexOf(this.props.varKey) > -1 &&
                            <div className="input-group-append">
                                <div className="input-group-text pr-1">

                                    <div className="custom-control custom-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={this.props.sectionByState[this.props.varKey] ? this.props.sectionByState[this.props.varKey].indexOf("true") > -1 : this.props.sectionByDefault[this.props.varKey].indexOf("true") > -1}
                                            onChange={() => {
                                                const value = (this.props.sectionByState[this.props.varKey] ? this.props.sectionByState[this.props.varKey].indexOf("true") > -1 : this.props.sectionByDefault[this.props.varKey].indexOf("true") > -1) ? "false" : "true";
                                                this.props.onChange(value, this.props.varKey);
                                            }}
                                            className="custom-control-input"
                                            id={"checkbox-" + this.props.varKey}
                                        />
                                        <label className="custom-control-label" htmlFor={"checkbox-" + this.props.varKey} />
                                    </div>

                                </div>
                            </div>
                        }
                    </div>
                </div>

                {this.state.showColorPicker &&
                    <div className="offset-sm-4 col-sm-8">
                        <SketchPicker
                            color={this.props.sectionByState[this.props.varKey] || ""}
                            onChangeComplete={color => {
                                this.props.onChange(color.hex, this.props.varKey);
                            }}
                        />

                        <a href="https://colorganize.com" target="_blank" className="btn btn-light mt-2">
                            <img src={require("../images/colorganize.png")} className="d-inline-block" style={{ marginTop: "-4px" }} />
                            &nbsp;Choose color from Colorganize
                    </a>
                    </div>
                }
            </div>
        );
    }
}

Variable.propTypes = {
    onChange: PropTypes.func,
    varKey: PropTypes.string
};

export default Variable;