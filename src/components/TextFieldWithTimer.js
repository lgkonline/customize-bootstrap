import React, { Component } from 'react';
import PropTypes from "prop-types";

const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;

class TextFieldWithTimer extends Component {
    constructor(props) {
        super();

        this.state = {
            value: ""
        };
    }

    static get defaultProps() {
        return {
            type: "text"
        };
    }

    componentWillMount() {
        this.timer = null;

        if (this.props.value) {
            this.setState({ value: this.props.value });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.value != this.props.value) {
            this.componentWillMount();
        }
    }

    handleChange(value) {
        clearTimeout(this.timer);

        this.setState({ value });

        this.timer = setTimeout(() => this.triggerChange(), WAIT_INTERVAL);
    }

    handleKeyDown(e) {
        if (e.keyCode === ENTER_KEY) {
            this.triggerChange();
        }
    }

    triggerChange() {
        const { value } = this.state;

        this.props.onChange(value);
    }

    render() {
        let props = {};

        Object.keys(this.props).map(propName => {
            if (propName != "inputGroupPrepend" && propName != "type") {
                props[propName] = this.props[propName];
            }
        });

        let inputEl;

        if (this.props.type == "text") {
            inputEl = (
                <input
                    {...props}
                    type="text"
                    value={this.state.value}
                    onChange={(event) => this.handleChange(event.target.value)}
                    onKeyDown={(event) => this.handleKeyDown(event)}
                />
            );
        }
        else if (this.props.type == "textarea") {
            inputEl = (
                <textarea
                    {...props}
                    value={this.state.value}
                    onChange={(event) => this.handleChange(event.target.value)}
                    onKeyDown={(event) => this.handleKeyDown(event)}
                />
            );
        }

        if (this.props.inputGroupPrepend) {
            return (
                <div className="input-group">
                    <div className="input-group-prepend">
                        {this.props.inputGroupPrepend}
                    </div>
                    {inputEl}
                </div>
            );
        }
        else {
            return inputEl;
        }
    }
}

TextFieldWithTimer.propTypes = {
    inputGroupPrepend: PropTypes.any,
    type: PropTypes.string
};

export default TextFieldWithTimer;