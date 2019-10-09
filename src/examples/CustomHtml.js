import React, { useState } from "react";

export function CustomHtml() {
    const [html, setHtml] = useState(`<h1 class="mt-4 mb-3">Replace this...</h1>\n<button class="btn btn-primary btn-lg">...with your own code!</button>`);

    return (
        <div>
            <textarea className="form-control" value={html} onChange={({ target }) => setHtml(target.value)} />

            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
}