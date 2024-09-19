import type { AxiosResponse } from 'axios'
import { useAppRequest } from '@/composable'
import { asm } from '@/apis/defineRouting.ts'
import type { SearchForm , Contractor } from '@/types/contractor.ts'

const { httpRequest } = useAppRequest()
export default {
  search: async (params: SearchForm) => {
    const rs: AxiosResponse = await httpRequest().get(`${asm.PROJECT_CONTRACTOR_SEARCH}`, {
      params
    })
    return rs.data
  },
  fetch: async (id: string) => {
    const rs = await httpRequest().get(`${asm.PROJECT_CONTRACTOR_DETAIL}/${id}`)
    return rs.data
  },
  store: async (data: Contractor) => {
    const rs = await httpRequest().post(`${asm.PROJECT_CONTRACTOR_STORE}`, data)
    return rs.data
  },
  update: async (data: Contractor) => {
    const rs = await httpRequest().post(`${asm.PROJECT_CONTRACTOR_UPDATE}`, data)
    return rs.data
  },
  delete: async (id: number) => {
    const rs = await httpRequest().delete(`${asm.PROJECT_CONTRACTOR_DELETE}/${id}`)
    return rs.data
  }
}
