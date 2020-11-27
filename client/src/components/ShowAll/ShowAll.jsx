import React, { useState, useEffect, useRef, useCallback } from "react";
import "../../styles/loadingAnimation.css"
import axios from "../../axiosConfig";
import { FileIcon, defaultStyles } from "react-file-icon";
import {formatDate, formatSize, downloadFile} from "../../helpers/helpers.tsx"

const ShowAll = () => {
    const [allDocuments, setAllDocuments] = useState([]);

    const [pageToken, setPageToken] = useState(); // google cloude storage needs it to determine which set of items is needed next

    const pattern = "";

    const [noMoreResults, setNoMoreResults] = useState(false);

    const [pageNumber, setPageNumber] = useState(1);

    const [displayLoadingIcon, setDisplayLoadingIcon] = useState(false);

    //////////////////// infinite scroll and observer////////////////////

    let observer = useRef();

    const lastDocumentRef = useCallback((node) => {
        if (displayLoadingIcon) return;
        //console.log("lastdocuref triggered");
        //console.log("node is: ", node);
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !noMoreResults) {
                setPageNumber((pageNumber) => pageNumber + 1);
            }
        })
        if (node) observer.current.observe(node);
    }, []);

    //////////////////// infinite scroll and observer ////////////////////

    useEffect(() => {
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

                formatSize(res.data)

                //formatting the date part of the results, see in helpers
                formatDate(res.data)

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
                console.error("useEffect error: ", error);
            });
    }, [pageNumber]);


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
                                <tr key={i} onClick={(e) => downloadFile(document.name)} ref={allDocuments.length === i + 1 ? lastDocumentRef : null}>
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