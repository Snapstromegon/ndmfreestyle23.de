import "./components/SnapRouter/SnapRouter.js";
import "./components/SnapPWAInstall/SnapPWAInstall.js";

if(navigator.serviceWorker){
  navigator.serviceWorker.register('/sw.js', {
    scope: '/'
  });
}
