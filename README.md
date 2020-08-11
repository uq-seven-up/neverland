# Neverland



## Preparing the development environment.
### Required software.

- Install GIT https://git-scm.com/downloads
- Install Docker Desktop https://www.docker.com/get-started
- Install nodejs 14.7.0 https://nodejs.org/en/
- Install yarn v1.22.4 https://classic.yarnpkg.com/en/docs/install/#windows-stable

Note: You could also use the provided docker container as a build environment, in which case there is no need to install nodejs or docker. However, on Windows and MacOS compiling local source code mounted to a docker container is painfully slow.

--- 

### Grab the source-code

All shell commands should be run in the terminal appropriate for your operating system. i.e. Powershell (Windows) or Terminal/Console (Linux/Mac OS).

Navigate to a place in the file system where you would like to store the project source code. Then

`git clone https://github.com/uq-seven-up/neverland.git`

Then switch to the "develop" branch.

`git checkout develop`

### Building the project

The following command will build all packages.

#### Windows
`./build.bat`

#### Linux / Mac OS
`./build.sh`

### Day to Day development.
All the usual commands that you can find on the web for working with react / typescript application created with the create-react tool should work. Just remeber the project is configured to use YARN and not NPM and we are using the YARN workspaces feature to afford us the ability to easily share private packages.

---
### Using Docker as a development environment.
Not recommended on Mac OS or Windows, but you can try it.

#### Windows
`./start.bat`

#### Linux / Mac OS
`./start.sh`

Then choose option 1. This will launch a docker build environment and start a bash shell inside of the linux
container. 

Inside the bash shell you can use the same commands for building and working with the source code as described for Linux.

The start.sh script also provides the option to build the docke build environment from the provided docker file.

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