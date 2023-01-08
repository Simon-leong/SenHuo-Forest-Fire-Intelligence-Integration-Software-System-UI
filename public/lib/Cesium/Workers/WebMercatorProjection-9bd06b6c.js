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

define(["exports","./Matrix2-4706dd70","./defaultValue-028a8a27","./RuntimeError-a977b8e0","./ComponentDatatype-438cad2a"],function(m,s,d,c,u){"use strict";function t(e){this._ellipsoid=d.defaultValue(e,s.Ellipsoid.WGS84),this._semimajorAxis=this._ellipsoid.maximumRadius,this._oneOverSemimajorAxis=1/this._semimajorAxis}Object.defineProperties(t.prototype,{ellipsoid:{get:function(){return this._ellipsoid}}}),t.mercatorAngleToGeodeticLatitude=function(e){return u.CesiumMath.PI_OVER_TWO-2*Math.atan(Math.exp(-e))},t.geodeticLatitudeToMercatorAngle=function(e){e>t.MaximumLatitude?e=t.MaximumLatitude:e<-t.MaximumLatitude&&(e=-t.MaximumLatitude);const i=Math.sin(e);return .5*Math.log((1+i)/(1-i))},t.MaximumLatitude=t.mercatorAngleToGeodeticLatitude(Math.PI),t.prototype.project=function(e,i){const o=this._semimajorAxis,n=e.longitude*o,r=t.geodeticLatitudeToMercatorAngle(e.latitude)*o,a=e.height;return d.defined(i)?(i.x=n,i.y=r,i.z=a,i):new s.Cartesian3(n,r,a)},t.prototype.unproject=function(e,i){if(!d.defined(e))throw new c.DeveloperError("cartesian is required");const o=this._oneOverSemimajorAxis,n=e.x*o,r=t.mercatorAngleToGeodeticLatitude(e.y*o),a=e.z;return d.defined(i)?(i.longitude=n,i.latitude=r,i.height=a,i):new s.Cartographic(n,r,a)},m.WebMercatorProjection=t});
