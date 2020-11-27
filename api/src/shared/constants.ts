// Strings
export const paramMissingError =
    "One or more of the required parameters was missing.";
export const loginFailedErr = "Login failed";

// Numbers
export const pwdSaltRounds = 12;

// Cookie Properties
export const cookieProps = Object.freeze({
    key: "ExpressGeneratorTs",
    secret: process.env.COOKIE_SECRET,
    options: {
        httpOnly: true,
        signed: true,
        path: process.env.COOKIE_PATH,
        maxAge: Number(process.env.COOKIE_EXP),
        domain: process.env.COOKIE_DOMAIN,
        secure: process.env.SECURE_COOKIE === "true",
    },
});

/************************************************************************************
 *                              Connect with Google Storage
 ***********************************************************************************/

// Imports the Google Cloud client library
const { Storage } = require("@google-cloud/storage");
export const storage = new Storage().bucket("seshat-bucket");

// Make project root path globally available
export const appRoot = require("app-root-path").path;
