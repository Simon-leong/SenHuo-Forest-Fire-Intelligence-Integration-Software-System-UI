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

define(["exports","./defaultValue-028a8a27"],function(u,s){"use strict";function a(r,n,o){o=s.defaultValue(o,!1);const f={},y=s.defined(r),l=s.defined(n);let e,i,t;if(y)for(e in r)r.hasOwnProperty(e)&&(i=r[e],l&&o&&typeof i=="object"&&n.hasOwnProperty(e)?(t=n[e],typeof t=="object"?f[e]=a(i,t,o):f[e]=i):f[e]=i);if(l)for(e in n)n.hasOwnProperty(e)&&!f.hasOwnProperty(e)&&(t=n[e],f[e]=t);return f}u.combine=a});
