import { $httpRequest } from '@/apis'
import { asm } from '@/apis/defineRouting.ts'
import { AxiosResponse } from 'axios'
import { SearchForm } from '@/types/contractor.ts'
import { Contractor } from '@/types/contractor.ts'

export default {
  search: async (params: SearchForm) => {
    const rs: AxiosResponse = await $httpRequest('asm').get(`${asm.PROJECT_CONTRACTOR_SEARCH}`, {
      params
    })
    return rs.data
  },
  fetch: async (id: string) => {
    const rs = await $httpRequest('asm').get(`${asm.PROJECT_CONTRACTOR_DETAIL}/${id}`)
    return rs.data
  },
  store: async (data: Contractor) => {
    const rs = await $httpRequest('asm').post(`${asm.PROJECT_CONTRACTOR_STORE}`, data)
    return rs.data
  },
  update: async (data: Contractor) => {
    const rs = await $httpRequest('asm').post(`${asm.PROJECT_CONTRACTOR_UPDATE}`, data)
    return rs.data
  },
  delete: async (id: number) => {
    const rs = await $httpRequest('asm').delete(`${asm.PROJECT_CONTRACTOR_DELETE}/${id}`)
    return rs.data
  }
}
