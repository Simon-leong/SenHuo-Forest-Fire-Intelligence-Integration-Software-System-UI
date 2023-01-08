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

define(["exports","./RuntimeError-a977b8e0","./defaultValue-028a8a27","./ComponentDatatype-438cad2a"],function(l,m,n,D){"use strict";const C=D.CesiumMath.EPSILON10;function R(e,r,o,f){if(m.Check.defined("equalsEpsilon",r),!n.defined(e))return;o=n.defaultValue(o,!1);const s=n.defined(f),c=e.length;if(c<2)return e;let t,g=e[0],d,i,h=0,p=-1;for(t=1;t<c;++t)d=e[t],r(g,d,C)?(n.defined(i)||(i=e.slice(0,t),h=t-1,p=0),s&&f.push(t)):(n.defined(i)&&(i.push(d),h=t,s&&(p=f.length)),g=d);return o&&r(e[0],e[c-1],C)&&(s&&(n.defined(i)?f.splice(p,0,h):f.push(c-1)),n.defined(i)?i.length-=1:i=e.slice(0,-1)),n.defined(i)?i:e}l.arrayRemoveDuplicates=R});
