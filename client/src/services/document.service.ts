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
