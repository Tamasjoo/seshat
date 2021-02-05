// downloads the files passed into the function

import axios from "../axiosConfig";
import fileDownload from "js-file-download";
import { Document, IncomingDocus } from "../helpers/helpers";

export const downloadFile = (name: any) => {
    axios
        .get("/api/documents/" + name, {
            responseType: "blob",
        })
        .then((res) => {
            fileDownload(res.data, name);
        });
};

// type definition, what does the function return { lower: number; upper: number; }

/*
config: {url: "/api/documents", method: "get", headers: {…}, params: {…}, baseURL: "http://localhost:9000", …}
data: {nextQuery: {…}, documents: Array(15)}
headers: {content-length: "1687", content-type: "application/json; charset=utf-8"}
request: XMLHttpRequest {readyState: 4, timeout: 0, withCredentials: false, upload: XMLHttpRequestUpload, onreadystatechange: ƒ, …}
status: 200
statusText: "OK"

*/

interface ResponseWithDocus {
    documents: any; // why does typescript insist on putting this here inst
    nextQuery: any;
    config: any;
    data: { documents: any };
    headers: any;
    request: any;
    status: any;
    statusTest: any;
}

export const getNextDocumentGroup = (pattern: string, pageToken: string) => {
    //deine what a document is and then say that this is getting docuemnts
    return axios.get<ResponseWithDocus>("/api/documents", {
        //https://github.com/axios/axios/blob/master/index.d.ts#L140 --> maybe this could help me define it
        params: {
            pattern,
            pageToken,
        },
    });
};
