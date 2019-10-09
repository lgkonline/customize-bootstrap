import React from "react";
import PropTypes from "prop-types";

class DollarBtn extends React.Component {
    componentWillMount() {
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        const value = this.props.varByState || this.props.varByDefault;
        const search = value.replace(" !default", "");
        window.appRef.setState({ search });
    }

    render() {
        const value = this.props.varByState || this.props.varByDefault;
        const search = value.replace(" !default", "");

        return (
            value && value && value[0] === "$" &&
            <div className="input-group-prepend">
                <button
                    className="btn btn-outline-secondary"
                    title={`Search for variable: "${search}"`}
                    onClick={this.onClick}
                >
                    <strong>$</strong>
                </button>
            </div>
        );
    }
}

DollarBtn.propTypes = {
    varByState: PropTypes.string,
    varByDefault: PropTypes.string
};

export default DollarBtn;