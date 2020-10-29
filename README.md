# Neverland

## Preparing the development environment.
### Required software.

- Install GIT https://git-scm.com/downloads
- Install Docker Desktop https://www.docker.com/get-started
- Install nodejs 14.7.0 https://nodejs.org/en/
- Install yarn v1.22.4 https://classic.yarnpkg.com/en/docs/install/#windows-stable

--- 
### Grab the source-code from Git Hub
All shell commands should be run in the terminal appropriate for your operating system. i.e. Powershell (Windows) or Terminal/Console (Linux/Mac OS).

Navigate to a place in the file system where you would like to store the project source code. Then

`git clone https://github.com/uq-seven-up/neverland.git`

Then switch to the "develop" branch.

`git checkout develop`

### Configure local environment files.
Create a file named `.env` in `%project_root%/packages/server/`

The file needs to define the following environment variables:

`mongoserver = localhost`  
`mongousername = root`  
`mongopassword = secret`  
`mongodbname = neverland-dev`  
`OPEN_WEATHER_MAP_API_KEY = A VALID API KEY FROM https://openweathermap.org/api`  
  
The above credentials will work with the mongo db launched by the provided script. (start_mongo)
`

### Building the project

The following command will build all packages.  

### YOU MUST DO THIS AT LEAST ONCE THE VERY FIRST TIME YOU CHECKOUT THE SOURCE CODE.

#### Windows
`./build.bat`

#### Linux / Mac OS
`./build.sh`

## Day to Day development.
All the usual commands that you can find on the web for working with a react / typescript application created with the create-react tool should work. Just remember that the project is configured to use YARN and not NPM and we are using the YARN workspaces feature to afford us the ability to easily share private packages.

### A typical workflow for a coding session is:
(Windows user should use scripts that end in .bat instead of .sh)

* Get the lastest changes from the team: `git pull`
* Build any changes to common packages: `./build.sh`
* Start the local mongo db docker container: `./start_mongo.sh`
* Start the server:  
  `cd ./packages/server`  
  `yarn dev`
* Start the mobile client:  
  `cd ./packages/client-mobile`  
  `yarn start`  
* Start the screen application:  
  `cd ./packages/client-screen`  
  `yarn start`
* The application should now be running.

### Note:  
When working on the game component there is no need to run the client-screen.  
Also, code changes to the playground application will not show in the client-screen until
the code has been integrated. See the readme file in the playground project.

For quick testing of the game a local player can be launched directly in the client-screen without
requiring the mobile client.

To add the debug player click on the game to start the game. Then press 1 to add a debug player. The debug player can be controlled with the cursor keys. (note diagonals do not work with the debug player.)


## Changing code inside of the common-* packages
For code changes to common packages to be available the changes packages must be rebuilt.

In the console change to the ./packages/common-* folder.

The following commands are available:  
`yarn build`  
Builds the server source code and runs all unit-tests. 

## Changing code inside of the playground packages
For code changes to the phase3 game you must run the integrate script. See the readme file for the playground package.

## Local mongo database.
For local development the project includes a mongo db stack. To start the stack run the start_mongo shell script.

The shell script launches a development version of mongo db as well as a web interface for managing the mongo database. The web interface is available on http://localhost:8081

## Starting the REST API server
As all the client applications rely on the REST API server, it is recommended to have the REST API running during all development.

In the console change to the ./packages/server folder.

The following commands are available:  
`yarn build`  
Builds the server source code.  

`yarn start`  
Starts up the node express server.  

`yarn dev`  
Starts up the node express server and watches the source code for any changes. If source code changes are detected the code is automatically re-compiled and the node server is restarted with the new source code changes.  

## Starting the Client Applications (playground/client-mobile/client-screen)
As all the client applications rely on the REST API server, it is recommended to have the REST API running during all development.

In the console change to the ./packages/client-* folder.

The following commands are available:  
`yarn build`  
Builds the client source code for production.  

`yarn start`  
Starts up the client application and launches a web-browser windows.  

`yarn test`  
Launches a tool for running unit-tests.


---
## Project folder structure.

**./docker**  
Contains docker files for containerising the application and constructing a build environement.

**./packages**  
Contains all the packages which are used to construct the project.

**./packages/client-mobile**  
React Application used by end users to interact with the Public Display (screen).

**./packages/client-screen**  
React Application which is shown on the Public Display (screen)

**./packages/playground**  
The interactive game that is integrated into the client screen.

**./packages/server**  
Node.js server which mediates between the mobile and screen application.

**./packages/common-types**  
Typescript Type definitions which can be shared accross all packages.

**./packages/common-utils**  
Utilities and libraries which can be shared accross all packages.

## Deployment to AWS
The project includes sample buildspec and appspec these files allow using the AWS Code Build and AWS Code Deploy services respectively for building and deploying the project to production.

The team uses both services in CI pipeline to automatically build and deploy to AWS EC2 whenc code is pushed to the master branch.

See:  
* https://aws.amazon.com/codedeploy/
* https://aws.amazon.com/codebuild/
* https://aws.amazon.com/ec2
