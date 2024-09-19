import { round } from 'lodash';
import moment from 'moment';
import { useUtils } from "dnp-core";

const {numberFormatter, numberCommaParser} = useUtils()
export default {
  round(value: number, radix = 2) {
    return value ? round(value, radix) : 0;
  },
  numberFormatter(value: string) {
    // , seg, suffix
    return numberFormatter(value);
  },
  integerFormatter(value: string) {
    let tmp = value ? parseInt(value) : value;
    tmp = tmp?.toString();
    // , seg, suffix
    return numberFormatter(tmp);
  },
  numberCommaParser(value: string) {
    return numberCommaParser(value);
  },
  timestampToDate(time: any, format = 'DD/MM/YYYY') {
    return moment.unix(time).format(format) || '';
  },
  roundNumberParser(num: number, offset = 1) {
    if (!num) return 0;
    return round(num, offset);
  },
};
