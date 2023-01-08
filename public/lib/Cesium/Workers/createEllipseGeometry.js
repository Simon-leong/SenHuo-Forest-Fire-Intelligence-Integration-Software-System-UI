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
define(["./Matrix2-f4a72982","./defaultValue-ff4e651f","./EllipseGeometry-bf751fdd","./RuntimeError-ed67c927","./ComponentDatatype-cb7120fd","./WebGLConstants-dc5a5fcc","./Transforms-e2b46a6c","./_commonjsHelpers-b40762ca","./combine-36f11d2f","./EllipseGeometryLibrary-461ff9ca","./GeometryAttribute-7b85a4f4","./GeometryAttributes-9da88d6e","./GeometryInstance-5be181eb","./GeometryOffsetAttribute-a6457b88","./GeometryPipeline-b0b332fc","./AttributeCompression-857bc071","./EncodedCartesian3-f4bbf636","./IndexDatatype-5062f28c","./IntersectionTests-a8d45b72","./Plane-7efd9975","./VertexFormat-a6a7080e"],(function(e,t,r,n,a,o,i,f,c,s,b,l,d,m,p,u,y,G,E,C,_){"use strict";return function(n,a){return t.defined(a)&&(n=r.EllipseGeometry.unpack(n,a)),n._center=e.Cartesian3.clone(n._center),n._ellipsoid=e.Ellipsoid.clone(n._ellipsoid),r.EllipseGeometry.createGeometry(n)}}));
