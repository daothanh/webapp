export const KEY_LOCAL = 'DNP_'

export const PAGINATION = {
  page: 0,
  total: 0,
  current: 1,
  pageSize: 10,
  showQuickJumper: true,
  showSizeChanger: true,
  pageSizeOptions: ['10', '25', '50', '100'],
  showTotal: (total: number) => {
    return 'Tổng số dòng ' + total
  }
}
