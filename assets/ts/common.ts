import "./components/SnapRouter/SnapRouter.js";
import "./components/SnapPWAInstall/SnapPWAInstall.js";
import "./components/SnapStartlist/SnapStartlist.js";

if (navigator.serviceWorker) {
  navigator.serviceWorker.register("/sw.js", {
    scope: "/"
  });
}
