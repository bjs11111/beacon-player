#beacon-player.com client-app

##Setup

This setup is tested with following environment:


For general information visit the official [ionic guide](http://ionicframework.com/docs/guide/).
Documentation for the [ionic CLI](https://github.com/driftyco/ionic-cli)

###Setup environment 

- nodeJs
It's required to have node installed. If you don't have you will find it [here](https://nodejs.org/en/download/).
Download and install the version for your OS.

- ionic
To use the ionic-CLI and run cordova commands install ionic and cordova globaly over nmp.
You also need to install bower to load the required libs. Paste following command to you console to install all three with a single line.
```bash
$ npm install -g ionic cordova bower
```
###Setup project for desktop development

1. Check out the project
  ```bash
  $ git clone https://github.com/Tokencube/beacon-player.git [project name]
  ```
  Check that the current user have write permissions to the newly created folder.
  Then cd into the folder and check out the dev branch
  ```bash
  $ cd [project_name]
  $ git checkout dev
  ```

2. Setup node_modules 
  In the ckecked out branch there is a package.json file  
  which contains all required node modules required for the gulp tasks as well   as the platforms and plugins of cordova 
  ```bash
  $ npm install
  ```
  
3. Load bower lib's
  As all the thrid party libs are not in the repository we have to load them over bower
  ```bash
  $ bower update
  ```
  Now you are ready to test it on desktop. Run following command:
  ```bash
  $ ionic serve
  ```
  
###Setup project for mobile development

1. setup cordova platforms and plugins
  To build your project for platforms or debugging over console setup codrova platforms and plugins.
  These are defined in the package.json file
  ```bash
  $ ionic state restore
  ```
  
  **NOTICE:**
  I'm not 100% shure for now but i think following:
  If you do "ionic plugin add [plugin]" it will change you config.xml by adding the plugin references.
  If you do "ionic state restore" it will not. 
  
  Consider this when installing, testing or removing cordova plugins
  
  
  
  This will create the platforms folder and loads codrova android and ios platform.
  It also creates the plugins folder and loads the plugins defined in package.json  
  
  - setup icons and splash screen
    To generate all different versions of splash screens and app icons run following
    ```bash
     $ ionic resources
     ```
     This will also change your config.xml by adding the platforms icon tags. 
     
2. run app on device
  To run the project on your mobile phone do following
  ```bash
  $ ionic run android --device
  ```
  
  To change the images just replace the splash.png or icon.png file in the resources folder of the root directory










