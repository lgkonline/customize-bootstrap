import React from "react";
import PropTypes from "prop-types";
import { SketchPicker } from "react-color";

const bootstrapTypes = require("../data/bootstrap.types.json");

let typingTimer;

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
                        <input
                            type="text"
                            className="form-control"
                            id={"var-" + this.props.varKey}
                            placeholder={this.props.sectionByDefault.variables[this.props.varKey]}
                            value={this.props.sectionByState.variables[this.props.varKey] || ""}
                            onChange={event => {
                                this.props.onChange(event, this.props.varKey);
                            }}
                            onKeyUp={() => {
                                clearTimeout(typingTimer);
                                typingTimer = setTimeout(() => {
                                    this.props.onPauseTyping();
                                }, 700);
                            }}
                            onKeyDown={() => clearTimeout(typingTimer)}
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
                    </div>
                </div>

                {this.state.showColorPicker &&
                    <div className="offset-sm-4 col-sm-8">
                        <SketchPicker
                            color={this.props.sectionByState.variables[this.props.varKey] || ""}
                            onChangeComplete={color => {
                                const event = {
                                    target: {
                                        value: color.hex
                                    }
                                };
                                this.props.onChange(event, this.props.varKey);
                                this.props.onPauseTyping();
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