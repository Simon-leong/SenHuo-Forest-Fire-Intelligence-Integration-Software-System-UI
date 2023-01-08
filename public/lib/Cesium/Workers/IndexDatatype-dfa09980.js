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

define(["exports","./defaultValue-028a8a27","./RuntimeError-a977b8e0","./ComponentDatatype-438cad2a","./WebGLConstants-0ff1ce58"],function(I,i,n,E,a){"use strict";const e={UNSIGNED_BYTE:a.WebGLConstants.UNSIGNED_BYTE,UNSIGNED_SHORT:a.WebGLConstants.UNSIGNED_SHORT,UNSIGNED_INT:a.WebGLConstants.UNSIGNED_INT};e.getSizeInBytes=function(r){switch(r){case e.UNSIGNED_BYTE:return Uint8Array.BYTES_PER_ELEMENT;case e.UNSIGNED_SHORT:return Uint16Array.BYTES_PER_ELEMENT;case e.UNSIGNED_INT:return Uint32Array.BYTES_PER_ELEMENT}throw new n.DeveloperError("indexDatatype is required and must be a valid IndexDatatype constant.")},e.fromSizeInBytes=function(r){switch(r){case 2:return e.UNSIGNED_SHORT;case 4:return e.UNSIGNED_INT;case 1:return e.UNSIGNED_BYTE;default:throw new n.DeveloperError("Size in bytes cannot be mapped to an IndexDatatype")}},e.validate=function(r){return i.defined(r)&&(r===e.UNSIGNED_BYTE||r===e.UNSIGNED_SHORT||r===e.UNSIGNED_INT)},e.createTypedArray=function(r,t){if(!i.defined(r))throw new n.DeveloperError("numberOfVertices is required.");return r>=E.CesiumMath.SIXTY_FOUR_KILOBYTES?new Uint32Array(t):new Uint16Array(t)},e.createTypedArrayFromArrayBuffer=function(r,t,N,o){if(!i.defined(r))throw new n.DeveloperError("numberOfVertices is required.");if(!i.defined(t))throw new n.DeveloperError("sourceArray is required.");if(!i.defined(N))throw new n.DeveloperError("byteOffset is required.");return r>=E.CesiumMath.SIXTY_FOUR_KILOBYTES?new Uint32Array(t,N,o):new Uint16Array(t,N,o)},e.fromTypedArray=function(r){if(r instanceof Uint8Array)return e.UNSIGNED_BYTE;if(r instanceof Uint16Array)return e.UNSIGNED_SHORT;if(r instanceof Uint32Array)return e.UNSIGNED_INT;throw new n.DeveloperError("array must be a Uint8Array, Uint16Array, or Uint32Array.")};var S=Object.freeze(e);I.IndexDatatype=S});
