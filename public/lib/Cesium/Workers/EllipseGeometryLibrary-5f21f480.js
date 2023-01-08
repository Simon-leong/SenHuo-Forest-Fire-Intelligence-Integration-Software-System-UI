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

define(["exports","./Matrix2-4706dd70","./ComponentDatatype-438cad2a","./Transforms-66eda18c"],function(k,t,S,j){"use strict";const N={},B=new t.Cartesian3,G=new t.Cartesian3,H=new j.Quaternion,p=new t.Matrix3;function E(u,O,_,T,A,I,R,m,d,r){const o=u+O;t.Cartesian3.multiplyByScalar(T,Math.cos(o),B),t.Cartesian3.multiplyByScalar(_,Math.sin(o),G),t.Cartesian3.add(B,G,B);let h=Math.cos(u);h=h*h;let l=Math.sin(u);l=l*l;const C=I/Math.sqrt(R*h+A*l)/m;return j.Quaternion.fromAxisAngle(B,C,H),t.Matrix3.fromQuaternion(H,p),t.Matrix3.multiplyByVector(p,d,r),t.Cartesian3.normalize(r,r),t.Cartesian3.multiplyByScalar(r,m,r),r}const x=new t.Cartesian3,U=new t.Cartesian3,Q=new t.Cartesian3,v=new t.Cartesian3;N.raisePositionsToHeight=function(u,O,_){const T=O.ellipsoid,A=O.height,I=O.extrudedHeight,R=_?u.length/3*2:u.length/3,m=new Float64Array(R*3),d=u.length,r=_?d:0;for(let o=0;o<d;o+=3){const h=o+1,l=o+2,a=t.Cartesian3.fromArray(u,o,x);T.scaleToGeodeticSurface(a,a);const C=t.Cartesian3.clone(a,U),y=T.geodeticSurfaceNormal(a,v),w=t.Cartesian3.multiplyByScalar(y,A,Q);t.Cartesian3.add(a,w,a),_&&(t.Cartesian3.multiplyByScalar(y,I,w),t.Cartesian3.add(C,w,C),m[o+r]=C.x,m[h+r]=C.y,m[l+r]=C.z),m[o]=a.x,m[h]=a.y,m[l]=a.z}return m};const J=new t.Cartesian3,K=new t.Cartesian3,X=new t.Cartesian3;N.computeEllipsePositions=function(u,O,_){const T=u.semiMinorAxis,A=u.semiMajorAxis,I=u.rotation,R=u.center,m=u.granularity*8,d=T*T,r=A*A,o=A*T,h=t.Cartesian3.magnitude(R),l=t.Cartesian3.normalize(R,J);let a=t.Cartesian3.cross(t.Cartesian3.UNIT_Z,R,K);a=t.Cartesian3.normalize(a,a);const C=t.Cartesian3.cross(l,a,X);let y=1+Math.ceil(S.CesiumMath.PI_OVER_TWO/m);const w=S.CesiumMath.PI_OVER_TWO/(y-1);let f=S.CesiumMath.PI_OVER_TWO-y*w;f<0&&(y-=Math.ceil(Math.abs(f)/w));const Y=2*(y*(y+2)),n=O?new Array(Y*3):void 0;let s=0,e=x,c=U;const Z=y*4*3;let z=Z-1,W=0;const i=_?new Array(Z):void 0;let P,V,b,q,g;for(f=S.CesiumMath.PI_OVER_TWO,e=E(f,I,C,a,d,o,r,h,l,e),O&&(n[s++]=e.x,n[s++]=e.y,n[s++]=e.z),_&&(i[z--]=e.z,i[z--]=e.y,i[z--]=e.x),f=S.CesiumMath.PI_OVER_TWO-w,P=1;P<y+1;++P){if(e=E(f,I,C,a,d,o,r,h,l,e),c=E(Math.PI-f,I,C,a,d,o,r,h,l,c),O){for(n[s++]=e.x,n[s++]=e.y,n[s++]=e.z,b=2*P+2,V=1;V<b-1;++V)q=V/(b-1),g=t.Cartesian3.lerp(e,c,q,Q),n[s++]=g.x,n[s++]=g.y,n[s++]=g.z;n[s++]=c.x,n[s++]=c.y,n[s++]=c.z}_&&(i[z--]=e.z,i[z--]=e.y,i[z--]=e.x,i[W++]=c.x,i[W++]=c.y,i[W++]=c.z),f=S.CesiumMath.PI_OVER_TWO-(P+1)*w}for(P=y;P>1;--P){if(f=S.CesiumMath.PI_OVER_TWO-(P-1)*w,e=E(-f,I,C,a,d,o,r,h,l,e),c=E(f+Math.PI,I,C,a,d,o,r,h,l,c),O){for(n[s++]=e.x,n[s++]=e.y,n[s++]=e.z,b=2*(P-1)+2,V=1;V<b-1;++V)q=V/(b-1),g=t.Cartesian3.lerp(e,c,q,Q),n[s++]=g.x,n[s++]=g.y,n[s++]=g.z;n[s++]=c.x,n[s++]=c.y,n[s++]=c.z}_&&(i[z--]=e.z,i[z--]=e.y,i[z--]=e.x,i[W++]=c.x,i[W++]=c.y,i[W++]=c.z)}f=S.CesiumMath.PI_OVER_TWO,e=E(-f,I,C,a,d,o,r,h,l,e);const L={};return O&&(n[s++]=e.x,n[s++]=e.y,n[s++]=e.z,L.positions=n,L.numPts=y),_&&(i[z--]=e.z,i[z--]=e.y,i[z--]=e.x,L.outerPositions=i),L},k.EllipseGeometryLibrary=N});
