import { Excel } from 'antd-table-saveas-excel'
import moment from 'moment'
import { useAuthStore } from '@/stores/authStore.ts'
import _ from 'lodash'
import { message } from 'ant-design-vue'

export const setItemToLocalStorage = (key: string, payload: any): any => {
  return localStorage.setItem(key, JSON.stringify(payload))
}
export const getItemFromLocalStorage = (key: string) => {
  return JSON.parse(localStorage.getItem(key) || '{}')
}

export const isEmptyObject = (obj: object) => {
  return Object.keys(obj).length === 0
}

export const filterDataTree = (list: any) => {
  list = list.filter((item: any) => {
    return String(item.allow) === '1'
  })
  return list
}
export const buildTree = (list: any) => {
  const map: any = {}
  let node
  const roots = []
  let i = 0
  const length = list.length
  for (i = 0; i < length; i += 1) {
    map[list[i].orgUnitId] = i
    list[i].children = []
    list[i].title = list[i].orgUnitName
    list[i].key = list[i].orgUnitId
  }
  for (i = 0; i < length; i += 1) {
    node = list[i]
    if (node.upperOrgUnitId !== null) {
      if (list[map[node.upperOrgUnitId]]) {
        node.value = node.orgUnitName
        list[map[node.upperOrgUnitId]].children.push(node)
      } else {
        roots.push(node)
      }
    } else {
      roots.push(node)
    }
  }
  return roots
}

export const buildTreeParentChild = (list: any) => {
  const map: any = {}
  let node
  const roots = []
  let i = 0
  const length = list.length
  for (i = 0; i < length; i += 1) {
    map[list[i].id] = i
    list[i].children = []
    list[i].title = list[i].name
    list[i].key = list[i].id
  }
  for (i = 0; i < length; i += 1) {
    node = list[i]
    if (node.parentId !== null) {
      if (list[map[node.parentId]]) {
        node.value = node.name
        list[map[node.parentId]].children.push(node)
      } else {
        roots.push(node)
      }
    } else {
      roots.push(node)
    }
  }
  return roots
}

export const buildTreeParentChildCode = (list: any) => {
  const map: any = {}
  let node
  const roots = []
  let i = 0
  const length = list.length
  for (i = 0; i < length; i += 1) {
    map[list[i].id] = i
    list[i].children = []
    list[i].title = list[i].code
    list[i].key = list[i].id
  }
  for (i = 0; i < length; i += 1) {
    node = list[i]
    if (node.parentId !== null) {
      if (list[map[node.parentId]]) {
        node.value = node.code
        list[map[node.parentId]].children.push(node)
      } else {
        roots.push(node)
      }
    } else {
      roots.push(node)
    }
  }
  return roots
}

export const buildTreeParentChildWithKeyCode = (list: any) => {
  const map: any = {}
  let node
  const roots = []
  let i = 0
  const length = list.length
  for (i = 0; i < length; i += 1) {
    map[list[i].id] = i
    list[i].children = []
    list[i].title = list[i].name
    list[i].key = list[i].code
  }
  for (i = 0; i < length; i += 1) {
    node = list[i]
    if (node.parentId !== null) {
      if (list[map[node.parentId]]) {
        node.value = node.code
        list[map[node.parentId]].children.push(node)
      } else {
        roots.push(node)
      }
    } else {
      roots.push(node)
    }
  }
  return roots
}
export const convertDate = (str: string) => {
  const date = new Date(str),
    month = `0${date.getMonth() + 1}`.slice(-2),
    day = `0${date.getDate()}`.slice(-2)
  return [day, month, date.getFullYear()].join('/')
}

export function clearUserInfo() {
  localStorage.clear()
}

export function removeUtf8Vowel(val: string): string {
  let str = String(val)
  str = str.toLowerCase()
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  str = str.replace(/đ/g, 'd')
  str = str.trim()
  return str
}

export function removeUTF8(val: string): string {
  let str = val || ''
  if (str) {
    str = str.replace(/Đ/gi, 'DD')
    str = str.replace(/đ/gi, 'dd')

    str = str.replace(/Ê/gi, 'EE')
    str = str.replace(/ê/gi, 'ee')

    str = str.replace(/Ô/gi, 'OO')
    str = str.replace(/ô/gi, 'oo')

    str = str.replace(/Â/gi, 'AA')
    str = str.replace(/â/gi, 'aa')
  }
  return str
}

export const converVietNamese = (str = '') => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  str = str.replace(/đ/g, 'd')
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
  str = str.replace(/Đ/g, 'D')
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, '') // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, ' ')
  str = str.trim()
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ' '
  )
  return str
}

export function logOut() {
  clearUserInfo()
  setTimeout(() => {
    window.location.replace(import.meta.env.VITE_REDIRECT_URL_LOGOUT)
  }, 100)
}

export function sortDataMapPartition(data: any) {
  data.sort((a: { orgUnitCode: string; id: number }, b: { orgUnitCode: string; id: number }) => {
    return a.id - b.id
  })
  return data
}

export function onExportExcel(columnsTable: any, dataTable: any, router: any) {
  const excel = new Excel()
  const columnsExcel = columnsTable
    .filter((c: { dataIndex: string }) => c.dataIndex !== 'action')
    .map((e: { title: any; children: any }) => {
      return {
        ...e,
        title: e?.title || ''
      }
    })
  const nameRouter = router.currentRoute.value?.meta?.title || ''
  const today = moment().format('HH:mm:ss/DD-MM-YYYY')

  const nameExcel = `Báo cáo ${nameRouter}(${today})`.replace(/\s/g, '_') || 'excel'

  excel
    .addSheet(today)
    .addColumns(columnsExcel)
    .addDataSource(dataTable, {
      str2Percent: true
    })
    .saveAs(`${nameExcel}.xlsx`)
}

export const getTableRowIndex = (
  pageSize: number,
  currentPage: number,
  rowIndex: number
): number => {
  let current = currentPage
  if (currentPage === 0) {
    current = 0
  }
  return current * pageSize + rowIndex + 1
}

export function checkRoles(role: string) {
  const {
    auth: { userInfo: { authorization } = {} as any }
  } = useAuthStore()
  const roles =
    authorization
      ?.filter((item: { type: string }) => item.type === 'web')
      ?.map((item: { uri: string }) => item.uri) || []
  return role ? roles.includes(role) : true
}

export const formatThousand = (value: string | number) => {
  return value && !isNaN(Number(value)) && !value?.toString()?.includes('.')
    ? value?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : value
}

export const getListMonthCurrent = (year) => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const monthsPassed = []

  if (year.toString() === currentYear.toString()) {
    const currentMonth = currentDate.getMonth()
    for (let month = 0; month <= currentMonth; month++) {
      monthsPassed.push(month + 1)
    }
  } else if (year < currentYear) {
    for (let month = 0; month < 12; month++) {
      monthsPassed.push(month + 1)
    }
  }

  return monthsPassed
}

export const renderListMonth = (year: any, formatDate = 'MM/YYYY') => {
  const listMonth = getListMonthCurrent(year)

  return (
    listMonth?.map((m) => {
      return {
        id: m,
        key: m,
        title: `Kỳ ${m}`,
        value: moment(`${m}/${year}`, 'MM/YYYY').format(formatDate)
      }
    }) || []
  )
}

export const summaryColTable = (data, fieldName) => {
  if (!data.length) {
    return 0
  }
  const summaryValue = _.sumBy(data, (item) =>
    Number(Number(item[fieldName]) ? item[fieldName] : 0)
  )
  return formatThousand(summaryValue.toFixed().toString())
}

export const getFileUrl = (fileName: string) => {
  const BASE_URL = import.meta.env.VITE_WP_WDN_DESKTOP_URL
  return `${BASE_URL}/${fileName}`
}

export const copyTextToClipboard = (text: string) => {
  const input = document.createElement('input')
  input.value = text
  document.body.appendChild(input)
  input.select()
  const success = document.execCommand('copy')
  document.body.removeChild(input)

  message.success('Copy thành công')
}

export const openNewTab = (route) => {
  if (!route) {
    return
  }

  const newTab = window.open(route.href, '_blank')
  if (newTab) {
    newTab.focus()
  } else {
    console.error('Trình duyệt của bạn đã chặn mở tab mới. Vui lòng đồng ý bỏ chặn.')
  }
}

export const formatRelativeTime = (inputDate) => {
  const inputMoment = moment(inputDate, 'DD/MM/YYYY HH:mm')
  const currentMoment = moment()
  const timeDifference = currentMoment.diff(inputMoment, 'seconds')

  if (timeDifference < 60) {
    return 'Vừa xong'
  } else if (timeDifference < 3600) {
    const minutesAgo = Math.floor(timeDifference / 60)
    return `${minutesAgo} phút trước`
  } else if (timeDifference < 86400) {
    const hoursAgo = Math.floor(timeDifference / 3600)
    return `${hoursAgo} giờ trước`
  } else if (timeDifference < 2592000) {
    const daysAgo = Math.floor(timeDifference / 86400)
    return `${daysAgo} ngày trước`
  } else if (timeDifference < 31536000) {
    const monthsAgo = Math.floor(timeDifference / 2592000)
    return `${monthsAgo} tháng trước`
  } else {
    return inputMoment.format('DD/MM/YYYY HH:mm')
  }
}

export const showNotification = (title, options) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, options)
  } else if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification(title, options)
      }
    })
  }
}

export const renderProcessColorByState = (state: number | string) => {
  let color = null

  switch (parseFloat(state)) {
    case 1: {
      color = 'red'
      break
    }
    case 2: {
      color = '#C2998C'
      break
    }
    case 3: {
      color = '#E5BA4C'
      break
    }
    case 4: {
      color = '#05428C'
      break
    }
    case 5: {
      color = '#52C41A'
      break
    }
    case 6: {
      color = '#4CE5B1'
      break
    }
    default: {
      break
    }
  }

  return color
}

export const filterOption = (val: string, option: { value: string; label: string }) => {
  console.log(val, option.label)
  return val
    ? removeUtf8Vowel(option.label?.toLowerCase()).includes(
        removeUtf8Vowel(String(val).toLowerCase())
      )
    : false
}

export const getDevBaseUrl = (moduleCode: string) => {
  const devBaseUrls = {
    iam: 'http://localhost:8050',
    auth: 'http://localhost:8051',
    sys: 'http://localhost:8052',
    fsm: 'http://localhost:8054',
    wtpm: 'http://localhost:8057',
    noti: 'http://localhost:8058',
    asm: 'http://localhost:8059',
    wsm: 'http://localhost:8062'
  }
  return devBaseUrls[moduleCode]
}
