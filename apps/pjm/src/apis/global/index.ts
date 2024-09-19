import type { AxiosResponse } from 'axios'
import { useAppRequest } from '@/composable'
import { fsm, iam, sys } from '@/apis/defineRouting.ts'

const $req = useAppRequest()

export const getCompanyList = async (params?: {
  listOrgUnitType: string | number
  orgUnitId?: number
  getParent?: boolean
}) => {
  const res: AxiosResponse = await $req.setModuleCode('sys').httpRequest().get(`${sys.GET_COMPANY_LIST}`, { params })
  return res.data
}

// Lấy danh sách phân loại khu vực
export const getGlobalListDetail = async (params: { code: string }) => {
  const res: AxiosResponse = await $req.setModuleCode('sys').httpRequest().get(`${sys.GET_GLOBAL_LIST_DETAIL}`, {
    params
  })
  return res.data
}

// Lấy file
export const getFile = async (params: { objectCode: string; objectId?: number }) => {
  const res: AxiosResponse = await $req.setModuleCode('sys').httpRequest().get(`${fsm.GET_FILE}`, { params })
  return res.data
}

// Tải file lên
export const uploadFile = async (params: any) => {
  const res: AxiosResponse = await $req.setModuleCode('sys').httpRequest().post(
    `${fsm.UPLOAD_MULTIPART_FILE}`,
    params,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
  return res.data
}

export const getApplicationList = async () => {
  const res: AxiosResponse = await $req.setModuleCode('sys').httpRequest().get(`${iam.ALL_CLIENT}`)
  return res.data
}

//Lấy danh sách tỉnh thành
export const getListProvince = async () => {
  const res: AxiosResponse = await $req.setModuleCode('sys').httpRequest().post(`${sys.GET_PROVINCE}`, {})
  return res.data
}

//Lấy danh sách huyện
export const getListDistrict = async (params: any) => {
  const res: AxiosResponse = await $req.setModuleCode('sys').httpRequest().post(`${sys.GET_DISTRICT}`, params)
  return res.data
}

//Lấy danh sách xã
export const getListCommune = async (params: any) => {
  const res: AxiosResponse = await $req.setModuleCode('sys').httpRequest().post(`${sys.GET_COMMUNE}`, params)
  return res.data
}

//Lấy đối tượng theo loại đối tượng
export const getObjectListByCode = async (path: string, params: any) => {
  const res: AxiosResponse = await $req.setModuleCode('sys').httpRequest().get(`${path}`, { params })
  return res.data
}
