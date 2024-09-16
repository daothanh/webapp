import { defineStore } from 'pinia'
import { ref } from 'vue'
import contractorApi from '@/apis/project-management/contractor.ts'
import { PAGINATION } from '@/contants'
import { Contractor, SearchForm } from '@/types/contractor.ts'

interface SearchParams extends SearchForm {
  pageSize: number
  currentPage: number
}
export const useContractorStore = defineStore('contractStore', () => {
  const contractors = ref<Contractor[]>([])
  const loading = ref(false)
  const pagination = ref({ ...PAGINATION })

  const fetchContractors = async (params: SearchParams) => {
    try {
      loading.value = true
      const data = await contractorApi.search(params)
      if (data) {
        contractors.value = data.body.data
        pagination.value.total = data?.body?.page_meta?.total_elements || 0
      }
    } finally {
      loading.value = false
    }
  }

  return {
    contractors,
    loading,
    pagination,
    fetchContractors
  }
})
