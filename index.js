// check enviroment is available
const envCheck = () => {
  if (!('serviceWorker') in navigator) {
    throw new Error('No service worker support!')
  }

  if (!('PushManager' in window)) {
    throw new Error('No Push Api support!')
  }
}

// register Service Worker
const registerServiceWorker = async () => {
  const swRegistration = await navigator.serviceWorker.register('service.js')
  return swRegistration
}

// request notifications permission
const requestNotificationPermission = async () => {
  const permission = await window.Notification.requestPermission()
  // value of permission can be 'granted', 'default', 'denied'
  // granted: user has accepted the request
  // default: user has dismissed the notification permission popup by clicking on x
  // denied: user has denied the request.
  if (permission !== 'granted') throw new Error('Permission not granted for Notification')
}

const serviceFunc = async () => {
  envCheck()
  const permission = await requestNotificationPermission()
  const swRegistration = await registerServiceWorker()
}
