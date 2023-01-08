<template>
  <mars-dialog title="卫星过境" visible="true" right="10" top="55">
    <a-form-item label="绘制形状">
        <mars-select class="selectWidth" v-model:value="selectWay" :options="selectWayOptions"> 
        </mars-select>
      </a-form-item>

      <a-form-item label="火势监控">
    <div class="f-mb">
    <a-space>
      <div></div><div></div>
      <mars-button @click="drawPicture">开始绘制</mars-button>
      <div></div><div></div><div></div><div></div><div></div>
      <mars-button @click="drawClear">清除</mars-button>
    </a-space>
    </div>
    </a-form-item>
    <div class="f-mb">
        <a-space>
          <span class="mars-pannel-item-label">过境区域:</span>
          <mars-button @click="drawRectangle">框选</mars-button>
          <mars-button @click="drawCircle">圆形</mars-button>
          <mars-button @click="drawPolygon">多边形</mars-button>
          <mars-button @click="drawClear_look">清除</mars-button>
        </a-space>
      </div>

      <div class="f-mb">
        <a-space>
          <span class="mars-pannel-item-label">开始时间:</span>
          <mars-date-picker v-model:value="startTime" format="YYYY-MM-DD HH:mm:ss" :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }" />
        </a-space>
      </div>
  
      <div class="f-mb">
        <a-space>
          <span class="mars-pannel-item-label">结束时间:</span>
          <mars-date-picker v-model:value="endTime" format="YYYY-MM-DD HH:mm:ss" :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }" />
        </a-space>
      </div>
  
      <div class="f-mb">
        <a-space>
          <span class="mars-pannel-item-label"></span>
          <div></div><div></div><div></div>
          <mars-button @click="startFX">开始分析</mars-button>
          <div></div><div></div><div></div><div></div><div></div>
          <mars-button @click="clearResult">清除</mars-button>
        </a-space>
      </div>

      <mars-table size="small" :pagination="{ pageSize: 5 }" :columns="columns" :data-source="pathData">
        <template #bodyCell="{ column, text }">
          <template v-if="column.dataIndex === 'name'">
            <a>{{ text }}</a>
          </template>
        </template>
      </mars-table>
  </mars-dialog>

  <!-- 视频 面板  //data.mars3d.cn/file/video/lukou.mp4 http://localhost/mars3d-data/fire.mp4-->
  <div class="videoWrap" v-show="satelliteParams.openVideo == true">
    <div class="openPanel" v-show="satelliteParams.openPannel === true">
      <div class="closeAction" @click="closePannel">收缩&gt;</div>
      <video width="420" :muted="true" :autoplay="true">
        <source src="http://localhost/mars3d-data/fire.mp4" type="video/mp4" />
      </video>
    </div>
    <div v-show="satelliteParams.openPannel === false">
      <mars-button @click="openPanel">查看视频</mars-button>
    </div>
  </div>

  <div class="information">
  <table class="mars-table_information tb-border f-mt">
      <tr>
        <td class="nametd">可用卫星名称</td>
        <td id="td_name">{{ formState.name }}</td>
      </tr>
      <tr>
        <td class="nametd">TLE1</td>
        <td id="td_tle1">{{ formState.tle1 }}</td>
      </tr>
      <tr>
        <td class="nametd">TLE2</td>
        <td id="td_tle2">{{ formState.tle2 }}</td>
      </tr>
      <tr>
        <td class="nametd">时间</td>
        <td id="td_time">{{ formState.time }}</td>
      </tr>

      <tr>
        <td class="nametd">经度</td>
        <td id="td_jd">{{ formState.td_jd }}</td>
      </tr>
      <tr>
        <td class="nametd">经度</td>
        <td id="td_wd">{{ formState.td_wd }}</td>
      </tr>
      <tr>
        <td class="nametd">高程</td>
        <td id="td_gd">{{ formState.td_gd }}</td>
      </tr>
    </table>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import * as mapWork from "./map.js"
import useLifecycle from "@mars/common/uses/use-lifecycle"
import dayjs, { Dayjs } from "dayjs"
import type { UnwrapRef } from "vue"

interface FormState {
  enabledShowMatrix: boolean // 参考轴系
  name: string
  tle1: string
  tle2: string
  time: string
  td_jd: number
  td_wd: number
  td_gd: number
}

const formState: UnwrapRef<FormState> = reactive({
  enabledShowMatrix: false,
  name: "",
  tle1: "",
  tle2: "",
  time: "",
  td_jd: 0,
  td_wd: 0,
  td_gd: 0
})

mapWork.eventTarget.on("satelliteChange", (e: any) => {
  const nowData = e.weixinData
  formState.name = nowData.name
  formState.tle1 = nowData.tle1
  formState.tle2 = nowData.tle2
  formState.time = nowData.time
  formState.td_jd = nowData.td_jd
  formState.td_wd = nowData.td_wd
  formState.td_gd = nowData.td_gd
})

interface Satellite {
  openVideo: boolean
  openPannel: boolean
}
const satelliteParams = reactive<Satellite>({
  openVideo: false,
  openPannel: true
})

mapWork.eventTarget.on("video", (item: any) => {
  satelliteParams.openVideo = item.openVideo
})

const selectWay = ref("rectangle")
  // 下拉菜单
  const selectWayOptions = ref([
    {
       // 绘制矩形
      value: "rectangle",
      label: "矩形"
    },
    {
      // 绘制圆形
      value: "circle",
      label: "圆形"
    },
    {
      // 绘制多边形
      value: "polygon",
      label: "多边形"
    }
  ])

// 启用map.ts生命周期
useLifecycle(mapWork)

  const drawPicture = () => {
    if (selectWay.value === "rectangle") {
      mapWork.drawRectangle()
    } else if (selectWay.value === "circle") {
      mapWork.drawCircle()
    } else if (selectWay.value === "polygon") {
      mapWork.drawPolygon()
    }
  }

// 清除
const drawClear = () => {
  mapWork.drawClear()
  satelliteParams.openVideo = false
}

// 视屏面板的控制
const openPanel = () => {
  satelliteParams.openPannel = true
}
const closePannel = () => {
  satelliteParams.openPannel = false
}

const columns = [
    {
      title: "卫星名称",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "进入时间",
      dataIndex: "inTime",
      key: "inTime"
    },
    {
      title: "飞出时间",
      dataIndex: "outTime",
      key: "outTime"
    },
    {
      title: "飞行时长",
      dataIndex: "often",
      key: "often"
    },
    {
      title: "飞行距离",
      dataIndex: "distance",
      key: "distance"
    }
  ]
  
  const startTime = ref<Dayjs>(dayjs())
  const endTime = ref<Dayjs>(dayjs().add(60, "minute"))
  const pathData = ref([])
  
  mapWork.eventTarget.on("dataList", (e: any) => {
    pathData.value = e.tableList
  })
  
  // 框选查询 矩形
  const drawRectangle = () => {
    mapWork.drawRectangle()
  }
  // 框选查询   多边
  const drawPolygon = () => {
    mapWork.drawPolygon()
  }
  // 框选查询   圆
  const drawCircle = () => {
    mapWork.drawCircle()
  }
  
  const drawClear_look = () => {
    mapWork.drawClear()
  }
  
  const clearResult = () => {
    pathData.value = []
    mapWork.clearResult()
  }
  
  const startFX = () => {
    const startTimes = dayjs(startTime.value).valueOf()
    const endTimes = dayjs(endTime.value).valueOf()
    mapWork.startFX(startTimes, endTimes)
  }

</script>

<style scoped lang="less">
.videoWrap {
  position: absolute;
  bottom: 60px;
  left: 50px;
  padding: 4px 8px;
  border: 1px solid gray;
  background-color: #3f4854;
  z-index: 9;
}

th.column-money,
td.column-money {
  text-align: right !important;
}
.ant-slider {
  width: 110px;
}

.tb-border {
  border: 1px solid #4db3ff70;
}

.tb-border tr td {
  border: 1px solid #4db3ff70;
}

.information {
  position: absolute;
  top: 60px;
  left: 10px;
  padding: 4px 8px;
  border: 1px solid gray;
  background-color: #3f4854;
  z-index: 9;
  opacity: 0.9;
}

.mars-table_information {
  width: 400px;
  border-collapse: collapse;
  border-spacing: 0;
}

.mars-table_information .nametd {
  padding: 2.5px 10px 2.5px 5px;
}

.mars-table_information tr td {
  padding: 2.5px 5px;
  text-align: left;
}

.mars-table_information tr td:first-child {
  border-left: none;
}

.tb-border {
  border: 1px solid #4db3ff70;
}

.mars-table .nametd {
  padding: 5px 20px 5px 10px;
}

.closeAction {
  position: absolute;
  top: -25px;
  left: 0;
  background-color: #3f4854;
  padding: 2px 6px;
  cursor: pointer;
}

.closeAction:after {
  content: "";
  position: absolute;
  right: -28px;
  top: 0;
  border-left: 14px solid #3f4854;
  border-right: 14px solid transparent;
  border-bottom: 14px solid #3f4854;
  border-top: 14px solid transparent;
}

.videoWrap .title {
  margin-bottom: 8px;
}

/* 视频的收缩展开状态 */
.videoWrap .openPanel {
  display: block;
}

.videoWrap .closePanel {
  display: block;
  cursor: pointer;
  display: none;
}

.selectWidth {
    width: 210px;
  }
</style>
