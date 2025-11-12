const publicVapidakey = "BN_WyNtu64YOPOPXLRWkJ_90n9OvVHxFuHdUequUOMuCOlDeHMWCHnw_jRP7GHAFXW_o4uFG5MSSOX6pT_6WW_c";

if ('serviceWorker' in navigator) {
  registerPush().catch(err => console.error("Service Worker Error:", err));
}

async function registerPush() {
  console.log("Registering service worker...");
  const register = await navigator.serviceWorker.register('/worker.js', { scope: '/' });
  console.log("Service worker registered:", register);

  console.log("Waiting for service worker to be ready...");
  const ready = await navigator.serviceWorker.ready;

  console.log("Subscribing to push notifications...");
  const subscription = await ready.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidakey),
  });

  console.log("Subscription complete:", subscription);

  // Send subscription to backend
  await fetch('/api/notifications/webshow', {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: { 'Content-Type': 'application/json' }
  });

  console.log("Subscription sent to backend successfully!");
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}


