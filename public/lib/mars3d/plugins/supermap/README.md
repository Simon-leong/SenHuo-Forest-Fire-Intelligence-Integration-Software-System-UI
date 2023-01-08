# mars3d-plugin-supermap

Mars3D平台插件, 结合supermap超图库使用的功能插件
  

## mars3d与超图的融合有2个方式

### 方式1：原生Cesium库+s3m插件
 mars3d(含Cesium) + s3m独立插件 + mars3d-supermap，需要引入的资源为：
```js
"mars3d": [
  "Cesium/Widgets/widgets.css", //原生Cesium
  "Cesium/Cesium.js",
  "turf/turf.min.js",
  "mars3d/mars3d.css", //mars3d
  "mars3d/mars3d.js",
  "mars3d/plugins/supermap/SuperMap3D.js", //s3m支持原生cesium的独立插件，参考 https://github.com/SuperMap/iClient3D-for-WebGL
  "mars3d/plugins/supermap/mars3d-supermap.js",//mars3d-supermap简化调用封装
],
```
更多参考mars3d功能示例中[S3M图层示例](https://mars3d.cn/editor-vue.html?id=layer-other/s3m/basis)

#### 此方式的特别说明
经过测试，[SuperMap3D](https://github.com/SuperMap/iClient3D-for-WebGL/tree/main/Cesium_S3MLayer_Plugins/S3MTilesLayer)插件代码不是最新的，超图官网API很多在此插件中都没有。



### 方式2：需要替换Cesium库
超图版本Cesium + mars3d + mars3d-supermap ，需要引入的资源为：
```js
"mars3d": [
  "Cesium-supermap/Widgets/widgets.css", //超图版本Cesium 
  "Cesium-supermap/Cesium.js",
  "mars3d/plugins/compatible/cesium-version.js", //cesium版本兼容处理
  "turf/turf.min.js",
  "mars3d/mars3d.css", //mars3d
  "mars3d/mars3d.js",
  "mars3d/plugins/supermap/mars3d-supermap.js",//mars3d-supermap简化调用封装
],
```
相关示例和项目可以访问：[https://github.com/marsgis/mars3d-link-supermap](https://github.com/marsgis/mars3d-link-supermap/)
 
 
#### 此方式的特别说明
 不是所有功能都可以正常用，因为：

- 使用的是超图版Cesium，所以mars3d-cesium的所有修改都无效，影响到wfs、模型编辑、地形编辑等功能(可以用超图的相关API来替代实现)
- 超图Cesium修改了地球的默认参数，造成3dtiles加载位置偏差很大。




 
## 相关依赖 
 超图版Cesium、mars3d
 
## 查看源码
  https://github.com/marsgis/mars3d-plugin/
 


## Mars3D 是什么 
> `Mars3D三维地球平台软件` 是[火星科技](http://marsgis.cn/)团队研发的二三维一体的WebGIS地图开发平台，是火星科技团队成员多年GIS开发和Cesium使用的技术沉淀。基于[Cesium](https://cesium.com/cesiumjs/)开源库和现代Web技术栈全新构建，该平台框架优化了Cesium的使用方式和增添了更多高级功能。集成了领先的开源地图库、可视化库，提供了全新的三维大数据可视化、实时流数据可视化功能，通过本产品可快速实现浏览器和移动端上美观、流畅的三维地图呈现与空间分析。


## 相关网站 

- Mars3D官网：[http://mars3d.cn](http://mars3d.cn)  

- GitHub地址：[https://github.com/marsgis/mars3d](https://github.com/marsgis/mars3d)
