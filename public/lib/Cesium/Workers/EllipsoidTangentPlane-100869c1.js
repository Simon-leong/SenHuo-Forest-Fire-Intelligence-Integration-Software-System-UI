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

define(["exports","./AxisAlignedBoundingBox-ca05cfa4","./Matrix2-4706dd70","./RuntimeError-a977b8e0","./defaultValue-028a8a27","./IntersectionTests-54d7f8a4","./Plane-f4cd36d8","./Transforms-66eda18c"],function(g,P,o,d,s,h,l,_){"use strict";const C=new o.Cartesian4;function a(e,n){if(d.Check.defined("origin",e),n=s.defaultValue(n,o.Ellipsoid.WGS84),e=n.scaleToGeodeticSurface(e),!s.defined(e))throw new d.DeveloperError("origin must not be at the center of the ellipsoid.");const t=_.Transforms.eastNorthUpToFixedFrame(e,n);this._ellipsoid=n,this._origin=e,this._xAxis=o.Cartesian3.fromCartesian4(o.Matrix4.getColumn(t,0,C)),this._yAxis=o.Cartesian3.fromCartesian4(o.Matrix4.getColumn(t,1,C));const i=o.Cartesian3.fromCartesian4(o.Matrix4.getColumn(t,2,C));this._plane=l.Plane.fromPointNormal(e,i)}Object.defineProperties(a.prototype,{ellipsoid:{get:function(){return this._ellipsoid}},origin:{get:function(){return this._origin}},plane:{get:function(){return this._plane}},xAxis:{get:function(){return this._xAxis}},yAxis:{get:function(){return this._yAxis}},zAxis:{get:function(){return this._plane.normal}}});const A=new P.AxisAlignedBoundingBox;a.fromPoints=function(e,n){d.Check.defined("cartesians",e);const t=P.AxisAlignedBoundingBox.fromPoints(e,A);return new a(t.center,n)};const y=new h.Ray,p=new o.Cartesian3;a.prototype.projectPointOntoPlane=function(e,n){d.Check.defined("cartesian",e);const t=y;t.origin=e,o.Cartesian3.normalize(e,t.direction);let i=h.IntersectionTests.rayPlane(t,this._plane,p);if(s.defined(i)||(o.Cartesian3.negate(t.direction,t.direction),i=h.IntersectionTests.rayPlane(t,this._plane,p)),s.defined(i)){const c=o.Cartesian3.subtract(i,this._origin,i),r=o.Cartesian3.dot(this._xAxis,c),f=o.Cartesian3.dot(this._yAxis,c);return s.defined(n)?(n.x=r,n.y=f,n):new o.Cartesian2(r,f)}},a.prototype.projectPointsOntoPlane=function(e,n){d.Check.defined("cartesians",e),s.defined(n)||(n=[]);let t=0;const i=e.length;for(let c=0;c<i;c++){const r=this.projectPointOntoPlane(e[c],n[t]);s.defined(r)&&(n[t]=r,t++)}return n.length=t,n},a.prototype.projectPointToNearestOnPlane=function(e,n){d.Check.defined("cartesian",e),s.defined(n)||(n=new o.Cartesian2);const t=y;t.origin=e,o.Cartesian3.clone(this._plane.normal,t.direction);let i=h.IntersectionTests.rayPlane(t,this._plane,p);s.defined(i)||(o.Cartesian3.negate(t.direction,t.direction),i=h.IntersectionTests.rayPlane(t,this._plane,p));const c=o.Cartesian3.subtract(i,this._origin,i),r=o.Cartesian3.dot(this._xAxis,c),f=o.Cartesian3.dot(this._yAxis,c);return n.x=r,n.y=f,n},a.prototype.projectPointsToNearestOnPlane=function(e,n){d.Check.defined("cartesians",e),s.defined(n)||(n=[]);const t=e.length;n.length=t;for(let i=0;i<t;i++)n[i]=this.projectPointToNearestOnPlane(e[i],n[i]);return n};const m=new o.Cartesian3;a.prototype.projectPointOntoEllipsoid=function(e,n){d.Check.defined("cartesian",e),s.defined(n)||(n=new o.Cartesian3);const t=this._ellipsoid,i=this._origin,c=this._xAxis,r=this._yAxis,f=m;return o.Cartesian3.multiplyByScalar(c,e.x,f),n=o.Cartesian3.add(i,f,n),o.Cartesian3.multiplyByScalar(r,e.y,f),o.Cartesian3.add(n,f,n),t.scaleToGeocentricSurface(n,n),n},a.prototype.projectPointsOntoEllipsoid=function(e,n){d.Check.defined("cartesians",e);const t=e.length;s.defined(n)?n.length=t:n=new Array(t);for(let i=0;i<t;++i)n[i]=this.projectPointOntoEllipsoid(e[i],n[i]);return n},g.EllipsoidTangentPlane=a});
