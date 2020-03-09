const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const webpush = require('web-push') //requiring the web-push module

const app = express()
const port = 4000

app.use(cors())
app.use(bodyParser.json())

const dummyDb = { subscriptions: [] }

const saveToDatabase = subscription => {
  // Since this is a demo app, I am going to save this in a dummy in memory store. Do not do this in your apps.
  // Here you should be writing your db logic to save it.
  dummyDb.subscriptions.push(subscription)
}

const vapidKeys = {
  publicKey: 'BEyvJLn1EpAaiMd-98k-mSvpFtdzSfsdA1Gw__MrjaX0Ft9Pn9P8WI6ciFyewQtMU8LORXanLwMFgPIfWWByjhQ',
  privateKey: 'Ue9IZ4eCG8b0MiDY51SpabRi7mtvQ_rgtc_5q2dzLuw'
}

// setting VAPID keys
webpush.setVapidDetails(
  'mailto:myuserid@email.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

// function to send the notification on the subscribed device
const sendNotification = (subscription, dataToSend) => {
  webpush.sendNotification(subscription, dataToSend)
}

// routing
app.get('/', (req, res) => { res.send('Hello!') })

// The new /save-subscription endpoint
app.post('/save-subscription', async (req, res) => {
  console.log(req)
  const subscription = req.body
  //Method to save the subscription to Database
  await saveToDatabase(subscription)
  res.json({ message: 'success', subscription })
})

// route to test send notification
app.get('/send-notification', (req, res) => {
  const message = 'Hello Michael'
  for (let i = 0; i < dummyDb.subscriptions.length; i++) {
    sendNotification(dummyDb.subscriptions[i], message)
  }
  res.json({ message: 'message sent' })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
