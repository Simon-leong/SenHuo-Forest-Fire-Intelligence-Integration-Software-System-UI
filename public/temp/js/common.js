"use script"

const parentGlobal = window.parent || window

parentGlobal.mars3d = mars3d // widget中使用

function init() {
  // 判断webgl支持
  if (!mars3d.Util.webglreport()) {
    mars3d.Util.webglerror()
  }
  // 读取 config.json 配置文件
  mars3d.Util.fetchJson({ url: "config/config.json" })
    .then(function (json) {
      console.log("读取 config.json 配置文件完成", json) // 打印测试信息

      // 构建地图
      const initMapFun = window.initMap ? window.initMap : globalInitMap
      new Promise(function (resolve) {
        const mapObj = initMapFun(json.map3d)
        if (mapObj instanceof Promise) {
          mapObj.then(function (m) {
            resolve(m)
          })
        } else {
          resolve(mapObj)
        }
      }).then(function (m) {
        parentGlobal._mapInstance = m
        parentGlobal.mapWork = window
      })
      // parentGlobal._mapInstance = initMapFun(json.map3d)
      // parentGlobal.mapWork = window // 这句话是将当前js对象绑定赋予给index.项目内进行调用
    })
    .catch(function (error) {
      console.log("加载JSON出错", error)
      globalAlert(error ? error.message : "加载JSON出错")
    })
}
init()

// 构造地图主方法【必须】
function globalInitMap(options) {
  if (window.mapOptions) {
    if (typeof window.mapOptions === "function") {
      options = window.mapOptions(options) || options
    } else {
      window.mapOptions = options = mars3d.Util.merge(options, window.mapOptions)
    }
  }

  // 创建三维地球场景
  return new mars3d.Map("mars3dContainer", options)
}

// 调用项目的消息提示（自动消失）
function globalMsg(content) {
  return parentGlobal.$message(content)
}

// 调用项目的弹窗提示（手动单击确定关闭窗口）
function globalAlert(content, title) {
  return parentGlobal.$alert(content, title)
}

// 调用项目的右上角信息提示（可关闭）
function globalNotify(title, content) {
  return parentGlobal.$notify(title, content)
}

function showLoading(type) {
  parentGlobal.$showLoading(type)
}

function hideLoading(type) {
  parentGlobal.$hideLoading(type)
}
