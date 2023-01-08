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

define(["exports","./defaultValue-028a8a27"],function(a,i){"use strict";function o(t){this.name="DeveloperError",this.message=t;let e;try{throw new Error}catch(n){e=n.stack}this.stack=e}i.defined(Object.create)&&(o.prototype=Object.create(Error.prototype),o.prototype.constructor=o),o.prototype.toString=function(){let t=`${this.name}: ${this.message}`;return i.defined(this.stack)&&(t+=`
${this.stack.toString()}`),t},o.throwInstantiationError=function(){throw new o("This function defines an interface and should not be called directly.")};const r={};r.typeOf={};function p(t){return`${t} is required, actual value was undefined`}function f(t,e,n){return`Expected ${n} to be typeof ${e}, actual typeof was ${t}`}r.defined=function(t,e){if(!i.defined(e))throw new o(p(t))},r.typeOf.func=function(t,e){if(typeof e!="function")throw new o(f(typeof e,"function",t))},r.typeOf.string=function(t,e){if(typeof e!="string")throw new o(f(typeof e,"string",t))},r.typeOf.number=function(t,e){if(typeof e!="number")throw new o(f(typeof e,"number",t))},r.typeOf.number.lessThan=function(t,e,n){if(r.typeOf.number(t,e),e>=n)throw new o(`Expected ${t} to be less than ${n}, actual value was ${e}`)},r.typeOf.number.lessThanOrEquals=function(t,e,n){if(r.typeOf.number(t,e),e>n)throw new o(`Expected ${t} to be less than or equal to ${n}, actual value was ${e}`)},r.typeOf.number.greaterThan=function(t,e,n){if(r.typeOf.number(t,e),e<=n)throw new o(`Expected ${t} to be greater than ${n}, actual value was ${e}`)},r.typeOf.number.greaterThanOrEquals=function(t,e,n){if(r.typeOf.number(t,e),e<n)throw new o(`Expected ${t} to be greater than or equal to ${n}, actual value was ${e}`)},r.typeOf.object=function(t,e){if(typeof e!="object")throw new o(f(typeof e,"object",t))},r.typeOf.bool=function(t,e){if(typeof e!="boolean")throw new o(f(typeof e,"boolean",t))},r.typeOf.bigint=function(t,e){if(typeof e!="bigint")throw new o(f(typeof e,"bigint",t))},r.typeOf.number.equals=function(t,e,n,u){if(r.typeOf.number(t,n),r.typeOf.number(e,u),n!==u)throw new o(`${t} must be equal to ${e}, the actual values are ${n} and ${u}`)};function c(t){this.name="RuntimeError",this.message=t;let e;try{throw new Error}catch(n){e=n.stack}this.stack=e}i.defined(Object.create)&&(c.prototype=Object.create(Error.prototype),c.prototype.constructor=c),c.prototype.toString=function(){let t=`${this.name}: ${this.message}`;return i.defined(this.stack)&&(t+=`
${this.stack.toString()}`),t},a.Check=r,a.DeveloperError=o,a.RuntimeError=c});
