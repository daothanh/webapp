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

    const companies = ref([])
    const companyLoading = ref(false)

    interface GlObj {
        [T: string]: GlobalListItem[]
    }

    const globalListItems = ref<GlObj>({})
    const globalListLoading = ref(false)
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
                const {body} = await post(`${urls.GET_PROVINCE}`, {})
                provinces.value = body.map((item: { fullName: string; areaCode: string }) => {
                    return {
                        label: item.fullName,
                        value: item.areaCode
                    }
                })
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
            const {body} = await post(`${urls.GET_DISTRICT}`, params)
            districts.value = body.map((item: { name: string; areaCode: string }) => {
                return {
                    label: item.name,
                    value: item.areaCode
                }
            })
        } finally {
            loading.value = false
        }
        return districts.value
    }

    const fetchWards = async (params: { parentCode: string }) => {
        params = params || {}
        loading.value = true
        try {
            const { body } = await post(`${urls.GET_COMMUNE}`, params)
            wards.value = body.map((item: { name: string; areaCode: string }) => {
                return {
                    label: item.name,
                    value: item.areaCode
                }
            })
        } finally {
            loading.value = false
        }
        return wards.value
    }

    const fetchGlobalList = async (code: string) => {
        if (!globalListItems.value[code]?.length) {
            globalListLoading.value = true
            try {
                const {body} = await get(`${urls.GET_GLOBAL_LIST_DETAIL}`, {params: {code}})
                if (body) {
                    globalListItems.value = {
                        ...globalListItems.value,
                        [code]: body
                    }
                }
            } finally {
                globalListLoading.value = false
            }
        }
        return globalListItems.value
    }

    const fetchGlobalListByCodes = async (codes: string[]) => {
        await Promise.all(codes.map(code => fetchGlobalList(code)))
    }

    // Lấy danh sách công ty
    const fetchCompanies = async (params?: {
        listOrgUnitType: string | number
        orgUnitId?: number
        getParent?: boolean
    }) => {
        companyLoading.value = true
        const {body}: AxiosResponse = await get(urls.GET_COMPANY_LIST, {params})
        companies.value = body
        companyLoading.value = false
        return body
    }

    // Lấy file
    const fetchFile = async (params: { objectCode: string; objectId?: number }) => {
        const {body} = await get(`${urls.GET_FILE}`, {params})
        return body
    }

    // Tải file lên
    const uploadFile = async (params: FormData) => {
        return await post(urls.UPLOAD_MULTIPART_FILE, params, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    const getApplicationList = async () => await get(`${urls.ALL_CLIENT}`)

    // Lấy đối tượng theo loại đối tượng
    const getObjectListByCode = async (path: string, params: any) => await get(`${path}`, {params})

    return {
        globalListItems,
        provinces,
        districts,
        wards,
        loading,
        companies,
        companyLoading,
        fetchGlobalListByCodes,
        fetchProvinces,
        fetchDistricts,
        fetchWards,
        fetchCompanies,
        fetchFile,
        uploadFile,
        getApplicationList,
        getObjectListByCode
    }
}, {persist: true});