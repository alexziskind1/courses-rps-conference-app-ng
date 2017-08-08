# RPS Conference App code 


* **This version is the Angular verison of the app**

*IMPORTANT:* If you are using version 2.5.0 of the NativeScript CLI, please upgrade to 2.5.1 right away. 
Please use the ```update_2.5.1``` branch of this repository if you're on 2.5.x.

Branch ```update_3.1.3``` has a working version of the app for NativeScript 3.1.3, but the map page isn't loading the images. This needs to be looked into.

To check your version run this:
```
tns --version
```


Clone this repository
```
git clone https://github.com/alexziskind1/courses-rps-conference-app-ng.git
```

Go into the repository directory
```
cd courses-rps-conference-app-ng
```

Change to the ```update_2.5.1``` branch
```
git checkout update_2.5.1
```

Go into the project directory
```
cd rps-conf
```

Run the project on iOS
```
tns run ios
```

Run the project on Android (I start up my Genymotion emulator before this step)
```
tns run android
```

*NOTE:* Only the finished application in the ```rps-conf-ng``` folder will be updated to the latest versions of NativeScript. The ```course-modules``` will not be updated.


------------
This is a companion app to my Pluralsight course Building Cross Platform Native Mobile Applications with NativeScript.
This app is based on the [TelerikNEXT app](https://github.com/NativeScript/sample-TelerikNEXT/) sample with a few things added.

Fork/clone the repository and run npm install in the rps-conf directory. 
This app is based on the Telerik NEXT app sample with a few things added.

Use this application to find-out how to implement common mobile scenarios with NativeScript.

## Running the sample

1. Make sure you have the [NativeScript Command Line Interface](https://www.npmjs.com/package/nativescript) installed as well as all the prerequisites for the NativeScript development.

2. Fork and/or clone the repo:
  ```
  git clone https://github.com/alexziskind1/courses-rps-conference-app-ng.git
  cd courses-rps-conference-app-ng/rps-conf-ng
  ```
3. Install the dependencies
  ```
  tns install
  ```

4. Run the project:

    `tns run ios|android [--emulator]`

    The `--emulator` keyword instructs the CLI to load the iOS simulator or an android emulator depending on the platform you want.

