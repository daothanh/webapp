<script setup>
import leaflet from 'leaflet'
import { onBeforeUpdate, onMounted, reactive, ref, toRaw, watch, watchEffect } from 'vue'
import data from '../../configs/data/dataArea.json'
import Drawer from '../drawer/DrawerDMA.vue'
import senserData from '../../configs/data/datasensor.json'
import moment from 'moment'

const map = ref(null)

let datasValue = reactive([])
let tooltipsValue = reactive([])
let polygons = reactive([])
let searchAreaDatas = reactive([])
let searchPolygons = reactive([])
let tooltipsValuesSearch = reactive([])
let datasValueSearch = reactive([])

const clockIcons = ref([])
const sensorIcons = ref([])

const sensorInfo = ref({})

//constiable drawer
const visible = ref(false)
const dataDrawer = ref({})

//web socket
let webSocket = reactive(null)
const token = ref('')

const props = defineProps({
  checkedAreaDatas: {
    type: Array,
    required: true
  },
  checkedClockDatas: {
    type: Array,
    required: true
  },
  checkedSensorDatas: {
    type: Array,
    required: true
  }
})

onMounted(() => {
  // real time data
  token.value =
    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkb3RiQGNhcnBsYS52biIsInVzZXJJZCI6ImZjOWM2YWYwLWRjZWUtMTFlZC1hZjM1LTEzNzkzNDUwZGQ3NCIsInNjb3BlcyI6WyJURU5BTlRfQURNSU4iXSwiaXNzIjoidGhpbmdzYm9hcmQuaW8iLCJpYXQiOjE2ODIwNTc5NzAsImV4cCI6MTY4MjA2Njk3MCwiZmlyc3ROYW1lIjoiRG8iLCJsYXN0TmFtZSI6IlRyYW4iLCJlbmFibGVkIjp0cnVlLCJpc1B1YmxpYyI6ZmFsc2UsInRlbmFudElkIjoiYzNjODA4ZTAtNzA0ZS0xMWVkLWFmMzUtMTM3OTM0NTBkZDc0IiwiY3VzdG9tZXJJZCI6IjEzODE0MDAwLTFkZDItMTFiMi04MDgwLTgwODA4MDgwODA4MCJ9.zxgXPbCKLOPisvFgwDslCGxbMT0qEImJ0mSfRulLsRkA4pT-rDMdhN2KWvnOpDzNAAN4TU-xYHnY8402ivhziQ'

  openWebSocket()

  // map
  map.value = leaflet
    .map('map', {
      // zoomAnimation: false
    })
    .setView([15.9030623, 105.8066925], 5)
  leaflet
    .tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    })
    .addTo(map.value)

  //convert data
  data.forEach((item) => {
    datasValue.push(item['data'])
    tooltipsValue.push(item['tendmr'])
  })

  datasValue.forEach((p, index) => {
    const polygon = leaflet
      .polygon(p, { color: 'green ' })
      .bindTooltip(tooltipsValue[index])
      .addTo(toRaw(map.value))
    polygons.push(polygon)
  })

  for (let i = 0; i < polygons.length; i++) {
    polygons[i].on('click', function (e) {
      for (let j = 0; j < polygons.length; j++) {
        polygons[j].setStyle({ color: 'green' })
      }
      e.target.setStyle({ color: 'red' })

      e.target.closeTooltip()

      visible.value = true
      dataDrawer.value.title = tooltipsValue[i]
      sendData(tooltipsValue[i])

      webSocket.onmessage = function (event) {
        const received_msg = event.data
        sensorInfo.value = JSON.parse(received_msg)
        if (dataDrawer.value && dataDrawer.value.data) {
          dataDrawer.value.data.push(JSON.parse(received_msg))
        }
      }

      //show Popup
      const popupContent = `<b>tendmr</b><br>${tooltipsValue[i]}`
      const popup = leaflet.popup().setContent(popupContent)
      popup.setLatLng(e.latlng).openOn(toRaw(map.value))

      // set color polygon search
      //- Khi selected area khu vực khác các area đang select -> Giữ màu vàng cho vùng đang được select

      for (let i = 0; i < searchPolygons.length; i++) {
        searchPolygons[i].setStyle({ color: 'orange' })
      }
    })
  }
  map.value.fitBounds(datasValue)
})

watch(
  () => [props.checkedAreaDatas, props.checkedClockDatas, props.checkedSensorDatas],
  (newValue, oldValue) => {
    if (newValue[0].length) {
      toRaw(map.value).closePopup()

      // NEW CODE

      //1. Reset lại màu của tất cả các vùng

      searchPolygons.forEach((p, index) => {
        p.remove()
      })

      datasValueSearch = []
      searchPolygons = []
      searchAreaDatas = []
      tooltipsValuesSearch = []

      //2. Set màu vàng cho các area được select

      // get dữ liệu các area được check
      data.forEach((item, index) => {
        const checkItem = newValue[0].find((i) => item.tendmr === i.tendmr)
        if (checkItem) {
          {
            //check
            searchAreaDatas.push(item)
          }
        } else {
          // uncheck
          searchAreaDatas.splice(index, 1)
        }
      })

      // mapping data
      searchAreaDatas.forEach((item) => {
        datasValueSearch.push(item['data'])
        tooltipsValuesSearch.push(item['tendmr'])
      })

      // tô màu vàng
      datasValueSearch.forEach((p, index) => {
        const polygon = leaflet
          .polygon(p, { color: 'orange' })
          .bindTooltip(tooltipsValuesSearch[index])
          .addTo(toRaw(map.value))
        searchPolygons.push(polygon)
      })

      //3. Bắt sự kiện click. Tô màu cho các vùng được click

      for (let i = 0; i < searchPolygons.length; i++) {
        searchPolygons[i].on('click', function (e) {
          for (let j = 0; j < searchPolygons.length; j++) {
            searchPolygons[j].setStyle({ color: 'orange' })
          }
          e.target.setStyle({ color: 'red' })
          e.target.closeTooltip()

          visible.value = true
          dataDrawer.value.title = tooltipsValuesSearch[i]
          sendData(tooltipsValuesSearch[i])

          webSocket.onmessage = function (event) {
            const received_msg = event.data
            sensorInfo.value = JSON.parse(received_msg)
            if (dataDrawer.value && dataDrawer.value.data) {
              dataDrawer.value.data.push(JSON.parse(received_msg))
            }
          }

          //show Popup
          const popupContent = `<b>tendmr</b><br>${tooltipsValuesSearch[i]}`
          const popup = leaflet.popup().setContent(popupContent)
          popup.setLatLng(e.latlng).openOn(toRaw(map.value))

          // set color polygon search
          for (let i = 0; i < polygons.length; i++) {
            polygons[i].setStyle({ color: 'green' })
          }
        })
      }
      map.value.fitBounds(datasValueSearch)
    } else {
      //reset all old data
      toRaw(map.value).closePopup()
      searchPolygons.forEach((p, index) => {
        p.remove()
      })

      datasValueSearch = []
      searchPolygons = []
      searchAreaDatas = []
      tooltipsValuesSearch = []
    }

    if (newValue[1].length) {
      const myIcon = leaflet.icon({
        iconUrl: '/clock.svg',
        iconSize: [38, 95],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
      })

      //remove old icon

      clockIcons.value.forEach((icon) => {
        if (map.value.hasLayer(icon)) {
          map.value.removeLayer(icon)
        }
      })

      newValue[1].forEach((item) => {
        if (item.Latitude && item.Longitude) {
          const icon = leaflet
            .marker([item.Latitude, item.Longitude], { icon: myIcon })
            .bindPopup(
              `
        <div class="flex flex-col">
          <div class="font-bold my-1">Thông số chi tiết</div>
          <div>Chỉ số 1: ....</div>
          <div>Chỉ số 2: ....</div>
        </div>
        `
            )
            .addTo(toRaw(map.value))
          clockIcons.value.push(icon)
        }
      })
      // const group = new leaflet.featureGroup(clockIcons.value);
      // toRaw(map.value).fitBounds(group.getBounds());
    } else {
      clockIcons.value.forEach((icon) => {
        map.value.removeLayer(icon)
      })
    }
    if (newValue[2].length) {
      const sensorIcon = leaflet.icon({
        iconUrl: '/sensor.svg',
        iconSize: [20, 45],
        popupAnchor: [-3, -16],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
      })

      //remove old icon

      sensorIcons.value.forEach((icon) => {
        if (map.value.hasLayer(icon)) {
          map.value.removeLayer(icon)
        }
      })
      // sensorIcons.value = []

      newValue[2].forEach(async (item, index) => {
        if (item.Latitude && item.Longitude) {
          const icon = leaflet
            .marker([item.Latitude, item.Longitude], { icon: sensorIcon })
            .bindPopup('')
            .addTo(toRaw(map.value))

          map.value.on('zoomend', function () {
            const zoomLevel = map.value.getZoom()
            let iconSize
            if (zoomLevel > 15) {
              iconSize = [2 * zoomLevel, 2 * zoomLevel]
            } else {
              iconSize = [20, 45]
            }

            sensorIcon.options.iconSize = iconSize
            icon.setIcon(sensorIcon)
          })

          icon.on('click', function (e) {
            sendData(null, item)
            // icon.bindPopup('').openPopup()
            webSocket.onmessage = function (event) {
              const received_msg = event.data
              sensorInfo.value = JSON.parse(received_msg)
              const updatedTime = sensorInfo.value?.data?.mH2O
                ? moment(sensorInfo.value.data.mH2O[0][0]).format('DD-MM-YYYY HH:mm:ss')
                : ''
              const mH20 = sensorInfo.value?.data?.mH2O
                ? `${sensorInfo.value.data.mH2O[0][1]}m`
                : ''
              icon.getPopup().setContent(`
                        <div class="flex flex-col">
                          <div class="font-bold my-1 text-center">Thông tin sensor: ${item.Sensor}</div>
                          <div class="flex flex-col gap-y-1">
                              <div><span>Áp lực: </span><span class="font-bold">${mH20}</span></div>
                              <div><span>Thời gian cập nhật:</span> <span class="font-bold">${updatedTime}</span></div>
                          </div>
                        </div>
                        `)
              if (dataDrawer.value && dataDrawer.value.data) {
                dataDrawer.value.data.push(JSON.parse(received_msg))
              }
            }
          })

          sensorIcons.value.push(icon)
        }
      })
      // const group = new leaflet.featureGroup(sensorIcons.value);
      // toRaw(map.value).fitBounds(group.getBounds());
    } else {
      sensorIcons.value.forEach((icon) => {
        map.value.removeLayer(icon)
      })
    }
  }
)

const changeVisibleDrawer = () => {
  visible.value = false
  dataDrawer.value = {}
  toRaw(map.value).closePopup()
}

const sendData = (tendmr, sensor = {}) => {
  if (!sensor.EntityID) {
    //Find sensor
    const sensorList = senserData.filter((sensor) => {
      return sensor['Sub-DMA'] === tendmr.replaceAll(' ', '')
    })

    dataDrawer.value.data = []
    dataDrawer.value.sensorList = []
    if (sensorList.length) {
      dataDrawer.value.sensorList = sensorList
      sensorList.forEach((sensor) => {
        const object = {
          tsSubCmds: [
            {
              entityType: 'DEVICE',
              entityId: sensor.EntityID,
              scope: 'LATEST_TELEMETRY',
              cmdId: 10
            }
          ],
          historyCmds: [],
          attrSubCmds: []
        }

        if (sensor.EntityID !== '#N/A') {
          const data = JSON.stringify(object)
          webSocket.send(data)
        }
      })
    }
  } else {
    const object = {
      tsSubCmds: [
        {
          entityType: 'DEVICE',
          entityId: sensor.EntityID,
          scope: 'LATEST_TELEMETRY',
          cmdId: 10
        }
      ],

      historyCmds: [],
      attrSubCmds: []
    }
    if (sensor.EntityID !== '#N/A') {
      const data = JSON.stringify(object)
      webSocket.send(data)
    }
  }
}

const openWebSocket = () => {
  webSocket = new WebSocket('wss://wboards.carpla.vn/api/ws/plugins/telemetry?token=' + token.value)

  // if (entityId === "YOUR_DEVICE_ID") {
  //   alert("Invalid device id!");
  //   webSocket.close();
  // }
  //
  // if (token === "YOUR_JWT_TOKEN") {
  //   alert("Invalid JWT token!");
  //   webSocket.close();
  // }

  webSocket.onopen = function () {
    console.log('Đã kết nối')
  }

  webSocket.onclose = function (event) {
    console.log('Connection is closed!')
    openWebSocket()
  }
}
</script>

<template>
  <div id="map" class="w-full h-[calc(100vh_-_134px)]" />
  <Drawer :visible="visible" :data="dataDrawer" @changeVisibleDrawer="changeVisibleDrawer" />
</template>

<style scoped></style>
