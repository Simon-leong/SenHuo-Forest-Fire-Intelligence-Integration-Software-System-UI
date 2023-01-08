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
define(["./defaultValue-ff4e651f","./EllipsoidOutlineGeometry-78afd83e","./Transforms-e2b46a6c","./Matrix2-f4a72982","./RuntimeError-ed67c927","./ComponentDatatype-cb7120fd","./WebGLConstants-dc5a5fcc","./_commonjsHelpers-b40762ca","./combine-36f11d2f","./GeometryAttribute-7b85a4f4","./GeometryAttributes-9da88d6e","./GeometryOffsetAttribute-a6457b88","./IndexDatatype-5062f28c"],(function(e,t,r,f,n,i,o,a,u,c,d,m,s){"use strict";return function(r,f){return e.defined(r.buffer)&&(r=t.EllipsoidOutlineGeometry.unpack(r,f)),t.EllipsoidOutlineGeometry.createGeometry(r)}}));
