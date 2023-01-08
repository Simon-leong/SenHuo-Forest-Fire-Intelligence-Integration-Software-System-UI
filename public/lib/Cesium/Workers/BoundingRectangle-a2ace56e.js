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

define(["exports","./Matrix2-4706dd70","./RuntimeError-a977b8e0","./defaultValue-028a8a27","./Transforms-66eda18c"],function(g,w,d,o,x){"use strict";function c(n,h,i,e){this.x=o.defaultValue(n,0),this.y=o.defaultValue(h,0),this.width=o.defaultValue(i,0),this.height=o.defaultValue(e,0)}c.packedLength=4,c.pack=function(n,h,i){return d.Check.typeOf.object("value",n),d.Check.defined("array",h),i=o.defaultValue(i,0),h[i++]=n.x,h[i++]=n.y,h[i++]=n.width,h[i]=n.height,h},c.unpack=function(n,h,i){return d.Check.defined("array",n),h=o.defaultValue(h,0),o.defined(i)||(i=new c),i.x=n[h++],i.y=n[h++],i.width=n[h++],i.height=n[h],i},c.fromPoints=function(n,h){if(o.defined(h)||(h=new c),!o.defined(n)||n.length===0)return h.x=0,h.y=0,h.width=0,h.height=0,h;const i=n.length;let e=n[0].x,t=n[0].y,f=n[0].x,y=n[0].y;for(let p=1;p<i;p++){const m=n[p],C=m.x,k=m.y;e=Math.min(C,e),f=Math.max(C,f),t=Math.min(k,t),y=Math.max(k,y)}return h.x=e,h.y=t,h.width=f-e,h.height=y-t,h};const b=new x.GeographicProjection,j=new w.Cartographic,O=new w.Cartographic;c.fromRectangle=function(n,h,i){if(o.defined(i)||(i=new c),!o.defined(n))return i.x=0,i.y=0,i.width=0,i.height=0,i;h=o.defaultValue(h,b);const e=h.project(w.Rectangle.southwest(n,j)),t=h.project(w.Rectangle.northeast(n,O));return w.Cartesian2.subtract(t,e,t),i.x=e.x,i.y=e.y,i.width=t.x,i.height=t.y,i},c.clone=function(n,h){if(!!o.defined(n))return o.defined(h)?(h.x=n.x,h.y=n.y,h.width=n.width,h.height=n.height,h):new c(n.x,n.y,n.width,n.height)},c.union=function(n,h,i){d.Check.typeOf.object("left",n),d.Check.typeOf.object("right",h),o.defined(i)||(i=new c);const e=Math.min(n.x,h.x),t=Math.min(n.y,h.y),f=Math.max(n.x+n.width,h.x+h.width),y=Math.max(n.y+n.height,h.y+h.height);return i.x=e,i.y=t,i.width=f-e,i.height=y-t,i},c.expand=function(n,h,i){d.Check.typeOf.object("rectangle",n),d.Check.typeOf.object("point",h),i=c.clone(n,i);const e=h.x-i.x,t=h.y-i.y;return e>i.width?i.width=e:e<0&&(i.width-=e,i.x=h.x),t>i.height?i.height=t:t<0&&(i.height-=t,i.y=h.y),i},c.intersect=function(n,h){d.Check.typeOf.object("left",n),d.Check.typeOf.object("right",h);const i=n.x,e=n.y,t=h.x,f=h.y;return i>t+h.width||i+n.width<t||e+n.height<f||e>f+h.height?x.Intersect.OUTSIDE:x.Intersect.INTERSECTING},c.equals=function(n,h){return n===h||o.defined(n)&&o.defined(h)&&n.x===h.x&&n.y===h.y&&n.width===h.width&&n.height===h.height},c.prototype.clone=function(n){return c.clone(this,n)},c.prototype.intersect=function(n){return c.intersect(this,n)},c.prototype.equals=function(n){return c.equals(this,n)},g.BoundingRectangle=c});
