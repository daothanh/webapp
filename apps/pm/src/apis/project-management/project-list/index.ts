import type { AxiosResponse } from 'axios'
import { $httpRequest } from '@/apis'
import { asm } from '@/apis/defineRouting.ts'

export const projectListService = {
  async search(params: {
    code: string
    name: string
    managerId: number
    type: number
    state: number
  }) {
    const res: AxiosResponse = await $httpRequest('asm').get(`${asm.PROJECT_LIST_SEARCH}`, {
      params
    })
    return res.data
  },
  async detail(params: { id: string }) {
    const res: AxiosResponse = await $httpRequest('asm').get(`${asm.PROJECT_LIST_DETAIL}`, {
      params
    })
    return res.data
  },
  async create(params: any) {
    const res: AxiosResponse = await $httpRequest('asm').post(`${asm.PROJECT_LIST_CREATE}`, params)
    return res.data
  },
  async update(params: any) {
    const res: AxiosResponse = await $httpRequest('asm').post(`${asm.PROJECT_LIST_UPDATE}`, params)
    return res.data
  },
  async grantAsset(params: any) {
    const res: AxiosResponse = await $httpRequest('asm').post(
      `${asm.PROJECT_LIST_GRANT_ASSET}`,
      params
    )
    return res.data
  },
  async revokeAsset(params: any) {
    const res: AxiosResponse = await $httpRequest('asm').post(
      `${asm.PROJECT_LIST_REVOKE_ASSET}`,
      params
    )
    return res.data
  },
  async getDocOfProject(params: any) {
    const res: AxiosResponse = await $httpRequest('asm').get(`${asm.PROJECT_LIST_GET_DOC}`, {
      params
    })
    return res.data
  },
  async updateDocOfProject(params: any) {
    const res: AxiosResponse = await $httpRequest('asm').post(
      `${asm.PROJECT_LIST_UPDATE_DOC}`,
      params
    )
    return res.data
  }
}
