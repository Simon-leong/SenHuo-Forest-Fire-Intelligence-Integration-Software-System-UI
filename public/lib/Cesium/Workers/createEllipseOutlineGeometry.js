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
define(["./Matrix2-f4a72982","./defaultValue-ff4e651f","./EllipseOutlineGeometry-d49f5b3c","./RuntimeError-ed67c927","./ComponentDatatype-cb7120fd","./WebGLConstants-dc5a5fcc","./Transforms-e2b46a6c","./_commonjsHelpers-b40762ca","./combine-36f11d2f","./EllipseGeometryLibrary-461ff9ca","./GeometryAttribute-7b85a4f4","./GeometryAttributes-9da88d6e","./GeometryOffsetAttribute-a6457b88","./IndexDatatype-5062f28c"],(function(e,t,r,i,n,o,a,l,c,f,s,d,u,m){"use strict";return function(i,n){return t.defined(n)&&(i=r.EllipseOutlineGeometry.unpack(i,n)),i._center=e.Cartesian3.clone(i._center),i._ellipsoid=e.Ellipsoid.clone(i._ellipsoid),r.EllipseOutlineGeometry.createGeometry(i)}}));
