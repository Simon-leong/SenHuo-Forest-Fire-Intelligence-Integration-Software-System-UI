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
define(["./defaultValue-ff4e651f","./Matrix2-f4a72982","./RuntimeError-ed67c927","./EllipsoidOutlineGeometry-78afd83e","./ComponentDatatype-cb7120fd","./WebGLConstants-dc5a5fcc","./Transforms-e2b46a6c","./_commonjsHelpers-b40762ca","./combine-36f11d2f","./GeometryAttribute-7b85a4f4","./GeometryAttributes-9da88d6e","./GeometryOffsetAttribute-a6457b88","./IndexDatatype-5062f28c"],(function(e,i,t,n,o,r,s,a,d,l,c,u,m){"use strict";function f(t){const o=e.defaultValue(t.radius,1),r={radii:new i.Cartesian3(o,o,o),stackPartitions:t.stackPartitions,slicePartitions:t.slicePartitions,subdivisions:t.subdivisions};this._ellipsoidGeometry=new n.EllipsoidOutlineGeometry(r),this._workerName="createSphereOutlineGeometry"}f.packedLength=n.EllipsoidOutlineGeometry.packedLength,f.pack=function(e,i,t){return n.EllipsoidOutlineGeometry.pack(e._ellipsoidGeometry,i,t)};const p=new n.EllipsoidOutlineGeometry,y={radius:void 0,radii:new i.Cartesian3,stackPartitions:void 0,slicePartitions:void 0,subdivisions:void 0};return f.unpack=function(t,o,r){const s=n.EllipsoidOutlineGeometry.unpack(t,o,p);return y.stackPartitions=s._stackPartitions,y.slicePartitions=s._slicePartitions,y.subdivisions=s._subdivisions,e.defined(r)?(i.Cartesian3.clone(s._radii,y.radii),r._ellipsoidGeometry=new n.EllipsoidOutlineGeometry(y),r):(y.radius=s._radii.x,new f(y))},f.createGeometry=function(e){return n.EllipsoidOutlineGeometry.createGeometry(e._ellipsoidGeometry)},function(i,t){return e.defined(t)&&(i=f.unpack(i,t)),f.createGeometry(i)}}));
