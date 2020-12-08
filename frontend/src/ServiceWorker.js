export function register(config) {
  if ('serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }
    // register service worker on window load
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker-custom.js', {scope: '/'})
      .then(registration => {
        console.log(registration);
      })
      .catch(error => {
        console.log(error)
      })      
    });
  }
}

export function registerMessageNotification(callback){
  return navigator.serviceWorker.addEventListener('message', (message) => {
    callback(message.data);
  });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}
