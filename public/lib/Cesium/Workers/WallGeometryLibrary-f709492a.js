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

define(["exports","./arrayRemoveDuplicates-ca6f0282","./Matrix2-4706dd70","./defaultValue-028a8a27","./ComponentDatatype-438cad2a","./PolylinePipeline-52ab0181"],function(v,O,b,L,y,C){"use strict";const S={};function T(a,t){return y.CesiumMath.equalsEpsilon(a.latitude,t.latitude,y.CesiumMath.EPSILON10)&&y.CesiumMath.equalsEpsilon(a.longitude,t.longitude,y.CesiumMath.EPSILON10)}const q=new b.Cartographic,w=new b.Cartographic;function F(a,t,i,h){t=O.arrayRemoveDuplicates(t,b.Cartesian3.equalsEpsilon);const f=t.length;if(f<2)return;const E=L.defined(h),d=L.defined(i),l=new Array(f),g=new Array(f),r=new Array(f),p=t[0];l[0]=p;const u=a.cartesianToCartographic(p,q);d&&(u.height=i[0]),g[0]=u.height,E?r[0]=h[0]:r[0]=0;const o=g[0],P=r[0];let e=o===P,n=1;for(let c=1;c<f;++c){const A=t[c],s=a.cartesianToCartographic(A,w);d&&(s.height=i[c]),e=e&&s.height===0,T(u,s)?u.height<s.height&&(g[n-1]=s.height):(l[n]=A,g[n]=s.height,E?r[n]=h[c]:r[n]=0,e=e&&g[n]===r[n],b.Cartographic.clone(s,u),++n)}if(!(e||n<2))return l.length=n,g.length=n,r.length=n,{positions:l,topHeights:g,bottomHeights:r}}const B=new Array(2),M=new Array(2),R={positions:void 0,height:void 0,granularity:void 0,ellipsoid:void 0};S.computePositions=function(a,t,i,h,f,E){const d=F(a,t,i,h);if(!L.defined(d))return;t=d.positions,i=d.topHeights,h=d.bottomHeights;const l=t.length,g=l-2;let r,p;const u=y.CesiumMath.chordLength(f,a.maximumRadius),o=R;if(o.minDistance=u,o.ellipsoid=a,E){let P=0,e;for(e=0;e<l-1;e++)P+=C.PolylinePipeline.numberOfPoints(t[e],t[e+1],u)+1;r=new Float64Array(P*3),p=new Float64Array(P*3);const n=B,c=M;o.positions=n,o.height=c;let A=0;for(e=0;e<l-1;e++){n[0]=t[e],n[1]=t[e+1],c[0]=i[e],c[1]=i[e+1];const s=C.PolylinePipeline.generateArc(o);r.set(s,A),c[0]=h[e],c[1]=h[e+1],p.set(C.PolylinePipeline.generateArc(o),A),A+=s.length}}else o.positions=t,o.height=i,r=new Float64Array(C.PolylinePipeline.generateArc(o)),o.height=h,p=new Float64Array(C.PolylinePipeline.generateArc(o));return{bottomPositions:p,topPositions:r,numCorners:g}},v.WallGeometryLibrary=S});
