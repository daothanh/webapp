import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getGlobalListDetail,
  getListCommune,
  getListDistrict,
  getListProvince
} from '@/apis/global'
import type { GlobalListItem } from '@/types/global-list.ts'

export const useLocationStore = defineStore(
  'locationStore',
  () => {
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

    return { provinces, districts, wards, loading, fetchProvinces, fetchDistricts, fetchWards }
  },
  { persist: true }
)

export const useGlobalListStore = defineStore(
  'globalListStore',
  () => {
    interface GlObj {
      [T: string]: GlobalListItem[]
    }
    const loading = ref(false)
    const globalListItems = ref<GlObj>({})

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

    return { globalListItems, loading, fetchGlobalList, fetchGlobalListByCodes }
  },
  { persist: true }
)
