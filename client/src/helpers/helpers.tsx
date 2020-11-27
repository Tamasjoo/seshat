//formats dates

import axios from "../axiosConfig";
import fileDownload from "js-file-download";

export const formatDate = (arg: any) => {
    console.log("data.documents is: ", arg.documents);
    for (let i = 0; i < arg.documents.length; i++) {
        arg.documents[i].timeCreated = new Date(
            arg.documents[i].timeCreated).toLocaleString();
    }    
};

//formats file sizes

export const formatSize = (arg: any) => {
    for (let i = 0; i < arg.documents.length; i++) {
        if (arg.documents[i].size / 1073741824 >= 1) {
            let size = arg.documents[i].size / 1073741824;
                        arg.documents[i].size = `${size.toFixed(2)} GB`;
                    } else if (arg.documents[i].size / 1048576 >= 1) {
                        let size = arg.documents[i].size / 1048576;
                        arg.documents[i].size = `${size.toFixed(2)} MB`;
                    } else if (arg.documents[i].size / 1024 >= 1) {
                        let size = arg.documents[i].size / 1024;
                        arg.documents[i].size = `${size.toFixed(2)} KB`;
                    } else {
                        let size = arg.documents[i].size;
                        arg.documents[i].size = `${size} B `;
                    }
                }
};

// downloads the files passed into the function

    export const downloadFile = (name: any) => {
            axios.get("/api/documents/" + name, {
                responseType: "blob",
            })
            .then((res) => {
                fileDownload(res.data.documents, name);
            });
    };