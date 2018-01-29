import React from "react";

class Loading extends React.Component {
    render() {
        return (
            <div style={{
                textAlign: "center",
                fontSize: "2rem",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
            }}>
                <style type="text/css" dangerouslySetInnerHTML={{
                    __html: `
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                        font-weight: 300;
                    }

                    .animation-spin {
                        display: inline-block;
                        animation: spinAnimation 1s infinite linear;
                    }
                    
                    @keyframes spinAnimation {
                        0% {
                            transform: rotate(0deg);
                            color: $primary;
                        }
                        100% {
                            transform: rotate(359deg);
                            color: $secondary;
                        }
                    }
                    `
                }} />

                <span className="animation-spin icon-spinner2" />
                <div>Please wait...</div>
            </div>
        );
    }
}

export default Loading;