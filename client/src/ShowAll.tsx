import React, { useState, useEffect } from "react";
import "./styling/results.css";
import axios from "./axiosConfig";
import fileDownload from "js-file-download";
import { FileIcon, defaultStyles } from "react-file-icon";

const ShowAll = () => {
    const initialAllDocuments: [
        {
            name: string;
            size: string;
            timeCreated: string;
        }
    ] = [
        {
            name: "",
            size: "",
            timeCreated: "",
        },
    ];
    const [allDocuments, setAllDocuments] = useState(initialAllDocuments); // empty state is not displayed for some reason

    const initialPageToken: string = "";
    const [pageToken, setPageToken] = useState(initialPageToken); // google cloude storage needs it to determine which set of items is needed next

    const initialPattern: string = "";
    const [pattern, setPattern] = useState(initialPattern); // search pattern that we will implement later in the FE but in he BE it already exists

    const initialLoading: boolean = true;
    const [loading, setLoading] = useState(initialLoading); // set it to true when the user is at the bottom of the page, set it to false when the last page is reached
    // https://www.pluralsight.com/guides/how-to-implement-infinite-scrolling-with-reactjs

    useEffect(() => {
        axios
            .get("/api/documents", {
                query: { pattern: pattern, pageToken: pageToken },
            } as any)
            .then((res) => {
                console.log("res.data is: ", res.data);
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

                for (let i = 0; i < res.data.documents.length; i++) {
                    res.data.documents[i].timeCreated = new Date(
                        res.data.documents[i].timeCreated
                    ).toLocaleString();
                }
                setAllDocuments(res.data.documents);
                setLoading(false);
                setPageToken(res.data.nextQuery.pageToken);
            });
    }, []);

    const download = (name: string) => {
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
            {allDocuments == [{ name: "", size: "", timeCreated: "" }] && (
                <p>No Files to display</p>
            )}
            {allDocuments !== [{ name: "", size: "", timeCreated: "" }] &&
                allDocuments.map((document: any, i: number) => {
                    return (
                        <tr key={i} onClick={(e) => download(document.name)}>
                            <td className="text-left">
                                <FileIcon
                                    extension={document.name.substring(
                                        document.name.lastIndexOf(".") + 1
                                    )}
                                    {...(defaultStyles as any)[
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

/*
- if last item is shown, check if there is nextpagetoken
-- if no, no more requests
-- if yes,set loading to true, fetch more files, when arrived, push it to the end of the array of objects, set loading to files
*/
