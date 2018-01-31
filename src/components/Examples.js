import React from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";

import Grid from "../examples/Grid";
import Album from "../examples/Album";

class Examples extends React.Component {
    constructor() {
        super();

        this.examples = [
            {
                component: <Grid />,
                label: "Grid"
            },
            {
                component: <Album />,
                label: "Album"
            }
        ];

        this.state = {
            activeTab: 0
        };
    }

    render() {
        return (
            <div>
                <h1 className="display-4 mt-4 mb-3">Examples</h1>

                <Nav tabs>
                    {this.examples.map((example, i) =>
                        <NavItem key={i}>
                            <NavLink
                                href="javascript:void(0)"
                                className={this.state.activeTab == i ? "active" : ""}
                                onClick={() => this.setState({ activeTab: i })}
                            >
                                {example.label}
                            </NavLink>
                        </NavItem>
                    )}
                </Nav>

                <TabContent activeTab={this.state.activeTab} className="m-3">
                    {this.examples.map((example, i) =>
                        <TabPane key={i} tabId={i}>
                            {example.component}
                        </TabPane>
                    )}
                </TabContent>
            </div>
        );
    }
}

export default Examples;