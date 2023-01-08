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
define(["./AttributeCompression-857bc071","./Matrix2-f4a72982","./ComponentDatatype-cb7120fd","./createTaskProcessorWorker","./RuntimeError-ed67c927","./defaultValue-ff4e651f","./WebGLConstants-dc5a5fcc"],(function(e,t,a,r,n,o,i){"use strict";const s=32767,c=new t.Cartographic,u=new t.Cartesian3,p=new t.Rectangle,f=new t.Ellipsoid,l={min:void 0,max:void 0};return r((function(r,n){const o=new Uint16Array(r.positions);!function(e){e=new Float64Array(e);let a=0;l.min=e[a++],l.max=e[a++],t.Rectangle.unpack(e,a,p),a+=t.Rectangle.packedLength,t.Ellipsoid.unpack(e,a,f)}(r.packedBuffer);const i=p,m=f,d=l.min,h=l.max,C=o.length/3,g=o.subarray(0,C),b=o.subarray(C,2*C),w=o.subarray(2*C,3*C);e.AttributeCompression.zigZagDeltaDecode(g,b,w);const k=new Float64Array(o.length);for(let e=0;e<C;++e){const r=g[e],n=b[e],o=w[e],p=a.CesiumMath.lerp(i.west,i.east,r/s),f=a.CesiumMath.lerp(i.south,i.north,n/s),l=a.CesiumMath.lerp(d,h,o/s),C=t.Cartographic.fromRadians(p,f,l,c),y=m.cartographicToCartesian(C,u);t.Cartesian3.pack(y,k,3*e)}return n.push(k.buffer),{positions:k.buffer}}))}));
