import type { AxiosResponse } from 'axios'
import { $httpRequest } from '@/apis'
import { sys } from '@/apis/defineRouting.ts'

export const staffServices = {
  async search(params?: any) {
    const res: AxiosResponse = await $httpRequest('sys').post(`${sys.STAFF_SEARCH}`, params)
    return res.data
  }
}
