import * as mars3d from "mars3d"
import { Cesium } from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象
let pathEntity0 = null
let pathEntity1 = null

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 32.550222, lng: 117.366824, alt: 2696, heading: 273, pitch: -67 }
  },
  control: {
    clockAnimate: true, // 时钟动画控制(左下角)
    timeline: true // 是否显示时间线控件
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted (mapInstance: mars3d.Map) :void {
  map = mapInstance // 记录map
  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  mars3d.Util.fetchJson({ url: "http://localhost/mars3d-data/uav-path.json" }) // "//data.mars3d.cn/file/apidemo/flypath.json"
    .then(function (res) {
      initPath0(res)
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })

  mars3d.Util.fetchJson({ url: "//data.mars3d.cn/file/apidemo/flypath.json" }) // "//data.mars3d.cn/file/apidemo/flypath.json"
    .then(function (res) {
      initPath1(res)
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
    })

  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  bindLayerContextMenu() // 在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted():void {
  map = null
  graphicLayer.remove()
  graphicLayer = null
}

// 改变视角  跟踪，上方和侧方
// flyToPoint:定位至当前时间所在的位置 (非相机位置)
// 飞机0号
export function viewAircraft0() { // 跟踪
  map.trackedEntity = pathEntity0.entity

  pathEntity0.flyToPoint({
    radius: 500, // 相机距离目标点的距离（单位：米）
    heading: 40, // 方向角度值，绕垂直于地心的轴旋转角度, 0至360
    pitch: -50, // 俯仰角度值，绕纬度线旋转角度, -90至90
    duration: 0.01// 飞行持续时间（秒）
  })
}
export function viewTopDown0() { // 上方
  map.trackedEntity = undefined

  map.flyToPoint(pathEntity0.positionShow, {
    radius: 2000, // 相机距离目标点的距离（单位：米）
    heading: -90, // 方向角度值，绕垂直于地心的轴旋转角度, 0至360
    pitch: -89// 俯仰角度值，绕纬度线旋转角度, -90至90
  })
}
export function viewSide0() { // 侧方
  map.trackedEntity = undefined

  map.flyToPoint(pathEntity0.positionShow, {
    radius: 3000, // 相机距离目标点的距离（单位：米）
    heading: -90, // 方向角度值，绕垂直于地心的轴旋转角度, 0至360
    pitch: -25// 俯仰角度值，绕纬度线旋转角度, -90至90
  })
}
// 飞机1号
export function viewAircraft1() { // 跟踪
  map.trackedEntity = pathEntity1.entity

  pathEntity1.flyToPoint({
    radius: 500, // 相机距离目标点的距离（单位：米）
    heading: 40, // 方向角度值，绕垂直于地心的轴旋转角度, 0至360
    pitch: -50, // 俯仰角度值，绕纬度线旋转角度, -90至90
    duration: 0.01// 飞行持续时间（秒）
  })
}
export function viewTopDown1() { // 上方
  map.trackedEntity = undefined

  map.flyToPoint(pathEntity1.positionShow, {
    radius: 2000, // 相机距离目标点的距离（单位：米）
    heading: -90, // 方向角度值，绕垂直于地心的轴旋转角度, 0至360
    pitch: -89// 俯仰角度值，绕纬度线旋转角度, -90至90
  })
}
export function viewSide1() { // 侧方
  map.trackedEntity = undefined

  map.flyToPoint(pathEntity1.positionShow, {
    radius: 3000, // 相机距离目标点的距离（单位：米）
    heading: -90, // 方向角度值，绕垂直于地心的轴旋转角度, 0至360
    pitch: -25// 俯仰角度值，绕纬度线旋转角度, -90至90
  })
}

function initPath0(data) {
  const property = new Cesium.SampledPositionProperty()
  property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD// The first or last value is used when outside the range of sample data.超出示例范围，则使用第一个或最后一个值

  let start// 开始时间
  let stop// 结束时间
  for (let i = 0, len = data.length; i < len; i++) {
    const item = data[i]
    // toFixed() 方法可把 Number 四舍五入为指定小数位数的数字。
    const lng = Number(item.x.toFixed(6)) // 经度
    const lat = Number(item.y.toFixed(6)) // 纬度
    const height = item.z // 高度
    const time = item.time // 时间

    let position = null
    if (lng && lat) {
      position = Cesium.Cartesian3.fromDegrees(lng, lat, height)// lng指longitude经度,lat指latitude纬度，height指高度  相当于xyz坐标
      // longitude and latitude are given in degrees
     }
    let juliaDate = null
    if (time) {
      juliaDate = Cesium.JulianDate.fromIso8601(time)
    }
    if (position && juliaDate) {
      property.addSample(juliaDate, position)
    }

    if (i === 0) {
      start = juliaDate
    } else if (i === len - 1) {
      stop = juliaDate
    }

    // 每一个target点的数据
    const graphic = new mars3d.graphic.PointPrimitive({ // 像素点 Primitive矢量数据
      position: position, // 坐标位置
      style: { // 样式信息
        pixelSize: 4,
        color: "#cccccc"
      },
      popup: "编号:" + item.id + "<br/>时间:" + time// 绑定的popup弹窗值
    })
    graphicLayer.addGraphic(graphic)
  }

  // 设置时钟属性
  map.clock.startTime = start.clone()
  map.clock.stopTime = stop.clone()
  map.clock.currentTime = start.clone()
  map.clock.clockRange = Cesium.ClockRange.LOOP_STOP// 当到达Clock#stopTime时，Clock#tick将Clock#currentTime提前到间隔的另一端。当时间向后移动时，Clock#tick不会超过Clock#startTime
  map.clock.multiplier = 5// multiplier确定调用Clock#tick时 时间向前推进了多少，负值允许向后推进。

  if (map.controls.timeline) { // 时间线, 是否创建下侧时间线控件面板
    map.controls.timeline.zoomTo(start, stop)
  }

  // 创建path对象
  pathEntity0 = new mars3d.graphic.PathEntity({ // path路径 Entity矢量数据
    position: property, // 含时序的点的集合（坐标位置）
    orientation: new Cesium.VelocityOrientationProperty(property), // 实体方向
    style: { // 样式信息
      resolution: 1, // 指定在对位置进行采样时步进的最大秒数
      leadTime: 0, // 提前显示轨迹的时间长度（单位：秒）
      trailTime: 3600, // 保留历史轨迹的时间长度（单位：秒）
      color: "#ff0000",
      width: 3
    },
    label: { // 文本点 支持的样式信息
      text: "飞机0号", // 文本内容
      font_size: 19,
      font_family: "楷体",
      color: Cesium.Color.AZURE, // 文本颜色
      outline: true, // 是否衬色(衬色)
      visibleDepth: false, // 是否被遮挡（不被遮挡）
      outlineColor: Cesium.Color.BLACK, // 衬色颜色
      outlineWidth: 2, // 衬色宽度
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 横向方向的定位(居中)
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 垂直方向的定位(点位于文本的左下角)
      pixelOffset: new Cesium.Cartesian2(10, -25) // 偏移量
    },
    // billboard: {// 设置附加的 图标 和对应的样式
    //   image: "img/marker/lace-blue.png",
    //   horizontalOrigin: Cesium.HorizontalOrigin.CENTER,// 横向方向的定位(居中)
    //   verticalOrigin: Cesium.VerticalOrigin.BOTTOM,// 垂直方向的定位(点位于文本的左下角)
    //   visibleDepth: false// 是否被遮挡（不被遮挡）
    // },
    model: { // 设置附加的 gltf模型 和对应的样式
      url: "//data.mars3d.cn/gltf/mars/dajiang/dajiang.gltf", // glTF模型的URI的字符串或资源属性
      scale: 1, // 比例
      minimumPixelSize: 50// 指定模型的近似最小像素大小，而不考虑缩放。
    },
    popup: "飞机0号"// 绑定的popup弹窗值
  })
  graphicLayer.addGraphic(pathEntity0)

  // 圆锥追踪体
  const coneTrack = new mars3d.graphic.ConeTrack({
    position: property, // 坐标位置
    style: { // 样式信息
      length: 100, // 圆锥追踪体长度值（单位：米）
      angle: 12, // 圆锥追踪体张角（角度值，取值范围 0.01-89.99）
      color: "#ff0000", // 填充颜色
      opacity: 0.5// 透明度, 取值范围：0.0-1.0
    }
  })
  graphicLayer.addGraphic(coneTrack)
}

function initPath1(data) {
  const property = new Cesium.SampledPositionProperty()
  property.forwardExtrapolationType = Cesium.ExtrapolationType.HOLD// The first or last value is used when outside the range of sample data.超出示例范围，则使用第一个或最后一个值

  let start// 开始时间
  let stop// 结束时间
  for (let i = 0, len = data.length; i < len; i++) {
    const item = data[i]
    // toFixed() 方法可把 Number 四舍五入为指定小数位数的数字。
    const lng = Number(item.x.toFixed(6)) // 经度
    const lat = Number(item.y.toFixed(6)) // 纬度
    const height = item.z // 高度
    const time = item.time // 时间

    let position = null
    if (lng && lat) {
      position = Cesium.Cartesian3.fromDegrees(lng, lat, height)// lng指longitude经度,lat指latitude纬度，height指高度  相当于xyz坐标
      // longitude and latitude are given in degrees
     }
    let juliaDate = null
    if (time) {
      juliaDate = Cesium.JulianDate.fromIso8601(time)
    }
    if (position && juliaDate) {
      property.addSample(juliaDate, position)
    }

    if (i === 0) {
      start = juliaDate
    } else if (i === len - 1) {
      stop = juliaDate
    }

    // 每一个target点的数据
    const graphic = new mars3d.graphic.PointPrimitive({ // 像素点 Primitive矢量数据
      position: position, // 坐标位置
      style: { // 样式信息
        pixelSize: 4,
        color: "#cccccc"
      },
      popup: "编号:" + item.id + "<br/>时间:" + time// 绑定的popup弹窗值
    })
    graphicLayer.addGraphic(graphic)
  }

  // 设置时钟属性
  map.clock.startTime = start.clone()
  map.clock.stopTime = stop.clone()
  map.clock.currentTime = start.clone()
  map.clock.clockRange = Cesium.ClockRange.LOOP_STOP// 当到达Clock#stopTime时，Clock#tick将Clock#currentTime提前到间隔的另一端。当时间向后移动时，Clock#tick不会超过Clock#startTime
  map.clock.multiplier = 5// multiplier确定调用Clock#tick时 时间向前推进了多少，负值允许向后推进。

  if (map.controls.timeline) { // 时间线, 是否创建下侧时间线控件面板
    map.controls.timeline.zoomTo(start, stop)
  }

  // 创建path对象
  pathEntity1 = new mars3d.graphic.PathEntity({ // path路径 Entity矢量数据
    position: property, // 含时序的点的集合（坐标位置）
    orientation: new Cesium.VelocityOrientationProperty(property), // 实体方向
    style: { // 样式信息
      resolution: 1, // 指定在对位置进行采样时步进的最大秒数
      leadTime: 0, // 提前显示轨迹的时间长度（单位：秒）
      trailTime: 3600, // 保留历史轨迹的时间长度（单位：秒）
      color: "#ff0000",
      width: 3
    },
    label: { // 文本点 支持的样式信息
      text: "飞机1号", // 文本内容
      font_size: 19,
      font_family: "楷体",
      color: Cesium.Color.AZURE, // 文本颜色
      outline: true, // 是否衬色(衬色)
      visibleDepth: false, // 是否被遮挡（不被遮挡）
      outlineColor: Cesium.Color.BLACK, // 衬色颜色
      outlineWidth: 2, // 衬色宽度
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // 横向方向的定位(居中)
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 垂直方向的定位(点位于文本的左下角)
      pixelOffset: new Cesium.Cartesian2(10, -25) // 偏移量
    },
    // billboard: {// 设置附加的 图标 和对应的样式
    //   image: "img/marker/lace-blue.png",
    //   horizontalOrigin: Cesium.HorizontalOrigin.CENTER,// 横向方向的定位(居中)
    //   verticalOrigin: Cesium.VerticalOrigin.BOTTOM,// 垂直方向的定位(点位于文本的左下角)
    //   visibleDepth: false// 是否被遮挡（不被遮挡）
    // },
    model: { // 设置附加的 gltf模型 和对应的样式
      url: "//data.mars3d.cn/gltf/mars/wrj.glb", // glTF模型的URI的字符串或资源属性
      scale: 0.1, // 比例
      minimumPixelSize: 20// 指定模型的近似最小像素大小，而不考虑缩放。
    },
    popup: "飞机1号"// 绑定的popup弹窗值
  })
  graphicLayer.addGraphic(pathEntity1)

  // 圆锥追踪体
  const coneTrack = new mars3d.graphic.ConeTrack({
    position: property, // 坐标位置
    style: { // 样式信息
      length: 100, // 圆锥追踪体长度值（单位：米）
      angle: 12, // 圆锥追踪体张角（角度值，取值范围 0.01-89.99）
      color: "#ff0000", // 填充颜色
      opacity: 0.5// 透明度, 取值范围：0.0-1.0
    }
  })
  graphicLayer.addGraphic(coneTrack)
}

// 在图层绑定Popup弹窗
export function bindLayerPopup() {
  graphicLayer.bindPopup(function (event) {
    const attr = event.graphic.attr || {}
    attr["类型"] = event.graphic.type
    attr["来源"] = "我是layer上绑定的Popup"
    attr["备注"] = "我支持鼠标交互"

    return mars3d.Util.getTemplateHtml({ title: "矢量图层", template: "all", attr: attr })
  })
}


// 绑定右键菜单
export function bindLayerContextMenu() {
  graphicLayer.bindContextMenu([
    {
      text: "删除对象",
      icon: "fa fa-trash-o",
      show: (event) => {
        const graphic = event.graphic
        if (!graphic || graphic.isDestroy) {
          return false
        } else {
          return true
        }
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return
        }
        const parent = graphic.parent // 右击是编辑点时
        graphicLayer.removeGraphic(graphic)
        if (parent) {
          graphicLayer.removeGraphic(parent)
        }
      }
    },
    {
      text: "跟踪锁定",
      icon: "fa fa-lock",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }

        if (graphic.entity instanceof Cesium.Entity) {
          return true
        } else if (graphic.trackedEntity instanceof Cesium.Entity) {
          return true
        }
        return false
      },
      callback: function (e) {
        map.trackedEntity = e.graphic
      }
    },
    {
      text: "取消锁定",
      icon: "fa fa-unlock-alt",
      show: function (e) {
        return map.trackedEntity !== undefined
      },
      callback: function (e) {
        map.trackedEntity = undefined
      }
    }
  ])
}
