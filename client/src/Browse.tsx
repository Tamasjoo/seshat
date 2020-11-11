import { render } from "@testing-library/react";
import React, { useState, useEffect } from "react";
import "./styling/results.css";

const Browse = () => {
    return (
        <div className="results_container">
            <img src="/img/pdf_logo.png" alt="file extension logo" />
            <p>I am sample file in the broser tab</p>
            <p>14.09.2020</p>
            <p>5 MB</p>
        </div>
    );
};

export default Browse;
