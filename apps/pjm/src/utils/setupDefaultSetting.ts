import { getItemFromLocalStorage } from './index'
import { KEY_LOCAL } from '@/contants'
import { useGlobalStore } from '@/stores/globalStore.ts'
import { listThemes } from '@/components/account/config.ts'

export const setTheme = () => {
  const globalStore = useGlobalStore()
  const keyThemeDefault = getItemFromLocalStorage(`${KEY_LOCAL}_THEME_DEFAULT`)

  const themeDefault = listThemes.find((l: { key: number }) => l.key === Number(keyThemeDefault))
  globalStore.setTheme(themeDefault ? themeDefault.class : listThemes[0].class)
}
