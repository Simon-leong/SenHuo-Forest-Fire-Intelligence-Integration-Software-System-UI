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

define(["exports","./Matrix2-4706dd70","./defaultValue-028a8a27","./RuntimeError-a977b8e0","./Transforms-66eda18c","./ComponentDatatype-438cad2a"],function(x,o,O,z,Z,_){"use strict";const N=Math.cos,k=Math.sin,m=Math.sqrt,L={};L.computePosition=function(n,G,u,h,I,C,c){const i=G.radiiSquared,g=n.nwCorner,e=n.boundingRectangle;let t=g.latitude-n.granYCos*h+I*n.granXSin;const Y=N(t),f=k(t),R=i.z*f;let a=g.longitude+h*n.granYSin+I*n.granXCos;const d=Y*N(a),X=Y*k(a),w=i.x*d,P=i.y*X,M=m(w*d+P*X+R*f);if(C.x=w/M,C.y=P/M,C.z=R/M,u){const s=n.stNwCorner;O.defined(s)?(t=s.latitude-n.stGranYCos*h+I*n.stGranXSin,a=s.longitude+h*n.stGranYSin+I*n.stGranXCos,c.x=(a-n.stWest)*n.lonScalar,c.y=(t-n.stSouth)*n.latScalar):(c.x=(a-e.west)*n.lonScalar,c.y=(t-e.south)*n.latScalar)}};const B=new o.Matrix2;let r=new o.Cartesian3;const A=new o.Cartographic;let E=new o.Cartesian3;const q=new Z.GeographicProjection;function v(n,G,u,h,I,C,c){const i=Math.cos(G),g=h*i,e=u*i,t=Math.sin(G),Y=h*t,f=u*t;r=q.project(n,r),r=o.Cartesian3.subtract(r,E,r);const R=o.Matrix2.fromRotation(G,B);r=o.Matrix2.multiplyByVector(R,r,r),r=o.Cartesian3.add(r,E,r),n=q.unproject(r,n),C-=1,c-=1;const a=n.latitude,d=a+C*f,X=a-g*c,w=a-g*c+C*f,P=Math.max(a,d,X,w),M=Math.min(a,d,X,w),s=n.longitude,V=s+C*e,b=s+c*Y,j=s+c*Y+C*e,y=Math.max(s,V,b,j),W=Math.min(s,V,b,j);return{north:P,south:M,east:y,west:W,granYCos:g,granYSin:Y,granXCos:e,granXSin:f,nwCorner:n}}L.computeOptions=function(n,G,u,h,I,C,c){let i=n.east,g=n.west,e=n.north,t=n.south,Y=!1,f=!1;e===_.CesiumMath.PI_OVER_TWO&&(Y=!0),t===-_.CesiumMath.PI_OVER_TWO&&(f=!0);let R;const a=e-t;g>i?R=_.CesiumMath.TWO_PI-g+i:R=i-g;const d=Math.ceil(R/G)+1,X=Math.ceil(a/G)+1,w=R/(d-1),P=a/(X-1),M=o.Rectangle.northwest(n,C),s=o.Rectangle.center(n,A);(u!==0||h!==0)&&(s.longitude<M.longitude&&(s.longitude+=_.CesiumMath.TWO_PI),E=q.project(s,E));const V=P,b=w,j=0,y=0,W=o.Rectangle.clone(n,I),l={granYCos:V,granYSin:j,granXCos:b,granXSin:y,nwCorner:M,boundingRectangle:W,width:d,height:X,northCap:Y,southCap:f};if(u!==0){const S=v(M,u,w,P,s,d,X);if(e=S.north,t=S.south,i=S.east,g=S.west,e<-_.CesiumMath.PI_OVER_TWO||e>_.CesiumMath.PI_OVER_TWO||t<-_.CesiumMath.PI_OVER_TWO||t>_.CesiumMath.PI_OVER_TWO)throw new z.DeveloperError("Rotated rectangle is invalid.  It crosses over either the north or south pole.");l.granYCos=S.granYCos,l.granYSin=S.granYSin,l.granXCos=S.granXCos,l.granXSin=S.granXSin,W.north=e,W.south=t,W.east=i,W.west=g}if(h!==0){u=u-h;const S=o.Rectangle.northwest(W,c),T=v(S,u,w,P,s,d,X);l.stGranYCos=T.granYCos,l.stGranXCos=T.granXCos,l.stGranYSin=T.granYSin,l.stGranXSin=T.granXSin,l.stNwCorner=S,l.stWest=T.west,l.stSouth=T.south}return l},x.RectangleGeometryLibrary=L});
