<template>
  <div class="setting-theme">
    <div class="flex flex-col my-5">
      <a-divider orientation="left" orientation-margin="0px" class="font-bold">
        Tuỳ chỉnh giao diện
      </a-divider>
      <span class="text-[12px] text-[#828282]">
        Đổi giao diện: Chọn 1 trong những giao diện dưới đây
      </span>
    </div>

    <a-row :gutter="16">
      <a-col v-for="theme in listThemes" :key="theme.key" :span="12" class="cursor-pointer">
        <div class="w-full relative" :offset="[-5, 5]">
          <a-checkbox :checked="themeActive === theme.key" class="icon-tick" />
          <div
            style="color: #1890ff"
            class="theme img-center cursor-pointer overflow-hidden rounded-xl h-[150px]"
            :class="{ 'theme-active': themeActive === theme.key }"
            @click="handleChangeTheme(theme)"
          >
            <img :src="theme.img" />
          </div>
          <p class="text-center mt-2 text-black font-medium">{{ theme.name }}</p>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { listThemes } from './config'
import { getItemFromLocalStorage, setItemToLocalStorage } from '../../utils'
import { KEY_LOCAL } from '@/contants'
import { useGlobalStore } from '@/stores/globalStore.ts'

export default {
  name: 'SettingTheme',
  props: {},
  data() {
    return {
      themeActive: 1,
      listThemes: listThemes
    }
  },
  computed: {},
  watch: {},
  mounted() {
    const keyThemeDefault = getItemFromLocalStorage(`${KEY_LOCAL}_THEME_DEFAULT`)
    const themeDefault = this.listThemes.find(
      (l: { key: number }) => l.key === Number(keyThemeDefault)
    )
    this.themeActive = themeDefault ? themeDefault.key : 1
  },
  methods: {
    handleChangeTheme(theme: { key: number; class: string }) {
      const globalStore = useGlobalStore()

      this.themeActive = theme.key
      setItemToLocalStorage(`${KEY_LOCAL}_THEME_DEFAULT`, theme.key)
      globalStore.setTheme(theme.class)
    }
  }
}
</script>
<style lang="scss">
.setting-theme {
  .theme-active {
    border: 2px solid currentColor;
  }
  .icon-tick {
    position: absolute;
    top: -7px;
    right: -5px;
    z-index: 10;
  }
  .theme {
    position: relative;
    box-sizing: border-box;
    img {
      filter: brightness(0.95);
    }
  }
  .ant-checkbox-wrapper,
  .ant-checkbox,
  .ant-checkbox-input {
    &:hover {
      .ant-checkbox-inner {
        border: none !important;
      }
      .ant-checkbox::after {
        visibility: hidden;
      }
    }
  }
  .ant-checkbox-inner {
    opacity: 0;
  }
  .ant-checkbox-checked .ant-checkbox-inner {
    border-radius: 50% !important;
    opacity: 1;
  }
}
</style>
