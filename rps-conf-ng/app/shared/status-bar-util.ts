import * as application from "application";
import * as platform from "platform";
import * as utils from "utils/utils";
import * as frameModule from 'ui/frame';

declare var android: any;
declare var UIResponder: any;
declare var UIStatusBarStyle: any;
declare var UIApplication: any;
declare var UIApplicationDelegate: any;
declare var UIColor: any;

export function setStatusBarColors() {
  console.log('setStatusBarColors');
  // Make the iOS status bar transparent with white text.
  // See https://github.com/burkeholland/nativescript-statusbar/issues/2
  // for details on the technique used.
  if (application.ios) {
    console.log('setStatusBarColors ios');
    const AppDelegate = UIResponder.extend({
      applicationDidFinishLaunchingWithOptions: function () {
        // Allow for XCode 8 API changes
        //utils.ios.getter(UIApplication, UIApplication.sharedApplication).statusBarStyle = UIStatusBarStyle.LightContent;
        UIApplication.sharedApplication.statusBarStyle = UIStatusBarStyle.LightContent;
        return true;
      }
    }, {
        name: "AppDelegate",
        protocols: [UIApplicationDelegate]
      });
    application.ios.delegate = AppDelegate;
  }

  // Make the Android status bar transparent.
  // See http://bradmartin.net/2016/03/10/fullscreen-and-navigation-bar-color-in-a-nativescript-android-app/
  // for details on the technique used.
  if (application.android) {
    application.android.onActivityStarted = function () {
      if (application.android && platform.device.sdkVersion >= "21") {
        const View = android.view.View;
        const window = application.android.startActivity.getWindow();
        window.setStatusBarColor(0x000000);

        const decorView = window.getDecorView();
        decorView.setSystemUiVisibility(
          View.SYSTEM_UI_FLAG_LAYOUT_STABLE
          | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
          | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
          | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
      }
    };
  }
}

export function configureiOSBackgroundColor() {
  var iosFrame = frameModule.topmost().ios;
  if (iosFrame) {
    // Fix status bar color and nav bar vidibility
    iosFrame.controller.view.window.backgroundColor = UIColor.blackColor;
    iosFrame.navBarVisibility = 'never';
  }
}
