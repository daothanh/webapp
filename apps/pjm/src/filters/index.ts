import common from '../utils/common';
import { round } from 'lodash';
import moment from 'moment';
export default {
  round(value: number, radix = 2) {
    return value ? round(value, radix) : 0;
  },
  numberFormatter(value: string) {
    // , seg, suffix
    return common.numberFormatter(value);
  },
  integerFormatter(value: string) {
    let tmp = value ? parseInt(value) : value;
    tmp = tmp?.toString();
    // , seg, suffix
    return common.numberFormatter(tmp);
  },
  numberCommaParser(value: string) {
    return common.numberCommaParser(value);
  },
  timestampToDate(time: any, format = 'DD/MM/YYYY') {
    return moment.unix(time).format(format) || '';
  },
  roundNumberParser(num: number, offset = 1) {
    if (!num) return 0;
    return round(num, offset);
  },
};
