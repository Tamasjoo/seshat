import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "../../axiosConfig";
import { FileIcon, defaultStyles } from "react-file-icon";
import { formatData } from "../../helpers/helpers.ts";
import {
    downloadFile,
    getNextDocumentGroup,
} from "../../services/document.service.ts";
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation.tsx";
import "./fileIcon.css";

const ShowAll = () => {
    const [allDocuments, setAllDocuments] = useState([]);

    const [pageToken, setPageToken] = useState(""); // google cloude storage needs it to determine which set of items is needed next

    const pattern = "";

    const [noMoreResults, setNoMoreResults] = useState(false);

    const [pageNumber, setPageNumber] = useState(1);

    const [displayLoadingAnimation, setDisplayLoadingAnimation] = useState(
        false
    ); // state that indicates if the loading animation should be shown

    //////////////////// infinite scroll and observer////////////////////

    let observer = useRef();

    const lastDocumentRef = useCallback((node) => {
        if (displayLoadingAnimation) return;
        //console.log("lastdocuref triggered");
        //console.log("node is: ", node);
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !noMoreResults) {
                setPageNumber((pageNumber) => pageNumber + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, []);

    //////////////////// infinite scroll and observer ////////////////////

    useEffect(() => {
        if (noMoreResults) observer.current.disconnect();
        if (noMoreResults) return;
        setDisplayLoadingAnimation(true);
        getNextDocumentGroup(pattern, pageToken)
            .then((res) => {
                console.log("res:", res);

                const formattedData = formatData(res.data.documents.slice());

                setAllDocuments([...allDocuments, ...formattedData]);

                setDisplayLoadingAnimation(false);

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
                {allDocuments &&
                    allDocuments.map((document, i) => {
                        return (
                            <tr
                                key={i}
                                onClick={(e) => downloadFile(document.name)}
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
                                                document.name.lastIndexOf(".") +
                                                    1
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
                {displayLoadingAnimation && <LoadingAnimation />}
            </tbody>
        </table>
    );
};

export default ShowAll;
