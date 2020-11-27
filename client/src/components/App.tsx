import React from "react";
import ShowAll from "./ShowAll";
import Logo from "./Logo";

const App = () => {
    return (
            <div className="container">
                <Logo/>
                <main className="container">
                    <ShowAll/>
                </main>
            </div>
    );
};

export default App;
