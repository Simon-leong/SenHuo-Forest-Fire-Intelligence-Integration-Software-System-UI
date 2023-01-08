<template>
  <mars-dialog title="火场面积" width="415" top="60" bottom="150" right="10" :min-width="357">
    <template #icon>
      <mars-icon icon="Fire" width="18" />
    </template>
    <!-- echarts图表 -->
    <div class="chart">
      <div class="chartTwo" id="chartTwo">
        <h6>饼状图</h6>
        <div id="ul_ZJLY" class="chartTwo_ulzjly"></div>
      </div>
      <div class="chartThree" id="chartThree">
        <h6>柱状图和折线图</h6>
        <button @click="btnNDTJ_xms(chartsData.ndtj)">柱状图</button>
        <button @click="btnNDTJ_zds(chartsData.ndtj)">折线图</button>
        <div id="ul_NDTJ" class="chartThree_ulndtj"></div>
      </div>
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import * as echarts from "echarts"
import useLifecycle from "@mars/common/uses/use-lifecycle"
import * as mapWork from "./map.js"

// 启用map.ts生命周期
useLifecycle(mapWork)

let ZJLY: HTMLElement
const NDTJ = ref()

onMounted(() => {
  ZJLY = document.getElementById("ul_ZJLY")
  NDTJ.value = document.getElementById("ul_NDTJ")
  // 饼状图
  initCharts_Two(chartsData.zjly, ZJLY)
  // 柱状图和折线图
  initCharts_Three(chartsData.ndtj)
})

const chartsData = {
  zjly: [
    { name: "三级", value: 88 },
    { name: "二级", value: 127 },
    { name: "一级", value: 175 },
    { name: "已熄灭", value: 270 }
  ],
  ndtj: {
    xms: [
      { name: "三级", value: 88 },
      { name: "二级", value: 127 },
      { name: "一级", value: 175 },
      { name: "已熄灭", value: 270 }
    ],
    zds: [
      { name: "三级", value: 127 },
      { name: "二级", value: 175 },
      { name: "一级", value: 88 },
      { name: "已熄灭", value: 270 }
    ]
  }
}

// chartTwo  Echart饼状  火场面积
function initCharts_Two(arr: any, ZJLY: any) {
  const data = []
  for (let i = 0; i < arr.length; i++) {
    const object: any = {}
    object.name = arr[i].name
    object.value = arr[i].value
    data[i] = object
  }

  const myChart = echarts.init(ZJLY)
  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}<br/>{c}"
    },
    // 图例 的相关设置
    legend: {
      orient: "vertical",
      left: "right",
      textStyle: {
        color: "#fff"
      }
    },
    // 图形的设置
    series: [
      {
        // name: '访问来源',
        type: "pie",
        radius: "80%",
        right: "20%",
        // 图形上文本标签的样式设置
        label: {
          show: false
        },
        color: [
          "#37A2DA",
          "#32C5E9",
          "#67E0E3",
          "#9FE6B8",
          "#FFDB5C",
          "#ff9f7f",
          "#fb7293",
          "#E062AE",
          "#E690D1",
          "#e7bcf3",
          "#9d96f5",
          "#8378EA",
          "#96BFFF"
        ],
        center: ["45%", "55%"],
        data: data, // 使用for循环添加
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
          }
        }
      }
    ]
  }
  myChart.setOption(option)

  window.addEventListener("resize", function () {
    myChart.resize()
  })
}

// chartThree   Echart柱状和折线  火场面积
function initCharts_Three(arr: any) {
  histogram(arr.xms, "公顷")
}
// 柱状和折线，按钮事件
function btnNDTJ_xms(arr: any) {
  histogram(arr.xms, "公顷")
}
function btnNDTJ_zds(arr: any) {
  histogram(arr.zds, "公顷")
}

// 柱状和折线    按钮点击切换
function histogram(arr: any, Word: string) {
  const arrName = []
  const arrValue = []
  for (let i = 0; i < arr.length; i++) {
    arrName[i] = arr[i].name
    arrValue[i] = arr[i].value
  }

  const myChart = echarts.init(NDTJ.value)
  const option = {
    // xAxis和yAxis的nameTextStyle不起作用
    // 因此设置了字体的全局样式
    textStyle: {
      color: "#ccc"
    },
    title: {
      text: "单位:" + Word,
      // 全局样式对此不生效，
      textStyle: {
        color: "#fff"
      }
    },
    // 移入柱子时的阴影
    tooltip: {
      trigger: "axis",
      formatter: "{b}<br/>{c}" + Word,
      axisPointer: {
        type: "shadow"
      }
    },
    grid: {
      left: "5px",
      right: "0",
      bottom: "5px",
      containLabel: true
    },
    xAxis: {
      type: "category",
      data: arrName
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        // 柱子的相关设置
        itemStyle: {
          color: "rgb(0, 174, 255)"
        },
        barWidth: "20px",
        type: "bar",
        emphasis: {
          focus: "series"
        },
        data: arrValue
      }
    ]
  }
  myChart.setOption(option)

  window.addEventListener("resize", function () {
    myChart.resize()
  })
}
</script>



<style scoped lang="less">
/* 右侧统计图表 */
.chart {
  position: absolute;
  right: 10px;
  top: 40px;
  height: 650px;
  font-size: 15px;
  border: none;
  color: #ffffff;
  background: none;
}
.chartTwo,
.chartThree {
  width: 393px;
  height: 30%;
  margin-bottom: 6px;
  position: relative;
  border: 1px solid #17366c;
  background: linear-gradient(to left, #3897cf, #3897cf) left top no-repeat, linear-gradient(to bottom, #3897cf, #3897cf) left top no-repeat,
    linear-gradient(to left, #3897cf, #3897cf) right top no-repeat, linear-gradient(to bottom, #3897cf, #3897cf) right top no-repeat,
    linear-gradient(to left, #3897cf, #3897cf) left bottom no-repeat, linear-gradient(to bottom, #3897cf, #3897cf) left bottom no-repeat,
    linear-gradient(to left, #3897cf, #3897cf) right bottom no-repeat, linear-gradient(to left, #3897cf, #3897cf) right bottom no-repeat;
  background-size: 1px 20px, 20px 1px, 1px 20px, 20px 1px;
  background-color: rgba(0, 0, 0, 0.1);
  h6 {
    color: #ffffff;
  }

  button {
    padding: 2px 6px;
  }
}
.chart h6 {
  padding: 4px;
  width: 10px;
  margin-left: 5%;
  float: left;
  margin-top: 3%;
  font-size: 16px;
  line-height: 16px;
  text-align: center;
}
.chartTwo h6::before {
  position: absolute;
  top: 10px;
  left: 6%;
  width: 20px;
  height: 2px;
  background: red;
  content: " ";
}
.chartThree h6::before {
  position: absolute;
  top: 10px;
  left: 6%;
  width: 20px;
  height: 2px;
  background: red;
  content: " ";
}

/*chartTwo ul_ZJLY */
.chartTwo_ulzjly,
.chartThree_ulndtj {
  width: 84%;
  height: 90%;
  position: absolute;
  left: 13%;
  bottom: 5px;
}

/* chartThree ul_NDTJ */
.chartThree button {
  background: none;
  border: 0.06px solid rgb(0, 174, 255);
  z-index: 1000;
  font-size: 1rem;
}
.chartThree button:nth-child(2) {
  position: absolute;
  top: 25px;
  right: 160px;
}
.chartThree button:nth-child(3) {
  position: absolute;
  top: 25px;
  right: 90px;
}

.chartThree button:active {
  background-color: rgb(19, 166, 224);
}
.chartThree button:visited {
  background-color: rgb(19, 166, 224);
}

</style>
