import { removeUtf8Vowel } from '@/utils'

const mixins = {
  methods: {
    filterSelectOption(inputValue: string, option: []) {
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
