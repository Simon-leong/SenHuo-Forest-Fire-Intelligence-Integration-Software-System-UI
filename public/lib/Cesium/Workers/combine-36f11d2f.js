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
define(["exports","./defaultValue-ff4e651f"],(function(e,t){"use strict";e.combine=function e(f,n,o){o=t.defaultValue(o,!1);const r={},i=t.defined(f),a=t.defined(n);let s,u,c;if(i)for(s in f)f.hasOwnProperty(s)&&(u=f[s],a&&o&&"object"==typeof u&&n.hasOwnProperty(s)?(c=n[s],r[s]="object"==typeof c?e(u,c,o):u):r[s]=u);if(a)for(s in n)n.hasOwnProperty(s)&&!r.hasOwnProperty(s)&&(c=n[s],r[s]=c);return r}}));
