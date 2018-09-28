import React from "react";
import PropTypes from "prop-types";
import { Collapse } from "reactstrap";

import Variable from "./Variable";

class VariableSection extends React.Component {
    static get defaultProps() {
        return {
            collapseDefaultValue: false
        };
    }

    constructor() {
        super();

        this.state = {
            collapse: false,
            childrenCount: 0
        };
    }

    componentWillMount() {
        this.setState({ collapse: this.props.collapseDefaultValue });
    }

    childrenCountUp() {
        this.setState({
            childrenCount: this.state.childrenCount + 1
        });
    }

    render() {
        const children = [];

        {
            Object.keys(this.props.sectionByDefault).map(key =>
                this.props.sectionByDefault[key].substring(0, 2) != "()" &&
                (this.props.search == "" || key.indexOf(this.props.search) > -1) &&
                children.push(<Variable
                    key={key}
                    {...this.props}
                    varKey={key}
                />)
            )
        }

        return (
            children.length > 0 && <div className="card mb-3">
                <div className="card-body">
                    <a
                        href="javascript:void(0)"
                        onClick={() => this.setState({ collapse: !this.state.collapse })}
                    >
                        <h5>
                            {this.props.sectionName}
                        </h5>
                    </a>

                    <Collapse isOpen={this.state.collapse || this.props.search != ""} className="mt-3">
                        {children}
                    </Collapse>
                </div>
            </div>
        );
    }
}

VariableSection.propTypes = {
    collapseDefaultValue: PropTypes.bool,
    sectionName: PropTypes.string,
    sectionByDefault: PropTypes.object,
    sectionByState: PropTypes.object,
    onChange: PropTypes.func,
    onPauseTyping: PropTypes.func,
    search: PropTypes.string
};

export default VariableSection;