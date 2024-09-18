import type { AxiosResponse } from 'axios'
import { $httpRequest } from '@/apis'
import { asm } from '@/apis/defineRouting.ts'

export const contractProjectListService = {
  async search(params: any) {
    const res: AxiosResponse = await $httpRequest('asm').get(
      `${asm.CONTRACT_PROJECT_LIST_SEARCH}`,
      {
        params
      }
    )
    return res.data
  },
  async detail(params: { id: string }) {
    const res: AxiosResponse = await $httpRequest('asm').get(
      `${asm.CONTRACT_PROJECT_LIST_DETAIL}`,
      {
        params
      }
    )
    return res.data
  },
  async create(params: any) {
    const res: AxiosResponse = await $httpRequest('asm').post(
      `${asm.CONTRACT_PROJECT_LIST_CREATE}`,
      params
    )
    return res.data
  },
  async update(params: any) {
    const res: AxiosResponse = await $httpRequest('').post(
      `${asm.CONTRACT_PROJECT_LIST_UPDATE}`,
      params
    )
    return res.data
  },
  async delete(params: { id: string }) {
    const res: AxiosResponse = await $httpRequest('asm').post(
      `${asm.CONTRACT_PROJECT_LIST_DELETE}`,
      params
    )
    return res.data
  },
  async getDocOfContract(params: any) {
    const res: AxiosResponse = await $httpRequest('asm').get(
      `${asm.CONTRACT_PROJECT_LIST_GET_DOC}`,
      {
        params
      }
    )
    return res.data
  },
  async updateDocOfContract(params: any) {
    const res: AxiosResponse = await $httpRequest('asm').post(
      `${asm.CONTRACT_PROJECT_LIST_UPDATE_DOC}`,
      params
    )
    return res.data
  }
}
