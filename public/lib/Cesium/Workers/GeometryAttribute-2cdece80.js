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

define(["exports","./Matrix2-4706dd70","./RuntimeError-a977b8e0","./defaultValue-028a8a27","./WebGLConstants-0ff1ce58","./Transforms-66eda18c"],function(T,e,u,s,I,S){"use strict";var d=Object.freeze({NONE:0,TRIANGLES:1,LINES:2,POLYLINES:3});const n={POINTS:I.WebGLConstants.POINTS,LINES:I.WebGLConstants.LINES,LINE_LOOP:I.WebGLConstants.LINE_LOOP,LINE_STRIP:I.WebGLConstants.LINE_STRIP,TRIANGLES:I.WebGLConstants.TRIANGLES,TRIANGLE_STRIP:I.WebGLConstants.TRIANGLE_STRIP,TRIANGLE_FAN:I.WebGLConstants.TRIANGLE_FAN};n.isLines=function(t){return t===n.LINES||t===n.LINE_LOOP||t===n.LINE_STRIP},n.isTriangles=function(t){return t===n.TRIANGLES||t===n.TRIANGLE_STRIP||t===n.TRIANGLE_FAN},n.validate=function(t){return t===n.POINTS||t===n.LINES||t===n.LINE_LOOP||t===n.LINE_STRIP||t===n.TRIANGLES||t===n.TRIANGLE_STRIP||t===n.TRIANGLE_FAN};var l=Object.freeze(n);function A(t){t=s.defaultValue(t,s.defaultValue.EMPTY_OBJECT),u.Check.typeOf.object("options.attributes",t.attributes),this.attributes=t.attributes,this.indices=t.indices,this.primitiveType=s.defaultValue(t.primitiveType,l.TRIANGLES),this.boundingSphere=t.boundingSphere,this.geometryType=s.defaultValue(t.geometryType,d.NONE),this.boundingSphereCV=t.boundingSphereCV,this.offsetAttribute=t.offsetAttribute}A.computeNumberOfVertices=function(t){u.Check.typeOf.object("geometry",t);let N=-1;for(const i in t.attributes)if(t.attributes.hasOwnProperty(i)&&s.defined(t.attributes[i])&&s.defined(t.attributes[i].values)){const a=t.attributes[i],r=a.values.length/a.componentsPerAttribute;if(N!==r&&N!==-1)throw new u.DeveloperError("All attribute lists must have the same number of attributes.");N=r}return N};const G=new e.Cartographic,O=new e.Cartesian3,w=new e.Matrix4,_=[new e.Cartographic,new e.Cartographic,new e.Cartographic],g=[new e.Cartesian2,new e.Cartesian2,new e.Cartesian2],R=[new e.Cartesian2,new e.Cartesian2,new e.Cartesian2],D=new e.Cartesian3,F=new S.Quaternion,v=new e.Matrix4,Y=new e.Matrix2;A._textureCoordinateRotationPoints=function(t,N,i,a){let r;const x=e.Rectangle.center(a,G),B=e.Cartographic.toCartesian(x,i,O),k=S.Transforms.eastNorthUpToFixedFrame(B,i,w),p=e.Matrix4.inverse(k,w),b=g,h=_;h[0].longitude=a.west,h[0].latitude=a.south,h[1].longitude=a.west,h[1].latitude=a.north,h[2].longitude=a.east,h[2].latitude=a.south;let o=D;for(r=0;r<3;r++)e.Cartographic.toCartesian(h[r],i,o),o=e.Matrix4.multiplyByPointAsVector(p,o,o),b[r].x=o.x,b[r].y=o.y;const j=S.Quaternion.fromAxisAngle(e.Cartesian3.UNIT_Z,-N,F),z=e.Matrix3.fromQuaternion(j,v),X=t.length;let m=Number.POSITIVE_INFINITY,P=Number.POSITIVE_INFINITY,L=Number.NEGATIVE_INFINITY,y=Number.NEGATIVE_INFINITY;for(r=0;r<X;r++)o=e.Matrix4.multiplyByPointAsVector(p,t[r],o),o=e.Matrix3.multiplyByVector(z,o,o),m=Math.min(m,o.x),P=Math.min(P,o.y),L=Math.max(L,o.x),y=Math.max(y,o.y);const q=e.Matrix2.fromRotation(N,Y),c=R;c[0].x=m,c[0].y=P,c[1].x=m,c[1].y=y,c[2].x=L,c[2].y=P;const f=b[0],Q=b[2].x-f.x,W=b[1].y-f.y;for(r=0;r<3;r++){const E=c[r];e.Matrix2.multiplyByVector(q,E,E),E.x=(E.x-f.x)/Q,E.y=(E.y-f.y)/W}const J=c[0],U=c[1],$=c[2],C=new Array(6);return e.Cartesian2.pack(J,C),e.Cartesian2.pack(U,C,2),e.Cartesian2.pack($,C,4),C};function V(t){if(t=s.defaultValue(t,s.defaultValue.EMPTY_OBJECT),!s.defined(t.componentDatatype))throw new u.DeveloperError("options.componentDatatype is required.");if(!s.defined(t.componentsPerAttribute))throw new u.DeveloperError("options.componentsPerAttribute is required.");if(t.componentsPerAttribute<1||t.componentsPerAttribute>4)throw new u.DeveloperError("options.componentsPerAttribute must be between 1 and 4.");if(!s.defined(t.values))throw new u.DeveloperError("options.values is required.");this.componentDatatype=t.componentDatatype,this.componentsPerAttribute=t.componentsPerAttribute,this.normalize=s.defaultValue(t.normalize,!1),this.values=t.values}T.Geometry=A,T.GeometryAttribute=V,T.GeometryType=d,T.PrimitiveType=l});
