import * as mars3d from "mars3d"
let map: mars3d.Map // 地图对象

// 事件对象，用于抛出事件给vue
export const eventTarget = new mars3d.BaseClass()

// 初始化当前业务
export function onMounted(mapInstance: mars3d.Map): void {
  map = mapInstance // 记录map
}

// 释放当前业务
export function onUnmounted(): void {
  map = null
}
