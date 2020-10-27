import React from "react";
import ReactDOM from "react-dom";
import Root from "./client/Root";
import "@style/reset.scss";
import "@style/common.scss";

ReactDOM.render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>,
    document.getElementById("root")
);
