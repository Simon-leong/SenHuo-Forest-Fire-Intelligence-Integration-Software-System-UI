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
define(["exports","./arrayRemoveDuplicates-cb6282cf","./Matrix2-f4a72982","./defaultValue-ff4e651f","./ComponentDatatype-cb7120fd","./PolylinePipeline-f14a929f"],(function(e,t,i,n,o,r){"use strict";const a={};function s(e,t){return o.CesiumMath.equalsEpsilon(e.latitude,t.latitude,o.CesiumMath.EPSILON10)&&o.CesiumMath.equalsEpsilon(e.longitude,t.longitude,o.CesiumMath.EPSILON10)}const l=new i.Cartographic,h=new i.Cartographic;const c=new Array(2),g=new Array(2),u={positions:void 0,height:void 0,granularity:void 0,ellipsoid:void 0};a.computePositions=function(e,a,p,f,d,y){const m=function(e,o,r,a){const c=(o=t.arrayRemoveDuplicates(o,i.Cartesian3.equalsEpsilon)).length;if(c<2)return;const g=n.defined(a),u=n.defined(r),p=new Array(c),f=new Array(c),d=new Array(c),y=o[0];p[0]=y;const m=e.cartesianToCartographic(y,l);u&&(m.height=r[0]),f[0]=m.height,d[0]=g?a[0]:0;let P=f[0]===d[0],A=1;for(let t=1;t<c;++t){const n=o[t],l=e.cartesianToCartographic(n,h);u&&(l.height=r[t]),P=P&&0===l.height,s(m,l)?m.height<l.height&&(f[A-1]=l.height):(p[A]=n,f[A]=l.height,d[A]=g?a[t]:0,P=P&&f[A]===d[A],i.Cartographic.clone(l,m),++A)}return P||A<2?void 0:(p.length=A,f.length=A,d.length=A,{positions:p,topHeights:f,bottomHeights:d})}(e,a,p,f);if(!n.defined(m))return;a=m.positions,p=m.topHeights,f=m.bottomHeights;const P=a.length,A=P-2;let C,w;const b=o.CesiumMath.chordLength(d,e.maximumRadius),v=u;if(v.minDistance=b,v.ellipsoid=e,y){let e,t=0;for(e=0;e<P-1;e++)t+=r.PolylinePipeline.numberOfPoints(a[e],a[e+1],b)+1;C=new Float64Array(3*t),w=new Float64Array(3*t);const i=c,n=g;v.positions=i,v.height=n;let o=0;for(e=0;e<P-1;e++){i[0]=a[e],i[1]=a[e+1],n[0]=p[e],n[1]=p[e+1];const t=r.PolylinePipeline.generateArc(v);C.set(t,o),n[0]=f[e],n[1]=f[e+1],w.set(r.PolylinePipeline.generateArc(v),o),o+=t.length}}else v.positions=a,v.height=p,C=new Float64Array(r.PolylinePipeline.generateArc(v)),v.height=f,w=new Float64Array(r.PolylinePipeline.generateArc(v));return{bottomPositions:w,topPositions:C,numCorners:A}},e.WallGeometryLibrary=a}));
