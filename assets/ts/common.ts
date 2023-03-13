import "./components/SnapRouter/snap-routed.js";
import "./components/SnapPWAInstall/SnapPWAInstall.js";
import "./components/SnapStartlist/SnapStartlist.js";
import "./components/SnapUtils/snap-privacy-frame.js";

if (navigator.serviceWorker) {
  navigator.serviceWorker.register("/sw.js", {
    scope: "/"
  });
}
