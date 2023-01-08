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
define(["./defaultValue-ff4e651f","./Transforms-e2b46a6c","./Matrix2-f4a72982","./RuntimeError-ed67c927","./ComponentDatatype-cb7120fd","./GeometryAttribute-7b85a4f4","./GeometryAttributes-9da88d6e","./_commonjsHelpers-b40762ca","./combine-36f11d2f","./WebGLConstants-dc5a5fcc"],(function(e,t,n,r,a,i,o,c,u,s){"use strict";function f(){this._workerName="createPlaneOutlineGeometry"}f.packedLength=0,f.pack=function(e,t){return t},f.unpack=function(t,n,r){return e.defined(r)?r:new f};const m=new n.Cartesian3(-.5,-.5,0),y=new n.Cartesian3(.5,.5,0);return f.createGeometry=function(){const e=new o.GeometryAttributes,r=new Uint16Array(8),c=new Float64Array(12);return c[0]=m.x,c[1]=m.y,c[2]=m.z,c[3]=y.x,c[4]=m.y,c[5]=m.z,c[6]=y.x,c[7]=y.y,c[8]=m.z,c[9]=m.x,c[10]=y.y,c[11]=m.z,e.position=new i.GeometryAttribute({componentDatatype:a.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:c}),r[0]=0,r[1]=1,r[2]=1,r[3]=2,r[4]=2,r[5]=3,r[6]=3,r[7]=0,new i.Geometry({attributes:e,indices:r,primitiveType:i.PrimitiveType.LINES,boundingSphere:new t.BoundingSphere(n.Cartesian3.ZERO,Math.sqrt(2))})},function(t,n){return e.defined(n)&&(t=f.unpack(t,n)),f.createGeometry(t)}}));
