import React, { useState, useEffect } from "react";

import { BrowserRouter, Route, Link } from "react-router-dom";
import Browse from "./Browse";
import ShowAll from "./ShowAll";

const App = () => {
    const [nav, setNav] = useState(""); // if we don´t want to hide the nav at some point we can also remove this because then probably we don´t want to change its state
    // can´t make the nav to have a fixed position, nor couldn´t add a width to the th element after making it fixed
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
                    <tbody>
                        <thead>
                            <tr>
                                <th scope="col">Type</th>
                                <th scope="col">Name</th>
                                <th scope="col">Created At</th>
                                <th scope="col">Size</th>
                            </tr>
                        </thead>

                        <Route exact path="/" component={ShowAll} />
                        <Route path="/browse" component={Browse} />
                    </tbody>
                </table>
            </div>
        </BrowserRouter>
    );
};

export default App;
