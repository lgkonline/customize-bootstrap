import React, { useState } from "react";

import { CodeFlaskReact } from "../components/CodeFlaskReact";

export function CustomHtml() {
    const [html, setHtml] = useState(`<h1 class="mt-4 mb-3">Replace this...</h1>\n<button class="btn btn-primary btn-lg">...with your own code!</button>`);

    return (
        <div>
            <div className="position-relative mb-3" style={{ minHeight: "200px" }}>
                <CodeFlaskReact
                    code={html}
                    onChange={setHtml}
                />
            </div>

            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
}