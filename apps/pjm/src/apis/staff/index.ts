import type { AxiosResponse } from 'axios'
import { useAppRequest } from '@/composable'
import { sys } from '@/apis/defineRouting.ts'

const $request = useAppRequest()
export const staffServices = {
  async search(params?: any) {
    const res: AxiosResponse = await $request.setModuleCode('sys').httpRequest().post(`${sys.STAFF_SEARCH}`, params)
    return res.data
  }
}
