import type { AxiosResponse } from 'axios'
import { useAppRequest } from '@/composable'
import { noti } from '@/apis/defineRouting.ts'

const { externalRequest } = useAppRequest()

export const notiAppService = {
  async search(params: any) {
    const res: AxiosResponse = await externalRequest('noti').get(`${noti.NOTI_APP_SEARCH}`, { params })
    return res.data
  },

  async create(params: any) {
    const res: AxiosResponse = await externalRequest('noti').post(`${noti.NOTI_APP_CREATE}`, params)
    return res.data
  },

  async detail(params: { id: number }) {
    const res: AxiosResponse = await externalRequest('noti').get(`${noti.NOTI_APP_DETAIL}`, { params })
    return res.data
  },

  async getCountUnread(params: { id: number }) {
    const res: AxiosResponse = await externalRequest('noti').get(`${noti.NOTI_APP_GET_COUNT_UNREAD}`, {
      params
    })
    return res.data
  },

  async markRead(params: any) {
    const res: AxiosResponse = await externalRequest('noti').post(`${noti.NOTI_APP_MARK_READ}`, params)
    return res.data
  }
}
