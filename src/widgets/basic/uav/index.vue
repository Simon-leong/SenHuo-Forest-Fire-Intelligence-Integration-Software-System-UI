<template>
    <mars-dialog title="无人机航线" visible="true" right="10" top="60">
      <a-form-item label="操作对象">
        <mars-select class="selectWidth" v-model:value="selectWay" :options="selectWayOptions"> </mars-select>
      </a-form-item>
      <a-space>
        <mars-button @click="viewAircraft">跟踪视角</mars-button>
        <mars-button @click="viewTopDown">上方视角</mars-button>
        <mars-button @click="viewSide">侧方视角</mars-button>
      </a-space>
    </mars-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue"
  import * as mapWork from "./map"
  import useLifecycle from "@mars/common/uses/use-lifecycle"

  
  const selectWay = ref("pathEntity0")
  // 下拉菜单
  const selectWayOptions = ref([
    {
      // 飞机1号
      value: "pathEntity0",
      label: "飞机0号"
    },
    {
      // 飞机2号
      value: "pathEntity1",
      label: "飞机1号"
    }
  ])

  
  // 启用map.ts生命周期
  useLifecycle(mapWork)
  
  const viewAircraft = () => {
    if (selectWay.value === "pathEntity0") {
      mapWork.viewAircraft0()
    } else if (selectWay.value === "pathEntity1") {
      mapWork.viewAircraft1()
    }
  }
  
  const viewTopDown = () => {
    if (selectWay.value === "pathEntity0") {
      mapWork.viewTopDown0()
    } else if (selectWay.value === "pathEntity1") {
      mapWork.viewTopDown1()
    }
    
  }
  
  const viewSide = () => {
    if (selectWay.value === "pathEntity0") {
      mapWork.viewSide0()
    } else if (selectWay.value === "pathEntity1") {
      mapWork.viewSide1()
    }
    
  }
  </script>

  <style lang="less">
  .selectWidth {
    width: 210px;
  }
  </style>
