import { $httpRequest } from '@/apis'
import { sys } from '@/apis/defineRouting.ts'
import { AxiosResponse } from 'axios'

export const staffServices = {
  async search(params?: any) {
    const res: AxiosResponse = await $httpRequest('sys').post(`${sys.STAFF_SEARCH}`, params)
    return res.data
  }
}
