import React from "react";

class LoadingScreen extends React.Component {
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
                    `
                }} />

                <span className="animation-spin icon-spinner2" />
                <div>Please wait...</div>
            </div>
        );
    }
}

export default LoadingScreen;