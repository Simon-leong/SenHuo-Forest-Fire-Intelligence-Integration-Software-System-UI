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
define(["./Matrix2-f4a72982","./RuntimeError-ed67c927","./defaultValue-ff4e651f","./EllipseGeometry-bf751fdd","./VertexFormat-a6a7080e","./ComponentDatatype-cb7120fd","./WebGLConstants-dc5a5fcc","./Transforms-e2b46a6c","./_commonjsHelpers-b40762ca","./combine-36f11d2f","./EllipseGeometryLibrary-461ff9ca","./GeometryAttribute-7b85a4f4","./GeometryAttributes-9da88d6e","./GeometryInstance-5be181eb","./GeometryOffsetAttribute-a6457b88","./GeometryPipeline-b0b332fc","./AttributeCompression-857bc071","./EncodedCartesian3-f4bbf636","./IndexDatatype-5062f28c","./IntersectionTests-a8d45b72","./Plane-7efd9975"],(function(e,t,i,r,o,n,s,l,a,d,m,c,u,p,y,_,f,G,x,h,g){"use strict";function b(e){const t=(e=i.defaultValue(e,i.defaultValue.EMPTY_OBJECT)).radius,o={center:e.center,semiMajorAxis:t,semiMinorAxis:t,ellipsoid:e.ellipsoid,height:e.height,extrudedHeight:e.extrudedHeight,granularity:e.granularity,vertexFormat:e.vertexFormat,stRotation:e.stRotation,shadowVolume:e.shadowVolume};this._ellipseGeometry=new r.EllipseGeometry(o),this._workerName="createCircleGeometry"}b.packedLength=r.EllipseGeometry.packedLength,b.pack=function(e,t,i){return r.EllipseGeometry.pack(e._ellipseGeometry,t,i)};const E=new r.EllipseGeometry({center:new e.Cartesian3,semiMajorAxis:1,semiMinorAxis:1}),w={center:new e.Cartesian3,radius:void 0,ellipsoid:e.Ellipsoid.clone(e.Ellipsoid.UNIT_SPHERE),height:void 0,extrudedHeight:void 0,granularity:void 0,vertexFormat:new o.VertexFormat,stRotation:void 0,semiMajorAxis:void 0,semiMinorAxis:void 0,shadowVolume:void 0};return b.unpack=function(t,n,s){const l=r.EllipseGeometry.unpack(t,n,E);return w.center=e.Cartesian3.clone(l._center,w.center),w.ellipsoid=e.Ellipsoid.clone(l._ellipsoid,w.ellipsoid),w.height=l._height,w.extrudedHeight=l._extrudedHeight,w.granularity=l._granularity,w.vertexFormat=o.VertexFormat.clone(l._vertexFormat,w.vertexFormat),w.stRotation=l._stRotation,w.shadowVolume=l._shadowVolume,i.defined(s)?(w.semiMajorAxis=l._semiMajorAxis,w.semiMinorAxis=l._semiMinorAxis,s._ellipseGeometry=new r.EllipseGeometry(w),s):(w.radius=l._semiMajorAxis,new b(w))},b.createGeometry=function(e){return r.EllipseGeometry.createGeometry(e._ellipseGeometry)},b.createShadowVolume=function(e,t,i){const r=e._ellipseGeometry._granularity,n=e._ellipseGeometry._ellipsoid,s=t(r,n),l=i(r,n);return new b({center:e._ellipseGeometry._center,radius:e._ellipseGeometry._semiMajorAxis,ellipsoid:n,stRotation:e._ellipseGeometry._stRotation,granularity:r,extrudedHeight:s,height:l,vertexFormat:o.VertexFormat.POSITION_ONLY,shadowVolume:!0})},Object.defineProperties(b.prototype,{rectangle:{get:function(){return this._ellipseGeometry.rectangle}},textureCoordinateRotationPoints:{get:function(){return this._ellipseGeometry.textureCoordinateRotationPoints}}}),function(t,r){return i.defined(r)&&(t=b.unpack(t,r)),t._ellipseGeometry._center=e.Cartesian3.clone(t._ellipseGeometry._center),t._ellipseGeometry._ellipsoid=e.Ellipsoid.clone(t._ellipseGeometry._ellipsoid),b.createGeometry(t)}}));
