import * as mars3d from "mars3d"
import { Cesium } from "mars3d"

let map: mars3d.Map // mars3d.Map三维地图对象
let drawGraphic
let graphicLayer
let tleArr
let tableList = []

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: -13.151771, lng: 55.60413, alt: 30233027, heading: 154, pitch: -89 },
    cameraController: {
      zoomFactor: 3.0,
      minimumZoomDistance: 1,
      maximumZoomDistance: 300000000,
      constrainedAxis: false // 解除在南北极区域鼠标操作限制
    },
    clock: {
      multiplier: 10 // 速度
    }
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true, // 是否显示时间线控件
    compass: { top: "10px", left: "5px" }
  }
}
export const eventTarget = new mars3d.BaseClass() // 事件对象，用于抛出事件到面板中

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance: mars3d.Map): void {
  map = mapInstance // 记录map  map.toolbar.style.bottom = "55px"// 修改toolbar控件的样式

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("单击了卫星", event)
  })
  // graphicLayer.on(mars3d.EventType.change, function (event) {
  //   console.log("卫星位置变化", event)
  // })

  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["类型"] = event.graphic.type
    attr["备注"] = "我支持鼠标交互"

    return mars3d.Util.getTemplateHtml({ title: "卫星图层", template: "all", attr: attr })
  })

  const tle_arr = [
    "COSMOS 33918U",
    "1 33918U 93036DX  21197.87508339  .00001232  00000-0  17625-3 0  9990",
    "2 33918  74.0595 343.7064 0054912  74.2148  45.2906 14.76790626663155",
    "COSMOS 33919U",
    "1 33919U 93036DY  21197.91197918  .00000904  00000-0  20362-3 0  9990",
    "2 33919  74.0505 161.6299 0033213 276.5546  83.1838 14.57578432657116",
    "COSMOS 33920U",
    "1 33920U 93036DZ  21197.66738688  .00000502  00000-0  17722-3 0  9999",
    "2 33920  74.0698  46.6248 0055820 106.9911 253.7370 14.36347026649192",
    "COSMOS 33921U",
    "1 33921U 93036EA  21197.38565197  .00009006  00000-0  82577-3 0  9990",
    "2 33921  74.0006 290.6759 0010303  43.2289 316.9701 14.94971510663519",
    "COSMOS 33922U",
    "1 33922U 93036EB  21197.56502581  .00000274  00000-0  89558-4 0  9994",
    "2 33922  74.0508 266.4243 0024779  54.6361  12.2512 14.42936298653573",
    "COSMOS 33924U",
    "1 33924U 93036ED  21197.52273790  .00000077  00000-0  98248-4 0  9996",
    "2 33924  73.9172 330.8929 0412462 300.5791  55.5226 13.47506448610712",
    "COSMOS 33928U",
    "1 33928U 93036EH  21197.42931451  .00000092  00000-0  35017-4 0  9996",
    "2 33928  73.9247 191.2154 0063743 117.8632 242.9002 14.43123719653944",
    "COSMOS 33929U",
    "1 33929U 93036EJ  21198.19991980  .00001910  00000-0  36273-3 0  9999",
    "2 33929  74.0305 128.7466 0003289 114.3771 359.7968 14.64926844657886",
    "COSMOS 33930U",
    "1 33930U 93036EK  21198.38692156  .00000817  00000-0  22790-3 0  9999",
    "2 33930  74.0285 287.1899 0028219 336.8694  92.7860 14.47667592652647"
  ]
  creatSatellite(tle_arr)

  queryTleChinaApiData()

  show_senhuo()
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted(): void {
  map = null
  graphicLayer.remove()
  graphicLayer = null
}

export function show_senhuo() {
  map.scene.skyBox = new Cesium.SkyBox({
    sources: {
      negativeX: "img/skybox/6/tycho2t3_80_mx.jpg",
      negativeY: "img/skybox/6/tycho2t3_80_my.jpg",
      negativeZ: "img/skybox/6/tycho2t3_80_mz.jpg",
      positiveX: "img/skybox/6/tycho2t3_80_px.jpg",
      positiveY: "img/skybox/6/tycho2t3_80_py.jpg",
      positiveZ: "img/skybox/6/tycho2t3_80_pz.jpg"
    }
  })
}

function creatSatellite(arr) {
  for (let i = 0; i < arr.length; i += 3) {
    const item = arr[i]
  const weixin = new mars3d.graphic.Satellite({
    name: arr[i],
    _lastInPoly: false,
    tle1: arr[i + 1],
    tle2: arr[i + 2],
    model: {
      url: "//data.mars3d.cn/gltf/mars/weixin.gltf",
      show: true
    },
    cone: {
      angle1: 40,
      show: false
    },
    label: {
      font_family: "楷体",
      font_size: 30,
      show: true
    },
    path: {
      show: true,
      color: "#e2e2e2",
      opacity: 0.5,
      width: 1
    }
  })

  graphicLayer.addGraphic(weixin)

  // weixin._lastInPoly = false

  const weixinData = {
     name: weixin.name, tle1: weixin.options.tle1, tle2: weixin.options.tle2, time: null, td_jd: null, td_wd: null, td_gd: null 
    }

 // 显示实时坐标和时间
 weixin.on(mars3d.EventType.change, function (event) {
  const date = Cesium.JulianDate.toDate(map.clock.currentTime)
  weixinData.time = mars3d.Util.formatDate(date, "yyyy-MM-dd HH:mm:ss")
  if (weixin.position) {
    const point = mars3d.LngLatPoint.fromCartesian(weixin.position)
    weixinData.td_jd = point.lng
    weixinData.td_wd = point.lat
    weixinData.td_gd = mars3d.MeasureUtil.formatDistance(point.alt)
    eventTarget.fire("satelliteChange", { weixinData })
  }
})


  setTimeout(() => {
    const position = weixin.position
    if (position) {
      map.flyToPoint(position, {
        radius: 900000, // 距离目标点的距离
        pitch: -60 // 相机方向
      })
    }
  }, 3000)

  // 位置变化事件
  graphicLayer.on(mars3d.EventType.change, function (event) {
    // 判断卫星是否在面内
    const weixin = event.graphic
    if (!drawGraphic) {
      weixin._lastInPoly = false
      weixin.coneShow = false // 关闭视锥体
      return
    }

    const position = weixin.position
    if (!position) {
      return
    }
    let openVideo = false
    const thisIsInPoly = drawGraphic.isInPoly(position)
    if (thisIsInPoly !== weixin._lastInPoly) {
      if (thisIsInPoly) {
        // 开始进入区域内
        console.log("卫星开始进入区域内", weixin.name)

        weixin.coneShow = true // 打开视锥体
        openVideo = true // 打开视频面板
      } else {
        // 离开区域
        console.log("卫星离开区域", weixin.name)

        weixin.coneShow = false // 关闭视锥体
        openVideo = false // 关闭视频面板
      }

      eventTarget.fire("video", { openVideo })
      weixin._lastInPoly = thisIsInPoly
    }
  })


   // RectSensor锥体（比Satellite内置的cone效率略高）
   const rectSensor = new mars3d.graphic.RectSensor({
    position: new Cesium.CallbackProperty(function (time) {
      return weixin.position
    }, false),
    style: {
      angle1: 30,
      angle2: 15,
      length: 90000,
      color: "rgba(0,255,0,0.4)",
      outline: true,
      topShow: true,
      topSteps: 2,
      rayEllipsoid: true,
      heading: new Cesium.CallbackProperty(function (time) {
        return weixin.heading
      }, false)
    },
    reverse: true
  })
  graphicLayer.addGraphic(rectSensor)
}
}

// 访问后端接口，取数据
function queryTleChinaApiData() {
  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/tle-china.json" })
    .then(function (data) {
      tleArr = data.data
      console.log("卫星数量：" + tleArr.length)
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })
}


// 框选查询 矩形
export function drawRectangle() {
  drawClear()
  map.graphicLayer.startDraw({
    type: "rectangle",
    style: {
      color: "#ffff00",
      opacity: 0.2,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2
    },
    success: function (graphic) {
      drawGraphic = graphic
    }
  })
}
// 框选查询   圆
export function drawCircle() {
  drawClear()
  map.graphicLayer.startDraw({
    type: "circle",
    style: {
      color: "#ffff00",
      opacity: 0.2,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2
    },
    success: function (graphic) {
      drawGraphic = graphic
    }
  })
}
// 框选查询   多边
export function drawPolygon() {
  drawClear()
  map.graphicLayer.startDraw({
    type: "polygon",
    style: {
      color: "#ffff00",
      opacity: 0.2,
      outline: true,
      outlineColor: "#ffffff",
      outlineWidth: 2
    },
    success: function (graphic) {
      drawGraphic = graphic
    }
  })
}
// 清除
export function drawClear(): void {
  map.graphicLayer.clear()
  drawGraphic = null
}

export function clearResult() {
  tableList = []
  map.graphicLayer.clear()
}

const parentGlobal = window.parent || window

function globalMsg(content) {
  return parentGlobal.$message(content)
}

//= ===============卫星过境===================================
const pointClr = Cesium.Color.fromCssColorString("#ff0000").withAlpha(0.7)
/**
 *
 * @export
 * @param {time} startTimes 开始时间
 * @param {time} endTimes 结束时间
 * @returns {void}
 */
export function startFX(startTimes, endTimes) {
  if (!drawGraphic) {
    globalMsg("请先在图上绘制区域")
    return
  }

  // 范围相关信息
  const options = {
    startTimes: startTimes,
    endTimes: endTimes,
    graphic: drawGraphic
  }

  // 分析卫星位置
  const newSatelliteArr = [] // 存储飞过指定范围的卫星的数据
  for (let ind = 0; ind < tleArr.length; ind++) {
    const item = tleArr[ind]
    const arr = fxOneSatellite(item, options)

    if (arr.length === 0) {
      continue
    }

    item.inAreaPath = arr
    newSatelliteArr.push(item)
  }

  showResult(newSatelliteArr)
}

function fxOneSatellite(item, options) {
  const inAreaPath = []
  let lastObj = null

  const graphic = options.graphic
  const startTimes = options.startTimes
  const endTimes = options.endTimes
  const step = 10 * 1000 // 插值数

  let nowTime = startTimes

  let position
  while (nowTime <= endTimes) {
    // 根据时间计算卫星的位置
    const position = mars3d.Tle.getEcfPosition(item.tle1, item.tle2, nowTime)
    if (!position) {
      break
    }
    // 显示点[参考比较结果是否正确]
    // let timeStr = new Date(nowTime).format("yyyy-MM-dd HH:mm:ss")
    const pointPrimitive = new mars3d.graphic.PointPrimitive({
      position: position,
      style: {
        color: pointClr,
        pixelSize: 3
      },
      attr: item
      // tooltip: `编号：${item.norad} <br />卫星：${item.name} <br />时间：${timeStr}`
    })
    map.graphicLayer.addGraphic(pointPrimitive)

    // 判断是卫星否在缓冲区内
    const isInPoly = graphic.isInPoly(position)

    // console.log(`${item.name},时间：${timeStr},结果：${isInPoly}`);

    if (lastObj && !lastObj.isInPoly && isInPoly) {
      // 表示进入范围
      inAreaPath.push({
        lastPosition: lastObj.position,
        lastTime: lastObj.time,
        time: nowTime,
        position: position,
        inOrOut: "in"
      })
    }

    if (lastObj && lastObj.isInPoly && !isInPoly) {
      // 表示出范围
      inAreaPath.push({
        position: position,
        lastPosition: lastObj.position,
        lastTime: lastObj.time,
        time: nowTime,
        inOrOut: "out"
      })
      break
    }

    lastObj = {
      position: position,
      isInPoly: isInPoly,
      time: nowTime
    }
    nowTime += step
  }

  if (lastObj && lastObj.isInPoly) {
    // 表示出范围
    inAreaPath.push({
      position: position,
      lastPosition: lastObj.position,
      lastTime: lastObj.time,
      time: nowTime,
      inOrOut: "out"
    })
  }

  return inAreaPath
}

//= ====================结果展示==================================

function showResult(newSatelliteArr) {
  // 显示卫星条带

  for (let ind = 0; ind < newSatelliteArr.length; ind++) {
    const item = newSatelliteArr[ind]
    const inAreaPath = item.inAreaPath
    if (inAreaPath.length < 2) {
      continue
    }

    let index = 0
    if (inAreaPath[0].inOrOut === "out") {
      // 保证从进入 开始计算
      index = 1
    }

    for (let i = index; i < inAreaPath.length; i = i + 2) {
      const positions = []
      let inTime
      let outTime
      if (inAreaPath[i].inOrOut === "in" && inAreaPath[i + 1].inOrOut === "out") {
        const inAttr = inAreaPath[i]
        const outAttr = inAreaPath[i + 1]
        if (inAttr?.lastPosition) {
          inTime = mars3d.Util.formatDate(new Date(inAttr.lastTime), "yyyy-M-d HH:mm:ss")
          positions.push(inAttr.lastPosition)
        }
        if (outAttr?.position) {
          positions.push(outAttr.position)
          outTime = mars3d.Util.formatDate(new Date(outAttr.time), "yyyy-M-d HH:mm:ss")
        }
        if (positions.length > 1) {
          const data = {
            positions: positions,
            name: item.name,
            inTime: inTime,
            outTime: outTime,
            often: mars3d.Util.formatTime((outAttr.time - inAttr.lastTime) / 1000),
            distance: mars3d.MeasureUtil.formatDistance(Cesium.Cartesian3.distance(positions[1], positions[0]))
          }
          tableList.push(data)

          eventTarget.fire("dataList", { tableList })

          showCorridor(data)
        }
      }
    }
  }

  globalMsg("分析完成，共" + tableList.length + "条过境记录")
}


function showCorridor(data) {
  const graphic = new mars3d.graphic.CorridorPrimitive({
    positions: data.positions,
    style: {
      width: 6000,
      cornerType: Cesium.CornerType.MITERED, // 指定转角处样式
      color: "#00ff00"
    }
  })
  map.graphicLayer.addGraphic(graphic)

  const inthtml =
    '<table style="width:280px;">' +
    '<tr><th scope="col" colspan="4"  style="text-align:center;font-size:15px;">信息</th></tr>' +
    "<tr><td >卫星名称：</td><td >" +
    data.name +
    " </td></tr>" +
    "<tr><td >进入时间：</td><td >" +
    data.inTime +
    " </td></tr>" +
    "<tr><td >飞出时间：</td><td >" +
    data.outTime +
    " </td></tr>" +
    "<tr><td >过境时长：</td><td >" +
    data.often +
    " </td></tr>" +
    "<tr><td >过境距离：</td><td >" +
    data.distance +
    " </td></tr>" +
    "</table>"
  graphic.bindPopup(inthtml)

  data._graphic = graphic
}
