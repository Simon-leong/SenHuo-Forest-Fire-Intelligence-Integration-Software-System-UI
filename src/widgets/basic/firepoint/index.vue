<template><div></div>></template>

<script setup lang="ts">
  import * as mapWork from "./map"
  import useLifecycle from "@mars/common/uses/use-lifecycle"
  
  // 启用map.ts生命周期
  useLifecycle(mapWork)
</script>
 
<style lang="less"></style>
