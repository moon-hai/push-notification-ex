// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// saveSubscription saves the subscription to the backend
const saveSubscription = async subscription => {
  const SERVER_URL = 'http://localhost:4000/save-subscription'
  const response = await fetch(SERVER_URL, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subscription)
  })

  return response.json()
}

// install
self.addEventListener('install', async event => {
  console.log('Installed sw.js', event);
})

// activate
self.addEventListener('activate', async () => {
  try {
    const applicationServerKey = urlB64ToUint8Array('BEyvJLn1EpAaiMd-98k-mSvpFtdzSfsdA1Gw__MrjaX0Ft9Pn9P8WI6ciFyewQtMU8LORXanLwMFgPIfWWByjhQ')
    const options = {
      applicationServerKey,
      userVisibleOnly: true
    }

    const subscription = await self.registration.pushManager.subscribe(options)
    const response = await saveSubscription(subscription)
    console.log(response)
    return response
  } catch (err) {
    console.log('Error', err)
  }
})

// Listen to Push event
self.addEventListener('push', function(event) {
  if (event.data) {
    console.log('Push event!! ', event.data.text())
    self.registration.showNotification('Yolo', { body: event.data.text() })
    // showLocalNotification('Yolo', event.data.text(), self.registration)
  } else {
    console.log('Push event but no data')
  }
})

// const showLocalNotification = (title, body, swRegistration) => {
//   const options = {
//     body,
//     // here you can add more properties like icon, image, vibrate, etc.
//   }
//   swRegistration.showNotification(title, options)
// }
