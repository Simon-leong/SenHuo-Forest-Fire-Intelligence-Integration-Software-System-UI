//按mars3d规范，将CesiumVectorTile封装下

;(function (window) {
  class WeiVectorTileLayer extends mars3d.layer.BaseTileLayer {
    //构建ImageryProvider
    _createImageryProvider(options) {
      return createImageryProvider(options)
    }
  }
  function createImageryProvider(options) {
    return new CesiumVectorTile.VectorTileImageryProvider(options) //CesiumVectorTile.js中
  }
  WeiVectorTileLayer.createImageryProvider = createImageryProvider

  //注册下
  const layerType = 'weiVectorTile' //图层类型
  mars3d.LayerUtil.register(layerType, WeiVectorTileLayer)
  mars3d.LayerUtil.registerImageryProvider(layerType, createImageryProvider)

  //对外接口
  window.mars3d.layer.WeiVectorTileLayer = WeiVectorTileLayer
})(window)
