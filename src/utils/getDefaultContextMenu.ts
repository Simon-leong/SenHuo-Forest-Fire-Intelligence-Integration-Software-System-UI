import * as mars3d from "mars3d"
import { $alert as globalAlert } from "@mars/components/mars-ui/index"
import {
  Home,
  Local,
  PreviewOpen,
  AppSwitch,
  Forbid,
  Cube,
  MultiTriangular,
  Shovel,
  Close,
  MapDistance,
  Ruler,
  Texture,
  AutoHeightOne,
  Compass,
  DeleteKey,
  Mark,
  Label,
  Change,
  BringToFrontOne,
  Asterisk,
  Rectangle,
  Editor,
  Export,
  ClearFormat,
  Effects,
  LightRain,
  Snow,
  Fog,
  Halo,
  Brightness,
  DarkMode,
  Blackboard,
  HighLight,
  Config,
  LandSurveying,
  TwoTriangles,
  Sun,
  FlightAirflow,
  AddPicture,
  SwitchThemes,
  Agreement,
  TakeOff,
  KeyboardOne,
  RecentViewsSort,
  MoveInOne,
  ExclusiveGateway,
  CloseOne,
  LockOne,
  Box,
  MonitorOff,
  MapTwo,
  International,
  DatabaseForbid
} from "@icon-park/svg"

const Cesium = mars3d.Cesium

// 获取平台内置的右键菜单
export function getDefaultContextMenu(map) {
  const that = map.contextmenu
  return [{
    text: "这是显示文字",
    icon: Local({ theme: "outline", fill: "#fff", size: "18" }),
    show: function () {
      return true
    },
    callback: function (e) {
      console.log(e)
      // e是bindContextmenu里传的参，官方没有说明，考虑到传入的参数只有content数组，那么其他的参数来源都是鼠标点击事件，鼠标点击天然带有位置以及各种信息
      globalAlert("这是点击后的回调")
    }
  }]
}

