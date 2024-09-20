<template>
  <a-layout-footer
    style="text-align: center; left: 0; right: 0; bottom: 0; z-index: 99; margin-top: auto"
    class="footer font-semibold bg-white"
  >
    <div class="text-coppy">{{ `Copyright ©2023 ` }}</div>
    <div :class="`mr-1 ml-1 flex items-center space-x-1`">
      <span class="sm:block hidden"> Bản quyền thuộc về </span>
      <span>Công Ty Cổ Phần Đầu Tư Ngành Nước DNP</span>
    </div>
  </a-layout-footer>
</template>
<style scoped>
.footer {
  border-top: 2px solid #f5f5f5;
}
</style>
