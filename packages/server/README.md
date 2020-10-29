# Server componente
This package contains the source code for the server component.

## Developer notes.
The server must be able to connect to a MongoDB database to operate.

A docker container with mongo db installed can be run with the start_mongo script located in the root of the project.

The credentials to connect to mongo db need to be specified in a .env file which should be located in the ./packages/server folder. The contents of the file are as follows:

mongoserver = localhost
mongousername = root
mongopassword = secret
mongodbname = neverland-dev
OPEN_WEATHER_MAP_API_KEY = A VALID API KEY FROM https://openweathermap.org/api

The above credentials will work with the mongo db launched by the provided script. (start_mongo)


## Available commands
`yarn start` Runs the server.  
`yarn dev` Runs the server and auto re-builds on code changes.  
`yarn build` Build a production version of the server. NOTE: You most likely want to use the integration script instead.

# Credits
The server is built ontop of node express.
https://expressjs.com/