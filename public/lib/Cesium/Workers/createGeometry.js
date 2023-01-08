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
define(["./defaultValue-ff4e651f","./PrimitivePipeline-94215433","./createTaskProcessorWorker","./Transforms-e2b46a6c","./Matrix2-f4a72982","./RuntimeError-ed67c927","./ComponentDatatype-cb7120fd","./WebGLConstants-dc5a5fcc","./_commonjsHelpers-b40762ca","./combine-36f11d2f","./GeometryAttribute-7b85a4f4","./GeometryAttributes-9da88d6e","./GeometryPipeline-b0b332fc","./AttributeCompression-857bc071","./EncodedCartesian3-f4bbf636","./IndexDatatype-5062f28c","./IntersectionTests-a8d45b72","./Plane-7efd9975","./WebMercatorProjection-9ab65454"],(function(e,t,r,n,o,i,s,c,a,f,u,b,d,m,l,p,y,P,k){"use strict";const C={};function G(t){let r=C[t];return e.defined(r)||("object"==typeof exports?C[r]=r=require(`Workers/${t}`):require([`Workers/${t}`],(function(e){r=e,C[r]=e}))),r}return r((function(r,n){const o=r.subTasks,i=o.length,s=new Array(i);for(let t=0;t<i;t++){const r=o[t],n=r.geometry,i=r.moduleName;if(e.defined(i)){const e=G(i);s[t]=e(n,r.offset)}else s[t]=n}return Promise.all(s).then((function(e){return t.PrimitivePipeline.packCreateGeometryResults(e,n)}))}))}));
