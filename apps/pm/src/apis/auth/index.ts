import type {AxiosResponse} from 'axios'
import axios from 'axios'
import { $httpRequest } from '@/apis'
import { auth } from '@/apis/defineRouting.ts'
import type { authParams } from '@/apis/auth/types.ts'

const BASE_URL = import.meta.env.VITE_BASE_URL
export const refreshToken = async (params: {
  refresh_token: string
  clientId: string
  access_token: string
}) => {
  const config = {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${params.access_token}`
    }
  }
  const res: AxiosResponse = await axios.post(
    `${BASE_URL}/cop/auth/auth/refresh-token`,
    { refreshToken: params.refresh_token, clientId: params.clientId },
    config
  )
  return res.data
}
export const authAPI = {
  async exchangeToken(params: authParams) {
    const res: AxiosResponse = await $httpRequest('auth').post(`${auth.TOKEN_EXCHANGE}`, params)
    return res.data
  }
}
