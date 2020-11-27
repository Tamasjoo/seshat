import React, { useState, useEffect, useRef, useCallback } from "react";
import "../styling/results.css"
import axios from "../axiosConfig";
import fileDownload from "js-file-download";
import { FileIcon, defaultStyles } from "react-file-icon";

const ShowAll = () => {
    const [allDocuments, setAllDocuments] = useState([]);

    const [pageToken, setPageToken] = useState(); // google cloude storage needs it to determine which set of items is needed next

    const pattern = "";

    const [noMoreResults, setNoMoreResults] = useState(false);

    const [pageNumber, setPageNumber] = useState(1);

    const [displayLoadingIcon, setDisplayLoadingIcon] = useState(false);

    let observer = useRef();

    const lastDocumentRef = useCallback((node) => {
        if (displayLoadingIcon) return;
        console.log("lastdocuref triggered");
        console.log("node is: ", node);
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !noMoreResults) {
                setPageNumber((pageNumber) => pageNumber + 1);
            }
        })
        if (node) observer.current.observe(node);
    }, []);

    useEffect(() => {
        console.log("useeffect triggered");
        if (noMoreResults) observer.current.disconnect();
        if (noMoreResults) return;
        setDisplayLoadingIcon(true);
        axios
            .get("/api/documents", {
                params: {
                    pattern: pattern,
                    pageToken: pageToken,
                },
            })
            .then((res) => {
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
                        let size = res.data.documents[i].size;
                        res.data.documents[i].size = `${size} B `;
                    }
                }
                //formatting the date part of the results
                for (let i = 0; i < res.data.documents.length; i++) {
                    res.data.documents[i].timeCreated = new Date(
                        res.data.documents[i].timeCreated
                    ).toLocaleString();
                }
                setAllDocuments([...allDocuments, ...res.data.documents]);
                setDisplayLoadingIcon(false);
                if (noMoreResults) observer.current.disconnect();
                if (!res.data.nextQuery) {
                    setNoMoreResults(true);
                    return;
                }
                setPageToken(res.data.nextQuery.pageToken);
            })
            .catch((error) => {
                console.error("error: ", error);
            });
    }, [pageNumber]);

// upon a click on a file, it gets downloaded

    const download = (name) => {
            axios.get("/api/documents/" + name, {
                responseType: "blob",
            })
            .then((res) => {
                fileDownload(res.data.documents, name);
            });
    };

    return (
            <table className="table">
                <thead>
                    <tr>
                        <th className="text-left" scope="col">
                            Type
                        </th>
                        <th className="text-left" scope="col">
                            Name
                        </th>
                        <th className="text-left" scope="col">
                            Created At
                        </th>
                        <th className="text-right" scope="col">
                            Size
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {!allDocuments && <p>No Files to display</p>}
                    {allDocuments && allDocuments.map((document, i) => {
                        return (
                                <tr key={i} onClick={(e) => download(document.name)} ref={allDocuments.length === i + 1 ? lastDocumentRef : null}>
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
                    {displayLoadingIcon && (
                        <tr className="lds-ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        </tr>
            	    )}
        	    </tbody>
            </table>
    );
};

export default ShowAll;
