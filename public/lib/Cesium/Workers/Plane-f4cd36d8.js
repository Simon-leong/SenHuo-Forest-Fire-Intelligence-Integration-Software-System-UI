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

define(["exports","./Matrix2-4706dd70","./RuntimeError-a977b8e0","./defaultValue-028a8a27","./ComponentDatatype-438cad2a"],function(d,a,c,f,C){"use strict";function s(e,n){if(c.Check.typeOf.object("normal",e),!C.CesiumMath.equalsEpsilon(a.Cartesian3.magnitude(e),1,C.CesiumMath.EPSILON6))throw new c.DeveloperError("normal must be normalized.");c.Check.typeOf.number("distance",n),this.normal=a.Cartesian3.clone(e),this.distance=n}s.fromPointNormal=function(e,n,t){if(c.Check.typeOf.object("point",e),c.Check.typeOf.object("normal",n),!C.CesiumMath.equalsEpsilon(a.Cartesian3.magnitude(n),1,C.CesiumMath.EPSILON6))throw new c.DeveloperError("normal must be normalized.");const o=-a.Cartesian3.dot(n,e);return f.defined(t)?(a.Cartesian3.clone(n,t.normal),t.distance=o,t):new s(n,o)};const h=new a.Cartesian3;s.fromCartesian4=function(e,n){c.Check.typeOf.object("coefficients",e);const t=a.Cartesian3.fromCartesian4(e,h),o=e.w;if(!C.CesiumMath.equalsEpsilon(a.Cartesian3.magnitude(t),1,C.CesiumMath.EPSILON6))throw new c.DeveloperError("normal must be normalized.");return f.defined(n)?(a.Cartesian3.clone(t,n.normal),n.distance=o,n):new s(t,o)},s.getPointDistance=function(e,n){return c.Check.typeOf.object("plane",e),c.Check.typeOf.object("point",n),a.Cartesian3.dot(e.normal,n)+e.distance};const l=new a.Cartesian3;s.projectPointOntoPlane=function(e,n,t){c.Check.typeOf.object("plane",e),c.Check.typeOf.object("point",n),f.defined(t)||(t=new a.Cartesian3);const o=s.getPointDistance(e,n),r=a.Cartesian3.multiplyByScalar(e.normal,o,l);return a.Cartesian3.subtract(n,r,t)};const m=new a.Matrix4,O=new a.Cartesian4,b=new a.Cartesian3;s.transform=function(e,n,t){c.Check.typeOf.object("plane",e),c.Check.typeOf.object("transform",n);const o=e.normal,r=e.distance,w=a.Matrix4.inverseTranspose(n,m);let i=a.Cartesian4.fromElements(o.x,o.y,o.z,r,O);i=a.Matrix4.multiplyByVector(w,i,i);const j=a.Cartesian3.fromCartesian4(i,b);return i=a.Cartesian4.divideByScalar(i,a.Cartesian3.magnitude(j),i),s.fromCartesian4(i,t)},s.clone=function(e,n){return c.Check.typeOf.object("plane",e),f.defined(n)?(a.Cartesian3.clone(e.normal,n.normal),n.distance=e.distance,n):new s(e.normal,e.distance)},s.equals=function(e,n){return c.Check.typeOf.object("left",e),c.Check.typeOf.object("right",n),e.distance===n.distance&&a.Cartesian3.equals(e.normal,n.normal)},s.ORIGIN_XY_PLANE=Object.freeze(new s(a.Cartesian3.UNIT_Z,0)),s.ORIGIN_YZ_PLANE=Object.freeze(new s(a.Cartesian3.UNIT_X,0)),s.ORIGIN_ZX_PLANE=Object.freeze(new s(a.Cartesian3.UNIT_Y,0)),d.Plane=s});
