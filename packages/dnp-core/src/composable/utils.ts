import {message} from "ant-design-vue";

export function useUtils () {
    const convertVietnamese = (str: string): string => {
        let text = removeUtf8Vowel(str)
        // Xóa dấu và các ký tự đặc biệt
        text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Loại bỏ dấu
        // text = text.replace(/[!@%^\*\(\)\+=<>?\/,.:;"&\[\]~$`{}|\\\-]/g, ' '); // Bỏ các ký tự đặc biệt
        text = text.replace(/ +/g, ' ').trim(); // Bỏ khoảng trắng thừa

        return text;
    };

    const isEmptyObject = (obj: object) => {
        return Object.keys(obj).length === 0
    }

    const copyTextToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            message.success('Copy thành công');
        } catch (err) {
            message.error('Copy thất bại');
        }
    }

    const removeUtf8Vowel = (val: string): string => {
        const map: { [key: string]: string } = {
            a: 'àáạảãâầấậẩẫăằắặẳẵ',
            e: 'èéẹẻẽêềếệểễ',
            i: 'ìíịỉĩ',
            o: 'òóọỏõôồốộổỗơờớợởỡ',
            u: 'ùúụủũưừứựửữ',
            y: 'ỳýỵỷỹ',
            d: 'đ',
            A: 'ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ',
            E: 'ÈÉẸẺẼÊỀẾỆỂỄ',
            I: 'ÌÍỊỈĨ',
            O: 'ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ',
            U: 'ÙÚỤỦŨƯỪỨỰỬỮ',
            Y: 'ỲÝỴỶỸ',
            D: 'Đ'
        };

        let text = val;

        // Thay thế các ký tự tiếng Việt
        for (const key in map) {
            const regex = new RegExp(`[${map[key]}]`, 'g');
            text = text.replace(regex, key);
        }

        return text
    }

    const isNumeric = (str: string) => {
        if (typeof str !== 'string') return false
        return !isNaN(Number(str)) && !isNaN(parseFloat(str))
    }

    const numberFormatter = (value: any, seg = ',') =>
        value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, seg) : value

    const numberCommaParser = (value: string) => (value ? value.replace(/\$\s?|(,*)/g, '') : value)

    return {
        convertVietnamese,
        isEmptyObject,
        copyTextToClipboard,
        removeUtf8Vowel,
        numberFormatter,
        numberCommaParser,
        isNumeric
    }
}