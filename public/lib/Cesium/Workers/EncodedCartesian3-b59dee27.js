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

define(["exports","./Matrix2-4706dd70","./RuntimeError-a977b8e0","./defaultValue-028a8a27"],function(C,d,i,g){"use strict";function e(){this.high=d.Cartesian3.clone(d.Cartesian3.ZERO),this.low=d.Cartesian3.clone(d.Cartesian3.ZERO)}e.encode=function(n,o){i.Check.typeOf.number("value",n),g.defined(o)||(o={high:0,low:0});let h;return n>=0?(h=Math.floor(n/65536)*65536,o.high=h,o.low=n-h):(h=Math.floor(-n/65536)*65536,o.high=-h,o.low=n+h),o};const c={high:0,low:0};e.fromCartesian=function(n,o){i.Check.typeOf.object("cartesian",n),g.defined(o)||(o=new e);const h=o.high,f=o.low;return e.encode(n.x,c),h.x=c.high,f.x=c.low,e.encode(n.y,c),h.y=c.high,f.y=c.low,e.encode(n.z,c),h.z=c.high,f.z=c.low,o};const t=new e;e.writeElements=function(n,o,h){i.Check.defined("cartesianArray",o),i.Check.typeOf.number("index",h),i.Check.typeOf.number.greaterThanOrEquals("index",h,0),e.fromCartesian(n,t);const f=t.high,w=t.low;o[h]=f.x,o[h+1]=f.y,o[h+2]=f.z,o[h+3]=w.x,o[h+4]=w.y,o[h+5]=w.z},C.EncodedCartesian3=e});
