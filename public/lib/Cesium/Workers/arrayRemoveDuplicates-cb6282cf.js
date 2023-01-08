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
define(["exports","./RuntimeError-ed67c927","./defaultValue-ff4e651f","./ComponentDatatype-cb7120fd"],(function(e,n,t,d){"use strict";const f=d.CesiumMath.EPSILON10;e.arrayRemoveDuplicates=function(e,n,d,i){if(!t.defined(e))return;d=t.defaultValue(d,!1);const u=t.defined(i),r=e.length;if(r<2)return e;let s,l,c,a=e[0],o=0,p=-1;for(s=1;s<r;++s)l=e[s],n(a,l,f)?(t.defined(c)||(c=e.slice(0,s),o=s-1,p=0),u&&i.push(s)):(t.defined(c)&&(c.push(l),o=s,u&&(p=i.length)),a=l);return d&&n(e[0],e[r-1],f)&&(u&&(t.defined(c)?i.splice(p,0,o):i.push(r-1)),t.defined(c)?c.length-=1:c=e.slice(0,-1)),t.defined(c)?c:e}}));
