# Seshat

[Node.js]: https://nodejs.org/en/
[NPM]: https://www.npmjs.com/
[React.js]: https://reactjs.org/
[Typescript]: https://www.typescriptlang.org/
[Express.js]: https://expressjs.com/

## About

We created this project with my friend David Sieberger to gain experience with new libraries. My contributions are in frontend part of the application.

## What does the app do?

The backend of application is connected to a Google Cloud Storage bucket and it retrieves the files from there and the frontend of the application lists them.

## Main Features

- Download files
- Infinite scroll

## Notes

- It works but it is not ready yet
- Typescript is turned off in the frontend for now

## Setup

To access the bucket, credentials are necessary and those have to be requested from me. Just drop me a message.

- clone the repo
- run npm install in the client and api folder too
- add .env files

This application was setup by following this [tutorial](https://www.freecodecamp.org/news/create-a-react-frontend-a-node-express-backend-and-connect-them-together-c5798926047c/).

In using [create-react-app](https://create-react-app.dev/) and [express-generator-typescript](https://www.npmjs.com/package/express-generator-typescript) for generating the client and the API app, respectively, it is important to notice that both applications are using [Typescript].

### Related resources may be found here:
* [Node.js]
* [NPM]
* [React.js]
* [Express.js]
