const isNumeric = (str: string) => {
  if (typeof str !== 'string') return false
  return !isNaN(Number(str)) && !isNaN(parseFloat(str))
}

const numberFormatter = (value: any, seg = ',') =>
  value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, seg) : value

const numberCommaParser = (value: string) => (value ? value.replace(/\$\s?|(,*)/g, '') : value)

export default {
  numberFormatter,
  numberCommaParser,
  isNumeric
}
