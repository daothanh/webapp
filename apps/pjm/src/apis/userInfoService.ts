import type { AxiosResponse } from 'axios'
import { useAppRequest } from '@/composable'
import { getItemFromLocalStorage } from '@/utils'
import { KEY_LOCAL } from '@/contants'
import type { TypeAPIError } from '@/apis/types.ts'

const { externalRequest } = useAppRequest()
export const getUserInfo = async (access_token?: string) => {
  const token = access_token || getItemFromLocalStorage(`${KEY_LOCAL}access_token`)

  try {
    const res: AxiosResponse = await externalRequest('iam').post(`/user/userInfo`, {
      access_token: token
    })
    return res.data
  } catch (_error: TypeAPIError) {
    console.log(_error)
  }
}

export const changePassword = async () => {
  const res: AxiosResponse = await externalRequest('iam').post('/user/request-change-pwd')

  return res.data
}
