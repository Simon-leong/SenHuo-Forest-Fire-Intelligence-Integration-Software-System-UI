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
define(["./defaultValue-ff4e651f","./FrustumGeometry-6ebade62","./Transforms-e2b46a6c","./Matrix2-f4a72982","./RuntimeError-ed67c927","./ComponentDatatype-cb7120fd","./WebGLConstants-dc5a5fcc","./_commonjsHelpers-b40762ca","./combine-36f11d2f","./GeometryAttribute-7b85a4f4","./GeometryAttributes-9da88d6e","./Plane-7efd9975","./VertexFormat-a6a7080e"],(function(e,t,r,a,n,o,u,f,m,c,d,s,i){"use strict";return function(r,a){return e.defined(a)&&(r=t.FrustumGeometry.unpack(r,a)),t.FrustumGeometry.createGeometry(r)}}));
