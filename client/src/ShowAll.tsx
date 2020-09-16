import React, { useState, useEffect } from "react";
import "./results.css";

const ShowAll = () => {
    useEffect(() => console.log("mounted"), []); // this is where we want to make the initial call to the server to fetch the list of files in the DB
    return (
        <div className="results_container">
            <img src="/img/pdf_logo.png" alt="file extension logo" />
            <p>I am a sample file in Show All component</p>
            <p>14.09.2020</p>
            <p>5 MB</p>
        </div>
    );
};

export default ShowAll;
