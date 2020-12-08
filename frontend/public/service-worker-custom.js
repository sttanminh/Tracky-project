self.addEventListener('push', event => {
    const data = event.data.json();
    self.clients.matchAll().then(function (clients){
      clients.forEach(function(client){
          console.log(data.message)
          client.postMessage(data.message);
      });
    }); 
});

self.addEventListener('install', event => {
  self.skipWaiting();
});