// downloads the files passed into the function

import axios from "../axiosConfig";
import fileDownload from "js-file-download";

export const downloadFile = (name: any) => {
    axios
        .get("/api/documents/" + name, {
            responseType: "blob",
        })
        .then((res) => {
            fileDownload(res.data, name);
        });
};

export const getNextDocumentGroup = (pattern: any, pageToken: any) => {
    return axios.get("/api/documents", {
        params: {
            pattern: pattern,
            pageToken: pageToken,
        },
    });
};
