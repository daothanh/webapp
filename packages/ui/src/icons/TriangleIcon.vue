<template>
  <svg :width="width" :height="height" xmlns="http://www.w3.org/2000/svg">
    <polygon
      :points="`0,0 ${width},${height / 2} 0,${height}`"
      :style="{ fill: color, stroke: borderColor, strokeWidth: '2' }"
    />
    <line
      x1="0"
      :x2="0"
      :y1="2"
      :y2="height - 2.5"
      :style="{ stroke: color, strokeWidth: '2.5' }"
    />
  </svg>
</template>

<script>
export default {
  name: 'TriangleIcon',
  props: {
    width: {
      type: [String, Number],
      default: 100
    },
    height: {
      type: [String, Number],
      default: 100
    },
    borderColor: {
      type: String,
      default: 'black'
    },
    color: {
      type: String,
      default: 'red'
    }
  }
}
</script>

<style scoped lang="scss"></style>
