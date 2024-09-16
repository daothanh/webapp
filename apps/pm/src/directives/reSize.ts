import type { DirectiveBinding } from 'vue';

export default {
  mounted(el: any, binding: DirectiveBinding) {
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      binding.value({ width, height });
    });

    resizeObserver.observe(el);

    el._resizeObserver = resizeObserver;
  },
  unmounted(el: any) {
    if (el._resizeObserver) {
      el._resizeObserver.disconnect();
      delete el._resizeObserver;
    }
  },
};
