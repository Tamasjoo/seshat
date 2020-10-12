import React, { useState, useEffect } from "react";
import "./results.css";
import axios from "./axiosConfig";
import fileDownload from "js-file-download";
import { FileIcon, defaultStyles } from "react-file-icon";

const ShowAll = () => {
    const [allDocuments, setAllDocuments] = useState([]);

    useEffect(() => {
        axios.get("/api/documents").then((res) => {
            console.log("res.data is: ", res.data);
            for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].size / 1073741824 >= 1) {
                    let size = res.data[i].size / 1073741824;
                    res.data[i].size = `${size.toFixed(2)} GB`;
                } else if (res.data[i].size / 1048576 >= 1) {
                    let size = res.data[i].size / 1048576;
                    res.data[i].size = `${size.toFixed(2)} MB`;
                } else if (res.data[i].size / 1024 >= 1) {
                    let size = res.data[i].size / 1024;
                    res.data[i].size = `${size.toFixed(2)} KB`;
                } else {
                    res.data[i].size = `${res.data[i].size.toFixed(2)} B `;
                }
            }

            for (let i = 0; i < res.data.length; i++) {
                res.data[i].timeCreated = new Date(
                    res.data[i].timeCreated
                ).toLocaleString();
            }
            setAllDocuments(res.data);
        });
    }, []);

    const download = (name: any) => {
        axios
            .get("/api/documents/" + name, {
                responseType: "blob",
            })
            .then((res) => {
                console.log("document name clicked", name);
                fileDownload(res.data, name);
            });
    };

    return (
        <tbody>
            {!allDocuments && <p>No Files</p>}
            {allDocuments &&
                allDocuments.map((document: any, i: any) => {
                    return (
                        <tr key={i} onClick={(e) => download(document.name)}>
                            <td>{document.name}</td>
                            <td>{document.timeCreated}</td>
                            <td>{document.size}</td>
                        </tr>
                    );
                })}
        </tbody>
    );
};

export default ShowAll;
