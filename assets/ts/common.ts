import "./components/SnapRouter/snap-routed.js";
import "./components/SnapPWAInstall/SnapPWAInstall.js";
import "./components/SnapStartlist/SnapStartlist.js";
import "./components/SnapUtils/snap-privacy-frame.js";

// Disabling check, because the typings always provide serviceWorker, but we need to progressively enhance
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (navigator.serviceWorker) {
  await navigator.serviceWorker.register("/sw.js", {
    scope: "/",
  });
}
