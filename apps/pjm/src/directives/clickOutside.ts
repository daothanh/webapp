export default {
  mounted(el: any, binding: { value: (arg0: any, arg1: any) => void }, vnode: any) {
    el.clickOutsideEvent = function (event: any) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event, el);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el: { clickOutsideEvent: (this: HTMLElement, ev: MouseEvent) => any }) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  },
};
