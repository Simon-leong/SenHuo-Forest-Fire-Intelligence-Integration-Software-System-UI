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

define(["exports","./Matrix2-4706dd70","./RuntimeError-a977b8e0","./defaultValue-028a8a27","./Transforms-66eda18c"],function(O,e,o,c,h){"use strict";function a(n,m,i){this.minimum=e.Cartesian3.clone(c.defaultValue(n,e.Cartesian3.ZERO)),this.maximum=e.Cartesian3.clone(c.defaultValue(m,e.Cartesian3.ZERO)),c.defined(i)?i=e.Cartesian3.clone(i):i=e.Cartesian3.midpoint(this.minimum,this.maximum,new e.Cartesian3),this.center=i}a.fromCorners=function(n,m,i){return o.Check.defined("minimum",n),o.Check.defined("maximum",m),c.defined(i)||(i=new a),i.minimum=e.Cartesian3.clone(n,i.minimum),i.maximum=e.Cartesian3.clone(m,i.maximum),i.center=e.Cartesian3.midpoint(n,m,i.center),i},a.fromPoints=function(n,m){if(c.defined(m)||(m=new a),!c.defined(n)||n.length===0)return m.minimum=e.Cartesian3.clone(e.Cartesian3.ZERO,m.minimum),m.maximum=e.Cartesian3.clone(e.Cartesian3.ZERO,m.maximum),m.center=e.Cartesian3.clone(e.Cartesian3.ZERO,m.center),m;let i=n[0].x,t=n[0].y,d=n[0].z,C=n[0].x,r=n[0].y,y=n[0].z;const w=n.length;for(let z=1;z<w;z++){const I=n[z],E=I.x,Z=I.y,q=I.z;i=Math.min(E,i),C=Math.max(E,C),t=Math.min(Z,t),r=Math.max(Z,r),d=Math.min(q,d),y=Math.max(q,y)}const s=m.minimum;s.x=i,s.y=t,s.z=d;const f=m.maximum;return f.x=C,f.y=r,f.z=y,m.center=e.Cartesian3.midpoint(s,f,m.center),m},a.clone=function(n,m){if(!!c.defined(n))return c.defined(m)?(m.minimum=e.Cartesian3.clone(n.minimum,m.minimum),m.maximum=e.Cartesian3.clone(n.maximum,m.maximum),m.center=e.Cartesian3.clone(n.center,m.center),m):new a(n.minimum,n.maximum,n.center)},a.equals=function(n,m){return n===m||c.defined(n)&&c.defined(m)&&e.Cartesian3.equals(n.center,m.center)&&e.Cartesian3.equals(n.minimum,m.minimum)&&e.Cartesian3.equals(n.maximum,m.maximum)};let u=new e.Cartesian3;a.intersectPlane=function(n,m){o.Check.defined("box",n),o.Check.defined("plane",m),u=e.Cartesian3.subtract(n.maximum,n.minimum,u);const i=e.Cartesian3.multiplyByScalar(u,.5,u),t=m.normal,d=i.x*Math.abs(t.x)+i.y*Math.abs(t.y)+i.z*Math.abs(t.z),C=e.Cartesian3.dot(n.center,t)+m.distance;return C-d>0?h.Intersect.INSIDE:C+d<0?h.Intersect.OUTSIDE:h.Intersect.INTERSECTING},a.prototype.clone=function(n){return a.clone(this,n)},a.prototype.intersectPlane=function(n){return a.intersectPlane(this,n)},a.prototype.equals=function(n){return a.equals(this,n)},O.AxisAlignedBoundingBox=a});
