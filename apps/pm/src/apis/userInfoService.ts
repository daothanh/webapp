import type { AxiosResponse } from 'axios'
import { getItemFromLocalStorage } from '@/utils'
import { KEY_LOCAL } from '@/contants'
import type { TypeAPIError } from '@/apis/types.ts'
import { $httpRequest } from '@/apis/index.ts'

const BASE_URL = import.meta.env.VITE_BASE_URL
export const getUserInfo = async (access_token?: string) => {
  const token = access_token || getItemFromLocalStorage(`${KEY_LOCAL}access_token`)

  try {
    const res: AxiosResponse = await $httpRequest('iam').post(`/user/userInfo`, {
      access_token: token
    })
    return res.data
  } catch (_error: TypeAPIError) {
    console.log(_error)
  }
}

export const changePassword = async () => {
  const res: AxiosResponse = await $httpRequest('iam').post('/user/request-change-pwd')

  return res.data
}
