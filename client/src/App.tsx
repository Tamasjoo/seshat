import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Browse from "./Browse";
import ShowAll from "./ShowAll";

const App = () => {
    const [nav, setNav] = useState(""); // if we don´t want to hide the nav at some point we can also remove this because then probably we don´t want to change its state
    const [allDocuments, setAllDocumnets] = useState("");
    const [browseDocuments, setBrowseDocuments] = useState("");
    return (
        <BrowserRouter>
            <div className="main_container">
                <nav>
                    <Link to="/">
                        <button>Show All</button>
                    </Link>
                    <Link to="/browse">
                        <button>Browse</button>
                    </Link>
                    <button>Upload</button>
                </nav>
                <main>
                    <header>
                        <div id="header_name">Name</div>
                        <div id="header_last_modified">Last Modified On</div>
                        <div id="header_size">Size</div>
                    </header>
                    <Route exact path="/" component={ShowAll} />
                    <Route path="/browse" component={Browse} />
                </main>
            </div>
        </BrowserRouter>
    );
};

export default App;
