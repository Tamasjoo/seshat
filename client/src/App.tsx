import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
    return (
        <div className="main">
            <nav>
                <button>Show All</button>
                <button>Browse</button>
                <button>Upload</button>
            </nav>
            <main>
                <header>
                    <div>Name</div>
                    <div>Last Modified On</div>
                    <div>Size</div>
                </header>
                <div className="results_container">
                    <img src="/img/pdf_logo.png" alt="file extension logo" />
                    <p>File Name</p>
                    <p>14.09.2020</p>
                    <p>5 MB</p>
                </div>
            </main>
        </div>
    );
}

export default App;
