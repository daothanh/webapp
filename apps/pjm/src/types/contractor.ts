export interface Contractor {
  id?: number
  type: number | null
  typeName: string | null
  code: string | null
  name: string | null
  idNo: string | null
  provinceCode: string | null
  provinceName: string | null
  districtCode: string | null
  commueCode: string | null
  address: string | null
  legalType: number | null
  legalTypeName: string | null
  status: number | null
}
export interface SearchForm {
  keyword: string | null
  type: string | null
  provinceCode: string | null
  legalType: string | null
}
