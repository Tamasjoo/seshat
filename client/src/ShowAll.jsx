/* tslint:disable */

import React, { useState, useEffect, useRef, useCallback } from "react";
import "./styling/results.css";
import axios from "./axiosConfig";
import fileDownload from "js-file-download";
import { FileIcon, defaultStyles } from "react-file-icon";

const ShowAll = () => {
    // useeffect calls search function
    // make the initial request to get initial documents, set states, set intersectionobserver
    // get the observer to make request

    const [allDocuments, setAllDocuments] = useState([]); // @ts-ignore // empty state is not displayed for some reason

    const [pageToken, setPageToken] = useState(); // google cloude storage needs it to determine which set of items is needed next

    const [pattern, setPattern] = useState(""); // search pattern that we will implement later in the FE but in he BE it already exists

    const [loading, setLoading] = useState(false); // set it to true when the user is at the bottom of the page, set it to false when the last page is reached

    const [noMoreResults, setNoMoreResults] = useState(false);

    const [pageNumber, setPageNumber] = useState(1);
    // https://www.pluralsight.com/guides/how-to-implement-infinite-scrolling-with-reactjs

    /*  ********************  useref  ********************  */

    let observer = useRef();

    const lastDocumentRef = useCallback(
        (node) => {
            console.log("lastdocuref");
            if (loading) return;
            console.log("node is: ", node); // @ts-ignore
            if (observer.current) observer.current.disconnect(); // @ts-ignore
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !noMoreResults) {
                    setPageNumber((PageNumber) => PageNumber + 1);
                }
            });
            if (node) observer.current.observe(node); // @ts-ignore
        }, // @ts-ignore
        [loading]
    );
    useEffect(() => {
        console.log("useeffect triggered");

        if (noMoreResults) return;
        setLoading(true);
        axios
            .get("/api/documents", {
                params: {
                    pattern: pattern,
                    pageToken: pageToken,
                },
            })
            .then((res) => {
                console.log("res.data is: ", res.data);
                //formatting the size property of results
                for (let i = 0; i < res.data.documents.length; i++) {
                    if (res.data.documents[i].size / 1073741824 >= 1) {
                        let size = res.data.documents[i].size / 1073741824;
                        res.data.documents[i].size = `${size.toFixed(2)} GB`;
                    } else if (res.data.documents[i].size / 1048576 >= 1) {
                        let size = res.data.documents[i].size / 1048576;
                        res.data.documents[i].size = `${size.toFixed(2)} MB`;
                    } else if (res.data.documents[i].size / 1024 >= 1) {
                        let size = res.data.documents[i].size / 1024;
                        res.data.documents[i].size = `${size.toFixed(2)} KB`;
                    } else {
                        res.data.documents[i].size = `${res.data.documents[
                            i
                        ].size.toFixed(2)} B `;
                    }
                }
                //formatting the date part of the results
                for (let i = 0; i < res.data.documents.length; i++) {
                    res.data.documents[i].timeCreated = new Date(
                        res.data.documents[i].timeCreated
                    ).toLocaleString();
                }
                setAllDocuments([...allDocuments, ...res.data.documents]);
                setLoading(false);

                if (!res.data.nextQuery) {
                    setNoMoreResults(true);
                    return;
                }
                setPageToken(res.data.nextQuery.pageToken);
                console.log(
                    "res.data.nextQuery.pageToken in useeffect is is: ",
                    res.data.nextQuery.pageToken
                );
            });
    }, [pageNumber]);

    const download = (name) => {
        axios
            .get("/api/documents/" + name, {
                responseType: "blob",
            })
            .then((res) => {
                fileDownload(res.data.documents, name);
            });
    };

    return (
        <tbody>
            {!allDocuments && <p>No Files to display</p>}
            {allDocuments &&
                allDocuments.map((document, i) => {
                    return (
                        <tr
                            key={i}
                            onClick={(e) => download(document.name)}
                            ref={
                                allDocuments.length === i + 1
                                    ? lastDocumentRef
                                    : null
                            }
                        >
                            <td className="text-left">
                                <FileIcon
                                    extension={document.name.substring(
                                        document.name.lastIndexOf(".") + 1
                                    )}
                                    {...defaultStyles[
                                        document.name.substring(
                                            document.name.lastIndexOf(".") + 1
                                        )
                                    ]}
                                />
                            </td>
                            <td className="text-left">{document.name}</td>
                            <td className="text-left">
                                {document.timeCreated}
                            </td>
                            <td className="text-right">{document.size}</td>
                        </tr>
                    );
                })}
            {loading && (
                <div className="lds-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            )}
        </tbody>
    );
};

export default ShowAll;
