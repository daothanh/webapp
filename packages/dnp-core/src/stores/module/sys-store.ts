import {defineStore} from "pinia";
import type { AxiosResponse } from "axios";
import {useFetchWithModule} from "../../composable/request";
import {ref} from "vue";
import type { GlobalListItem } from "../../types";
export const useSysStore = defineStore('sysModuleStore', () => {

    const urls = {
        GET_COMPANY_LIST: '/orgUnit/initTree',
        GET_PROVINCE: '/location/find-province',
        GET_DISTRICT: '/location/find-district',
        GET_COMMUNE: '/location/find-commune',
        GET_GLOBAL_LIST_DETAIL: '/globalListDetail/getListGlobalValueByCode',
        STAFF_SEARCH: '/staff/search',
        UPLOAD_MULTIPART_FILE: '/file/upload-multipart',
        GET_FILE: '/file/getFile',
        ALL_CLIENT: '/client/findAll'
    }

    const { post, get } = useFetchWithModule('sys')

    const companyList = ref([])
    interface GlObj {
        [T: string]: GlobalListItem[]
    }
    const globalListItems = ref<GlObj>({})

    interface Option {
        label: string
        value: string
    }
    const provinces = ref<Option[]>([])
    const districts = ref<Option[]>([])
    const wards = ref<Option[]>([])
    const loading = ref<boolean>(false)

    const fetchProvinces = async () => {
        if (!provinces.value.length) {
            loading.value = true
            try {
                const res = await getListProvince()
                if (res.message === 'SUCCESS') {
                    provinces.value = res.body.map((item: { fullName: string; areaCode: string }) => {
                        return {
                            label: item.fullName,
                            value: item.areaCode
                        }
                    })
                }
            } finally {
                loading.value = false
            }
        }
        return provinces.value
    }

    const fetchDistricts = async (params: { parentCode: string | null }) => {
        params = params || {}
        loading.value = true
        try {
            const res = await getListDistrict(params)
            if (res.message === 'SUCCESS') {
                districts.value = res.body.map((item: { name: string; areaCode: string }) => {
                    return {
                        label: item.name,
                        value: item.areaCode
                    }
                })
            }
        } finally {
            loading.value = false
        }
        return districts.value
    }

    const fetchWards = async (params: { parentCode: string }) => {
        params = params || {}
        loading.value = true
        try {
            const res = await getListCommune(params)
            if (res.message === 'SUCCESS') {
                wards.value = res.body.map((item: { name: string; areaCode: string }) => {
                    return {
                        label: item.name,
                        value: item.areaCode
                    }
                })
            }
        } finally {
            loading.value = false
        }
        return wards.value
    }

    const fetchGlobalList = async (code: string) => {
        const temp: GlObj = { ...globalListItems.value }
        if (temp[code] === undefined) {
            temp[code] = []
        }
        if (temp[code].length === 0) {
            loading.value = true
            try {
                const res = await getGlobalListDetail({ code })
                if (res.message === 'SUCCESS') {
                    temp[code] = res.body
                }
            } finally {
                loading.value = false
            }
        }
        globalListItems.value = { ...temp }
        return globalListItems.value
    }

    const fetchGlobalListByCodes = async (codes: string[]) => {
        for (const code of codes) {
            await fetchGlobalList(code)
        }
    }

    // Lấy danh sách công ty
    const getCompanyList = async (params?: {
        listOrgUnitType: string | number
        orgUnitId?: number
        getParent?: boolean
    }) => {
        if (companyList.value.length > 0) return companyList.value

        const res: AxiosResponse = await get(`${urls.GET_COMPANY_LIST}`, {params})
        companyList.value = res.data
        return res.data
    }

    // Lấy danh sách phân loại khu vực
    const getGlobalListDetail = async (params: { code: string }) => {
        const res: AxiosResponse = await get(`${urls.GET_GLOBAL_LIST_DETAIL}`, {
            params
        })
        return res.data
    }

    // Lấy file
    const getFile = async (params: { objectCode: string; objectId?: number }) => {
        const res: AxiosResponse = await get(`${urls.GET_FILE}`, {params})
        return res.data
    }

    // Tải file lên
    const uploadFile = async (params: any) => {
        const res: AxiosResponse = await post(
            `${urls.UPLOAD_MULTIPART_FILE}`,
            params,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        return res.data
    }

    const getApplicationList = async () => {
        const res: AxiosResponse = await get(`${urls.ALL_CLIENT}`)
        return res.data
    }

    //Lấy danh sách tỉnh thành
    const getListProvince = async () => {
        const res: AxiosResponse = await post(`${urls.GET_PROVINCE}`, {})
        return res.data
    }

    //Lấy danh sách huyện
    const getListDistrict = async (params: any) => {
        const res: AxiosResponse = await post(`${urls.GET_DISTRICT}`, params)
        return res.data
    }

    //Lấy danh sách xã
    const getListCommune = async (params: any) => {
        const res: AxiosResponse = await post(`${urls.GET_COMMUNE}`, params)
        return res.data
    }

    //Lấy đối tượng theo loại đối tượng
    const getObjectListByCode = async (path: string, params: any) => {
        const res: AxiosResponse = await get(`${path}`, {params})
        return res.data
    }

    return {
        provinces,
        districts,
        wards,
        loading,
        companyList,
        fetchProvinces,
        fetchDistricts,
        fetchWards,
        getCompanyList,
        getGlobalListDetail,
        getFile,
        uploadFile,
        getApplicationList,
        getListProvince,
        getListDistrict,
        getListCommune,
        getObjectListByCode
    }
}, {persist: true});