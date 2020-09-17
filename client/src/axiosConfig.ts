import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:9000",
});

instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

export default instance;
