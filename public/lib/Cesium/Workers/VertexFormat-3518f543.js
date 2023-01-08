/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.96.6
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

define(["exports","./defaultValue-028a8a27","./RuntimeError-a977b8e0"],function(O,t,f){"use strict";function o(e){e=t.defaultValue(e,t.defaultValue.EMPTY_OBJECT),this.position=t.defaultValue(e.position,!1),this.normal=t.defaultValue(e.normal,!1),this.st=t.defaultValue(e.st,!1),this.bitangent=t.defaultValue(e.bitangent,!1),this.tangent=t.defaultValue(e.tangent,!1),this.color=t.defaultValue(e.color,!1)}o.POSITION_ONLY=Object.freeze(new o({position:!0})),o.POSITION_AND_NORMAL=Object.freeze(new o({position:!0,normal:!0})),o.POSITION_NORMAL_AND_ST=Object.freeze(new o({position:!0,normal:!0,st:!0})),o.POSITION_AND_ST=Object.freeze(new o({position:!0,st:!0})),o.POSITION_AND_COLOR=Object.freeze(new o({position:!0,color:!0})),o.ALL=Object.freeze(new o({position:!0,normal:!0,st:!0,tangent:!0,bitangent:!0})),o.DEFAULT=o.POSITION_NORMAL_AND_ST,o.packedLength=6,o.pack=function(e,n,i){if(!t.defined(e))throw new f.DeveloperError("value is required");if(!t.defined(n))throw new f.DeveloperError("array is required");return i=t.defaultValue(i,0),n[i++]=e.position?1:0,n[i++]=e.normal?1:0,n[i++]=e.st?1:0,n[i++]=e.tangent?1:0,n[i++]=e.bitangent?1:0,n[i]=e.color?1:0,n},o.unpack=function(e,n,i){if(!t.defined(e))throw new f.DeveloperError("array is required");return n=t.defaultValue(n,0),t.defined(i)||(i=new o),i.position=e[n++]===1,i.normal=e[n++]===1,i.st=e[n++]===1,i.tangent=e[n++]===1,i.bitangent=e[n++]===1,i.color=e[n]===1,i},o.clone=function(e,n){if(!!t.defined(e))return t.defined(n)||(n=new o),n.position=e.position,n.normal=e.normal,n.st=e.st,n.tangent=e.tangent,n.bitangent=e.bitangent,n.color=e.color,n},O.VertexFormat=o});
