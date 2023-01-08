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

define(["exports","./Matrix2-4706dd70","./RuntimeError-a977b8e0","./defaultValue-028a8a27","./ComponentDatatype-438cad2a"],function(E,f,q,T,F){"use strict";function N(n){const a=n._uSquared,t=n._ellipsoid.maximumRadius,e=n._ellipsoid.minimumRadius,_=(t-e)/t,l=Math.cos(n._startHeading),p=Math.sin(n._startHeading),h=(1-_)*Math.tan(n._start.latitude),C=1/Math.sqrt(1+h*h),y=C*h,M=Math.atan2(h,l),m=C*p,U=m*m,i=1-U,A=Math.sqrt(i),c=a/4,o=c*c,u=o*c,S=o*o,d=1+c-3*o/4+5*u/4-175*S/64,w=1-c+15*o/8-35*u/8,r=1-3*c+35*o/4,g=1-5*c,k=d*M-w*Math.sin(2*M)*c/2-r*Math.sin(4*M)*o/16-g*Math.sin(6*M)*u/48-Math.sin(8*M)*5*S/512,s=n._constants;s.a=t,s.b=e,s.f=_,s.cosineHeading=l,s.sineHeading=p,s.tanU=h,s.cosineU=C,s.sineU=y,s.sigma=M,s.sineAlpha=m,s.sineSquaredAlpha=U,s.cosineSquaredAlpha=i,s.cosineAlpha=A,s.u2Over4=c,s.u4Over16=o,s.u6Over64=u,s.u8Over256=S,s.a0=d,s.a1=w,s.a2=r,s.a3=g,s.distanceRatio=k}function J(n,a){return n*a*(4+n*(4-3*a))/16}function z(n,a,t,e,_,l,p){const h=J(n,t);return(1-h)*n*a*(e+h*_*(p+h*l*(2*p*p-1)))}function K(n,a,t,e,_,l,p){const h=(a-t)/a,C=l-e,y=Math.atan((1-h)*Math.tan(_)),M=Math.atan((1-h)*Math.tan(p)),m=Math.cos(y),U=Math.sin(y),i=Math.cos(M),A=Math.sin(M),c=m*i,o=m*A,u=U*A,S=U*i;let d=C,w=F.CesiumMath.TWO_PI,r=Math.cos(d),g=Math.sin(d),k,s,O,H,b;do{r=Math.cos(d),g=Math.sin(d);const W=o-S*r;O=Math.sqrt(i*i*g*g+W*W),s=u+c*r,k=Math.atan2(O,s);let D;O===0?(D=0,H=1):(D=c*g/O,H=1-D*D),w=d,b=s-2*u/H,isFinite(b)||(b=0),d=C+z(h,D,H,k,O,s,b)}while(Math.abs(d-w)>F.CesiumMath.EPSILON12);const v=H*(a*a-t*t)/(t*t),X=1+v*(4096+v*(v*(320-175*v)-768))/16384,L=v*(256+v*(v*(74-47*v)-128))/1024,R=b*b,Y=L*O*(b+L*(s*(2*R-1)-L*b*(4*O*O-3)*(4*R-3)/6)/4),Z=t*X*(k-Y),$=Math.atan2(i*g,o-S*r),V=Math.atan2(m*g,o*r-S);n._distance=Z,n._startHeading=$,n._endHeading=V,n._uSquared=v}const Q=new f.Cartesian3,I=new f.Cartesian3;function B(n,a,t,e){const _=f.Cartesian3.normalize(e.cartographicToCartesian(a,I),Q),l=f.Cartesian3.normalize(e.cartographicToCartesian(t,I),I);q.Check.typeOf.number.greaterThanOrEquals("value",Math.abs(Math.abs(f.Cartesian3.angleBetween(_,l))-Math.PI),.0125),K(n,e.maximumRadius,e.minimumRadius,a.longitude,a.latitude,t.longitude,t.latitude),n._start=f.Cartographic.clone(a,n._start),n._end=f.Cartographic.clone(t,n._end),n._start.height=0,n._end.height=0,N(n)}function P(n,a,t){const e=T.defaultValue(t,f.Ellipsoid.WGS84);this._ellipsoid=e,this._start=new f.Cartographic,this._end=new f.Cartographic,this._constants={},this._startHeading=void 0,this._endHeading=void 0,this._distance=void 0,this._uSquared=void 0,T.defined(n)&&T.defined(a)&&B(this,n,a,e)}Object.defineProperties(P.prototype,{ellipsoid:{get:function(){return this._ellipsoid}},surfaceDistance:{get:function(){return q.Check.defined("distance",this._distance),this._distance}},start:{get:function(){return this._start}},end:{get:function(){return this._end}},startHeading:{get:function(){return q.Check.defined("distance",this._distance),this._startHeading}},endHeading:{get:function(){return q.Check.defined("distance",this._distance),this._endHeading}}}),P.prototype.setEndPoints=function(n,a){q.Check.defined("start",n),q.Check.defined("end",a),B(this,n,a,this._ellipsoid)},P.prototype.interpolateUsingFraction=function(n,a){return this.interpolateUsingSurfaceDistance(this._distance*n,a)},P.prototype.interpolateUsingSurfaceDistance=function(n,a){q.Check.defined("distance",this._distance);const t=this._constants,e=t.distanceRatio+n/t.b,_=Math.cos(2*e),l=Math.cos(4*e),p=Math.cos(6*e),h=Math.sin(2*e),C=Math.sin(4*e),y=Math.sin(6*e),M=Math.sin(8*e),m=e*e,U=e*m,i=t.u8Over256,A=t.u2Over4,c=t.u6Over64,o=t.u4Over16;let u=2*U*i*_/3+e*(1-A+7*o/4-15*c/4+579*i/64-(o-15*c/4+187*i/16)*_-(5*c/4-115*i/16)*l-29*i*p/16)+(A/2-o+71*c/32-85*i/16)*h+(5*o/16-5*c/4+383*i/96)*C-m*((c-11*i/2)*h+5*i*C/2)+(29*c/96-29*i/16)*y+539*i*M/1536;const S=Math.asin(Math.sin(u)*t.cosineAlpha),d=Math.atan(t.a/t.b*Math.tan(S));u=u-t.sigma;const w=Math.cos(2*t.sigma+u),r=Math.sin(u),g=Math.cos(u),k=t.cosineU*g,s=t.sineU*r,H=Math.atan2(r*t.sineHeading,k-s*t.cosineHeading)-z(t.f,t.sineAlpha,t.cosineSquaredAlpha,u,r,g,w);return T.defined(a)?(a.longitude=this._start.longitude+H,a.latitude=d,a.height=0,a):new f.Cartographic(this._start.longitude+H,d,0)},E.EllipsoidGeodesic=P});
