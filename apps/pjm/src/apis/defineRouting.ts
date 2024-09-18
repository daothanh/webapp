export const auth = {
  //switch login
  REFRESH_TOKEN: '/refresh-token',
  TOKEN_EXCHANGE: '/token-exchange'
}
export const iam = {
  // Lấy thông tin user
  USER_INFO: '/user/userInfo',
  ALL_CLIENT: '/client/findAll'
}

export const noti = {
  //Thông báo
  NOTI_APP_SEARCH: '/noti-app/search',
  NOTI_APP_CREATE: '/noti-app/create',
  NOTI_APP_DETAIL: '/noti-app/self',
  NOTI_APP_GET_COUNT_UNREAD: '/noti-app/count-unread',
  NOTI_APP_MARK_READ: '/noti-app/mark-read'
}

export const sys = {
  GET_COMPANY_LIST: '/orgUnit/initTree',
  GET_PROVINCE: '/location/find-province',
  GET_DISTRICT: '/location/find-district',
  GET_COMMUNE: '/location/find-commune',
  GET_GLOBAL_LIST_DETAIL: '/globalListDetail/getListGlobalValueByCode',
  STAFF_SEARCH: '/staff/search'
}

export const wdn = {}

export const wfm = {
  // Nhóm ticket
  TICKET_GROUP_SEARCH: '/ticket-group/search',
  TICKET_GROUP_CREATE: '/ticket-group/create',
  TICKET_GROUP_UPDATE: '/ticket-group/update',
  TICKET_GROUP_UPDATE_STATUS: '/ticket-group/update-status',
  TICKET_GROUP_DELETE: '/ticket-group/delete',
  TICKET_GROUP_DETAIL: '/ticket-group/self',

  // Loại ticket
  TICKET_TYPE_SEARCH: '/ticket-type/search',
  TICKET_TYPE_CREATE: '/ticket-type/create',
  TICKET_TYPE_UPDATE: '/ticket-type/update',
  TICKET_TYPE_UPDATE_STATUS: '/ticket-type/update-status',
  TICKET_TYPE_DELETE: '/ticket-type/delete',
  TICKET_TYPE_DETAIL: '/ticket-type/self',

  // Loại ticket theo đơn vị
  TICKET_TYPE_ORG_SEARCH: '/ticket-type-org/search',
  TICKET_TYPE_ORG_CREATE: '/ticket-type-org/create',
  TICKET_TYPE_ORG_UPDATE: '/ticket-type-org/update',
  TICKET_TYPE_ORG_UPDATE_STATUS: '/ticket-type-org/update-status',
  TICKET_TYPE_ORG_DELETE: '/ticket-type-org/delete',
  TICKET_TYPE_ORG_DETAIL: '/ticket-type-org/self',
  TICKET_TYPE_ORG_INIT: '/ticket-type-org/sync-ticket-type',
  TICKET_TYPE_ORG_DUE_TIME: '/ticket-type-org/due-date',

  // Quản lý ticket
  TICKET_MANAGE_SEARCH: '/ticket/search',
  TICKET_MANAGE_DETAIL: '/ticket/self',
  TICKET_MANAGE_CREATE: '/ticket/create',
  TICKET_MANAGE_UPDATE: '/ticket/update',
  TICKET_MANAGE_DELETE: '/ticket/delete',
  TICKET_MANAGE_CANCEL: '/ticket/cancel',
  TICKET_MANAGE_PROCESS: '/ticket/inprogress',
  TICKET_MANAGE_COMPLETE: '/ticket/complete',
  TICKET_MANAGE_NEW: '/ticket/new',
  TICKET_MANAGE_GET_ACTIONS_LIST: '/ticket-comment/search',
  TICKET_MANAGE_CREATE_ACTIONS_LIST: '/ticket-comment/create',
  TICKET_MANAGE_GET_HISTORY_LIST: '/ticket/history-change'
}

export const asm = {
  ASM_SEARCH: '/asset/search',

  //Danh sách dự án
  PROJECT_LIST_SEARCH: '/asset-project/search',
  PROJECT_LIST_DETAIL: '/asset-project/self',
  PROJECT_LIST_UPDATE: '/asset-project/update',
  PROJECT_LIST_CREATE: '/asset-project/create',
  PROJECT_LIST_GRANT_ASSET: '/asset-project/grant-asset',
  PROJECT_LIST_REVOKE_ASSET: '/asset-project/revoke-asset',
  PROJECT_LIST_GET_DOC: '/asset-project-doc/search',
  PROJECT_LIST_UPDATE_DOC: '/asset-project-doc/update-batch',

  //Danh sách hợp đồng của dự án
  CONTRACT_PROJECT_LIST_SEARCH: '/asset-project-contract/search',
  CONTRACT_PROJECT_LIST_DETAIL: '/asset-project-contract/self',
  CONTRACT_PROJECT_LIST_CREATE: '/asset-project-contract/create',
  CONTRACT_PROJECT_LIST_UPDATE: '/asset-project-contract/update',
  CONTRACT_PROJECT_LIST_DELETE: '/asset-project-contract/delete',
  CONTRACT_PROJECT_LIST_GET_DOC: '/asset-project-contract-doc/search',
  CONTRACT_PROJECT_LIST_UPDATE_DOC: '/asset-project-contract-doc/update-batch',

  // Nhà thầu
  PROJECT_CONTRACTOR_SEARCH: '/asset-project-contractor/search',
  PROJECT_CONTRACTOR_STORE: '/asset-project-contractor/create',
  PROJECT_CONTRACTOR_UPDATE: '/asset-project-contractor/update',
  PROJECT_CONTRACTOR_DELETE: '/asset-project-contractor/delete',
  PROJECT_CONTRACTOR_DETAIL: '/asset-project-contractor/find'
}

export const fsm = {
  GET_FILE: '/file/list',
  UPLOAD_MULTIPART_FILE: '/file/upload-multipart'
}
