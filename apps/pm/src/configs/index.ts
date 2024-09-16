import { wdn } from '@/apis/defineRouting.ts'

export const GLOBAL_ROLES = {
  //Thông báo
  NOTI_APP_SEARCH: '/noti-app/search',
  NOTI_APP_CREATE: '/noti-app/create',
  NOTI_APP_DETAIL: '/noti-app/self',
  NOTI_APP_GET_COUNT_UNREAD: '/noti-app/count-unread',
  NOTI_APP_MARK_READ: '/noti-app/mark-read',

  //Quản lý dự án
  PROJECT_MANAGEMENT_SEARCH: '/asset-project/search',
  PROJECT_MANAGEMENT_CREATE: '/asset-project/create',
  PROJECT_MANAGEMENT_UPDATE: '/asset-project/update',
  PROJECT_MANAGEMENT_SELF: '/asset-project/self',
  PROJECT_MANAGEMENT_SEARCH_ASSET: '/asset-project/asset/search',
  PROJECT_MANAGEMENT_GRANT_ASSET: '/asset-project/asset/grant',
  PROJECT_MANAGEMENT_REVOKE_ASSET: '/asset-project/asset/revoke',
  PROJECT_MANAGEMENT_EXPORT_EXCEL: ' /asset-project/export-excel',
  PROJECT_MANAGEMENT_SEARCH_DOCUMENT: '/asset-project/doc/search',
  PROJECT_MANAGEMENT_UPDATE_DOCUMENT: '/asset-project/doc/update',
  //Quản lý nhà thâ
  PROJECT_CONTRACTOR_SEARCH: '/contractor/search',
  PROJECT_CONTRACTOR_CREATE: '/contractor/create',
  PROJECT_CONTRACTOR_UPDATE: '/contractor/update',
  PROJECT_CONTRACTOR_VIEW: '/contractor/view',
  PROJECT_CONTRACTOR_DELETE: '/contractor/delete'
}

export const MODE_ACTION_TO_PAGE = {
  VIEW: '0',
  EDIT: '1',
  CREATE: '2'
}

export const CALENDAR_LIST_TICKET_ORG = {
  MON: 'Thứ 2',
  TUE: 'Thứ 3',
  WED: 'Thứ 4',
  THU: 'Thứ 5',
  FRI: 'Thứ 6',
  SAT: 'Thứ 7',
  SUN: 'Chủ nhật'
}

export const STATE_PROJECT = {
  BUDGET_PRESENTATION: '1', //Trình ngân sách
  APPROVE_POLICY: '2', //Duyệt chủ trương
  PROJECT_PRESENTATION: '3', //Trình dự án
  APPROVE_PROJECT: '4', //Duyệt dự án
  SIGN_CONTRACT: '5', //Ký hợp đồng
  ACCEPTANCE: '6' //Nghiệm thu
}

export const ESTIMATED_COSTS_PROJECT = [
  { key: '', value: '', unit: 'đ' },
  { key: 'Chi phí xây dựng', value: '', unit: 'đ' },
  { key: 'Chi phí thiết bị', value: '', unit: 'đ' },
  { key: 'Chi phí QLDA', value: '', unit: 'đ' },
  { key: 'Chi phí TV ĐTXDCT', value: '', unit: 'đ' },
  { key: 'Chi phí khác', value: '', unit: 'đ' },
  { key: 'Chi phí đền bù GPMB', value: '', unit: 'đ' },
  { key: 'Dự phòng phí', value: '', unit: 'đ' },
  { key: 'Chi phí lãi vay', value: '', unit: 'đ' },
  { key: 'Chi phí xây dựng', value: '', unit: 'đ' },
  { key: 'Chi phí xây dựng', value: '', unit: 'đ' },
  { key: 'Chi phí xây dựng', value: '', unit: 'đ' },
  { key: 'Chi phí sữa chữa, TT t.bị', value: '', unit: 'đ' }
]

export const ESTIMATED_COSTS_YEAR_PROJECT_OVER_APPROVED = [
  { key: 'KH giải ngân năm', value: '', unit: 'đ' },
  { key: 'KH sử dụng thực tế', value: '', unit: 'đ' },
  { key: 'Giá trị đã quyết toán', value: '', unit: 'đ' },
  { key: 'Giá trị thanh toán', value: '', unit: 'đ' }
]

export const ESTIMATED_COSTS_PROJECT_OVER_APPROVED = [
  { key: '', value: '', unit: 'đ' },
  {
    key: 'Năm',
    value: '',
    children: ESTIMATED_COSTS_YEAR_PROJECT_OVER_APPROVED
  }
]

export const EFFECTIVE_INVEST_PROJECT = [
  { key: 'PV of FCFF', value: '', unit: 'đ' },
  { key: 'IRR', value: '', unit: '%' }
]

export const EFFECTIVE_INVEST_PROJECT_OVER_APPROVED = [
  { key: 'Tỉ lệ giải ngân', value: '', unit: '%' },
  { key: 'Tỉ lệ thanh quyết toán', value: '', unit: '%' }
]

export const APPROVE_STEP_PROJECT = [
  { key: 'Cấp DNPW', value: '' },
  { key: 'Cấp đơn vị', value: '' },
  { key: 'Người lập', value: '' }
]

export const APPROVE_STEP_PROJECT_OVER_APPROVED = [
  { key: 'Chịu trách nhiệm', value: '' },
  { key: 'Hỗ trợ', value: '' }
]

export const EXPECT_EFFECTIVE_PROJECT = [
  { key: 'Thời gian thực hiện', value: '', unit: 'Tháng' },
  {
    key: 'Hiệu quả dầu tư',
    children: [
      { key: 'Tổng mức đầu tư dự kiến trước thuế GTGT', value: '' },
      { key: 'PV of FCFF', value: '' },
      { key: 'IRR', value: '' },
      { key: 'Thời gian hoàn vốn (không chiết khấu)', value: '' },
      { key: 'Thời gian hoàn vốn (có chiết khấu)', value: '' }
    ]
  },
  {
    key: 'Sản lượng và giá thành',
    children: [
      { key: 'Tổng số KH mới', value: '', unit: 'KH', color: 'rgba(5, 66, 140, 0.7)' },
      {
        key: 'Tổng sản lượng tiêu thụ mới',
        value: '',
        unit: 'm3/ng',
        color: 'rgba(5, 66, 140, 0.7)'
      },
      { key: 'Sản lượng tiêu thụ bán lẻ', value: '', unit: 'm3/ng' },
      { key: 'Sản lượng tiêu thụ bán buôn', value: '', unit: 'm3/ng' },
      { key: 'Giá bán', color: 'rgba(5, 66, 140, 0.7)' },
      { key: 'Giá bán lẻ trước thuế GTGT', value: '', unit: 'vnd/m3' },
      { key: 'Giá bán buôn trước thuế GTGT', value: '', unit: 'vnd/m3' },
      { key: 'Chi phí sản xuất', value: '', color: 'rgba(5, 66, 140, 0.7)', unit: 'vnd/m3' }
    ]
  }
]

export const BUDGET_EXP_PROJECT = [
  { key: 'Tổng ngân sách', value: '', unit: 'đ' },
  {
    key: 'Tổng dự toán',
    value: '',
    unit: 'đ'
  },
  {
    key: 'Tổng ngân sách thực hiện',
    value: '',
    unit: 'đ'
  },
  {
    key: 'Tổng giá trị thực hiện lũy kế',
    value: '',
    unit: 'đ',
    listYear: []
  },
  {
    key: 'Tổng giá trị thanh, quyết toán',
    value: '',
    unit: 'đ'
  }
]
