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
define(["./Matrix2-f4a72982","./RuntimeError-ed67c927","./defaultValue-ff4e651f","./EllipseOutlineGeometry-d49f5b3c","./ComponentDatatype-cb7120fd","./WebGLConstants-dc5a5fcc","./Transforms-e2b46a6c","./_commonjsHelpers-b40762ca","./combine-36f11d2f","./EllipseGeometryLibrary-461ff9ca","./GeometryAttribute-7b85a4f4","./GeometryAttributes-9da88d6e","./GeometryOffsetAttribute-a6457b88","./IndexDatatype-5062f28c"],(function(e,i,t,r,l,n,s,o,a,c,u,d,m,p){"use strict";function f(e){const i=(e=t.defaultValue(e,t.defaultValue.EMPTY_OBJECT)).radius,l={center:e.center,semiMajorAxis:i,semiMinorAxis:i,ellipsoid:e.ellipsoid,height:e.height,extrudedHeight:e.extrudedHeight,granularity:e.granularity,numberOfVerticalLines:e.numberOfVerticalLines};this._ellipseGeometry=new r.EllipseOutlineGeometry(l),this._workerName="createCircleOutlineGeometry"}f.packedLength=r.EllipseOutlineGeometry.packedLength,f.pack=function(e,i,t){return r.EllipseOutlineGeometry.pack(e._ellipseGeometry,i,t)};const y=new r.EllipseOutlineGeometry({center:new e.Cartesian3,semiMajorAxis:1,semiMinorAxis:1}),G={center:new e.Cartesian3,radius:void 0,ellipsoid:e.Ellipsoid.clone(e.Ellipsoid.UNIT_SPHERE),height:void 0,extrudedHeight:void 0,granularity:void 0,numberOfVerticalLines:void 0,semiMajorAxis:void 0,semiMinorAxis:void 0};return f.unpack=function(i,l,n){const s=r.EllipseOutlineGeometry.unpack(i,l,y);return G.center=e.Cartesian3.clone(s._center,G.center),G.ellipsoid=e.Ellipsoid.clone(s._ellipsoid,G.ellipsoid),G.height=s._height,G.extrudedHeight=s._extrudedHeight,G.granularity=s._granularity,G.numberOfVerticalLines=s._numberOfVerticalLines,t.defined(n)?(G.semiMajorAxis=s._semiMajorAxis,G.semiMinorAxis=s._semiMinorAxis,n._ellipseGeometry=new r.EllipseOutlineGeometry(G),n):(G.radius=s._semiMajorAxis,new f(G))},f.createGeometry=function(e){return r.EllipseOutlineGeometry.createGeometry(e._ellipseGeometry)},function(i,r){return t.defined(r)&&(i=f.unpack(i,r)),i._ellipseGeometry._center=e.Cartesian3.clone(i._ellipseGeometry._center),i._ellipseGeometry._ellipsoid=e.Ellipsoid.clone(i._ellipseGeometry._ellipsoid),f.createGeometry(i)}}));
