<template>
  <div
    class="filterTags relative w-full flex items-center border-0 border-b-[1px] border-solid border-[#dfdfdf]"
  >
    <div v-if="selectOption" v-click-outside="handleClickOutSide" class="filterTags-select px-3">
      <div
        class="relative text-left w-[120px] bg-[#F3F4F6] px-[12px] py-[5px] rounded-full text-14 font-medium border-[#909090] border-[1px] border-solid capitalize flex justify-between items-center cursor-pointer"
        @click="activeSelect = !activeSelect"
      >
        <div class="ellipsis">{{ value }}</div>
        <arrow-down-icon
          :color="'#000000'"
          :width="10"
          class="arrow-down"
          :class="{ 'arrow-active': activeSelect }"
        />
      </div>
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="activeSelect"
          class="origin-top-right absolute left-[10px] z-10 mt-6 w-48 max-h-[300px] md:max-h-[500px] overflow-scroll rounded-md shadow-lg p-[5px] bg-white"
        >
          <div
            v-for="(data, index) in dataSource"
            :key="index"
            class="px-[15px] py-[5px] text-14 font-medium capitalize cursor-pointer rounded-sm"
            :class="
              data.value.toLowerCase() === value
                ? 'border-black bg-black text-white tag-active'
                : 'text-[#909090] border-[#909090] bg-transparent'
            "
          >
            <div
              @click="
                () => {
                  activeSelect = !activeSelect
                  handleChangeTag(data)
                }
              "
            >
              {{ data.title }}
            </div>
          </div>
        </div>
      </transition>
    </div>

    <div ref="filterTags" class="filterTags__box relative w-full flex items-center overflow-x-auto">
      <button
        v-for="(data, index) in dataSource"
        :id="`item-${data.key}`"
        :key="index"
        class="px-[15px] py-[3px] font-[600] text-[14px] border-[1px] border-solid capitalize cursor-pointer"
        :class="
          data.value.toLowerCase() === value
            ? 'border-[#267ddc] bg-[#267ddc] text-white tag-active'
            : 'text-[#277ddcc2] border-none bg-transparent'
        "
        @click="handleChangeTag(data)"
      >
        {{ data.title }}
      </button>
    </div>
    <div class="filterTags__scroll"></div>
  </div>
</template>

<script>
import $ from 'jquery'
import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import {ArrowDownIcon} from 'dnp-ui'

gsap.registerPlugin(Draggable)
gsap.registerPlugin(ScrollToPlugin)

export default {
  name: 'FilterTags',
  components: { ArrowDownIcon },
  props: ['selectOption', 'dataSource', 'onChange', 'value'],
  data() {
    return {
      activeSelect: false
    }
  },
  mounted() {
    const { filterTags } = this.$refs

    Draggable.create(filterTags, {
      type: 'scrollLeft'
    })

    this.handScrollToTag(this.value)
  },
  methods: {
    handleClickOutSide() {
      this.activeSelect = false
    },
    handScrollToTag(key) {
      if (key) {
        const { filterTags } = this.$refs
        const item = $(`#item-${key}`)

        const itemOffSetLeft = item?.offset()?.left - 200 - item?.parent()?.offset()?.left || 0

        gsap.to(filterTags, 1, {
          scrollTo: { x: itemOffSetLeft }
        })
      }
    },
    handleChangeTag(data) {
      if (data.value !== this.value) {
        this.handScrollToTag(data.key)
        this.onChange(data.value)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.filterTags {
  .ellipsis {
    max-width: 70px;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    max-height: 30px;
  }
  .arrow-down {
    transition: all 0.5s ease;
  }
  .arrow-active {
    margin-bottom: 1px;
    transform: rotate(180deg);
  }
  .filterTags-select {
    border-right: 1px solid #cfcfcf;
  }
  &__box {
    button {
    }
  }
}
</style>
<style lang="scss">
.filterTags {
  &__box {
    & > div {
      display: flex !important;
      width: auto !important;
      padding: 0px 10px 0px 0px !important;
    }
    &::-webkit-scrollbar {
      display: none;
    }
  }
  &__scroll {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
  }
}
</style>
