import { useUtils } from '../composable/utils.ts'

const mixins = {
  methods: {
    filterSelectOption(inputValue: string, option: []) {
      const { removeUtf8Vowel }  = useUtils()
      const txt = removeUtf8Vowel(inputValue.toLowerCase())
      let result = false
      for (const property in option) {
        if (
          option[property] &&
          typeof option[property] === 'string' &&
          removeUtf8Vowel(option[property]).indexOf(txt) >= 0
        ) {
          result = true
          break
        }
      }
      return result
    }
  }
}

export default mixins
