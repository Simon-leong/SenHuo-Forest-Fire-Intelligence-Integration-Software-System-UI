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

define(["exports","./ComponentDatatype-438cad2a"],function(w,G){"use strict";const m={};m.computePositions=function(I,p,b,n,c){const a=I*.5,f=-a,s=n+n,L=c?2*s:s,t=new Float64Array(L*3);let r,e=0,o=0;const i=c?s*3:0,y=c?(s+n)*3:n*3;for(r=0;r<n;r++){const d=r/n*G.CesiumMath.TWO_PI,u=Math.cos(d),x=Math.sin(d),C=u*b,h=x*b,M=u*p,O=x*p;t[o+i]=C,t[o+i+1]=h,t[o+i+2]=f,t[o+y]=M,t[o+y+1]=O,t[o+y+2]=a,o+=3,c&&(t[e++]=C,t[e++]=h,t[e++]=f,t[e++]=M,t[e++]=O,t[e++]=a)}return t},w.CylinderGeometryLibrary=m});
