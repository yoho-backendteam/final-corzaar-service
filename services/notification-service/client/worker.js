
// self.addEventListener('push', (event) => {
//   console.log("event", event);

//   if (!event.data) return;
//   const data = event.data.json();
//   console.log("event", event);
//   console.log("aaaaa",event.data);
//   console.log("Push Received:", data);

//   const options = {
//     body: data.body || "You have a new notification!",
//     icon: data.icon || "https://cdn-icons-png.flaticon.com/512/1827/1827370.png",
//     // data: { url: data.url || "/" },
//   };

//   event.waitUntil(
//     self.registration.showNotification(data.title || "Notification", options)
//   );
// });

// self.addEventListener("notificationclick", (event) => {
//   event.notification.close();
//   event.waitUntil(clients.openWindow(event.notification.data.url));
// });


self.addEventListener("push", function (event) {
  const data = event.data.json();
  console.log("Push received:", data);

  const options = {
    body: data.body,
    icon: "/icons/notification.png",
    data: { url: data.url || "/" },
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});
