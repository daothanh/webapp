<template>
  <div class="snippet" data-title="dot-flashing">
    <div class="stage">
      <div class="dot-flashing"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingDots',
  components: {},
  computed: {}
}
</script>

<style lang="scss" scoped>
.dot-flashing {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 5px;
  background-color: #1890ff;
  color: #1890ff;
  animation: dot-flashing 0.5s infinite linear alternate;
  animation-delay: 0.2s;
}
.dot-flashing::before,
.dot-flashing::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
}
.dot-flashing::before {
  left: -15px;
  width: 8px;
  height: 8px;
  border-radius: 5px;
  background-color: #1890ff;
  color: #1890ff;
  animation: dot-flashing 0.5s infinite alternate;
  animation-delay: 0s;
}
.dot-flashing::after {
  left: 15px;
  width: 8px;
  height: 8px;
  border-radius: 5px;
  background-color: #1890ff;
  color: #1890ff;
  animation: dot-flashing 0.5s infinite alternate;
  animation-delay: 0.5s;
}

@keyframes dot-flashing {
  0% {
    background-color: #1890ff;
  }
  50%,
  100% {
    background-color: rgba(160, 160, 160, 0.2);
  }
}
</style>
