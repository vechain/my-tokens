import Vue, { VNode } from 'vue'
import { picasso } from '@vechain/picasso'
Vue.directive('picasso', (el, binding) => {
  if (binding.value === binding.oldValue) {
    return
  }

  const svg = picasso((binding.value as string).toLowerCase())
  if (el.tagName === 'IMG') {
    (el as HTMLImageElement).src = `data:image/svg+xml;utf8,${svg}`
  } else {
    (el as HTMLElement).setAttribute(
      'style',
      `background-image:url('data:image/svg+xml;utf8,${svg}'); background-repeat: no-repeat; background-size: contain`)
  }
})
