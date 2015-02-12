#beacon-player
The beacon player app is the client app for the great BCMS platform of [tokencube](http://www.tokencube.com). 
Tokencube is one of the [netidee]( http://www.netidee.at) projects of 2014.
[netidee](https://www.netidee.at/fileadmin/www.netidee.at/template/main/images/logo_start.gif "www.netidee.at")

Both, the platform source and the app source are completely open source. We also provide free access to [tokencube](http://www.tokencube.com) and the basic account has the full number of available features.
Visit [www.tokencube.com](http://www.tokencube.com) for more information.

##Features
We heavily use the new Bluetooth 4.0 Beacon Technology to create a point of interaction to share local based or item based information.

##Setup the Project

###Installig envirement 

We recommend using the [Ionic CLI](https://github.com/driftyco/ionic-cli) to create new Ionic projects and work with them. Also a good advice is to read the [IONIC CLI FAQ](http://ionicframework.com/docs/ionic-cli-faq).

1.`ionic` utility

...make sure the `ionic` utility and all other dependencies are installed. Read about in the [IONIC GETTING STARTED GUIDE](http://ionicframework.com/getting-started/)
...run following on you console:

```bash
$ npm install -g ionic
```

1.1 setup project
We provide just the platform unspecific code on github not the whole ionic project. To get it running on your mashine follow the prozess above. 

Check out the project from git as usual. Then create other project to get the full ionic project folder structure. We need this to copy all the folders and files form it that are not on git.

on the console:
```bash
$ ionic start dummyApp blank
$ cd dummyApp
$ ionic setup sass
$ ionic platform add android
```

1.2 install plugins
on the console:
```bash
$ cordova plugin add org.apache.cordova.network-information
$ cordova plugins add org.apache.cordova.vibration
$ cordova plugin add org.apache.cordova.inappbrowser
$ cordova plugin add com.evothings.ble
```
you alos coud do it in a singel line like 
```bash
$ cordova plugin add org.apache.cordova.network-information org.apache.cordova.vibration org.apache.cordova.inappbrowser com.evothings.ble
```
but seperated lines are more readable.

1.3 check plugins
```bash
$ cordova plugin list
```
should result in a list of above plugins plus some ionic default plugins:

com.evothings.ble 0.0.1 "Evothings BLE API"

com.ionic.keyboard 1.0.3 "Keyboard"

org.apache.cordova.console 0.2.11 "Console"

org.apache.cordova.device 0.2.12 "Device"

org.apache.cordova.inappbrowser 0.5.4 "InAppBrowser"

org.apache.cordova.network-information 0.2.14 "Network Information"

org.apache.cordova.vibration 0.3.12 "Vibration"

1.4
copy all but:
- recources 
- scss
- www
- bower.json

1.5 install other libs
copy bower.json into your project and run:
```bash
$ bower update
```
or install new with
```bash
$ bower install ngCordova
$ bower install angular-moment
```

2. add icon and splashscreen images into the recources folder named icon and splash .png,.psd,.ai
2.1 run following commands
```bash
$ ionic resources
```
2.1.1 advanced settings
If you only need to update one of the resources use following flags:
```bash
$ ionic resources --icon
$ ionic resources --splash
```
Platform Specifics icons and splashscreens:
path: resources/android/
path: resources/ios

###building and signing the app

to build the app run 
```bash
$ cordova build android --release --signed
```
and be shure to have the right properties set in the /platforms/android/ant.properties
read more about in this link under method 2
http://ilee.co.uk/Sign-Releases-with-Cordova-Android/

Alos the great ionic framework has really good documentation about this process
http://ionicframework.com/docs/guide/publishing.html

##app
native state checks like inet or bluetooth are done initialy in the app-controller as well as pn app resume and app open

## Issues

###eclipse
- An internal error occurred during: "Building workspace". GC overhead limit exceeded 
  This is because you need more memory. Edit your eclipse.ini file. 	https://docs.oseems.com/general/application/eclipse/fix-gc-overhead-limit-exceeded
- Loading Android SDK Manager stuck at 0%
http://stackoverflow.com/questions/15056987/android-sdk-content-loader-at-0-and-nothing-works
