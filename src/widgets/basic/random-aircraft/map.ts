import * as mars3d from "mars3d"
import { Cesium } from "mars3d"

export let map // mars3d.Map三维地图对象
export let graphicLayer // 矢量图层对象

// 需要覆盖config.json中地图属性参数（当前示例框架中自动处理合并）
export const mapOptions = {
  scene: {
    center: { lat: 27.823386, lng: 102.248608, alt: 2696, heading: 273, pitch: -67 }
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
 * +
 * @returns {void} 无
 */
export function onMounted (mapInstance: mars3d.Map) :void {
  map = mapInstance // 记录map
  map.fixedLight = true // 固定光照，避免gltf模型随时间存在亮度不一致。

  // 创建矢量数据图层
  graphicLayer = new mars3d.layer.GraphicLayer()
  map.addLayer(graphicLayer)


  // 在layer上绑定监听事件
  graphicLayer.on(mars3d.EventType.click, function (event) {
    console.log("监听layer，单击了矢量对象", event)
  })

  bindLayerPopup() // 在图层上绑定popup,对所有加到这个图层的矢量数据都生效
  bindLayerContextMenu() // 在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效

  // 加一些演示数据
  for (let i = 0; i < 6; i++) {
    const graphic = new mars3d.graphic.ModelEntity({
      position: Cesium.Cartesian3.fromDegrees(102.248608, 27.823386, 160), // 首次出现的坐标位置
      style: {
        url: "//data.mars3d.cn/gltf/mars/dajiang/dajiang.gltf",
        scale: 1, // 比例
        minimumPixelSize: 50, // 指定模型的近似最小像素大小，而不考虑缩放。
  
        // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
        highlight: {
          type: mars3d.EventType.click,
          silhouette: true,
          silhouetteColor: "#ff0000",
          silhouetteSize: 4
        },
  
        label: { // 支持附带文字的显示
          // 不需要文字时，去掉label配置即可
          text: "大疆PHANTON" + i, // 文本内容，换行可以用换行符'\n'。
          font_size: 12, // 字体大小
          color: "#ffffff", // 文本颜色
          outline: true, // 是否衬色（是）
          outlineColor: "#000000", // 衬色颜色
          pixelOffsetY: -20, // 纵向偏移像素
          distanceDisplayCondition: true, // 是否按视距显示 或 指定此框将显示在与摄像机的多大距离。（是）
          distanceDisplayCondition_far: 50000, // 最大距离
          distanceDisplayCondition_near: 0, // 最小距离
          scaleByDistance: false // 是否按视距缩放 或 设定基于与相机的距离设置比例。（否）
        }
      },
      // forwardExtrapolationType: Cesium.ExtrapolationType.NONE,
      attr: { index: i, remark: "Model示例" } // 附件的属性信息，可以任意附加属性，导出geojson或json时会自动处理导出。

    })
    graphicLayer.addGraphic(graphic)
  
    // 仅 forwardExtrapolationType: Cesium.ExtrapolationType.NONE时触发
    // graphic.on(mars3d.EventType.stop, function (event) {
    //   console.log("已停止运行", event.target?.attr)
    // })
    // 圆锥追踪体
     const coneTrack = new mars3d.graphic.ConeTrack({
        // position: graphic.position, // 坐标位置
        position: new Cesium.CallbackProperty(function (time) {
          return graphic.position
        }, false),
        targetPosition: graphic.position,
        style: { // 样式信息
        length: 300, // 圆锥追踪体长度值（单位：米）
        angle: 30, // 圆锥追踪体张角（角度值，取值范围 0.01-89.99）
        color: "#ff0000", // 填充颜色
        opacity: 0.5// 透明度, 取值范围：0.0-1.0
        }
    })
    graphicLayer.addGraphic(coneTrack) 

  }

  // 设置动态位置
  graphicLayer.eachGraphic((graphic) => {
    graphic.addDynamicPosition(randomPoint()) // 首次出现的位置
  })
  graphicLayer.eachGraphic((graphic) => { // 设置并添加动画轨迹位置，按“指定时间”运动到达“指定位置”。
    graphic.addDynamicPosition(randomPoint(), 10) // 按10秒运动至指定位置
  })

  // 定时更新动态位置（setInterval为演示）
  setInterval(() => {
    graphicLayer.eachGraphic((graphic) => {
      graphic.addDynamicPosition(randomPoint(), 10)
    })
  }, 10000)


  startAnimation()
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
export function startAnimation() {
  map.flyHome({ duration: 0 })

  // 开场动画
  map.openFlyAnimation({
    // duration1:4,
    // easingFunction1: Cesium.EasingFunction.QUINTIC_IN_OUT,
    callback: function () {
      // 动画播放完成后回调
    }
  })
}

export function stopAnimation() {
  map.camera.cancelFlight()
}

// 取区域内的随机点
function randomPoint() {
  const jd = random(102.205144 * 1000, 102.262125 * 1000) / 1000
  const wd = random(27.786495 * 1000, 27.882958 * 1000) / 1000
  return Cesium.Cartesian3.fromDegrees(jd, wd, 160)
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
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
