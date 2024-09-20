import type {AxiosResponse} from 'axios'
import { useAppRequest } from '@/composable'
import { auth } from '@/apis/defineRouting.ts'
import type { authParams } from '@/apis/auth/types.ts'

export const authAPI = {
  async exchangeToken(params: authParams) {
    const { externalRequest } = useAppRequest()
    const req: AxiosResponse = await externalRequest('auth')
    const res = await req.post(`${auth.TOKEN_EXCHANGE}`, params)
    return res.data
  }
}
