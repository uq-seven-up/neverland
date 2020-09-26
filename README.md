# Neverland



## Preparing the development environment.
### Required software.

- Install GIT https://git-scm.com/downloads
- Install Docker Desktop https://www.docker.com/get-started
- Install nodejs 14.7.0 https://nodejs.org/en/
- Install yarn v1.22.4 https://classic.yarnpkg.com/en/docs/install/#windows-stable

Note: You could also use the provided docker container as a build environment, in which case there is no need to install nodejs or yarn. However, on Windows and MacOS compiling local source code mounted to a docker container is painfully slow.

--- 

### Grab the source-code from Git Hub

All shell commands should be run in the terminal appropriate for your operating system. i.e. Powershell (Windows) or Terminal/Console (Linux/Mac OS).

Navigate to a place in the file system where you would like to store the project source code. Then

`git clone https://github.com/uq-seven-up/neverland.git`

Then switch to the "develop" branch.

`git checkout develop`

### Building the project

The following command will build all packages.  

### YOU MUST DO THIS AT LEAST ONCE THE VERY FIRST TIME YOU CHECKOUT THE SOURCE CODE.

For development you MUST create the following file:

`./packages/client-screen/.env.local`  

File contents:  
`REACT_APP_NEVERMIND_API_BASE=http://localhost:3080/api`

If you do NOT generate this file then client applications will contact the production REST API.


#### Windows
`./build.bat`

#### Linux / Mac OS
`./build.sh`

## Day to Day development.
All the usual commands that you can find on the web for working with react / typescript application created with the create-react tool should work. Just remeber the project is configured to use YARN and not NPM and we are using the YARN workspaces feature to afford us the ability to easily share private packages.

## Changing code inside of the common-* packages
For code changes to common packages to be available the changes packages must be rebuilt.

In the console change to the ./packages/common-* folder.

The following commands are available:  
`yarn build`  
Builds the server source code and runs all unit-tests. 

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

## Starting the Client Applications
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

**./packages/server**  
Node.js server which mediates between the mobile and screen application.

**./packages/common-types**  
Typescript Type definitions which can be shared accross all packages.

**./packages/common-utils**  
Utilities and libraries which can be shared accross all packages.
