import * as mqtt from 'mqtt/dist/mqtt'

const connection = {
  host: import.meta.env.VITE_DB_MAP_WDN_MQTT_URL,
  port: import.meta.env.VITE_DB_MAP_WDN_MQTT_PORT,
  endpoint: '/mqtt',
  clean: true,
  connectTimeout: 1000,
  clientId: `mqtt_client_${Math.random().toString(16).substring(2, 10)}`,
  username: import.meta.env.VITE_DB_MAP_WDN_MQTT_USERNAME,
  password: import.meta.env.VITE_DB_MAP_WDN_MQTT_PASSWORD,
  reconnectPeriod: 1000
}

const { host, port, endpoint, ...options } = connection
const connectUrl = `${host}:${port}${endpoint}`

let mqttClient
let onMessageCallback

const connect = () => {
  mqttClient = mqtt.connect(connectUrl, options)

  mqttClient.on('connect', () => {})

  mqttClient.on('message', (topic, message) => {
    if (onMessageCallback && message) {
      const parsedMessage = JSON.parse(message)
      onMessageCallback(topic, parsedMessage)
    }
  })

  mqttClient.on('error', (error) => {
    console.error('MQTT connection error:', error)
  })
}

export default {
  connect,

  subscribe: (topic) => {
    mqttClient.subscribe(topic, { qos: 1 })
    // console.log(`Subscribed to topic: ${topic}`)
  },

  publish: (topic, message) => {
    mqttClient.publish(topic, message)
    // console.log(`Published message to topic: ${topic}, message: ${message}`)
  },

  disconnect: () => {
    mqttClient.end()
    // console.log('Disconnected from MQTT broker')
  },

  onMessage: (callback) => {
    onMessageCallback = callback
  }
}
