# Neverland Game
This package contains the source code for the interactive game that is integrated into the client-screen.

## Developer notes.
During development this project can be run as a stand-alone project independently from the client-screen project. However, the server package needs to be running.

The game is built around the phase3 game engine. Refer to the excellent documentation and examples on  
https://www.phaser.io/phaser3

## Integration.
The game is integrated into the client-screen as a compiled component as such changes to the source code will
not show in the client-screen until a production version of the game has been built and deployed into the client-screen package.

The helper script: integrate.bat (windows) / integrate.sh (mac/linux) will build the production version of the game and copy the build artifacts into the client-screen package.

## Available commands
`yarn start` Runs the game in stand alone mode and auto re-builds on code changes.  
`yarn build` Build a production version of the game. NOTE: You most likely want to use the integration script instead.

# Credits
This projects configuration is based on the Phaser 3 Webpack Project Template
but has been modified to use typescript and yarn instead of node.
https://github.com/photonstorm/phaser3-project-template

The game is built around the phaser3 game engine and the excellent examples located at.
https://www.phaser.io/phaser3