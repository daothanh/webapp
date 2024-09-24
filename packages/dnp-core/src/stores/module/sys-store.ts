import {defineStore} from "pinia";
import type {AxiosResponse} from "axios";
import {useFetchWithModule} from "../../composable/request";
import {ref} from "vue";
import type {GlobalListItem} from "../../types";

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

    const {post, get} = useFetchWithModule('sys')

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
        if (!globalListItems.value[code]?.length) {
            loading.value = true
            try {
                const res = await getGlobalListDetail({code})
                if (res.message === 'SUCCESS') {
                    globalListItems.value = {
                        ...globalListItems.value,
                        [code]: res.body
                    }
                }
            } finally {
                loading.value = false
            }
        }
        return globalListItems.value
    }

    const fetchGlobalListByCodes = async (codes: string[]) => {
        await Promise.all(codes.map(code => fetchGlobalList(code)))
    }

    // Lấy danh sách công ty
    const getCompanyList = async (params?: {
        listOrgUnitType: string | number
        orgUnitId?: number
        getParent?: boolean
    }) => {
        if (companyList.value.length) return companyList.value

        const {data}: AxiosResponse = await get(urls.GET_COMPANY_LIST, {params})
        companyList.value = data
        return data
    }

    // Lấy danh sách phân loại khu vực
    const getGlobalListDetail = async (params: { code: string }) => {
        const {data} = await get(`${urls.GET_GLOBAL_LIST_DETAIL}`, {params})
        return data
    }

// Lấy file
    const getFile = async (params: { objectCode: string; objectId?: number }) => {
        const {data} = await get(`${urls.GET_FILE}`, {params})
        return data
    }

    // Tải file lên
    const uploadFile = async (params: FormData) => {
        return await post(urls.UPLOAD_MULTIPART_FILE, params, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    const getApplicationList = () => get(`${urls.ALL_CLIENT}`)

// Lấy danh sách tỉnh thành
    const getListProvince = () => post(`${urls.GET_PROVINCE}`, {})

// Lấy danh sách huyện
    const getListDistrict = (params: any) => post(`${urls.GET_DISTRICT}`, params)

// Lấy danh sách xã
    const getListCommune = (params: any) => post(`${urls.GET_COMMUNE}`, params)

// Lấy đối tượng theo loại đối tượng
    const getObjectListByCode = (path: string, params: any) => get(`${path}`, {params})

    return {
        globalListItems,
        provinces,
        districts,
        wards,
        loading,
        companyList,
        fetchGlobalListByCodes,
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