/* eslint @typescript-eslint/no-var-requires: "off" */
import ImageLightTheme from '@/assets/images/lightTheme.png'
import ImageDarkTheme from '@/assets/images/darkTheme.png'
import ImageGrayTheme from '@/assets/images/grayTheme.png'
import ImageEyeProtectionTheme from '@/assets/images/eyeProtTheme.png'
export const listThemes = [
  { key: 1, name: 'Giao diện sáng', class: 'light-theme', img: ImageLightTheme },
  { key: 2, name: 'Giao diện tối', class: 'dark-theme', img: ImageDarkTheme },
  { key: 3, name: 'Giao diện xám', class: 'gray-theme', img: ImageGrayTheme },
  {
    key: 4,
    name: 'Giao diện bảo vệ mắt',
    class: 'eye-protection-theme',
    img: ImageEyeProtectionTheme
  }
]
