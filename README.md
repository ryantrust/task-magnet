# TaskMagnet
CS35L Project for Fall 2023 with Paul Eggert (Discussion 1B)\
Developed by Ryan Trust, Arul Mathur, Patrick Li, Andy Huang

## Installation

### .env file
```sh
PORT=3000
API_PORT=5001
CLIENT_ORIGIN=http://localhost
CLIENT_ORIGIN_URL=${CLIENT_ORIGIN}:${PORT}
REACT_APP_API_SERVER_URL=${CLIENT_ORIGIN}:${API_PORT}
AUTH0_DOMAIN=dev-*******.us.auth0.com
REACT_APP_AUTH0_DOMAIN=${AUTH0_DOMAIN}
REACT_APP_AUTH0_CLIENT_ID=******************************
REACT_APP_AUTH0_CALLBACK_URL=${CLIENT_ORIGIN_URL}/callback
AUTH0_SECRET=****************************************************************
AUTH0_AUDIENCE=https://**********/api
REACT_APP_AUTH0_AUDIENCE=${AUTH0_AUDIENCE}
MONGO_CONNECTION_STRING=mongodb+srv://*********:**************@cluster*.*******.mongodb.net/?retryWrites=true&w=majority
```

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### #`npm test`

Launches the test runner in the interactive watch mode.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
