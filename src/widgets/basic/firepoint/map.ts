import * as mars3d from "mars3d"
import { Cesium } from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象
let pathEntity0 = null

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 27.88, lng: 101.42, alt: 2832, heading: 359, pitch: -50 }
  }
}

/**
 * 初始化地图业务，生命周期钩子函数（必须）
 * 框架在地图初始化完成后自动调用该函数
 * @param {mars3d.Map} mapInstance 地图对象
 * @returns {void} 无
 */
export function onMounted(mapInstance) {
  map = mapInstance // 记录map

  startAnimation()

  mars3d.Util.fetchJson({ url: "http://192.168.2.15/mars3d-data/firepoint-path.json" }) 
  .then(function (res) {
    initPath0(res)
  })
  .catch(function (error) {
    console.log("加载JSON出错", error)
  })

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)

  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })
  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  bindLayerContextMenu() // 在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效

  // 合肥市
  addDemoGraphic1(graphicLayer)
  addDemoGraphic2(graphicLayer)
  addDemoGraphic3(graphicLayer)
}

/**
 * 释放当前地图业务的生命周期函数
 * @returns {void} 无
 */
export function onUnmounted() {
  map = null
  graphicLayer.remove()
  graphicLayer = null
}

export function startAnimation() {
    map.openFlyAnimation({ 
        center: { lat: 27.20, lng: 101.437, alt: 83390.5, heading: 359, pitch: -50 },
        duration: 0
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
      text: "无人机1号", // 文本内容
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
    popup: "无人机1号"// 绑定的popup弹窗值
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


function addDemoGraphic1(graphicLayer) {
  const lightCone = new mars3d.graphic.LightCone({
    position: Cesium.Cartesian3.fromDegrees(101.447485, 27.89831, 117.8),
    style: {
      color: "rgba(255,0,0,0.9)",
      radius: 100, // 底部半径
      height: 80000 // 椎体高度
    },
    show: true
  })
  graphicLayer.addGraphic(lightCone)

  // 演示个性化处理graphic
  initGraphicManager(lightCone)
}
// 也可以在单个Graphic上做个性化管理及绑定操作
function initGraphicManager(graphic) {
  // 绑定Popup
  const inthtml = `<table style="width: auto;">
            <tr>
              <th scope="col" colspan="2" style="text-align:center;font-size:15px;">四川凉山州木里县模拟火点位置 </th>
            </tr>
            <tr>
            <tr>
              <td>展示一级火点和二级火点位置</td></tr>
              <td>可以对二级火点位置进行迁移</td>
            </tr>
          </table>`
  graphic.bindPopup(inthtml).openPopup()

  // 绑定右键菜单
  graphic.bindContextMenu([
    {
      text: "删除对象[graphic绑定的]",
      icon: "fa fa-trash-o",
      callback: (e) => {
        const graphic = e.graphic
        if (graphic) {
          graphic.remove()
        }
      }
    }
  ])
}

function addDemoGraphic2(graphicLayer) {
  const cities = [
    { name: "二级火点-1", lon: 101.487741, lat: 27.901914 },
    { name: "二级火点-2", lon: 101.45417, lat: 27.910557 },
    { name: "二级火点-3", lon: 101.416448, lat: 27.907239 },
    { name: "二级火点-4", lon: 101.433749, lat: 27.939323 },
    { name: "二级火点-5", lon: 101.436074, lat: 27.917293 },
    { name: "二级火点-6", lon: 101.386248, lat: 27.958096 },
    { name: "二级火点-7", lon: 101.419372, lat: 27.930455 },
    { name: "二级火点-8", lon: 101.480663, lat: 27.983014 }
  ]
  for (let i = 0; i < cities.length; i++) {
    const item = cities[i]

    const coneGlow2 = new mars3d.graphic.LightCone({
      position: Cesium.Cartesian3.fromDegrees(item.lon, item.lat, 117.8),
      style: {
        radius: 70,
        height: 80000,
        distanceDisplayCondition: new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(1, 3010000),

        // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
        highlight: {
          type: mars3d.EventType.click,
          color: "#ffff00"
        }
      },
      show: true,
     popup: item.name
    })
    graphicLayer.addGraphic(coneGlow2)
  }
}

function addDemoGraphic3(graphicLayer) {
  // 走马灯围墙效果
  const scrollWall = new mars3d.graphic.ScrollWall({
    positions: [
      [101.337741, 28.101914, 12.29],
      [101.48417, 28.010557, 11.07],
      [101.49448, 27.897239, 11.01],
      [101.407319, 27.901996, 17.11]
    ],
    style: {
      diffHeight: 2500, // 高度
      color: "#f33349",
      style: 2, // 效果2，默认是1
      speed: 10
    },
    attr: { remark: "示例3" }
  })
  graphicLayer.addGraphic(scrollWall)
}

// 生成演示数据(测试数据量)
export function addRandomGraphicByCount(count) {
  graphicLayer.clear()
  graphicLayer.enabledEvent = false // 关闭事件，大数据addGraphic时影响加载时间

  const bbox = [116.984788, 31.625909, 117.484068, 32.021504]
  const result = mars3d.PolyUtil.getGridPoints(bbox, count, 30)
  console.log("生成的测试网格坐标", result)

  for (let j = 0; j < result.points.length; ++j) {
    const position = result.points[j]
    const index = j + 1

    const graphic = new mars3d.graphic.LightCone({
      position: position,
      style: {
        radius: result.radius * 0.3,
        height: result.radius * 3
      },
      attr: { index: index }
    })
    graphicLayer.addGraphic(graphic)
  }

  graphicLayer.enabledEvent = true // 恢复事件
  return result.points.length
}

// 开始绘制
export function startDrawGraphic() {
  graphicLayer.startDraw({
    type: "lightCone",
    style: {
      radius: 500,
      height: 8000
    }
  })
  graphicLayer.startDraw({
    type: "scrollWall",
    style: {
      color: "#55ff33",
      opacity: 0.8,
      diffHeight: 800,
      reverse: false, // 方向：true往上、false往下
      speed: 10
    }
  })
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
      text: "开始编辑对象",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return !graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphicLayer.startEditing(graphic)
        }
      }
    },
    {
      text: "停止编辑对象",
      icon: "fa fa-edit",
      show: function (e) {
        const graphic = e.graphic
        if (!graphic || !graphic.hasEdit) {
          return false
        }
        return graphic.isEditing
      },
      callback: (e) => {
        const graphic = e.graphic
        if (!graphic) {
          return false
        }
        if (graphic) {
          graphic.stopEditing()
        }
      }
    },
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
    }
  ])
}
