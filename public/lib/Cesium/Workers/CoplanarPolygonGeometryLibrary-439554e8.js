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

define(["exports","./Matrix2-4706dd70","./RuntimeError-a977b8e0","./OrientedBoundingBox-1ead2ca7"],function(w,n,d,h){"use strict";const l={},z=new n.Cartesian3,x=new n.Cartesian3,B=new n.Cartesian3,P=new n.Cartesian3,b=new h.OrientedBoundingBox;l.validOutline=function(s){d.Check.defined("positions",s);const t=h.OrientedBoundingBox.fromPoints(s,b).halfAxes,o=n.Matrix3.getColumn(t,0,x),c=n.Matrix3.getColumn(t,1,B),e=n.Matrix3.getColumn(t,2,P),r=n.Cartesian3.magnitude(o),a=n.Cartesian3.magnitude(c),C=n.Cartesian3.magnitude(e);return!(r===0&&(a===0||C===0)||a===0&&C===0)},l.computeProjectTo2DArguments=function(s,i,t,o){d.Check.defined("positions",s),d.Check.defined("centerResult",i),d.Check.defined("planeAxis1Result",t),d.Check.defined("planeAxis2Result",o);const c=h.OrientedBoundingBox.fromPoints(s,b),e=c.halfAxes,r=n.Matrix3.getColumn(e,0,x),a=n.Matrix3.getColumn(e,1,B),C=n.Matrix3.getColumn(e,2,P),m=n.Cartesian3.magnitude(r),f=n.Cartesian3.magnitude(a),g=n.Cartesian3.magnitude(C),u=Math.min(m,f,g);if(m===0&&(f===0||g===0)||f===0&&g===0)return!1;let A,y;return(u===f||u===g)&&(A=r),u===m?A=a:u===g&&(y=a),(u===m||u===f)&&(y=C),n.Cartesian3.normalize(A,t),n.Cartesian3.normalize(y,o),n.Cartesian3.clone(c.center,i),!0};function p(s,i,t,o,c){const e=n.Cartesian3.subtract(s,i,z),r=n.Cartesian3.dot(t,e),a=n.Cartesian3.dot(o,e);return n.Cartesian2.fromElements(r,a,c)}l.createProjectPointsTo2DFunction=function(s,i,t){return function(o){const c=new Array(o.length);for(let e=0;e<o.length;e++)c[e]=p(o[e],s,i,t);return c}},l.createProjectPointTo2DFunction=function(s,i,t){return function(o,c){return p(o,s,i,t,c)}},w.CoplanarPolygonGeometryLibrary=l});
