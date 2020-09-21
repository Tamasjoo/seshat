import React, { useState, useEffect } from "react";
import "./results.css";
import axios from "./axiosConfig";

const ShowAll = () => {
    const [allDocuments, setAllDocuments] = useState([]);

    useEffect(() => {
        axios.get("/api/documents").then((res) => {
            console.log("res.data is: ", res.data);
            setAllDocuments(res.data);
        });
    }, []);

    const download = (name: any) => {
        console.log("document name clicked", name);
        axios
            .get("/api/documents/" + name, {
                responseType: "stream",
            })
            .then((res) => {
                console.log(res);
            });
    };

    return (
        <div className="results_container">
            {!allDocuments && <p>No Files</p>}
            {allDocuments &&
                allDocuments.map((document: any, i: any) => {
                    return (
                        <div key={i} onClick={(e) => download(document.name)}>
                            {document.name} {document.timeCreated}{" "}
                            {document.size}
                        </div>
                    );
                })}
        </div>
    );
};

export default ShowAll;
