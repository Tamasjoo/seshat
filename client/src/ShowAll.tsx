import React, { useState, useEffect } from "react";
import "./results.css";
import axios from "./axiosConfig";

const ShowAll = () => {
    useEffect(() => {
        console.log("mounted");
        axios.get("/api/documents").then((res) => {
            console.log("documents is: ", res);
            let documents = res; // to be fixed
        });
    }, []); // check if we need to make this synchronouse in order to load before the render

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
