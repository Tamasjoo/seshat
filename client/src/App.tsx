import React, { useState, useEffect } from "react";

import { BrowserRouter, Route, Link } from "react-router-dom";
import Browse from "./Browse";
import ShowAll from "./ShowAll";

const App = () => {
    const [nav, setNav] = useState(""); // if we don´t want to hide the nav at some point we can also remove this because then probably we don´t want to change its state
    const [browseDocuments, setBrowseDocuments] = useState("");
    return (
        <BrowserRouter>
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a className="navbar-brand" href="#">
                        <img
                            src="/img/bk.jpg"
                            width="30"
                            height="30"
                            alt=""
                            loading="lazy"
                        />
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarNavAltMarkup"
                        aria-controls="navbarNavAltMarkup"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div
                        className="collapse navbar-collapse"
                        id="navbarNavAltMarkup"
                    >
                        <div className="navbar-nav">
                            <Link className="nav-link active" to="/">
                                Show All{" "}
                                <span className="sr-only">(current)</span>
                            </Link>
                            <Link className="nav-link" to="/browse">
                                Browse
                            </Link>
                            <Link className="nav-link" to="#">
                                Upload
                            </Link>
                        </div>
                    </div>
                </nav>
                <table className="table">
                    <thead>
                        <tr>
                            <th className="text-left" scope="col">
                                Type
                            </th>
                            <th className="text-left" scope="col">
                                Name
                            </th>
                            <th className="text-left" scope="col">
                                Created At
                            </th>
                            <th className="text-right" scope="col">
                                Size
                            </th>
                        </tr>
                    </thead>
                    <Route exact path="/" component={ShowAll} />
                    <Route path="/browse" component={Browse} />
                </table>
            </div>
        </BrowserRouter>
    );
};

export default App;
