import type {AxiosResponse} from 'axios'
import { useAppRequest } from '@/composable'
import { auth } from '@/apis/defineRouting.ts'
import type { authParams } from '@/apis/auth/types.ts'

export const authAPI = {
  async exchangeToken(params: authParams) {
    const $request = useAppRequest()
    const res: AxiosResponse = await $request.setModuleCode('auth').httpRequest().post(`${auth.TOKEN_EXCHANGE}`, params)
    return res.data
  }
}
