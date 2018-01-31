import React from "react";
import PropTypes from "prop-types";
import { Collapse } from "reactstrap";

let typingTimer;

class VariableSection extends React.Component {
    static get defaultProps() {
        return {
            collapseDefaultValue: false
        };
    }

    constructor() {
        super();

        this.state = {
            collapse: false
        };
    }

    componentWillMount() {
        this.setState({ collapse: this.props.collapseDefaultValue });
    }

    render() {
        return (
            <div className="card mb-3">
                <div className="card-body">
                    <a
                        href="javascript:void(0)"
                        onClick={() => this.setState({ collapse: !this.state.collapse })}
                    >
                        <h5>
                            {this.props.sectionByDefault.sectionName}
                        </h5>
                    </a>

                    <Collapse isOpen={this.state.collapse} className="mt-3">
                        {Object.keys(this.props.sectionByDefault.variables).map(key =>
                            this.props.sectionByDefault.variables[key].substring(0, 2) != "()" &&
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
                                        placeholder={this.props.sectionByDefault.variables[key]}
                                        value={this.props.sectionByState.variables[key] || ""}
                                        onChange={event => {
                                            this.props.onChange(event, key);
                                        }}
                                        onKeyUp={() => {
                                            clearTimeout(typingTimer);
                                            typingTimer = setTimeout(() => {
                                                this.props.onPauseTyping();
                                            }, 700);
                                        }}
                                        onKeyDown={() => clearTimeout(typingTimer)}
                                    />
                                </div>
                            </div>
                        )}
                    </Collapse>
                </div>
            </div>
        );
    }
}

VariableSection.propTypes = {
    collapseDefaultValue: PropTypes.bool,
    sectionByDefault: PropTypes.object,
    sectionByState: PropTypes.object,
    onChange: PropTypes.func,
    onPauseTyping: PropTypes.func
};

export default VariableSection;