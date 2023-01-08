var olcs_unused_var;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/olcs/AbstractSynchronizer.js":
/*!******************************************!*\
  !*** ./src/olcs/AbstractSynchronizer.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var ol_Observable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ol/Observable.js */ "ol/Observable.js");
/* harmony import */ var ol_Observable_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ol_Observable_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ol_layer_Group_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ol/layer/Group.js */ "ol/layer/Group.js");
/* harmony import */ var ol_layer_Group_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ol_layer_Group_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util.js */ "./src/olcs/util.js");
/**
 * @module olcs.AbstractSynchronizer
 */





class AbstractSynchronizer {
  /**
   * @param {!ol.Map} map
   * @param {!Cesium.Scene} scene
   * @template T
   * @abstract
   * @api
   */
  constructor(map, scene) {
    /**
     * @type {!ol.Map}
     * @protected
     */
    this.map = map;

    /**
     * @type {ol.View}
     * @protected
     */
    this.view = map.getView();

    /**
     * @type {!Cesium.Scene}
     * @protected
     */
    this.scene = scene;

    /**
     * @type {ol.Collection.<ol.layer.Base>}
     * @protected
     */
    this.olLayers = map.getLayerGroup().getLayers();

    /**
     * @type {ol.layer.Group}
     */
    this.mapLayerGroup = map.getLayerGroup();

    /**
     * Map of OpenLayers layer ids (from getUid) to the Cesium ImageryLayers.
     * Null value means, that we are unable to create equivalent layers.
     * @type {Object.<string, ?Array.<T>>}
     * @protected
     */
    this.layerMap = {};

    /**
     * Map of listen keys for OpenLayers layer layers ids (from getUid).
     * @type {!Object.<string, Array<ol.EventsKey>>}
     * @protected
     */
    this.olLayerListenKeys = {};

    /**
     * Map of listen keys for OpenLayers layer groups ids (from getUid).
     * @type {!Object.<string, !Array.<ol.EventsKey>>}
     * @private
     */
    this.olGroupListenKeys_ = {};
  }

  /**
   * Destroy all and perform complete synchronization of the layers.
   * @api
   */
  synchronize() {
    this.destroyAll();
    this.addLayers_(this.mapLayerGroup);
  }

  /**
   * Order counterparts using the same algorithm as the Openlayers renderer:
   * z-index then original sequence order.
   * @protected
   */
  orderLayers() {
    // Ordering logics is handled in subclasses.
  }

  /**
   * Add a layer hierarchy.
   * @param {ol.layer.Base} root
   * @private
   */
  addLayers_(root) {
    /** @type {Array<import('olsc/core.js').LayerWithParents>} */
    const fifo = [{
      layer: root,
      parents: []
    }];
    while (fifo.length > 0) {
      const olLayerWithParents = fifo.splice(0, 1)[0];
      const olLayer = olLayerWithParents.layer;
      const olLayerId = (0,_util_js__WEBPACK_IMPORTED_MODULE_2__.getUid)(olLayer).toString();
      this.olLayerListenKeys[olLayerId] = [];
      console.assert(!this.layerMap[olLayerId]);

      let cesiumObjects = null;
      if (olLayer instanceof (ol_layer_Group_js__WEBPACK_IMPORTED_MODULE_1___default())) {
        this.listenForGroupChanges_(olLayer);
        if (olLayer !== this.mapLayerGroup) {
          cesiumObjects = this.createSingleLayerCounterparts(olLayerWithParents);
        }
        if (!cesiumObjects) {
          olLayer.getLayers().forEach((l) => {
            if (l) {
              const newOlLayerWithParents = {
                layer: l,
                parents: olLayer === this.mapLayerGroup ?
                  [] :
                  [olLayerWithParents.layer].concat(olLayerWithParents.parents)
              };
              fifo.push(newOlLayerWithParents);
            }
          });
        }
      } else {
        cesiumObjects = this.createSingleLayerCounterparts(olLayerWithParents);
        if (!cesiumObjects) {
          // keep an eye on the layers that once failed to be added (might work when the layer is updated)
          // for example when a source is set after the layer is added to the map
          const layerId = olLayerId;
          const layerWithParents = olLayerWithParents;
          const onLayerChange = (e) => {
            const cesiumObjs = this.createSingleLayerCounterparts(layerWithParents);
            if (cesiumObjs) {
              // unsubscribe event listener
              layerWithParents.layer.un('change', onLayerChange);
              this.addCesiumObjects_(cesiumObjs, layerId, layerWithParents.layer);
              this.orderLayers();
            }
          };
          this.olLayerListenKeys[olLayerId].push((0,_util_js__WEBPACK_IMPORTED_MODULE_2__.olcsListen)(layerWithParents.layer, 'change', onLayerChange));
        }
      }
      // add Cesium layers
      if (cesiumObjects) {
        this.addCesiumObjects_(cesiumObjects, olLayerId, olLayer);
      }
    }

    this.orderLayers();
  }

  /**
   * Add Cesium objects.
   * @param {Array.<T>} cesiumObjects
   * @param {string} layerId
   * @param {ol.layer.Base} layer
   * @private
   */
  addCesiumObjects_(cesiumObjects, layerId, layer) {
    this.layerMap[layerId] = cesiumObjects;
    this.olLayerListenKeys[layerId].push((0,_util_js__WEBPACK_IMPORTED_MODULE_2__.olcsListen)(layer, 'change:zIndex', () => this.orderLayers()));
    cesiumObjects.forEach((cesiumObject) => {
      this.addCesiumObject(cesiumObject);
    });
  }

  /**
   * Remove and destroy a single layer.
   * @param {ol.layer.Layer} layer
   * @return {boolean} counterpart destroyed
   * @private
   */
  removeAndDestroySingleLayer_(layer) {
    const uid = (0,_util_js__WEBPACK_IMPORTED_MODULE_2__.getUid)(layer).toString();
    const counterparts = this.layerMap[uid];
    if (!!counterparts) {
      counterparts.forEach((counterpart) => {
        this.removeSingleCesiumObject(counterpart, false);
        this.destroyCesiumObject(counterpart);
      });
      this.olLayerListenKeys[uid].forEach(ol_Observable_js__WEBPACK_IMPORTED_MODULE_0__.unByKey);
      delete this.olLayerListenKeys[uid];
    }
    delete this.layerMap[uid];
    return !!counterparts;
  }

  /**
   * Unlisten a single layer group.
   * @param {ol.layer.Group} group
   * @private
   */
  unlistenSingleGroup_(group) {
    if (group === this.mapLayerGroup) {
      return;
    }
    const uid = (0,_util_js__WEBPACK_IMPORTED_MODULE_2__.getUid)(group).toString();
    const keys = this.olGroupListenKeys_[uid];
    keys.forEach((key) => {
      (0,ol_Observable_js__WEBPACK_IMPORTED_MODULE_0__.unByKey)(key);
    });
    delete this.olGroupListenKeys_[uid];
    delete this.layerMap[uid];
  }

  /**
   * Remove layer hierarchy.
   * @param {ol.layer.Base} root
   * @private
   */
  removeLayer_(root) {
    if (!!root) {
      const fifo = [root];
      while (fifo.length > 0) {
        const olLayer = fifo.splice(0, 1)[0];
        const done = this.removeAndDestroySingleLayer_(olLayer);
        if (olLayer instanceof (ol_layer_Group_js__WEBPACK_IMPORTED_MODULE_1___default())) {
          this.unlistenSingleGroup_(olLayer);
          if (!done) {
            // No counterpart for the group itself so removing
            // each of the child layers.
            olLayer.getLayers().forEach((l) => {
              fifo.push(l);
            });
          }
        }
      }
    }
  }

  /**
   * Register listeners for single layer group change.
   * @param {ol.layer.Group} group
   * @private
   */
  listenForGroupChanges_(group) {
    const uuid = (0,_util_js__WEBPACK_IMPORTED_MODULE_2__.getUid)(group).toString();

    console.assert(this.olGroupListenKeys_[uuid] === undefined);

    const listenKeyArray = [];
    this.olGroupListenKeys_[uuid] = listenKeyArray;

    // only the keys that need to be relistened when collection changes
    let contentKeys = [];
    const listenAddRemove = (function() {
      const collection = group.getLayers();
      if (collection) {
        contentKeys = [
          collection.on('add', (event) => {
            this.addLayers_(event.element);
          }),
          collection.on('remove', (event) => {
            this.removeLayer_(event.element);
          })
        ];
        listenKeyArray.push(...contentKeys);
      }
    }).bind(this);

    listenAddRemove();

    listenKeyArray.push(group.on('change:layers', (e) => {
      contentKeys.forEach((el) => {
        const i = listenKeyArray.indexOf(el);
        if (i >= 0) {
          listenKeyArray.splice(i, 1);
        }
        (0,ol_Observable_js__WEBPACK_IMPORTED_MODULE_0__.unByKey)(el);
      });
      listenAddRemove();
    }));
  }

  /**
   * Destroys all the created Cesium objects.
   * @protected
   */
  destroyAll() {
    this.removeAllCesiumObjects(true); // destroy
    let objKey;
    for (objKey in this.olGroupListenKeys_) {
      const keys = this.olGroupListenKeys_[objKey];
      keys.forEach(ol_Observable_js__WEBPACK_IMPORTED_MODULE_0__.unByKey);
    }
    for (objKey in this.olLayerListenKeys) {
      this.olLayerListenKeys[objKey].forEach(ol_Observable_js__WEBPACK_IMPORTED_MODULE_0__.unByKey);
    }
    this.olGroupListenKeys_ = {};
    this.olLayerListenKeys = {};
    this.layerMap = {};
  }

  /**
   * Adds a single Cesium object to the collection.
   * @param {!T} object
   * @abstract
   * @protected
   */
  addCesiumObject(object) {}

  /**
   * @param {!T} object
   * @abstract
   * @protected
   */
  destroyCesiumObject(object) {}

  /**
   * Remove single Cesium object from the collection.
   * @param {!T} object
   * @param {boolean} destroy
   * @abstract
   * @protected
   */
  removeSingleCesiumObject(object, destroy) {}

  /**
   * Remove all Cesium objects from the collection.
   * @param {boolean} destroy
   * @abstract
   * @protected
   */
  removeAllCesiumObjects(destroy) {}

  /**
   * @param {import('olsc/core.js').LayerWithParents} olLayerWithParents
   * @return {?Array.<T>}
   * @abstract
   * @protected
   */
  createSingleLayerCounterparts(olLayerWithParents) {}
}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AbstractSynchronizer);


/***/ }),

/***/ "./src/olcs/AutoRenderLoop.js":
/*!************************************!*\
  !*** ./src/olcs/AutoRenderLoop.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * @module olcs.AutoRenderLoop
 */

class AutoRenderLoop {
  /**
   * @constructor
   * @param {olcs.OLCesium} ol3d
   */
  constructor(ol3d) {
    this.ol3d = ol3d;
    this.scene_ = ol3d.getCesiumScene();
    this.canvas_ = this.scene_.canvas;
    this._boundNotifyRepaintRequired = this.notifyRepaintRequired.bind(this);

    this.repaintEventNames_ = [
      'mousemove', 'mousedown', 'mouseup',
      'touchstart', 'touchend', 'touchmove',
      'pointerdown', 'pointerup', 'pointermove',
      'wheel'
    ];

    this.enable();
  }

  /**
   * Enable.
   */
  enable() {
    this.scene_.requestRenderMode = true;
    this.scene_.maximumRenderTimeChange = 1000;
    for (const repaintKey of this.repaintEventNames_) {
      this.canvas_.addEventListener(repaintKey, this._boundNotifyRepaintRequired, false);
    }

    window.addEventListener('resize', this._boundNotifyRepaintRequired, false);

    // Listen for changes on the layer group
    this.ol3d.getOlMap().getLayerGroup().on('change', this._boundNotifyRepaintRequired);
  }

  /**
   * Disable.
   */
  disable() {
    for (const repaintKey of this.repaintEventNames_) {
      this.canvas_.removeEventListener(repaintKey, this._boundNotifyRepaintRequired, false);
    }

    window.removeEventListener('resize', this._boundNotifyRepaintRequired, false);

    this.ol3d.getOlMap().getLayerGroup().un('change', this._boundNotifyRepaintRequired);
    this.scene_.requestRenderMode = false;
  }

  /**
   * Restart render loop.
   * Force a restart of the render loop.
   * @api
   */
  restartRenderLoop() {
    this.notifyRepaintRequired();
  }

  notifyRepaintRequired() {
    this.scene_.requestRender();
  }
}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AutoRenderLoop);


/***/ }),

/***/ "./src/olcs/Camera.js":
/*!****************************!*\
  !*** ./src/olcs/Camera.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var ol_Observable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ol/Observable.js */ "ol/Observable.js");
/* harmony import */ var ol_Observable_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ol_Observable_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./math.js */ "./src/olcs/math.js");
/* harmony import */ var ol_proj_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ol/proj.js */ "ol/proj.js");
/* harmony import */ var ol_proj_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ol_proj_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core.js */ "./src/olcs/core.js");
/**
 * @module olcs.Camera
 */






class Camera {
  /**
   * This object takes care of additional 3d-specific properties of the view and
   * ensures proper synchronization with the underlying raw Cesium.Camera object.
   * @param {!Cesium.Scene} scene
   * @param {!ol.Map} map
   * @api
   */
  constructor(scene, map) {
    /**
     * @type {!Cesium.Scene}
     * @private
     */
    this.scene_ = scene;

    /**
     * @type {!Cesium.Camera}
     * @private
     */
    this.cam_ = scene.camera;

    /**
     * @type {!ol.Map}
     * @private
     */
    this.map_ = map;

    /**
     * @type {?ol.View}
     * @private
     */
    this.view_ = null;

    /**
     * @type {?ol.EventsKey}
     * @private
     */
    this.viewListenKey_ = null;

    /**
     * @type {!ol.TransformFunction}
     * @private
     */
    this.toLonLat_ = Camera.identityProjection;

    /**
     * @type {!ol.TransformFunction}
     * @private
     */
    this.fromLonLat_ = Camera.identityProjection;

    /**
     * 0 -- topdown, PI/2 -- the horizon
     * @type {number}
     * @private
     */
    this.tilt_ = 0;

    /**
     * @type {number}
     * @private
     */
    this.distance_ = 0;

    /**
     * @type {?Cesium.Matrix4}
     * @private
     */
    this.lastCameraViewMatrix_ = null;

    /**
     * This is used to discard change events on view caused by updateView method.
     * @type {boolean}
     * @private
     */
    this.viewUpdateInProgress_ = false;

    this.map_.on('change:view', (e) => {
      this.setView_(this.map_.getView());
    });
    this.setView_(this.map_.getView());
  }

  /**
   * @param {Array.<number>} input Input coordinate array.
   * @param {Array.<number>=} opt_output Output array of coordinate values.
   * @param {number=} opt_dimension Dimension.
   * @return {Array.<number>} Input coordinate array (same array as input).
   */
  static identityProjection(input, opt_output, opt_dimension) {
    const dim = opt_dimension || input.length;
    if (opt_output) {
      for (let i = 0; i < dim; ++i) {
        opt_output[i] = input[i];
      }
    }
    return input;
  }

  /**
   * @param {?ol.View} view New view to use.
   * @private
   */
  setView_(view) {
    if (this.view_) {
      (0,ol_Observable_js__WEBPACK_IMPORTED_MODULE_0__.unByKey)(this.viewListenKey_);
      this.viewListenKey_ = null;
    }

    this.view_ = view;
    if (view) {
      const toLonLat = (0,ol_proj_js__WEBPACK_IMPORTED_MODULE_2__.getTransform)(view.getProjection(), 'EPSG:4326');
      const fromLonLat = (0,ol_proj_js__WEBPACK_IMPORTED_MODULE_2__.getTransform)('EPSG:4326', view.getProjection());
      console.assert(toLonLat && fromLonLat);

      this.toLonLat_ = toLonLat;
      this.fromLonLat_ = fromLonLat;

      this.viewListenKey_ = view.on('propertychange', e => this.handleViewEvent_(e));

      this.readFromView();
    } else {
      this.toLonLat_ = Camera.identityProjection;
      this.fromLonLat_ = Camera.identityProjection;
    }
  }

  /**
   * @param {?} e
   * @private
   */
  handleViewEvent_(e) {
    if (!this.viewUpdateInProgress_) {
      this.readFromView();
    }
  }

  /**
   * @param {number} heading In radians.
   * @api
   */
  setHeading(heading) {
    if (!this.view_) {
      return;
    }

    this.view_.setRotation(heading);
  }

  /**
   * @return {number|undefined} Heading in radians.
   * @api
   */
  getHeading() {
    if (!this.view_) {
      return undefined;
    }
    const rotation = this.view_.getRotation();
    return rotation || 0;
  }

  /**
   * @param {number} tilt In radians.
   * @api
   */
  setTilt(tilt) {
    this.tilt_ = tilt;
    this.updateCamera_();
  }

  /**
   * @return {number} Tilt in radians.
   * @api
   */
  getTilt() {
    return this.tilt_;
  }

  /**
   * @param {number} distance In meters.
   * @api
   */
  setDistance(distance) {
    this.distance_ = distance;
    this.updateCamera_();
    this.updateView();
  }

  /**
   * @return {number} Distance in meters.
   * @api
   */
  getDistance() {
    return this.distance_;
  }

  /**
   * Shortcut for ol.View.setCenter().
   * @param {!ol.Coordinate} center Same projection as the ol.View.
   * @api
   */
  setCenter(center) {
    if (!this.view_) {
      return;
    }
    this.view_.setCenter(center);
  }

  /**
   * Shortcut for ol.View.getCenter().
   * @return {ol.Coordinate|undefined} Same projection as the ol.View.
   * @api
   */
  getCenter() {
    if (!this.view_) {
      return undefined;
    }
    return this.view_.getCenter();
  }

  /**
   * Sets the position of the camera.
   * @param {!ol.Coordinate} position Same projection as the ol.View.
   * @api
   */
  setPosition(position) {
    if (!this.toLonLat_) {
      return;
    }
    const ll = this.toLonLat_(position);
    console.assert(ll);

    const carto = new Cesium.Cartographic(
        (0,_math_js__WEBPACK_IMPORTED_MODULE_1__.toRadians)(ll[0]),
        (0,_math_js__WEBPACK_IMPORTED_MODULE_1__.toRadians)(ll[1]),
        this.getAltitude());

    this.cam_.setView({
      destination: Cesium.Ellipsoid.WGS84.cartographicToCartesian(carto)
    });
    this.updateView();
  }

  /**
   * Calculates position under the camera.
   * @return {!ol.Coordinate|undefined} Same projection as the ol.View.
   * @api
   */
  getPosition() {
    if (!this.fromLonLat_) {
      return undefined;
    }
    const carto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(this.cam_.position);

    const pos = this.fromLonLat_([
      (0,_math_js__WEBPACK_IMPORTED_MODULE_1__.toDegrees)(carto.longitude),
      (0,_math_js__WEBPACK_IMPORTED_MODULE_1__.toDegrees)(carto.latitude)
    ]);
    console.assert(pos);
    return pos;
  }

  /**
   * @param {number} altitude In meters.
   * @api
   */
  setAltitude(altitude) {
    const carto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
        this.cam_.position);
    carto.height = altitude;
    this.cam_.position = Cesium.Ellipsoid.WGS84.cartographicToCartesian(carto);

    this.updateView();
  }

  /**
   * @return {number} Altitude in meters.
   * @api
   */
  getAltitude() {
    const carto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
        this.cam_.position);

    return carto.height;
  }

  /**
   * Updates the state of the underlying Cesium.Camera
   * according to the current values of the properties.
   * @private
   */
  updateCamera_() {
    if (!this.view_ || !this.toLonLat_) {
      return;
    }
    const center = this.view_.getCenter();
    if (!center) {
      return;
    }
    const ll = this.toLonLat_(center);
    console.assert(ll);

    const carto = new Cesium.Cartographic((0,_math_js__WEBPACK_IMPORTED_MODULE_1__.toRadians)(ll[0]),
        (0,_math_js__WEBPACK_IMPORTED_MODULE_1__.toRadians)(ll[1]));
    if (this.scene_.globe) {
      const height = this.scene_.globe.getHeight(carto);
      carto.height = height || 0;
    }

    const destination = Cesium.Ellipsoid.WGS84.cartographicToCartesian(carto);

    /** @type {Cesium.optionsOrientation} */
    const orientation = {
      pitch: this.tilt_ - Cesium.Math.PI_OVER_TWO,
      heading: -this.view_.getRotation(),
      roll: undefined
    };
    this.cam_.setView({
      destination,
      orientation
    });

    this.cam_.moveBackward(this.distance_);

    this.checkCameraChange(true);
  }

  /**
   * Calculates the values of the properties from the current ol.View state.
   * @api
   */
  readFromView() {
    if (!this.view_ || !this.toLonLat_) {
      return;
    }
    const center = this.view_.getCenter();
    if (center === undefined || center === null) {
      return;
    }
    const ll = this.toLonLat_(center);
    console.assert(ll);

    const resolution = this.view_.getResolution();
    this.distance_ = this.calcDistanceForResolution(
        resolution || 0, (0,_math_js__WEBPACK_IMPORTED_MODULE_1__.toRadians)(ll[1]));

    this.updateCamera_();
  }

  /**
   * Calculates the values of the properties from the current Cesium.Camera state.
   * Modifies the center, resolution and rotation properties of the view.
   * @api
   */
  updateView() {
    if (!this.view_ || !this.fromLonLat_) {
      return;
    }
    this.viewUpdateInProgress_ = true;

    // target & distance
    const ellipsoid = Cesium.Ellipsoid.WGS84;
    const scene = this.scene_;
    const target = _core_js__WEBPACK_IMPORTED_MODULE_3__["default"].pickCenterPoint(scene);

    let bestTarget = target;
    if (!bestTarget) {
      //TODO: how to handle this properly ?
      const globe = scene.globe;
      const carto = this.cam_.positionCartographic.clone();
      const height = globe.getHeight(carto);
      carto.height = height || 0;
      bestTarget = Cesium.Ellipsoid.WGS84.cartographicToCartesian(carto);
    }
    this.distance_ = Cesium.Cartesian3.distance(bestTarget, this.cam_.position);
    const bestTargetCartographic = ellipsoid.cartesianToCartographic(bestTarget);
    this.view_.setCenter(this.fromLonLat_([
      (0,_math_js__WEBPACK_IMPORTED_MODULE_1__.toDegrees)(bestTargetCartographic.longitude),
      (0,_math_js__WEBPACK_IMPORTED_MODULE_1__.toDegrees)(bestTargetCartographic.latitude)]));

    // resolution
    this.view_.setResolution(
        this.calcResolutionForDistance(this.distance_,
            bestTargetCartographic ? bestTargetCartographic.latitude : 0));


    /*
     * Since we are positioning the target, the values of heading and tilt
     * need to be calculated _at the target_.
     */
    if (target) {
      const pos = this.cam_.position;

      // normal to the ellipsoid at the target
      const targetNormal = new Cesium.Cartesian3();
      ellipsoid.geocentricSurfaceNormal(target, targetNormal);

      // vector from the target to the camera
      const targetToCamera = new Cesium.Cartesian3();
      Cesium.Cartesian3.subtract(pos, target, targetToCamera);
      Cesium.Cartesian3.normalize(targetToCamera, targetToCamera);


      // HEADING
      const up = this.cam_.up;
      const right = this.cam_.right;
      const normal = new Cesium.Cartesian3(-target.y, target.x, 0); // what is it?
      const heading = Cesium.Cartesian3.angleBetween(right, normal);
      const cross = Cesium.Cartesian3.cross(target, up, new Cesium.Cartesian3());
      const orientation = cross.z;

      this.view_.setRotation((orientation < 0 ? heading : -heading));

      // TILT
      const tiltAngle = Math.acos(
          Cesium.Cartesian3.dot(targetNormal, targetToCamera));
      this.tilt_ = isNaN(tiltAngle) ? 0 : tiltAngle;
    } else {
      // fallback when there is no target
      this.view_.setRotation(this.cam_.heading);
      this.tilt_ = -this.cam_.pitch + Math.PI / 2;
    }

    this.viewUpdateInProgress_ = false;
  }

  /**
   * Check if the underlying camera state has changed and ensure synchronization.
   * @param {boolean=} opt_dontSync Do not synchronize the view.
   */
  checkCameraChange(opt_dontSync) {
    const old = this.lastCameraViewMatrix_;
    const current = this.cam_.viewMatrix;

    if (!old || !Cesium.Matrix4.equalsEpsilon(old, current, 1e-5)) {
      this.lastCameraViewMatrix_ = current.clone();
      if (opt_dontSync !== true) {
        this.updateView();
      }
    }
  }

  /**
   * calculate the distance between camera and centerpoint based on the resolution and latitude value
   * @param {number} resolution Number of map units per pixel.
   * @param {number} latitude Latitude in radians.
   * @return {number} The calculated distance.
   * @api
   */
  calcDistanceForResolution(resolution, latitude) {
    return (0,_core_js__WEBPACK_IMPORTED_MODULE_3__.calcDistanceForResolution)(resolution, latitude, this.scene_, this.view_.getProjection());
  }

  /**
   * calculate the resolution based on a distance(camera to position) and latitude value
   * @param {number} distance
   * @param {number} latitude
   * @return {number} The calculated resolution.
   * @api
   */
  calcResolutionForDistance(distance, latitude) {
    return (0,_core_js__WEBPACK_IMPORTED_MODULE_3__.calcResolutionForDistance)(distance, latitude, this.scene_, this.view_.getProjection());
  }
}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Camera);


/***/ }),

/***/ "./src/olcs/FeatureConverter.js":
/*!**************************************!*\
  !*** ./src/olcs/FeatureConverter.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var ol_geom_Geometry_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ol/geom/Geometry.js */ "ol/geom/Geometry.js");
/* harmony import */ var ol_geom_Geometry_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ol_geom_Geometry_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ol_style_Icon_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ol/style/Icon.js */ "ol/style/Icon.js");
/* harmony import */ var ol_style_Icon_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ol_style_Icon_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ol_source_Vector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ol/source/Vector.js */ "ol/source/Vector.js");
/* harmony import */ var ol_source_Vector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ol_source_Vector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var ol_source_Cluster_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ol/source/Cluster.js */ "ol/source/Cluster.js");
/* harmony import */ var ol_source_Cluster_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ol_source_Cluster_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var ol_geom_Polygon_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ol/geom/Polygon.js */ "ol/geom/Polygon.js");
/* harmony import */ var ol_geom_Polygon_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ol_geom_Polygon_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var ol_extent_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ol/extent.js */ "ol/extent");
/* harmony import */ var ol_extent_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(ol_extent_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var ol_geom_SimpleGeometry_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ol/geom/SimpleGeometry.js */ "ol/geom/SimpleGeometry.js");
/* harmony import */ var ol_geom_SimpleGeometry_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(ol_geom_SimpleGeometry_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _core_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./core.js */ "./src/olcs/core.js");
/* harmony import */ var _core_VectorLayerCounterpart_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./core/VectorLayerCounterpart.js */ "./src/olcs/core/VectorLayerCounterpart.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./util.js */ "./src/olcs/util.js");
/**
 * @module olcs.FeatureConverter
 */












/**
 * @typedef {Object} ModelStyle
 * @property {Cesium.Matrix4} [debugModelMatrix]
 * @property {Cesium.ModelFromGltfOptions} cesiumOptions
 */


class FeatureConverter {
  /**
   * Concrete base class for converting from OpenLayers3 vectors to Cesium
   * primitives.
   * Extending this class is possible provided that the extending class and
   * the library are compiled together by the closure compiler.
   * @param {!Cesium.Scene} scene Cesium scene.
   * @constructor
   * @api
   */
  constructor(scene) {

    /**
     * @protected
     */
    this.scene = scene;

    /**
     * Bind once to have a unique function for using as a listener
     * @type {function(ol.source.Vector.Event)}
     * @private
     */
    this.boundOnRemoveOrClearFeatureListener_ = this.onRemoveOrClearFeature_.bind(this);

    /**
     * @type {Cesium.Cartesian3}
     * @private
     */
    this.defaultBillboardEyeOffset_ = new Cesium.Cartesian3(0, 0, 10);
  }

  /**
   * @param {ol.source.Vector.Event} evt
   * @private
   */
  onRemoveOrClearFeature_(evt) {
    const source = evt.target;
    console.assert(source instanceof (ol_source_Vector_js__WEBPACK_IMPORTED_MODULE_2___default()));

    const cancellers = _util_js__WEBPACK_IMPORTED_MODULE_9__["default"].obj(source)['olcs_cancellers'];
    if (cancellers) {
      const feature = evt.feature;
      if (feature) {
        // remove
        const id = (0,_util_js__WEBPACK_IMPORTED_MODULE_9__.getUid)(feature);
        const canceller = cancellers[id];
        if (canceller) {
          canceller();
          delete cancellers[id];
        }
      } else {
        // clear
        for (const key in cancellers) {
          if (cancellers.hasOwnProperty(key)) {
            cancellers[key]();
          }
        }
        _util_js__WEBPACK_IMPORTED_MODULE_9__["default"].obj(source)['olcs_cancellers'] = {};
      }
    }
  }

  /**
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature.
   * @param {!Cesium.Primitive|Cesium.Label|Cesium.Billboard} primitive
   * @protected
   */
  setReferenceForPicking(layer, feature, primitive) {
    primitive.olLayer = layer;
    primitive.olFeature = feature;
  }

  /**
   * Basics primitive creation using a color attribute.
   * Note that Cesium has 'interior' and outline geometries.
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature.
   * @param {!ol.geom.Geometry} olGeometry OpenLayers geometry.
   * @param {!Cesium.Geometry} geometry
   * @param {!Cesium.Color} color
   * @param {number=} opt_lineWidth
   * @return {Cesium.Primitive}
   * @protected
   */
  createColoredPrimitive(layer, feature, olGeometry, geometry, color, opt_lineWidth) {
    const createInstance = function(geometry, color) {
      const instance = new Cesium.GeometryInstance({
        // always update Cesium externs before adding a property
        geometry
      });
      if (color && !(color instanceof Cesium.ImageMaterialProperty)) {
        instance.attributes = {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(color)
        };
      }
      return instance;
    };

    const options = {
      // always update Cesium externs before adding a property
      flat: true, // work with all geometries
      renderState: {
        depthTest: {
          enabled: true
        }
      }
    };

    if (opt_lineWidth !== undefined) {
      if (!options.renderState) {
        options.renderState = {};
      }
      options.renderState.lineWidth = opt_lineWidth;
    }

    const instances = createInstance(geometry, color);

    const heightReference = this.getHeightReference(layer, feature, olGeometry);

    let primitive;

    if (heightReference === Cesium.HeightReference.CLAMP_TO_GROUND) {
      const ctor = instances.geometry.constructor;
      if (ctor && !ctor['createShadowVolume']) {
        return null;
      }
      primitive = new Cesium.GroundPrimitive({
        geometryInstances: instances
      });
    } else {
      primitive = new Cesium.Primitive({
        geometryInstances: instances
      });
    }

    if (color instanceof Cesium.ImageMaterialProperty) {
      const dataUri = color.image.getValue().toDataURL();

      primitive.appearance = new Cesium.MaterialAppearance({
        flat: true,
        renderState: {
          depthTest: {
            enabled: true
          }
        },
        material: new Cesium.Material({
          fabric: {
            type: 'Image',
            uniforms: {
              image: dataUri
            }
          }
        })
      });
    } else {
      primitive.appearance = new Cesium.PerInstanceColorAppearance(options);
    }

    this.setReferenceForPicking(layer, feature, primitive);
    return primitive;
  }

  /**
   * Return the fill or stroke color from a plain ol style.
   * @param {!ol.style.Style|ol.style.Text} style
   * @param {boolean} outline
   * @return {!Cesium.Color}
   * @protected
   */
  extractColorFromOlStyle(style, outline) {
    const fillColor = style.getFill() ? style.getFill().getColor() : null;
    const strokeColor = style.getStroke() ? style.getStroke().getColor() : null;

    let olColor = 'black';
    if (strokeColor && outline) {
      olColor = strokeColor;
    } else if (fillColor) {
      olColor = fillColor;
    }

    return _core_js__WEBPACK_IMPORTED_MODULE_7__["default"].convertColorToCesium(olColor);
  }

  /**
   * Return the width of stroke from a plain ol style.
   * @param {!ol.style.Style|ol.style.Text} style
   * @return {number}
   * @protected
   */
  extractLineWidthFromOlStyle(style) {
    // Handling of line width WebGL limitations is handled by Cesium.
    const width = style.getStroke() ? style.getStroke().getWidth() : undefined;
    return width !== undefined ? width : 1;
  }

  /**
   * Create a primitive collection out of two Cesium geometries.
   * Only the OpenLayers style colors will be used.
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature.
   * @param {!ol.geom.Geometry} olGeometry OpenLayers geometry.
   * @param {!Cesium.Geometry} fillGeometry
   * @param {!Cesium.Geometry} outlineGeometry
   * @param {!ol.style.Style} olStyle
   * @return {!Cesium.PrimitiveCollection}
   * @protected
   */
  wrapFillAndOutlineGeometries(layer, feature, olGeometry, fillGeometry, outlineGeometry, olStyle) {
    const fillColor = this.extractColorFromOlStyle(olStyle, false);
    const outlineColor = this.extractColorFromOlStyle(olStyle, true);

    const primitives = new Cesium.PrimitiveCollection();
    if (olStyle.getFill()) {
      const p1 = this.createColoredPrimitive(layer, feature, olGeometry,
          fillGeometry, fillColor);
      console.assert(!!p1);
      primitives.add(p1);
    }

    if (olStyle.getStroke() && outlineGeometry) {
      const width = this.extractLineWidthFromOlStyle(olStyle);
      const p2 = this.createColoredPrimitive(layer, feature, olGeometry,
          outlineGeometry, outlineColor, width);
      if (p2) {
        // Some outline geometries are not supported by Cesium in clamp to ground
        // mode. These primitives are skipped.
        primitives.add(p2);
      }
    }

    return primitives;
  }

  // Geometry converters
  /**
   * Create a Cesium primitive if style has a text component.
   * Eventually return a PrimitiveCollection including current primitive.
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature..
   * @param {!ol.geom.Geometry} geometry
   * @param {!ol.style.Style} style
   * @param {!Cesium.Primitive} primitive current primitive
   * @return {!Cesium.PrimitiveCollection}
   * @protected
   */
  addTextStyle(layer, feature, geometry, style, primitive) {
    let primitives;
    if (!(primitive instanceof Cesium.PrimitiveCollection)) {
      primitives = new Cesium.PrimitiveCollection();
      primitives.add(primitive);
    } else {
      primitives = primitive;
    }

    if (!style.getText()) {
      return primitives;
    }

    const text = /** @type {!ol.style.Text} */ (style.getText());
    const label = this.olGeometry4326TextPartToCesium(layer, feature, geometry,
        text);
    if (label) {
      primitives.add(label);
    }
    return primitives;
  }

  /**
   * Add a billboard to a Cesium.BillboardCollection.
   * Overriding this wrapper allows manipulating the billboard options.
   * @param {!Cesium.BillboardCollection} billboards
   * @param {!Cesium.optionsBillboardCollectionAdd} bbOptions
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature.
   * @param {!ol.geom.Geometry} geometry
   * @param {!ol.style.Style} style
   * @return {!Cesium.Billboard} newly created billboard
   * @api
   */
  csAddBillboard(billboards, bbOptions, layer, feature, geometry, style) {
    if (!bbOptions.eyeOffset) {
      bbOptions.eyeOffset = this.defaultBillboardEyeOffset_;
    }
    const bb = billboards.add(bbOptions);
    this.setReferenceForPicking(layer, feature, bb);
    return bb;
  }

  /**
   * Convert an OpenLayers circle geometry to Cesium.
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature..
   * @param {!ol.geom.Circle} olGeometry OpenLayers circle geometry.
   * @param {!ol.ProjectionLike} projection
   * @param {!ol.style.Style} olStyle
   * @return {!Cesium.PrimitiveCollection} primitives
   * @api
   */
  olCircleGeometryToCesium(layer, feature, olGeometry, projection, olStyle) {

    olGeometry = _core_js__WEBPACK_IMPORTED_MODULE_7__["default"].olGeometryCloneTo4326(olGeometry, projection);
    console.assert(olGeometry.getType() == 'Circle');

    // ol.Coordinate
    let center = olGeometry.getCenter();
    const height = center.length == 3 ? center[2] : 0.0;
    let point = center.slice();
    point[0] += olGeometry.getRadius();

    // Cesium
    center = _core_js__WEBPACK_IMPORTED_MODULE_7__["default"].ol4326CoordinateToCesiumCartesian(center);
    point = _core_js__WEBPACK_IMPORTED_MODULE_7__["default"].ol4326CoordinateToCesiumCartesian(point);

    // Accurate computation of straight distance
    const radius = Cesium.Cartesian3.distance(center, point);

    const fillGeometry = new Cesium.CircleGeometry({
      // always update Cesium externs before adding a property
      center,
      radius,
      height
    });

    let outlinePrimitive, outlineGeometry;
    if (this.getHeightReference(layer, feature, olGeometry) === Cesium.HeightReference.CLAMP_TO_GROUND) {
      const width = this.extractLineWidthFromOlStyle(olStyle);
      if (width) {
        const circlePolygon = (0,ol_geom_Polygon_js__WEBPACK_IMPORTED_MODULE_4__.circular)(olGeometry.getCenter(), radius);
        const positions = _core_js__WEBPACK_IMPORTED_MODULE_7__["default"].ol4326CoordinateArrayToCsCartesians(circlePolygon.getLinearRing(0).getCoordinates());
        if (!(0,_util_js__WEBPACK_IMPORTED_MODULE_9__.isGroundPolylinePrimitiveSupported)(this.scene)) {
          const color = this.extractColorFromOlStyle(olStyle, true);
          outlinePrimitive = this.createStackedGroundCorridors(layer, feature, width, color, positions);
        } else {
          outlinePrimitive = new Cesium.GroundPolylinePrimitive({
            geometryInstances: new Cesium.GeometryInstance({
              geometry: new Cesium.GroundPolylineGeometry({positions, width}),
            }),
            appearance: new Cesium.PolylineMaterialAppearance({
              material: this.olStyleToCesium(feature, olStyle, true),
            }),
            classificationType: Cesium.ClassificationType.TERRAIN,
          });
          outlinePrimitive.readyPromise.then(() => {
            this.setReferenceForPicking(layer, feature, outlinePrimitive._primitive);
          });
        }
      }
    } else {
      outlineGeometry = new Cesium.CircleOutlineGeometry({
        // always update Cesium externs before adding a property
        center,
        radius,
        extrudedHeight: height,
        height
      });
    }

    const primitives = this.wrapFillAndOutlineGeometries(
        layer, feature, olGeometry, fillGeometry, outlineGeometry, olStyle);

    if (outlinePrimitive) {
      primitives.add(outlinePrimitive);
    }
    return this.addTextStyle(layer, feature, olGeometry, olStyle, primitives);
  }

  /**
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature..
   * @param {!number} width The width of the line.
   * @param {!Cesium.Color} color The color of the line.
   * @param {!Array<Cesium.Cartesian3>|Array<Array<Cesium.Cartesian3>>} positions The vertices of the line(s).
   * @return {!Cesium.GroundPrimitive} primitive
   */
  createStackedGroundCorridors(layer, feature, width, color, positions) {
    // Convert positions to an Array if it isn't
    if (!Array.isArray(positions[0])) {
      positions = [positions];
    }
    width = Math.max(3, width); // A <3px width is too small for ground primitives
    const geometryInstances = [];
    let previousDistance = 0;
    // A stack of ground lines with increasing width (in meters) are created.
    // Only one of these lines is displayed at any time giving a feeling of continuity.
    // The values for the distance and width factor are more or less arbitrary.
    // Applications can override this logics by subclassing the FeatureConverter class.
    for (const distance of [1000, 4000, 16000, 64000, 254000, 1000000, 10000000]) {
      width *= 2.14;
      const geometryOptions = {
        // always update Cesium externs before adding a property
        width,
        vertexFormat: Cesium.VertexFormat.POSITION_ONLY
      };
      for (const linePositions of positions) {
        geometryOptions.positions = linePositions;
        geometryInstances.push(new Cesium.GeometryInstance({
          geometry: new Cesium.CorridorGeometry(geometryOptions),
          attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(color),
            distanceDisplayCondition: new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(previousDistance, distance - 1)
          }
        }));
      }
      previousDistance = distance;
    }
    return new Cesium.GroundPrimitive({
      // always update Cesium externs before adding a property
      geometryInstances
    });
  }

  /**
   * Convert an OpenLayers line string geometry to Cesium.
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature..
   * @param {!ol.geom.LineString} olGeometry OpenLayers line string geometry.
   * @param {!ol.ProjectionLike} projection
   * @param {!ol.style.Style} olStyle
   * @return {!Cesium.PrimitiveCollection} primitives
   * @api
   */
  olLineStringGeometryToCesium(layer, feature, olGeometry, projection, olStyle) {

    olGeometry = _core_js__WEBPACK_IMPORTED_MODULE_7__["default"].olGeometryCloneTo4326(olGeometry, projection);
    console.assert(olGeometry.getType() == 'LineString');

    const positions = _core_js__WEBPACK_IMPORTED_MODULE_7__["default"].ol4326CoordinateArrayToCsCartesians(olGeometry.getCoordinates());
    const width = this.extractLineWidthFromOlStyle(olStyle);

    let outlinePrimitive;
    const heightReference = this.getHeightReference(layer, feature, olGeometry);

    if (heightReference === Cesium.HeightReference.CLAMP_TO_GROUND && !(0,_util_js__WEBPACK_IMPORTED_MODULE_9__.isGroundPolylinePrimitiveSupported)(this.scene)) {
      const color = this.extractColorFromOlStyle(olStyle, true);
      outlinePrimitive = this.createStackedGroundCorridors(layer, feature, width, color, positions);
    } else {
      const appearance = new Cesium.PolylineMaterialAppearance({
        // always update Cesium externs before adding a property
        material: this.olStyleToCesium(feature, olStyle, true)
      });
      const geometryOptions = {
        // always update Cesium externs before adding a property
        positions,
        width,
      };
      const primitiveOptions = {
        // always update Cesium externs before adding a property
        appearance
      };
      if (heightReference === Cesium.HeightReference.CLAMP_TO_GROUND) {
        const geometry = new Cesium.GroundPolylineGeometry(geometryOptions);
        primitiveOptions.geometryInstances = new Cesium.GeometryInstance({
          geometry
        }),
        outlinePrimitive = new Cesium.GroundPolylinePrimitive(primitiveOptions);
        outlinePrimitive.readyPromise.then(() => {
          this.setReferenceForPicking(layer, feature, outlinePrimitive._primitive);
        });
      } else {
        geometryOptions.vertexFormat = appearance.vertexFormat;
        const geometry = new Cesium.PolylineGeometry(geometryOptions);
        primitiveOptions.geometryInstances = new Cesium.GeometryInstance({
          geometry
        }),
        outlinePrimitive = new Cesium.Primitive(primitiveOptions);
      }
    }

    this.setReferenceForPicking(layer, feature, outlinePrimitive);

    return this.addTextStyle(layer, feature, olGeometry, olStyle, outlinePrimitive);
  }

  /**
   * Convert an OpenLayers polygon geometry to Cesium.
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature..
   * @param {!ol.geom.Polygon} olGeometry OpenLayers polygon geometry.
   * @param {!ol.ProjectionLike} projection
   * @param {!ol.style.Style} olStyle
   * @return {!Cesium.PrimitiveCollection} primitives
   * @api
   */
  olPolygonGeometryToCesium(layer, feature, olGeometry, projection, olStyle) {

    olGeometry = _core_js__WEBPACK_IMPORTED_MODULE_7__["default"].olGeometryCloneTo4326(olGeometry, projection);
    console.assert(olGeometry.getType() == 'Polygon');

    const heightReference = this.getHeightReference(layer, feature, olGeometry);

    let fillGeometry, outlineGeometry, outlinePrimitive;
    if ((olGeometry.getCoordinates()[0].length == 5) &&
        (feature.getGeometry().get('olcs.polygon_kind') === 'rectangle')) {
      // Create a rectangle according to the longitude and latitude curves
      const coordinates = olGeometry.getCoordinates()[0];
      // Extract the West, South, East, North coordinates
      const extent = (0,ol_extent_js__WEBPACK_IMPORTED_MODULE_5__.boundingExtent)(coordinates);
      const rectangle = Cesium.Rectangle.fromDegrees(extent[0], extent[1],
          extent[2], extent[3]);

      // Extract the average height of the vertices
      let maxHeight = 0.0;
      if (coordinates[0].length == 3) {
        for (let c = 0; c < coordinates.length; c++) {
          maxHeight = Math.max(maxHeight, coordinates[c][2]);
        }
      }

      // Render the cartographic rectangle
      fillGeometry = new Cesium.RectangleGeometry({
        ellipsoid: Cesium.Ellipsoid.WGS84,
        rectangle,
        height: maxHeight
      });

      outlineGeometry = new Cesium.RectangleOutlineGeometry({
        ellipsoid: Cesium.Ellipsoid.WGS84,
        rectangle,
        height: maxHeight
      });
    } else {
      const rings = olGeometry.getLinearRings();
      // always update Cesium externs before adding a property
      const hierarchy = {};
      const polygonHierarchy = hierarchy;
      console.assert(rings.length > 0);

      for (let i = 0; i < rings.length; ++i) {
        const olPos = rings[i].getCoordinates();
        const positions = _core_js__WEBPACK_IMPORTED_MODULE_7__["default"].ol4326CoordinateArrayToCsCartesians(olPos);
        console.assert(positions && positions.length > 0);
        if (i == 0) {
          hierarchy.positions = positions;
        } else {
          if (!hierarchy.holes) {
            hierarchy.holes = [];
          }
          hierarchy.holes.push({
            positions
          });
        }
      }

      fillGeometry = new Cesium.PolygonGeometry({
        // always update Cesium externs before adding a property
        polygonHierarchy,
        perPositionHeight: true
      });

      // Since Cesium doesn't yet support Polygon outlines on terrain yet (coming soon...?)
      // we don't create an outline geometry if clamped, but instead do the polyline method
      // for each ring. Most of this code should be removeable when Cesium adds
      // support for Polygon outlines on terrain.
      if (heightReference === Cesium.HeightReference.CLAMP_TO_GROUND) {
        const width = this.extractLineWidthFromOlStyle(olStyle);
        if (width > 0) {
          const positions = [hierarchy.positions];
          if (hierarchy.holes) {
            for (let i = 0; i < hierarchy.holes.length; ++i) {
              positions.push(hierarchy.holes[i].positions);
            }
          }
          if (!(0,_util_js__WEBPACK_IMPORTED_MODULE_9__.isGroundPolylinePrimitiveSupported)(this.scene)) {
            const color = this.extractColorFromOlStyle(olStyle, true);
            outlinePrimitive = this.createStackedGroundCorridors(layer, feature, width, color, positions);
          } else {
            const appearance = new Cesium.PolylineMaterialAppearance({
              // always update Cesium externs before adding a property
              material: this.olStyleToCesium(feature, olStyle, true)
            });
            const geometryInstances = [];
            for (const linePositions of positions) {
              const polylineGeometry = new Cesium.GroundPolylineGeometry({positions: linePositions, width});
              geometryInstances.push(new Cesium.GeometryInstance({
                geometry: polylineGeometry
              }));
            }
            const primitiveOptions = {
              // always update Cesium externs before adding a property
              appearance,
              geometryInstances
            };
            outlinePrimitive = new Cesium.GroundPolylinePrimitive(primitiveOptions);
            outlinePrimitive.readyPromise.then(() => {
              this.setReferenceForPicking(layer, feature, outlinePrimitive._primitive);
            });
          }
        }
      } else {
        // Actually do the normal polygon thing. This should end the removable
        // section of code described above.
        outlineGeometry = new Cesium.PolygonOutlineGeometry({
          // always update Cesium externs before adding a property
          polygonHierarchy: hierarchy,
          perPositionHeight: true
        });
      }
    }

    const primitives = this.wrapFillAndOutlineGeometries(
        layer, feature, olGeometry, fillGeometry, outlineGeometry, olStyle);

    if (outlinePrimitive) {
      primitives.add(outlinePrimitive);
    }

    return this.addTextStyle(layer, feature, olGeometry, olStyle, primitives);
  }

  /**
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {ol.Feature} feature OpenLayers feature..
   * @param {!ol.geom.Geometry} geometry
   * @return {!Cesium.HeightReference}
   * @api
   */
  getHeightReference(layer, feature, geometry) {

    // Read from the geometry
    let altitudeMode = geometry.get('altitudeMode');

    // Or from the feature
    if (altitudeMode === undefined) {
      altitudeMode = feature.get('altitudeMode');
    }

    // Or from the layer
    if (altitudeMode === undefined) {
      altitudeMode = layer.get('altitudeMode');
    }

    let heightReference = Cesium.HeightReference.NONE;
    if (altitudeMode === 'clampToGround') {
      heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;
    } else if (altitudeMode === 'relativeToGround') {
      heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND;
    }

    return heightReference;
  }

  /**
   * Convert a point geometry to a Cesium BillboardCollection.
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature..
   * @param {!ol.geom.Point} olGeometry OpenLayers point geometry.
   * @param {!ol.ProjectionLike} projection
   * @param {!ol.style.Style} style
   * @param {!ol.style.Image} imageStyle
   * @param {!Cesium.BillboardCollection} billboards
   * @param {function(!Cesium.Billboard)=} opt_newBillboardCallback Called when the new billboard is added.
   * @api
   */
  createBillboardFromImage(
      layer,
      feature,
      olGeometry,
      projection,
      style,
      imageStyle,
      billboards,
      opt_newBillboardCallback
  ) {

    if (imageStyle instanceof (ol_style_Icon_js__WEBPACK_IMPORTED_MODULE_1___default())) {
      // make sure the image is scheduled for load
      imageStyle.load();
    }

    const image = imageStyle.getImage(1); // get normal density
    const isImageLoaded = function(image) {
      return image.src != '' &&
          image.naturalHeight != 0 &&
          image.naturalWidth != 0 &&
          image.complete;
    };
    const reallyCreateBillboard = (function() {
      if (!image) {
        return;
      }
      if (!(image instanceof HTMLCanvasElement ||
          image instanceof Image ||
          image instanceof HTMLImageElement)) {
        return;
      }
      const center = olGeometry.getCoordinates();
      const position = _core_js__WEBPACK_IMPORTED_MODULE_7__["default"].ol4326CoordinateToCesiumCartesian(center);
      let color;
      const opacity = imageStyle.getOpacity();
      if (opacity !== undefined) {
        color = new Cesium.Color(1.0, 1.0, 1.0, opacity);
      }

      const scale = imageStyle.getScale();
      const heightReference = this.getHeightReference(layer, feature, olGeometry);

      const bbOptions = /** @type {Cesium.optionsBillboardCollectionAdd} */ ({
        // always update Cesium externs before adding a property
        image,
        color,
        scale,
        heightReference,
        position
      });

      // merge in cesium options from openlayers feature
      Object.assign(bbOptions, feature.get('cesiumOptions'));

      if (imageStyle instanceof (ol_style_Icon_js__WEBPACK_IMPORTED_MODULE_1___default())) {
        const anchor = imageStyle.getAnchor();
        if (anchor) {
          bbOptions.pixelOffset = new Cesium.Cartesian2((image.width / 2 - anchor[0]) * scale, (image.height / 2 - anchor[1]) * scale);
        }
      }

      const bb = this.csAddBillboard(billboards, bbOptions, layer, feature, olGeometry, style);
      if (opt_newBillboardCallback) {
        opt_newBillboardCallback(bb);
      }
    }).bind(this);

    if (image instanceof Image && !isImageLoaded(image)) {
      // Cesium requires the image to be loaded
      let cancelled = false;
      const source = layer.getSource();
      const canceller = function() {
        cancelled = true;
      };
      source.on(['removefeature', 'clear'],
          this.boundOnRemoveOrClearFeatureListener_);
      let cancellers = _util_js__WEBPACK_IMPORTED_MODULE_9__["default"].obj(source)['olcs_cancellers'];
      if (!cancellers) {
        cancellers = _util_js__WEBPACK_IMPORTED_MODULE_9__["default"].obj(source)['olcs_cancellers'] = {};
      }

      const fuid = (0,_util_js__WEBPACK_IMPORTED_MODULE_9__.getUid)(feature);
      if (cancellers[fuid]) {
        // When the feature change quickly, a canceller may still be present so
        // we cancel it here to prevent creation of a billboard.
        cancellers[fuid]();
      }
      cancellers[fuid] = canceller;

      const listener = function() {
        image.removeEventListener('load', listener);
        if (!billboards.isDestroyed() && !cancelled) {
          // Create billboard if the feature is still displayed on the map.
          reallyCreateBillboard();
        }
      };

      image.addEventListener('load', listener);
    } else {
      reallyCreateBillboard();
    }
  }

  /**
   * Convert a point geometry to a Cesium BillboardCollection.
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature..
   * @param {!ol.geom.Point} olGeometry OpenLayers point geometry.
   * @param {!ol.ProjectionLike} projection
   * @param {!ol.style.Style} style
   * @param {!Cesium.BillboardCollection} billboards
   * @param {function(!Cesium.Billboard)=} opt_newBillboardCallback Called when
   * the new billboard is added.
   * @return {Cesium.Primitive} primitives
   * @api
   */
  olPointGeometryToCesium(
      layer,
      feature,
      olGeometry,
      projection,
      style,
      billboards,
      opt_newBillboardCallback
  ) {
    console.assert(olGeometry.getType() == 'Point');
    olGeometry = _core_js__WEBPACK_IMPORTED_MODULE_7__["default"].olGeometryCloneTo4326(olGeometry, projection);

    let modelPrimitive = null;
    const imageStyle = style.getImage();
    if (imageStyle) {
      const olcsModelFunction = /** @type {function():olcsx.ModelStyle} */ (olGeometry.get('olcs_model') || feature.get('olcs_model'));
      if (olcsModelFunction) {
        const olcsModel = olcsModelFunction();
        const options = /** @type {Cesium.ModelFromGltfOptions} */ (Object.assign({}, {scene: this.scene}, olcsModel.cesiumOptions));
        const model = Cesium.Model.fromGltf(options);
        modelPrimitive = new Cesium.PrimitiveCollection();
        modelPrimitive.add(model);
        if (olcsModel.debugModelMatrix) {
          modelPrimitive.add(new Cesium.DebugModelMatrixPrimitive({
            modelMatrix: olcsModel.debugModelMatrix
          }));
        }
      } else {
        this.createBillboardFromImage(layer, feature, olGeometry, projection, style, imageStyle, billboards, opt_newBillboardCallback);
      }
    }

    if (style.getText()) {
      return this.addTextStyle(layer, feature, olGeometry, style, modelPrimitive || new Cesium.Primitive());
    } else {
      return modelPrimitive;
    }
  }

  /**
   * Convert an OpenLayers multi-something geometry to Cesium.
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature..
   * @param {!ol.geom.Geometry} geometry OpenLayers geometry.
   * @param {!ol.ProjectionLike} projection
   * @param {!ol.style.Style} olStyle
   * @param {!Cesium.BillboardCollection} billboards
   * @param {function(!Cesium.Billboard)=} opt_newBillboardCallback Called when
   * the new billboard is added.
   * @return {Cesium.Primitive} primitives
   * @api
   */
  olMultiGeometryToCesium(
      layer,
      feature,
      geometry,
      projection,
      olStyle,
      billboards,
      opt_newBillboardCallback
  ) {
    // Do not reproject to 4326 now because it will be done later.

    // FIXME: would be better to combine all child geometries in one primitive
    // instead we create n primitives for simplicity.
    const accumulate = function(geometries, functor) {
      const primitives = new Cesium.PrimitiveCollection();
      geometries.forEach((geometry) => {
        primitives.add(functor(layer, feature, geometry, projection, olStyle));
      });
      return primitives;
    };

    let subgeos;
    switch (geometry.getType()) {
      case 'MultiPoint':
        geometry = /** @type {!ol.geom.MultiPoint} */ (geometry);
        subgeos = geometry.getPoints();
        if (olStyle.getText()) {
          const primitives = new Cesium.PrimitiveCollection();
          subgeos.forEach((geometry) => {
            console.assert(geometry);
            const result = this.olPointGeometryToCesium(layer, feature, geometry,
                projection, olStyle, billboards, opt_newBillboardCallback);
            if (result) {
              primitives.add(result);
            }
          });
          return primitives;
        } else {
          subgeos.forEach((geometry) => {
            console.assert(geometry);
            this.olPointGeometryToCesium(layer, feature, geometry, projection,
                olStyle, billboards, opt_newBillboardCallback);
          });
          return null;
        }
      case 'MultiLineString':
        geometry = /** @type {!ol.geom.MultiLineString} */ (geometry);
        subgeos = geometry.getLineStrings();
        return accumulate(subgeos, this.olLineStringGeometryToCesium.bind(this));
      case 'MultiPolygon':
        geometry = /** @type {!ol.geom.MultiPolygon} */ (geometry);
        subgeos = geometry.getPolygons();
        return accumulate(subgeos, this.olPolygonGeometryToCesium.bind(this));
      default:
        console.assert(false, `Unhandled multi geometry type${geometry.getType()}`);
    }
  }

  /**
   * Convert an OpenLayers text style to Cesium.
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature..
   * @param {!ol.geom.Geometry} geometry
   * @param {!ol.style.Text} style
   * @return {Cesium.LabelCollection} Cesium primitive
   * @api
   */
  olGeometry4326TextPartToCesium(layer, feature, geometry, style) {
    const text = style.getText();
    if (!text) {
      return null;
    }

    const labels = new Cesium.LabelCollection({scene: this.scene});
    // TODO: export and use the text draw position from OpenLayers .
    // See src/ol/render/vector.js
    const extentCenter = (0,ol_extent_js__WEBPACK_IMPORTED_MODULE_5__.getCenter)(geometry.getExtent());
    if (geometry instanceof (ol_geom_SimpleGeometry_js__WEBPACK_IMPORTED_MODULE_6___default())) {
      const first = geometry.getFirstCoordinate();
      extentCenter[2] = first.length == 3 ? first[2] : 0.0;
    }
    const options = /** @type {Cesium.optionsLabelCollection} */ ({});

    options.position = _core_js__WEBPACK_IMPORTED_MODULE_7__["default"].ol4326CoordinateToCesiumCartesian(extentCenter);

    options.text = text;

    options.heightReference = this.getHeightReference(layer, feature, geometry);

    const offsetX = style.getOffsetX();
    const offsetY = style.getOffsetY();
    if (offsetX != 0 && offsetY != 0) {
      const offset = new Cesium.Cartesian2(offsetX, offsetY);
      options.pixelOffset = offset;
    }

    options.font = style.getFont() || '10px sans-serif'; // OpenLayers default

    let labelStyle = undefined;
    if (style.getFill()) {
      options.fillColor = this.extractColorFromOlStyle(style, false);
      labelStyle = Cesium.LabelStyle.FILL;
    }
    if (style.getStroke()) {
      options.outlineWidth = this.extractLineWidthFromOlStyle(style);
      options.outlineColor = this.extractColorFromOlStyle(style, true);
      labelStyle = Cesium.LabelStyle.OUTLINE;
    }
    if (style.getFill() && style.getStroke()) {
      labelStyle = Cesium.LabelStyle.FILL_AND_OUTLINE;
    }
    options.style = labelStyle;

    let horizontalOrigin;
    switch (style.getTextAlign()) {
      case 'left':
        horizontalOrigin = Cesium.HorizontalOrigin.LEFT;
        break;
      case 'right':
        horizontalOrigin = Cesium.HorizontalOrigin.RIGHT;
        break;
      case 'center':
      default:
        horizontalOrigin = Cesium.HorizontalOrigin.CENTER;
    }
    options.horizontalOrigin = horizontalOrigin;

    if (style.getTextBaseline()) {
      let verticalOrigin;
      switch (style.getTextBaseline()) {
        case 'top':
          verticalOrigin = Cesium.VerticalOrigin.TOP;
          break;
        case 'middle':
          verticalOrigin = Cesium.VerticalOrigin.CENTER;
          break;
        case 'bottom':
          verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
          break;
        case 'alphabetic':
          verticalOrigin = Cesium.VerticalOrigin.TOP;
          break;
        case 'hanging':
          verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
          break;
        default:
          console.assert(false, `unhandled baseline ${style.getTextBaseline()}`);
      }
      options.verticalOrigin = verticalOrigin;
    }


    const l = labels.add(options);
    this.setReferenceForPicking(layer, feature, l);
    return labels;
  }

  /**
   * Convert an OpenLayers style to a Cesium Material.
   * @param {ol.Feature} feature OpenLayers feature..
   * @param {!ol.style.Style} style
   * @param {boolean} outline
   * @return {Cesium.Material}
   * @api
   */
  olStyleToCesium(feature, style, outline) {
    const fill = style.getFill();
    const stroke = style.getStroke();
    if ((outline && !stroke) || (!outline && !fill)) {
      return null; // FIXME use a default style? Developer error?
    }

    let color = outline ? stroke.getColor() : fill.getColor();
    color = _core_js__WEBPACK_IMPORTED_MODULE_7__["default"].convertColorToCesium(color);

    if (outline && stroke.getLineDash()) {
      return Cesium.Material.fromType('Stripe', {
        // always update Cesium externs before adding a property
        horizontal: false,
        repeat: 500, // TODO how to calculate this?
        evenColor: color,
        oddColor: new Cesium.Color(0, 0, 0, 0) // transparent
      });
    } else {
      return Cesium.Material.fromType('Color', {
        // always update Cesium externs before adding a property
        color
      });
    }

  }

  /**
   * Compute OpenLayers plain style.
   * Evaluates style function, blend arrays, get default style.
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature
   * @param {ol.StyleFunction|undefined} fallbackStyleFunction
   * @param {number} resolution
   * @return {Array.<!ol.style.Style>} null if no style is available
   * @api
   */
  computePlainStyle(layer, feature, fallbackStyleFunction, resolution) {
    /**
     * @type {ol.FeatureStyleFunction|undefined}
     */
    const featureStyleFunction = feature.getStyleFunction();

    /**
     * @type {ol.style.Style|Array.<ol.style.Style>}
     */
    let style = null;

    if (featureStyleFunction) {
      style = featureStyleFunction(feature, resolution);
    }

    if (!style && fallbackStyleFunction) {
      style = fallbackStyleFunction(feature, resolution);
    }

    if (!style) {
      // The feature must not be displayed
      return null;
    }

    // FIXME combine materials as in cesium-materials-pack?
    // then this function must return a custom material
    // More simply, could blend the colors like described in
    // http://en.wikipedia.org/wiki/Alpha_compositing
    return Array.isArray(style) ? style : [style];
  }

  /**
   * @protected
   * @param {!ol.Feature} feature
   * @param {!ol.style.Style} style
   * @param {!ol.geom.Geometry=} opt_geom Geometry to be converted.
   * @return {ol.geom.Geometry|undefined}
   */
  getGeometryFromFeature(feature, style, opt_geom) {
    if (opt_geom) {
      return opt_geom;
    }

    const geom3d = /** @type {!ol.geom.Geometry} */(feature.get('olcs.3d_geometry'));
    if (geom3d && geom3d instanceof (ol_geom_Geometry_js__WEBPACK_IMPORTED_MODULE_0___default())) {
      return geom3d;
    }

    if (style) {
      const geomFuncRes = style.getGeometryFunction()(feature);
      if (geomFuncRes instanceof (ol_geom_Geometry_js__WEBPACK_IMPORTED_MODULE_0___default())) {
        return geomFuncRes;
      }
    }

    return feature.getGeometry();
  }

  /**
   * Convert one OpenLayers feature up to a collection of Cesium primitives.
   * @param {ol.layer.Vector|ol.layer.Image} layer
   * @param {!ol.Feature} feature OpenLayers feature.
   * @param {!ol.style.Style} style
   * @param {!import('olcs/core/VectorLayerConterpart.js').OlFeatureToCesiumContext} context
   * @param {!ol.geom.Geometry=} opt_geom Geometry to be converted.
   * @return {Cesium.Primitive} primitives
   * @api
   */
  olFeatureToCesium(layer, feature, style, context, opt_geom) {
    let geom = this.getGeometryFromFeature(feature, style, opt_geom);

    if (!geom) {
      // OpenLayers features may not have a geometry
      // See http://geojson.org/geojson-spec.html#feature-objects
      return null;
    }

    const proj = context.projection;
    const newBillboardAddedCallback = function(bb) {
      const featureBb = context.featureToCesiumMap[(0,_util_js__WEBPACK_IMPORTED_MODULE_9__.getUid)(feature)];
      if (featureBb instanceof Array) {
        featureBb.push(bb);
      }
      else {
        context.featureToCesiumMap[(0,_util_js__WEBPACK_IMPORTED_MODULE_9__.getUid)(feature)] = [bb];
      }
    };

    switch (geom.getType()) {
      case 'GeometryCollection':
        const primitives = new Cesium.PrimitiveCollection();
        const collection = /** @type {!ol.geom.GeometryCollection} */ (geom);
        // TODO: use getGeometriesArray() instead
        collection.getGeometries().forEach((geom) => {
          if (geom) {
            const prims = this.olFeatureToCesium(layer, feature, style, context,
                geom);
            if (prims) {
              primitives.add(prims);
            }
          }
        });
        return primitives;
      case 'Point':
        geom = /** @type {!ol.geom.Point} */ (geom);
        const bbs = context.billboards;
        const result = this.olPointGeometryToCesium(layer, feature, geom, proj,
            style, bbs, newBillboardAddedCallback);
        if (!result) {
          // no wrapping primitive
          return null;
        } else {
          return result;
        }
      case 'Circle':
        geom = /** @type {!ol.geom.Circle} */ (geom);
        return this.olCircleGeometryToCesium(layer, feature, geom, proj,
            style);
      case 'LineString':
        geom = /** @type {!ol.geom.LineString} */ (geom);
        return this.olLineStringGeometryToCesium(layer, feature, geom, proj,
            style);
      case 'Polygon':
        geom = /** @type {!ol.geom.Polygon} */ (geom);
        return this.olPolygonGeometryToCesium(layer, feature, geom, proj,
            style);
      case 'MultiPoint':
      case 'MultiLineString':
      case 'MultiPolygon':
        const result2 = this.olMultiGeometryToCesium(layer, feature, geom, proj,
            style, context.billboards, newBillboardAddedCallback);
        if (!result2) {
          // no wrapping primitive
          return null;
        } else {
          return result2;
        }
      case 'LinearRing':
        throw new Error('LinearRing should only be part of polygon.');
      default:
        throw new Error(`Ol geom type not handled : ${geom.getType()}`);
    }
  }

  /**
   * Convert an OpenLayers vector layer to Cesium primitive collection.
   * For each feature, the associated primitive will be stored in
   * `featurePrimitiveMap`.
   * @param {!(ol.layer.Vector|ol.layer.Image)} olLayer
   * @param {!ol.View} olView
   * @param {!Object.<number, !Cesium.Primitive>} featurePrimitiveMap
   * @return {!olcs.core.VectorLayerCounterpart}
   * @api
   */
  olVectorLayerToCesium(olLayer, olView, featurePrimitiveMap) {
    const proj = olView.getProjection();
    const resolution = olView.getResolution();

    if (resolution === undefined || !proj) {
      console.assert(false, 'View not ready');
      // an assertion is not enough for closure to assume resolution and proj
      // are defined
      throw new Error('View not ready');
    }

    let source = olLayer.getSource();
    if (source instanceof (ol_source_Cluster_js__WEBPACK_IMPORTED_MODULE_3___default())) {
      source = source.getSource();
    }

    console.assert(source instanceof (ol_source_Vector_js__WEBPACK_IMPORTED_MODULE_2___default()));
    const features = source.getFeatures();
    const counterpart = new _core_VectorLayerCounterpart_js__WEBPACK_IMPORTED_MODULE_8__["default"](proj, this.scene);
    const context = counterpart.context;
    for (let i = 0; i < features.length; ++i) {
      const feature = features[i];
      if (!feature) {
        continue;
      }
      /**
       * @type {ol.StyleFunction|undefined}
       */
      const layerStyle = olLayer.getStyleFunction();
      const styles = this.computePlainStyle(olLayer, feature, layerStyle,
          resolution);
      if (!styles || !styles.length) {
        // only 'render' features with a style
        continue;
      }

      /**
       * @type {Cesium.Primitive|null}
       */
      let primitives = null;
      for (let i = 0; i < styles.length; i++) {
        const prims = this.olFeatureToCesium(olLayer, feature, styles[i], context);
        if (prims) {
          if (!primitives) {
            primitives = prims;
          } else if (prims) {
            let i = 0, prim;
            while ((prim = prims.get(i))) {
              primitives.add(prim);
              i++;
            }
          }
        }
      }
      if (!primitives) {
        continue;
      }
      featurePrimitiveMap[(0,_util_js__WEBPACK_IMPORTED_MODULE_9__.getUid)(feature)] = primitives;
      counterpart.getRootPrimitive().add(primitives);
    }

    return counterpart;
  }

  /**
   * Convert an OpenLayers feature to Cesium primitive collection.
   * @param {!(ol.layer.Vector|ol.layer.Image)} layer
   * @param {!ol.View} view
   * @param {!ol.Feature} feature
   * @param {!import('olcs/core/VectorLayerConterpart.js').OlFeatureToCesiumContext} context
   * @return {Cesium.Primitive}
   * @api
   */
  convert(layer, view, feature, context) {
    const proj = view.getProjection();
    const resolution = view.getResolution();

    if (resolution == undefined || !proj) {
      return null;
    }

    /**
     * @type {ol.StyleFunction|undefined}
     */
    const layerStyle = layer.getStyleFunction();

    const styles = this.computePlainStyle(layer, feature, layerStyle, resolution);

    if (!styles || !styles.length) {
      // only 'render' features with a style
      return null;
    }

    context.projection = proj;

    /**
     * @type {Cesium.Primitive|null}
     */
    let primitives = null;
    for (let i = 0; i < styles.length; i++) {
      const prims = this.olFeatureToCesium(layer, feature, styles[i], context);
      if (!primitives) {
        primitives = prims;
      } else if (prims) {
        let i = 0, prim;
        while ((prim = prims.get(i))) {
          primitives.add(prim);
          i++;
        }
      }
    }
    return primitives;
  }
}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FeatureConverter);


/***/ }),

/***/ "./src/olcs/MVTImageryProvider.js":
/*!****************************************!*\
  !*** ./src/olcs/MVTImageryProvider.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MVTImageryProvider)
/* harmony export */ });
/* harmony import */ var ol_format_MVT_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ol/format/MVT.js */ "ol/format/MVT.js");
/* harmony import */ var ol_format_MVT_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ol_format_MVT_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ol_style_Style_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ol/style/Style.js */ "ol/style/Style.js");
/* harmony import */ var ol_style_Style_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ol_style_Style_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ol_style_Stroke_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ol/style/Stroke.js */ "ol/style/Stroke.js");
/* harmony import */ var ol_style_Stroke_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ol_style_Stroke_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var ol_render_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ol/render.js */ "ol/render.js");
/* harmony import */ var ol_render_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ol_render_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var ol_proj_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ol/proj.js */ "ol/proj.js");
/* harmony import */ var ol_proj_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ol_proj_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var ol_util_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ol/util.js */ "ol/util.js");
/* harmony import */ var ol_util_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(ol_util_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var ol_structs_LRUCache_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ol/structs/LRUCache.js */ "ol/structs/LRUCache.js");
/* harmony import */ var ol_structs_LRUCache_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(ol_structs_LRUCache_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var ol_tilegrid_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ol/tilegrid.js */ "ol/tilegrid.js");
/* harmony import */ var ol_tilegrid_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(ol_tilegrid_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var ol_tileurlfunction_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ol/tileurlfunction.js */ "ol/tileurlfunction.js");
/* harmony import */ var ol_tileurlfunction_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(ol_tileurlfunction_js__WEBPACK_IMPORTED_MODULE_8__);











const format = new (ol_format_MVT_js__WEBPACK_IMPORTED_MODULE_0___default())();
const styles = [new (ol_style_Style_js__WEBPACK_IMPORTED_MODULE_1___default())({
  stroke: new (ol_style_Stroke_js__WEBPACK_IMPORTED_MODULE_2___default())({
    color: 'blue',
    width: 2
  })
})];


class MVTImageryProvider {
  constructor(options) {
    this.urls = options.urls;
    this.ready = true;
    this.readyPromise = Promise.resolve(true);
    this.tileWidth = 256;
    this.tileHeight = 256;
    this.maximumLevel = options.maximumLevel || 20;
    this.minimumLevel = options.minimumLevel || 0;
    this.tilingScheme = new Cesium.WebMercatorTilingScheme;
    this.rectangle = options.rectangle || this.tilingScheme.rectangle;
    this.errorEvent = new Cesium.Event();
    this.credit = options.credit;
    this.hasAlphaChannel = true;
    this.styleFunction_ = options.styleFunction || (() => styles);
    this.projection_ = (0,ol_proj_js__WEBPACK_IMPORTED_MODULE_4__.get)('EPSG:3857');
    this.emptyCanvas_ = document.createElement('canvas');
    this.emptyCanvas_.width = 1;
    this.emptyCanvas_.height = 1;
    this.tileRectangle_ = new Cesium.Rectangle();
    const cacheSize = options.cacheSize !== undefined ? options.cacheSize : 50;
    this.tileCache = new (ol_structs_LRUCache_js__WEBPACK_IMPORTED_MODULE_6___default())(cacheSize);
    this.featureCache = options.featureCache || new (ol_structs_LRUCache_js__WEBPACK_IMPORTED_MODULE_6___default())(cacheSize);
    // to avoid too frequent cache grooming we allow x2 capacity

    const tileGrid = (0,ol_tilegrid_js__WEBPACK_IMPORTED_MODULE_7__.getForProjection)(this.projection_);
    this.tileFunction_ = (0,ol_tileurlfunction_js__WEBPACK_IMPORTED_MODULE_8__.createFromTemplates)(this.urls, tileGrid);
  }

  getTileCredits() {
    return [];
  }

  pickFeatures() {
  }


  getTileFeatures(z, x, y) {
    const cacheKey = this.getCacheKey_(z, x, y);
    let promise;
    if (this.featureCache.containsKey(cacheKey)) {
      promise = this.featureCache.get(cacheKey);
    }
    if (!promise) {
      const url = this.getUrl_(z, x, y);
      promise = fetch(url)
          .then(r => (r.ok ? r : Promise.reject(r)))
          .then(r => r.arrayBuffer())
          .then(buffer => this.readFeaturesFromBuffer(buffer));
      this.featureCache.set(cacheKey, promise);
      if (this.featureCache.getCount() > 2 * this.featureCache.highWaterMark) {
        while (this.featureCache.canExpireCache()) {
          this.featureCache.pop();
        }
      }
    }
    return promise;
  }

  readFeaturesFromBuffer(buffer) {
    let options;
    if (ol_util_js__WEBPACK_IMPORTED_MODULE_5__.VERSION <= '6.4.4') {
      // See https://github.com/openlayers/openlayers/pull/11540
      options = {
        extent: [0, 0, 4096, 4096],
        dataProjection: format.dataProjection,
        featureProjection: format.dataProjection
      };
    }
    const features = format.readFeatures(buffer, options);
    const scaleFactor = this.tileWidth / 4096;
    features.forEach((f) => {
      const flatCoordinates = f.getFlatCoordinates();
      let flip = false;
      for (let i = 0; i < flatCoordinates.length; ++i) {
        flatCoordinates[i] *= scaleFactor;
        if (flip) {
          // FIXME: why do we need this now?
          flatCoordinates[i] = this.tileWidth - flatCoordinates[i];
        }
        if (ol_util_js__WEBPACK_IMPORTED_MODULE_5__.VERSION <= '6.4.4') {
          flip = !flip;
        }
      }
    });

    return features;
  }

  getUrl_(z, x, y) {
    const url = this.tileFunction_([z, x, y]);
    return url;
  }

  getCacheKey_(z, x, y) {
    return `${z}_${x}_${y}`;
  }

  requestImage(x, y, z, request) {
    if (z < this.minimumLevel) {
      return this.emptyCanvas_;
    }

    try {
      const cacheKey = this.getCacheKey_(z, x, y);
      let promise;
      if (this.tileCache.containsKey(cacheKey)) {
        promise = this.tileCache.get(cacheKey);
      }
      if (!promise) {
        promise = this.getTileFeatures(z, x, y)
            .then((features) => {
            // FIXME: here we suppose the 2D projection is in meters
              this.tilingScheme.tileXYToNativeRectangle(x, y, z, this.tileRectangle_);
              const resolution = (this.tileRectangle_.east - this.tileRectangle_.west) / this.tileWidth;
              return this.rasterizeFeatures(features, this.styleFunction_, resolution);
            });
        this.tileCache.set(cacheKey, promise);
        if (this.tileCache.getCount() > 2 * this.tileCache.highWaterMark) {
          while (this.tileCache.canExpireCache()) {
            this.tileCache.pop();
          }
        }
      }
      return promise;
    } catch (e) {
      console.trace(e);
      this.raiseEvent('could not render pbf to tile', e);
    }
  }

  rasterizeFeatures(features, styleFunction, resolution) {
    const canvas = document.createElement('canvas');
    const vectorContext = (0,ol_render_js__WEBPACK_IMPORTED_MODULE_3__.toContext)(canvas.getContext('2d'), {size: [this.tileWidth, this.tileHeight]});
    features.forEach((f) => {
      const styles = styleFunction(f, resolution);
      if (styles) {
        styles.forEach((style) => {
          vectorContext.setStyle(style);
          vectorContext.drawGeometry(f);
        });
      }
    });
    return canvas;
  }
}


/***/ }),

/***/ "./src/olcs/OLCesium.js":
/*!******************************!*\
  !*** ./src/olcs/OLCesium.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var ol_geom_Point_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ol/geom/Point.js */ "ol/geom/Point.js");
/* harmony import */ var ol_geom_Point_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ol_geom_Point_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ol_proj_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ol/proj.js */ "ol/proj.js");
/* harmony import */ var ol_proj_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ol_proj_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util.js */ "./src/olcs/util.js");
/* harmony import */ var _core_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core.js */ "./src/olcs/core.js");
/* harmony import */ var _AutoRenderLoop_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AutoRenderLoop.js */ "./src/olcs/AutoRenderLoop.js");
/* harmony import */ var _Camera_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Camera.js */ "./src/olcs/Camera.js");
/* harmony import */ var _RasterSynchronizer_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./RasterSynchronizer.js */ "./src/olcs/RasterSynchronizer.js");
/* harmony import */ var _VectorSynchronizer_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./VectorSynchronizer.js */ "./src/olcs/VectorSynchronizer.js");
/* harmony import */ var _OverlaySynchronizer_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./OverlaySynchronizer.js */ "./src/olcs/OverlaySynchronizer.js");
/**
 * @module olcs.OLCesium
 */











/**
 * @typedef {Object} OLCesiumOptions
 * @property {import('ol/Map.js').default} map The OpenLayers map we want to show on a Cesium scene.
 * @property {Cesium.Viewer} [viewer]   Cesium viewer.
 * @property {function(!import('ol/Map.js').default, !Cesium.Scene, !Cesium.DataSourceCollection): Array<import('olcs/AbstractSynchronizer.js').default>}
 *      [createSynchronizers] Callback function which will be called by the {@link olcs.OLCesium}
 *      constructor to create custom synchronizers. Receives an `ol.Map` and a `Cesium.Scene` as arguments,
 *      and needs to return an array of {@link import('olcs/AbstractSynchronizer.js').default}.
 * @property {function(): Cesium.JulianDate} [time] Control the current time used by Cesium.
 * @property {boolean} [stopOpenLayersEventsPropagation] Prevent propagation of mouse/touch events to
 *      OpenLayers when Cesium is active.
 */


class OLCesium {
  /**
   * @param {!OLCesiumOptions} options Options.
   * @constructor
   * @api
   */
  constructor(options) {

    /**
     * @type {olcs.AutoRenderLoop}
     * @private
     */
    this.autoRenderLoop_ = null;

    /**
     * @type {!ol.Map}
     * @private
     */
    this.map_ = options.map;

    /**
     * @type {!function(): Cesium.JulianDate}
     * @private
     */
    this.time_ = options.time || function() {
      return Cesium.JulianDate.now();
    };

    /**
     * No change of the view projection.
     * @private
     */
    this.to4326Transform_ = (0,ol_proj_js__WEBPACK_IMPORTED_MODULE_1__.getTransform)(this.map_.getView().getProjection(), 'EPSG:4326');

    /**
     * @type {number}
     * @private
     */
    this.resolutionScale_ = 1.0;

    /**
     * @type {number}
     * @private
     */
    this.canvasClientWidth_ = 0.0;

    /**
     * @type {number}
     * @private
     */
    this.canvasClientHeight_ = 0.0;

    /**
     * @type {boolean}
     * @private
     */
    this.resolutionScaleChanged_ = true; // force resize

    const fillArea = 'position:absolute;top:0;left:0;width:100%;height:100%;';

    /**
     * @type {!Element}
     * @private
     */
    this.container_ = document.createElement('DIV');
    const containerAttribute = document.createAttribute('style');
    containerAttribute.value = `${fillArea}visibility:hidden;`;
    this.container_.setAttributeNode(containerAttribute);


    //火星科技添加
    let viewer = options.viewer
 
    viewer.container.appendChild(this.container_);

    // /**
    //  * Whether the Cesium container is placed over the ol map.
    //  * a target => side by side mode
    //  * no target => over map mode
    //  * @type {boolean}
    //  * @private
    //  */
    // this.isOverMap_ = false; 


    // if (this.isOverMap_ && options.stopOpenLayersEventsPropagation) {
    //   const overlayEvents = ['click', 'dblclick', 'mousedown', 'touchstart', 'MSPointerDown', 'pointerdown', 'mousewheel', 'wheel'];
    //   for (let i = 0, ii = overlayEvents.length; i < ii; ++i) {
    //     this.container_.addEventListener(overlayEvents[i], evt => evt.stopPropagation());
    //   }
    // }


    // /**
    //  * @type {!HTMLCanvasElement}
    //  * @private
    //  */
    // this.canvas_ = /** @type {!HTMLCanvasElement} */ (document.createElement('CANVAS'));
    // const canvasAttribute = document.createAttribute('style');
    // canvasAttribute.value = fillArea;
    // this.canvas_.setAttributeNode(canvasAttribute);

    // if (olcsUtil.supportsImageRenderingPixelated()) {
    //   // non standard CSS4
    //   this.canvas_.style['imageRendering'] = olcsUtil.imageRenderingValue();
    // }

    // this.canvas_.oncontextmenu = function() { return false; };
    // this.canvas_.onselectstart = function() { return false; };

    // this.container_.appendChild(this.canvas_);

    /**
     * @type {boolean}
     * @private
     */
    this.enabled_ = false;

    /**
     * @type {!Array.<ol.interaction.Interaction>}
     * @private
     */
    this.pausedInteractions_ = [];

    /**
     * @type {?ol.layer.Group}
     * @private
     */
    this.hiddenRootGroup_ = null;

    // const sceneOptions = options.sceneOptions !== undefined ? options.sceneOptions :
    //   /** @type {Cesium.SceneOptions} */ ({});
    // sceneOptions.canvas = this.canvas_;
    // sceneOptions.scene3DOnly = true;

    /**
     * @type {!Cesium.Scene}
     * @private
     */
    this.scene_ = viewer.scene;

    // const sscc = this.scene_.screenSpaceCameraController;

    // sscc.tiltEventTypes.push({
    //   'eventType': Cesium.CameraEventType.LEFT_DRAG,
    //   'modifier': Cesium.KeyboardEventModifier.SHIFT
    // });

    // sscc.tiltEventTypes.push({
    //   'eventType': Cesium.CameraEventType.LEFT_DRAG,
    //   'modifier': Cesium.KeyboardEventModifier.ALT
    // });

    // sscc.enableLook = false;

    // this.scene_.camera.constrainedAxis = Cesium.Cartesian3.UNIT_Z;

    /**
     * @type {!olcs.Camera}
     * @private
     */
    this.camera_ = new _Camera_js__WEBPACK_IMPORTED_MODULE_5__["default"](this.scene_, this.map_);

    /**
     * @type {!Cesium.Globe}
     * @private
     */
    this.globe_ = viewer.scene.globe;
    // this.globe_.baseColor = Cesium.Color.WHITE;
    // this.scene_.globe = this.globe_;
    // this.scene_.skyAtmosphere = new Cesium.SkyAtmosphere();

    // The first layer of Cesium is special; using a 1x1 transparent image to workaround it.
    // See https://github.com/AnalyticalGraphicsInc/cesium/issues/1323 for details.
    // const firstImageryProvider = new Cesium.SingleTileImageryProvider({
    //   url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    //   rectangle: Cesium.Rectangle.fromDegrees(0, 0, 1, 1) // the Rectangle dimensions are arbitrary
    // });
    // this.globe_.imageryLayers.addImageryProvider(firstImageryProvider, 0);

    this.dataSourceCollection_ = viewer.dataSources
    this.dataSourceDisplay_ = viewer.dataSourceDisplay

    const synchronizers = options.createSynchronizers ?
      options.createSynchronizers(this.map_, this.scene_, this.dataSourceCollection_) : [
        new _RasterSynchronizer_js__WEBPACK_IMPORTED_MODULE_6__["default"](this.map_, this.scene_),
        new _VectorSynchronizer_js__WEBPACK_IMPORTED_MODULE_7__["default"](this.map_, this.scene_),
        new _OverlaySynchronizer_js__WEBPACK_IMPORTED_MODULE_8__["default"](this.map_, this.scene_)
      ];

    // Assures correct canvas size after initialisation
    // this.handleResize_();

    for (let i = synchronizers.length - 1; i >= 0; --i) {
      synchronizers[i].synchronize();
    }

    // /**
    //  * Time of the last rendered frame, as returned by `performance.now()`.
    //  * @type {number}
    //  * @private
    //  */
    // this.lastFrameTime_ = 0;

    // /**
    //  * The identifier returned by `requestAnimationFrame`.
    //  * @type {number|undefined}
    //  * @private
    //  */
    // this.renderId_ = undefined;

    // /**
    //  * Target frame rate for the render loop.
    //  * @type {number}
    //  * @private
    //  */
    // this.targetFrameRate_ = Number.POSITIVE_INFINITY;

    // /**
    //  * If the Cesium render loop is being blocked.
    //  * @type {boolean}
    //  * @private
    //  */
    // this.blockCesiumRendering_ = false;

    // /**
    //  * If the warmup routine is active.
    //  * @type {boolean}
    //  * @private
    //  */
    // this.warmingUp_ = false;

    /**
     * @type {ol.Feature}
     * @private
     */
    this.trackedFeature_ = null;

    /**
     * @type {Cesium.Entity}
     * @private
     */
    this.trackedEntity_ = null;

    // /**
    //  * @type {Cesium.EntityView}
    //  * @private
    //  */
    // this.entityView_ = null;

    // /**
    //  * @type {boolean}
    //  * @private
    //  */
    // this.needTrackedEntityUpdate_ = false;

    // /**
    //  * @type {!Cesium.BoundingSphere}
    //  */
    // this.boundingSphereScratch_ = new Cesium.BoundingSphere();

    // const eventHelper = new Cesium.EventHelper();
    // eventHelper.add(this.scene_.postRender, OLCesium.prototype.updateTrackedEntity_, this);

    // Cesium has a mechanism to prevent the camera to go under the terrain.
    // Unfortunately, it is only active when all the terrain has been loaded, which:
    // - does not prevent the camera to sink under terrain anymore;
    // - introduce a jumping effect once all terrain has been loaded and the position of the camera is finally fixed.
    // The property below enables a workaround found in the Camptocamp Cesium fork.
    // See also https://github.com/AnalyticalGraphicsInc/cesium/issues/5999.
    // Cesium.Camera.enableSuspendTerrainAdjustment = false;

    viewer.scene.postUpdate.addEventListener(this.onAnimationFrame_, this);
  }

  // /**
  //  * Render the Cesium scene.
  //  * @private
  //  */
  // render_() {
  //   // // if a call to `requestAnimationFrame` is pending, cancel it
  //   // if (this.renderId_ !== undefined) {
  //   //   cancelAnimationFrame(this.renderId_);
  //   //   this.renderId_ = undefined;
  //   // }

  //   // // only render if Cesium is enabled/warming and rendering hasn't been blocked
  //   // if ((this.enabled_ || this.warmingUp_) && !this.blockCesiumRendering_) {
  //   //   this.renderId_ = requestAnimationFrame(this.onAnimationFrame_.bind(this));
  //   // }
  // }

  /**
   * Callback for `requestAnimationFrame`.
   * @param {number} frameTime The frame time, from `performance.now()`.
   * @private
   */
  onAnimationFrame_(frameTime) {
    // this.renderId_ = undefined;

    // // check if a frame was rendered within the target frame rate
    // const interval = 1000.0 / this.targetFrameRate_;
    // const delta = frameTime - this.lastFrameTime_;
    // if (delta < interval) {
    //   // too soon, don't render yet
    //   this.render_();
    //   return;
    // }

    // time to render a frame, save the time
    // this.lastFrameTime_ = frameTime;

    // const julianDate = this.time_();
    // this.scene_.initializeFrame();
    // this.handleResize_();
    // this.dataSourceDisplay_.update(julianDate);

    // // Update tracked entity
    // if (this.entityView_) {
    //   const trackedEntity = this.trackedEntity_;
    //   const trackedState = this.dataSourceDisplay_.getBoundingSphere(trackedEntity, false, this.boundingSphereScratch_);
    //   if (trackedState === Cesium.BoundingSphereState.DONE) {
    //     this.boundingSphereScratch_.radius = 1; // a radius of 1 is enough for tracking points
    //     this.entityView_.update(julianDate, this.boundingSphereScratch_);
    //   }
    // }

    // this.scene_.render(julianDate);
    this.camera_.checkCameraChange();

    // request the next render call after this one completes to ensure the browser doesn't get backed up
    // this.render_();
  }

  /**
   * @private
   */
  // updateTrackedEntity_() {
  //   if (!this.needTrackedEntityUpdate_) {
  //     return;
  //   }

  //   const trackedEntity = this.trackedEntity_;
  //   const scene = this.scene_;

  //   const state = this.dataSourceDisplay_.getBoundingSphere(trackedEntity, false, this.boundingSphereScratch_);
  //   if (state === Cesium.BoundingSphereState.PENDING) {
  //     return;
  //   }

  //   scene.screenSpaceCameraController.enableTilt = false;

  //   const bs = state !== Cesium.BoundingSphereState.FAILED ? this.boundingSphereScratch_ : undefined;
  //   if (bs) {
  //     bs.radius = 1;
  //   }
  //   this.entityView_ = new Cesium.EntityView(trackedEntity, scene, scene.mapProjection.ellipsoid);
  //   this.entityView_.update(this.time_(), bs);
  //   this.needTrackedEntityUpdate_ = false;
  // }

  // /**
  //  * @private
  //  */
  // handleResize_() {
  //   let width = this.canvas_.clientWidth;
  //   let height = this.canvas_.clientHeight;

  //   if (width === 0 | height === 0) {
  //     // The canvas DOM element is not ready yet.
  //     return;
  //   }

  //   if (width === this.canvasClientWidth_ &&
  //       height === this.canvasClientHeight_ &&
  //       !this.resolutionScaleChanged_) {
  //     return;
  //   }

  //   let resolutionScale = this.resolutionScale_;
  //   if (!olcsUtil.supportsImageRenderingPixelated()) {
  //     resolutionScale *= window.devicePixelRatio || 1.0;
  //   }
  //   this.resolutionScaleChanged_ = false;

  //   this.canvasClientWidth_ = width;
  //   this.canvasClientHeight_ = height;

  //   width *= resolutionScale;
  //   height *= resolutionScale;

  //   this.canvas_.width = width;
  //   this.canvas_.height = height;
  //   // this.scene_.camera.frustum.aspectRatio = width / height;
  // }

  /**
   * @return {!olcs.Camera}
   * @api
   */
  getCamera() {
    return this.camera_;
  }

  /**
   * @return {!ol.Map}
   * @api
   */
  getOlMap() {
    return this.map_;
  }

  /**
   * @return {!ol.View}
   * @api
   */
  getOlView() {
    const view = this.map_.getView();
    console.assert(view);
    return view;
  }

  /**
   * @return {!Cesium.Scene}
   * @api
   */
  getCesiumScene() {
    return this.scene_;
  }

  /**
   * @return {!Cesium.DataSourceCollection}
   * @api
   */
  getDataSources() {
    return this.dataSourceCollection_;
  }

  /**
   * @return {!Cesium.DataSourceDisplay}
   * @api
   */
  getDataSourceDisplay() {
    return this.dataSourceDisplay_;
  }

  /**
   * @return {boolean}
   * @api
   */
  getEnabled() {
    return this.enabled_;
  }

  /**
   * Enables/disables the Cesium.
   * This modifies the visibility style of the container element.
   * @param {boolean} enable
   * @api
   */
  setEnabled(enable) {
    if (this.enabled_ === enable) {
      return;
    }
    this.enabled_ = enable;

    // some Cesium operations are operating with canvas.clientWidth,
    // so we can't remove it from DOM or even make display:none;
    // this.container_.style.visibility = this.enabled_ ? 'visible' : 'hidden';
    // let interactions;
    if (this.enabled_) {
      // this.throwOnUnitializedMap_();
      // if (this.isOverMap_) {
      //   interactions = this.map_.getInteractions();
      //   interactions.forEach((el, i, arr) => {
      //     this.pausedInteractions_.push(el);
      //   });
      //   interactions.clear();

      //   this.map_.addInteraction = interaction => this.pausedInteractions_.push(interaction);
      //   this.map_.removeInteraction = interaction =>
      //     this.pausedInteractions_ = this.pausedInteractions_.filter(i => i !== interaction);

      //   const rootGroup = this.map_.getLayerGroup();
      //   if (rootGroup.getVisible()) {
      //     this.hiddenRootGroup_ = rootGroup;
      //     this.hiddenRootGroup_.setVisible(false);
      //   }

      //   this.map_.getOverlayContainer().classList.add('olcs-hideoverlay');
      // }

      this.camera_.readFromView();
      // this.render_();
    } else {
      // if (this.isOverMap_) {
      //   interactions = this.map_.getInteractions();
      //   this.pausedInteractions_.forEach((interaction) => {
      //     interactions.push(interaction);
      //   });
      //   this.pausedInteractions_.length = 0;

      //   this.map_.addInteraction = interaction => this.map_.getInteractions().push(interaction);
      //   this.map_.removeInteraction = interaction => this.map_.getInteractions().remove(interaction);

      //   this.map_.getOverlayContainer().classList.remove('olcs-hideoverlay');
      //   if (this.hiddenRootGroup_) {
      //     this.hiddenRootGroup_.setVisible(true);
      //     this.hiddenRootGroup_ = null;
      //   }
      // }

      this.camera_.updateView();
    }
  }

  /**
   * Preload Cesium so that it is ready when transitioning from 2D to 3D.
   * @param {number} height Target height of the camera
   * @param {number} timeout Milliseconds after which the warming will stop
   * @api
  */
  warmUp(height, timeout) {
    if (this.enabled_) {
      // already enabled
      return;
    }
    this.throwOnUnitializedMap_();
    this.camera_.readFromView();
    const ellipsoid = this.globe_.ellipsoid;
    const csCamera = this.scene_.camera;
    const position = ellipsoid.cartesianToCartographic(csCamera.position);
    if (position.height < height) {
      position.height = height;
      csCamera.position = ellipsoid.cartographicToCartesian(position);
    }

    // this.warmingUp_ = true;
    // // this.render_();

    // setTimeout(() => {
    //   this.warmingUp_ = false;
    // }, timeout);
  }

  // /**
  //  * Block Cesium rendering to save resources.
  //  * @param {boolean} block True to block.
  //  * @api
  // */
  // setBlockCesiumRendering(block) {
  //   if (this.blockCesiumRendering_ !== block) {
  //     this.blockCesiumRendering_ = block;

  //     // reset the render loop
  //     this.render_();
  //   }
  // }

  /**
   * Render the globe only when necessary in order to save resources.
   * Experimental.
   * @api
   */
  enableAutoRenderLoop() {
    if (!this.autoRenderLoop_) {
      this.autoRenderLoop_ = new _AutoRenderLoop_js__WEBPACK_IMPORTED_MODULE_4__["default"](this);
    }
  }

  /**
   * Get the autorender loop.
   * @return {?olcs.AutoRenderLoop}
   * @api
  */
  getAutoRenderLoop() {
    return this.autoRenderLoop_;
  }

  /**
   * The 3D Cesium globe is rendered in a canvas with two different dimensions:
   * clientWidth and clientHeight which are the dimension on the screen and
   * width and height which are the dimensions of the drawing buffer.
   *
   * By using a resolution scale lower than 1.0, it is possible to render the
   * globe in a buffer smaller than the canvas client dimensions and improve
   * performance, at the cost of quality.
   *
   * Pixel ratio should also be taken into account; by default, a device with
   * pixel ratio of 2.0 will have a buffer surface 4 times bigger than the client
   * surface.
   *
   * @param {number} value
   * @this {olcs.OLCesium}
   * @api
   */
  setResolutionScale(value) {
    value = Math.max(0, value);
    if (value !== this.resolutionScale_) {
      this.resolutionScale_ = Math.max(0, value);
      this.resolutionScaleChanged_ = true;
      if (this.autoRenderLoop_) {
        this.autoRenderLoop_.restartRenderLoop();
      }
    }
  }

  // /**
  //  * Set the target frame rate for the renderer. Set to `Number.POSITIVE_INFINITY`
  //  * to render as quickly as possible.
  //  * @param {number} value The frame rate, in frames per second.
  //  * @api
  //  */
  // setTargetFrameRate(value) {
  //   if (this.targetFrameRate_ !== value) {
  //     this.targetFrameRate_ = value;

  //     // reset the render loop
  //     this.render_();
  //   }
  // }

  /**
   * Check if OpenLayers map is not properly initialized.
   * @private
   */
  throwOnUnitializedMap_() {
    const map = this.map_;
    const view = map.getView();
    const center = view.getCenter();
    if (!view.isDef() || isNaN(center[0]) || isNaN(center[1])) {
      throw new Error(`The OpenLayers map is not properly initialized: ${center} / ${view.getResolution()}`);
    }
  }

  /**
   * @type {ol.Feature}
   */
  get trackedFeature() {
    return this.trackedFeature_;
  }

  /**
   * @param {ol.Feature} feature
   */
  set trackedFeature(feature) {
    if (this.trackedFeature_ !== feature) {

      const scene = this.scene_;

      //Stop tracking
      if (!feature || !feature.getGeometry()) {
        // this.needTrackedEntityUpdate_ = false;
        scene.screenSpaceCameraController.enableTilt = true;

        if (this.trackedEntity_) {
          this.dataSourceDisplay_.defaultDataSource.entities.remove(this.trackedEntity_);
        }
        this.trackedEntity_ = null;
        this.trackedFeature_ = null;
        this.entityView_ = null;
        scene.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
        return;
      }

      this.trackedFeature_ = feature;

      //We can't start tracking immediately, so we set a flag and start tracking
      //when the bounding sphere is ready (most likely next frame).
      // this.needTrackedEntityUpdate_ = true;

      const to4326Transform = this.to4326Transform_;
      const toCesiumPosition = function() {
        const geometry = feature.getGeometry();
        console.assert(geometry instanceof (ol_geom_Point_js__WEBPACK_IMPORTED_MODULE_0___default()));
        const coo = geometry.getCoordinates();
        const coo4326 = to4326Transform(coo, undefined, coo.length);
        return _core_js__WEBPACK_IMPORTED_MODULE_3__["default"].ol4326CoordinateToCesiumCartesian(coo4326);
      };

      // Create an invisible point entity for tracking.
      // It is independant from the primitive/geometry created by the vector synchronizer.
      const options = {
        'position': new Cesium.CallbackProperty((time, result) => toCesiumPosition(), false),
        'point': {
          'pixelSize': 1,
          'color': Cesium.Color.TRANSPARENT
        }
      };

      this.trackedEntity_ = this.dataSourceDisplay_.defaultDataSource.entities.add(options);
    }
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (OLCesium);


/***/ }),

/***/ "./src/olcs/OverlaySynchronizer.js":
/*!*****************************************!*\
  !*** ./src/olcs/OverlaySynchronizer.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _SynchronizedOverlay_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SynchronizedOverlay.js */ "./src/olcs/SynchronizedOverlay.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util.js */ "./src/olcs/util.js");
/**
 * @module olcs.OverlaySynchronizer
 */



class OverlaySynchronizer {
  /**
  * @param {!ol.Map} map
  * @param {!Cesium.Scene} scene
  * @constructor
  * @template T
  * @api
  */
  constructor(map, scene) {
    /**
    * @type {!ol.Map}
    * @protected
    */
    this.map = map;

    /**
    * @type {ol.Collection.<ol.Overlay>}
    * @private
    */
    this.overlays_ = this.map.getOverlays();

    /**
    * @type {!Cesium.Scene}
    * @protected
    */
    this.scene = scene;

    /**
    * @private
    * @type {!Element}
    */
    this.overlayContainerStopEvent_ = document.createElement('DIV');
    this.overlayContainerStopEvent_.className = 'ol-overlaycontainer-stopevent';
    const overlayEvents = ['click', 'dblclick', 'mousedown', 'touchstart', 'MSPointerDown', 'pointerdown', 'mousewheel', 'wheel'];
    overlayEvents.forEach((event) => {
      this.overlayContainerStopEvent_.addEventListener(event, evt => evt.stopPropagation());
    });
    this.scene.canvas.parentElement.appendChild(this.overlayContainerStopEvent_);

    /**
    * @private
    * @type {!Element}
    */
    this.overlayContainer_ = document.createElement('DIV');
    this.overlayContainer_.className = 'ol-overlaycontainer';
    this.scene.canvas.parentElement.appendChild(this.overlayContainer_);


    /**
    * @type {!Object<?,olcs.SynchronizedOverlay>}
    * @private
    */
    this.overlayMap_ = {};
  }

  /**
  * Get the element that serves as a container for overlays that don't allow
  * event propagation. Elements added to this container won't let mousedown and
  * touchstart events through to the map, so clicks and gestures on an overlay
  * don't trigger any {@link ol.MapBrowserEvent}.
  * @return {!Element} The map's overlay container that stops events.
  */
  getOverlayContainerStopEvent() {
    return this.overlayContainerStopEvent_;
  }

  /**
  * Get the element that serves as a container for overlays.
  * @return {!Element} The map's overlay container.
  */
  getOverlayContainer() {
    return this.overlayContainer_;
  }

  /**
  * Destroy all and perform complete synchronization of the overlays.
  * @api
  */
  synchronize() {
    this.destroyAll();
    this.addOverlays();
    this.overlays_.on('add', this.addOverlayFromEvent_.bind(this));
    this.overlays_.on('remove', this.removeOverlayFromEvent_.bind(this));
  }

  /**
  * @param {ol.Collection.Event} event
  * @private
  */
  addOverlayFromEvent_(event) {
    const overlay = /** @type {ol.Overlay} */ (event.element);
    this.addOverlay(overlay);
  }

  /**
  * @api
  */
  addOverlays() {
    this.overlays_.forEach((overlay) => { this.addOverlay(overlay); });
  }

  /**
  * @param {ol.Overlay} overlay
  * @api
  */
  addOverlay(overlay) {
    if (!overlay) {
      return;
    }
    const cesiumOverlay = new _SynchronizedOverlay_js__WEBPACK_IMPORTED_MODULE_0__["default"]({
      scene: this.scene,
      synchronizer: this,
      parent: overlay
    });

    const overlayId = (0,_util_js__WEBPACK_IMPORTED_MODULE_1__.getUid)(overlay).toString();
    this.overlayMap_[overlayId] = cesiumOverlay;
  }

  /**
  * @param {ol.Collection.Event} event
  * @private
  */
  removeOverlayFromEvent_(event) {
    const removedOverlay = /** @type {ol.Overlay} */ (event.element);
    this.removeOverlay(removedOverlay);
  }

  /**
  * Removes an overlay from the scene
  * @param {ol.Overlay} overlay
  * @api
  */
  removeOverlay(overlay) {
    const overlayId = (0,_util_js__WEBPACK_IMPORTED_MODULE_1__.getUid)(overlay).toString();
    const csOverlay = this.overlayMap_[overlayId];
    if (csOverlay) {
      csOverlay.destroy();
      delete this.overlayMap_[overlayId];
    }
  }

  /**
  * Destroys all the created Cesium objects.
  * @protected
  */
  destroyAll() {
    Object.keys(this.overlayMap_).forEach((key) => {
      const overlay = this.overlayMap_[key];
      overlay.destroy();
      delete this.overlayMap_[key];
    });
  }
}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (OverlaySynchronizer);


/***/ }),

/***/ "./src/olcs/RasterSynchronizer.js":
/*!****************************************!*\
  !*** ./src/olcs/RasterSynchronizer.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var ol_layer_Group_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ol/layer/Group.js */ "ol/layer/Group.js");
/* harmony import */ var ol_layer_Group_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ol_layer_Group_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util.js */ "./src/olcs/util.js");
/* harmony import */ var _AbstractSynchronizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AbstractSynchronizer.js */ "./src/olcs/AbstractSynchronizer.js");
/* harmony import */ var _core_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core.js */ "./src/olcs/core.js");
/**
 * @module olcs.RasterSynchronizer
 */





class RasterSynchronizer extends _AbstractSynchronizer_js__WEBPACK_IMPORTED_MODULE_2__["default"] {
  /**
   * This object takes care of one-directional synchronization of
   * Openlayers raster layers to the given Cesium globe.
   * @param {!ol.Map} map
   * @param {!Cesium.Scene} scene
   * @constructor
   * @extends {olcsAbstractSynchronizer.<Cesium.ImageryLayer>}
   * @api
   */
  constructor(map, scene) {
    super(map, scene);

    /**
     * @type {!Cesium.ImageryLayerCollection}
     * @private
     */
    this.cesiumLayers_ = scene.imageryLayers;

    /**
     * @type {!Cesium.ImageryLayerCollection}
     * @private
     */
    this.ourLayers_ = new Cesium.ImageryLayerCollection();
  }

  /**
   * @inheritDoc
   */
  addCesiumObject(object) {
    this.cesiumLayers_.add(object);
    this.ourLayers_.add(object);
  }

  /**
   * @inheritDoc
   */
  destroyCesiumObject(object) {
    object.destroy();
  }

  /**
   * @inheritDoc
   */
  removeSingleCesiumObject(object, destroy) {
    this.cesiumLayers_.remove(object, destroy);
    this.ourLayers_.remove(object, false);
  }

  /**
   * @inheritDoc
   */
  removeAllCesiumObjects(destroy) {
    for (let i = 0; i < this.ourLayers_.length; ++i) {
      this.cesiumLayers_.remove(this.ourLayers_.get(i), destroy);
    }
    this.ourLayers_.removeAll(false);
  }

  /**
   * Creates an array of Cesium.ImageryLayer.
   * May be overriden by child classes to implement custom behavior.
   * The default implementation handles tiled imageries in EPSG:4326 or
   * EPSG:3859.
   * @param {!ol.layer.Base} olLayer
   * @param {!ol.proj.Projection} viewProj Projection of the view.
   * @return {?Array.<!Cesium.ImageryLayer>} array or null if not possible
   * (or supported)
   * @protected
   */
  convertLayerToCesiumImageries(olLayer, viewProj) {
    const result = _core_js__WEBPACK_IMPORTED_MODULE_3__["default"].tileLayerToImageryLayer(this.map, olLayer, viewProj);
    return result ? [result] : null;
  }

  /**
   * @inheritDoc
   */
  createSingleLayerCounterparts(olLayerWithParents) {
    const olLayer = olLayerWithParents.layer;
    const uid = (0,_util_js__WEBPACK_IMPORTED_MODULE_1__.getUid)(olLayer).toString();
    const viewProj = this.view.getProjection();
    console.assert(viewProj);
    const cesiumObjects = this.convertLayerToCesiumImageries(olLayer, viewProj);
    if (cesiumObjects) {
      const listenKeyArray = [];
      [olLayerWithParents.layer].concat(olLayerWithParents.parents).forEach((olLayerItem) => {
        listenKeyArray.push(olLayerItem.on(['change:opacity', 'change:visible'], () => {
          // the compiler does not seem to be able to infer this
          console.assert(cesiumObjects);
          for (let i = 0; i < cesiumObjects.length; ++i) {
            _core_js__WEBPACK_IMPORTED_MODULE_3__["default"].updateCesiumLayerProperties(olLayerWithParents, cesiumObjects[i]);
          }
        }));
      });

      if (olLayer.getStyleFunction) {
        let previousStyleFunction = olLayer.getStyleFunction();
        // there is no convenient way to detect a style function change in OL
        listenKeyArray.push(olLayer.on('change', () => {
          const currentStyleFunction = olLayer.getStyleFunction();
          if (previousStyleFunction === currentStyleFunction) {
            return;
          }
          previousStyleFunction = currentStyleFunction;
          for (let i = 0; i < cesiumObjects.length; ++i) {
            const csObj = cesiumObjects[i];
            // clear cache and set new style
            if (csObj._imageryCache && csObj.imageryProvider.cache_) {
              csObj._imageryCache = {};
              csObj.imageryProvider.cache_ = {};
              csObj.imageryProvider.styleFunction_ = currentStyleFunction;
            }
          }
          this.scene.requestRender();
        }));
      }

      for (let i = 0; i < cesiumObjects.length; ++i) {
        _core_js__WEBPACK_IMPORTED_MODULE_3__["default"].updateCesiumLayerProperties(olLayerWithParents, cesiumObjects[i]);
      }

      // there is no way to modify Cesium layer extent,
      // we have to recreate when OpenLayers layer extent changes:
      listenKeyArray.push(olLayer.on('change:extent', (e) => {
        for (let i = 0; i < cesiumObjects.length; ++i) {
          this.cesiumLayers_.remove(cesiumObjects[i], true); // destroy
          this.ourLayers_.remove(cesiumObjects[i], false);
        }
        delete this.layerMap[(0,_util_js__WEBPACK_IMPORTED_MODULE_1__.getUid)(olLayer)]; // invalidate the map entry
        this.synchronize();
      }));

      listenKeyArray.push(olLayer.on('change', (e) => {
        // when the source changes, re-add the layer to force update
        for (let i = 0; i < cesiumObjects.length; ++i) {
          const position = this.cesiumLayers_.indexOf(cesiumObjects[i]);
          if (position >= 0) {
            this.cesiumLayers_.remove(cesiumObjects[i], false);
            this.cesiumLayers_.add(cesiumObjects[i], position);
          }
        }
      }));

      this.olLayerListenKeys[uid].push(...listenKeyArray);
    }

    return Array.isArray(cesiumObjects) ? cesiumObjects : null;
  }

  /**
   * Order counterparts using the same algorithm as the Openlayers renderer:
   * z-index then original sequence order.
   * @override
   * @protected
   */
  orderLayers() {
    const layers = [];
    const zIndices = {};
    const queue = [this.mapLayerGroup];

    while (queue.length > 0) {
      const olLayer = queue.splice(0, 1)[0];
      layers.push(olLayer);
      zIndices[(0,_util_js__WEBPACK_IMPORTED_MODULE_1__.getUid)(olLayer)] = olLayer.getZIndex() || 0;

      if (olLayer instanceof (ol_layer_Group_js__WEBPACK_IMPORTED_MODULE_0___default())) {
        const sublayers = olLayer.getLayers();
        if (sublayers) {
          // Prepend queue with sublayers in order
          queue.unshift(...sublayers.getArray());
        }
      }
    }

    (0,_util_js__WEBPACK_IMPORTED_MODULE_1__.stableSort)(layers, (layer1, layer2) =>
      zIndices[(0,_util_js__WEBPACK_IMPORTED_MODULE_1__.getUid)(layer1)] - zIndices[(0,_util_js__WEBPACK_IMPORTED_MODULE_1__.getUid)(layer2)]
    );

    layers.forEach((olLayer) => {
      const olLayerId = (0,_util_js__WEBPACK_IMPORTED_MODULE_1__.getUid)(olLayer).toString();
      const cesiumObjects = this.layerMap[olLayerId];
      if (cesiumObjects) {
        cesiumObjects.forEach((cesiumObject) => { this.raiseToTop(cesiumObject); });
      }
    });
  }

  /**
   * @param {Cesium.ImageryLayer} counterpart
   */
  raiseToTop(counterpart) {
    this.cesiumLayers_.raiseToTop(counterpart);
  }
}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RasterSynchronizer);


/***/ }),

/***/ "./src/olcs/SynchronizedOverlay.js":
/*!*****************************************!*\
  !*** ./src/olcs/SynchronizedOverlay.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var ol_Overlay_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ol/Overlay.js */ "ol/Overlay.js");
/* harmony import */ var ol_Overlay_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ol_Overlay_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ol_proj_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ol/proj.js */ "ol/proj.js");
/* harmony import */ var ol_proj_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ol_proj_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util.js */ "./src/olcs/util.js");
/* harmony import */ var ol_Observable_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ol/Observable.js */ "ol/Observable.js");
/* harmony import */ var ol_Observable_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ol_Observable_js__WEBPACK_IMPORTED_MODULE_3__);
/**
 * @module olcs.SynchronizedOverlay
 */






/**
 * Options for SynchronizedOverlay
 * @typedef {Object} SynchronizedOverlayOptions
 * @property {!Cesium.Scene} scene
 * @property {olOverlay} parent
 * @property {!import('olsc/OverlaySynchronizer.js').default} synchronizer
 */


class SynchronizedOverlay extends (ol_Overlay_js__WEBPACK_IMPORTED_MODULE_0___default()) {
  /**
   * @param {olcsx.SynchronizedOverlayOptions} options SynchronizedOverlay Options.
   * @api
   */
  constructor(options) {
    const parent = options.parent;
    super(parent.getOptions());

    /**
     * @private
     * @type {?Function}
     */
    this.scenePostRenderListenerRemover_ = null;

    /**
     * @private
     * @type {!Cesium.Scene}
     */
    this.scene_ = options.scene;

    /**
     * @private
     * @type {!olcs.OverlaySynchronizer}
     */
    this.synchronizer_ = options.synchronizer;

    /**
     * @private
     * @type {!ol.Overlay}
     */
    this.parent_ = parent;

    /**
     * @private
     * @type {ol.Coordinate|undefined}
     */
    this.positionWGS84_ = undefined;

    /**
     * @private
     * @type {MutationObserver}
     */
    this.observer_ = new MutationObserver(this.handleElementChanged.bind(this));

    /**
     * @private
     * @type {Array.<MutationObserver>}
     */
    this.attributeObserver_ = [];

    /**
     * @private
     * @type {Array<ol.EventsKey>}
     */
    this.listenerKeys_ = [];
    // synchronize our Overlay with the parent Overlay
    const setPropertyFromEvent = event => this.setPropertyFromEvent_(event);
    this.listenerKeys_.push(this.parent_.on('change:position', setPropertyFromEvent));
    this.listenerKeys_.push(this.parent_.on('change:element', setPropertyFromEvent));
    this.listenerKeys_.push(this.parent_.on('change:offset', setPropertyFromEvent));
    this.listenerKeys_.push(this.parent_.on('change:position', setPropertyFromEvent));
    this.listenerKeys_.push(this.parent_.on('change:positioning', setPropertyFromEvent));

    this.setProperties(this.parent_.getProperties());

    this.handleMapChanged();
    this.handleElementChanged();
  }

  /**
   * @param {Node} target
   * @private
   */
  observeTarget_(target) {
    if (!this.observer_) {
      // not ready, skip the event (this occurs on construction)
      return;
    }
    this.observer_.disconnect();
    this.observer_.observe(target, {
      attributes: false,
      childList: true,
      characterData: true,
      subtree: true
    });
    this.attributeObserver_.forEach((observer) => {
      observer.disconnect();
    });
    this.attributeObserver_.length = 0;
    for (let i = 0; i < target.childNodes.length; i++) {
      const node = target.childNodes[i];
      if (node.nodeType === 1) {
        const observer = new MutationObserver(this.handleElementChanged.bind(this));
        observer.observe(node, {
          attributes: true,
          subtree: true
        });
        this.attributeObserver_.push(observer);
      }
    }
  }

  /**
   *
   * @param {ol.Object.Event} event
   * @private
   */
  setPropertyFromEvent_(event) {
    if (event.target && event.key) {
      this.set(event.key, event.target.get(event.key));
    }
  }

  /**
   * Get the scene associated with this overlay.
   * @see ol.Overlay.prototype.getMap
   * @return {!Cesium.Scene} The scene that the overlay is part of.
   * @api
   */
  getScene() {
    return this.scene_;
  }

  /**
   * @override
   */
  handleMapChanged() {
    if (this.scenePostRenderListenerRemover_) {
      this.scenePostRenderListenerRemover_();
      (0,_util_js__WEBPACK_IMPORTED_MODULE_2__.removeNode)(this.element);
    }
    this.scenePostRenderListenerRemover_ = null;
    const scene = this.getScene();
    if (scene) {
      this.scenePostRenderListenerRemover_ = scene.postRender.addEventListener(this.updatePixelPosition.bind(this));
      this.updatePixelPosition();
      const container = this.stopEvent ?
        this.synchronizer_.getOverlayContainerStopEvent() : this.synchronizer_.getOverlayContainer();
      if (this.insertFirst) {
        container.insertBefore(this.element, container.childNodes[0] || null);
      } else {
        container.appendChild(this.element);
      }
    }
  }

  /**
   * @override
   */
  handlePositionChanged() {
    // transform position to WGS84
    const position = this.getPosition();
    if (position) {
      const sourceProjection = this.parent_.getMap().getView().getProjection();
      this.positionWGS84_ = (0,ol_proj_js__WEBPACK_IMPORTED_MODULE_1__.transform)(position, sourceProjection, 'EPSG:4326');
    } else {
      this.positionWGS84_ = undefined;
    }
    this.updatePixelPosition();
  }

  /**
   * @override
   */
  handleElementChanged() {
    function cloneNode(node, parent) {
      const clone = node.cloneNode();
      if (node.nodeName === 'CANVAS') {
        const ctx = clone.getContext('2d');
        ctx.drawImage(node, 0, 0);
      }
      if (parent) {
        parent.appendChild(clone);
      }
      if (node.nodeType != Node.TEXT_NODE) {
        clone.addEventListener('click', (event) => {
          node.dispatchEvent(new MouseEvent('click', event));
          event.stopPropagation();
        });
      }
      const nodes = node.childNodes;
      for (let i = 0; i < nodes.length; i++) {
        if (!nodes[i]) {
          continue;
        }
        cloneNode(nodes[i], clone);
      }
      return clone;
    }
    (0,_util_js__WEBPACK_IMPORTED_MODULE_2__.removeChildren)(this.element);
    const element = this.getElement();
    if (element) {
      if (element.parentNode && element.parentNode.childNodes) {
        for (const node of element.parentNode.childNodes) {
          const clonedNode = cloneNode(node, null);
          this.element.appendChild(clonedNode);
        }
      }
    }
    if (element.parentNode) {
      // set new Observer
      this.observeTarget_(element.parentNode);
    }
  }

  /**
   * @override
   */
  updatePixelPosition() {
    const position = this.positionWGS84_;
    if (!this.scene_ || !position) {
      this.setVisible(false);
      return;
    }
    let height = 0;
    if (position.length === 2) {
      const globeHeight = this.scene_.globe.getHeight(Cesium.Cartographic.fromDegrees(position[0], position[1]));
      if (globeHeight && this.scene_.globe.tilesLoaded) {
        position[2] = globeHeight;
      }
      if (globeHeight) {
        height = globeHeight;
      }
    } else {
      height = position[2];
    }
    const cartesian = Cesium.Cartesian3.fromDegrees(position[0], position[1], height);
    const camera = this.scene_.camera;
    const ellipsoidBoundingSphere = new Cesium.BoundingSphere(new Cesium.Cartesian3(), 6356752);
    const occluder = new Cesium.Occluder(ellipsoidBoundingSphere, camera.position);
    // check if overlay position is behind the horizon
    if (!occluder.isPointVisible(cartesian)) {
      this.setVisible(false);
      return;
    }
    const cullingVolume = camera.frustum.computeCullingVolume(camera.position, camera.direction, camera.up);
    // check if overlay position is visible from the camera
    if (cullingVolume.computeVisibility(new Cesium.BoundingSphere(cartesian)) !== 1) {
      this.setVisible(false);
      return;
    }
    this.setVisible(true);

    const pixelCartesian = this.scene_.cartesianToCanvasCoordinates(cartesian);
    const pixel = [pixelCartesian.x, pixelCartesian.y];
    const mapSize = [this.scene_.canvas.width, this.scene_.canvas.height];
    this.updateRenderedPosition(pixel, mapSize);
  }

  /**
   * Destroys the overlay, removing all its listeners and elements
   * @api
   */
  destroy() {
    if (this.scenePostRenderListenerRemover_) {
      this.scenePostRenderListenerRemover_();
    }
    if (this.observer_) {
      this.observer_.disconnect();
    }
    (0,ol_Observable_js__WEBPACK_IMPORTED_MODULE_3__.unByKey)(this.listenerKeys_);
    this.listenerKeys_.splice(0);
    if (this.element.removeNode) {
      this.element.removeNode(true);
    } else {
      this.element.remove();
    }
    this.element = null;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SynchronizedOverlay);


/***/ }),

/***/ "./src/olcs/VectorSynchronizer.js":
/*!****************************************!*\
  !*** ./src/olcs/VectorSynchronizer.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var ol_source_Vector_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ol/source/Vector.js */ "ol/source/Vector.js");
/* harmony import */ var ol_source_Vector_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ol_source_Vector_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ol_layer_Layer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ol/layer/Layer.js */ "ol/layer/Layer.js");
/* harmony import */ var ol_layer_Layer_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ol_layer_Layer_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ol_source_Cluster_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ol/source/Cluster.js */ "ol/source/Cluster.js");
/* harmony import */ var ol_source_Cluster_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ol_source_Cluster_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var ol_layer_Image_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ol/layer/Image.js */ "ol/layer/Image.js");
/* harmony import */ var ol_layer_Image_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ol_layer_Image_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./util.js */ "./src/olcs/util.js");
/* harmony import */ var ol_layer_Vector_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ol/layer/Vector.js */ "ol/layer/Vector.js");
/* harmony import */ var ol_layer_Vector_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(ol_layer_Vector_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var ol_layer_VectorTile_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ol/layer/VectorTile.js */ "ol/layer/VectorTile.js");
/* harmony import */ var ol_layer_VectorTile_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(ol_layer_VectorTile_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _AbstractSynchronizer_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./AbstractSynchronizer.js */ "./src/olcs/AbstractSynchronizer.js");
/* harmony import */ var _FeatureConverter_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./FeatureConverter.js */ "./src/olcs/FeatureConverter.js");
/**
 * @module olcs.VectorSynchronizer
 */










class VectorSynchronizer extends _AbstractSynchronizer_js__WEBPACK_IMPORTED_MODULE_7__["default"] {
  /**
   * Unidirectionally synchronize OpenLayers vector layers to Cesium.
   * @param {!ol.Map} map
   * @param {!Cesium.Scene} scene
   * @param {olcs.FeatureConverter=} opt_converter
   * @extends {olcs.AbstractSynchronizer.<olcs.core.VectorLayerCounterpart>}
   * @api
   */
  constructor(map, scene, opt_converter) {
    super(map, scene);

    /**
     * @protected
     */
    this.converter = opt_converter || new _FeatureConverter_js__WEBPACK_IMPORTED_MODULE_8__["default"](scene);

    /**
     * @private
     */
    this.csAllPrimitives_ = new Cesium.PrimitiveCollection();
    scene.primitives.add(this.csAllPrimitives_);
    this.csAllPrimitives_.destroyPrimitives = false;
  }

  /**
   * @inheritDoc
   */
  addCesiumObject(counterpart) {
    console.assert(counterpart);
    counterpart.getRootPrimitive()['counterpart'] = counterpart;
    this.csAllPrimitives_.add(counterpart.getRootPrimitive());
  }

  /**
   * @inheritDoc
   */
  destroyCesiumObject(object) {
    object.getRootPrimitive().destroy();
  }

  /**
   * @inheritDoc
   */
  removeSingleCesiumObject(object, destroy) {
    object.destroy();
    this.csAllPrimitives_.destroyPrimitives = destroy;
    this.csAllPrimitives_.remove(object.getRootPrimitive());
    this.csAllPrimitives_.destroyPrimitives = false;
  }

  /**
   * @inheritDoc
   */
  removeAllCesiumObjects(destroy) {
    this.csAllPrimitives_.destroyPrimitives = destroy;
    if (destroy) {
      for (let i = 0; i < this.csAllPrimitives_.length; ++i) {
        this.csAllPrimitives_.get(i)['counterpart'].destroy();
      }
    }
    this.csAllPrimitives_.removeAll();
    this.csAllPrimitives_.destroyPrimitives = false;
  }

  /**
   * Synchronizes the layer visibility properties
   * to the given Cesium Primitive.
   * @param {import('olsc/core.js').LayerWithParents} olLayerWithParents
   * @param {!Cesium.Primitive} csPrimitive
   */
  updateLayerVisibility(olLayerWithParents, csPrimitive) {
    let visible = true;
    [olLayerWithParents.layer].concat(olLayerWithParents.parents).forEach((olLayer) => {
      const layerVisible = olLayer.getVisible();
      if (layerVisible !== undefined) {
        visible &= layerVisible;
      } else {
        visible = false;
      }
    });
    csPrimitive.show = visible;
  }

  /**
   * @inheritDoc
   */
  createSingleLayerCounterparts(olLayerWithParents) {
    const olLayer = olLayerWithParents.layer;
    if (!(olLayer instanceof (ol_layer_Vector_js__WEBPACK_IMPORTED_MODULE_5___default())) || olLayer instanceof (ol_layer_VectorTile_js__WEBPACK_IMPORTED_MODULE_6___default())) {
      return null;
    }
    console.assert(olLayer instanceof (ol_layer_Layer_js__WEBPACK_IMPORTED_MODULE_1___default()));

    let source = olLayer.getSource();
    if (source instanceof (ol_source_Cluster_js__WEBPACK_IMPORTED_MODULE_2___default())) {
      source = source.getSource();
    }

    if (!source) {
      return null;
    }

    console.assert(source instanceof (ol_source_Vector_js__WEBPACK_IMPORTED_MODULE_0___default()));
    console.assert(this.view);

    const view = this.view;
    const featurePrimitiveMap = {};
    const counterpart = this.converter.olVectorLayerToCesium(olLayer, view,
        featurePrimitiveMap);
    const csPrimitives = counterpart.getRootPrimitive();
    const olListenKeys = counterpart.olListenKeys;

    [olLayerWithParents.layer].concat(olLayerWithParents.parents).forEach((olLayerItem) => {
      olListenKeys.push((0,_util_js__WEBPACK_IMPORTED_MODULE_4__.olcsListen)(olLayerItem, 'change:visible', () => {
        this.updateLayerVisibility(olLayerWithParents, csPrimitives);
      }));
    });
    this.updateLayerVisibility(olLayerWithParents, csPrimitives);

    const onAddFeature = (function(feature) {
      console.assert(
          (olLayer instanceof (ol_layer_Vector_js__WEBPACK_IMPORTED_MODULE_5___default())) ||
          (olLayer instanceof (ol_layer_Image_js__WEBPACK_IMPORTED_MODULE_3___default()))
      );
      const context = counterpart.context;
      const prim = this.converter.convert(olLayer, view, feature, context);
      if (prim) {
        featurePrimitiveMap[(0,_util_js__WEBPACK_IMPORTED_MODULE_4__.getUid)(feature)] = prim;
        csPrimitives.add(prim);
      }
    }).bind(this);

    const onRemoveFeature = (function(feature) {
      const id = (0,_util_js__WEBPACK_IMPORTED_MODULE_4__.getUid)(feature);
      const context = counterpart.context;
      const bbs = context.featureToCesiumMap[id];
      if (bbs) {
        delete context.featureToCesiumMap[id];
        bbs.forEach((bb) => {
          if (bb instanceof Cesium.Billboard) {
            context.billboards.remove(bb);
          }
        });
      }
      const csPrimitive = featurePrimitiveMap[id];
      delete featurePrimitiveMap[id];
      if (csPrimitive) {
        csPrimitives.remove(csPrimitive);
      }
    }).bind(this);

    olListenKeys.push((0,_util_js__WEBPACK_IMPORTED_MODULE_4__.olcsListen)(source, 'addfeature', (e) => {
      console.assert(e.feature);
      onAddFeature(e.feature);
    }, this));

    olListenKeys.push((0,_util_js__WEBPACK_IMPORTED_MODULE_4__.olcsListen)(source, 'removefeature', (e) => {
      console.assert(e.feature);
      onRemoveFeature(e.feature);
    }, this));

    olListenKeys.push((0,_util_js__WEBPACK_IMPORTED_MODULE_4__.olcsListen)(source, 'changefeature', (e) => {
      const feature = e.feature;
      console.assert(feature);
      onRemoveFeature(feature);
      onAddFeature(feature);
    }, this));

    return counterpart ? [counterpart] : null;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VectorSynchronizer);


/***/ }),

/***/ "./src/olcs/contrib/LazyLoader.js":
/*!****************************************!*\
  !*** ./src/olcs/contrib/LazyLoader.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LazyLoader)
/* harmony export */ });
/**
 * @module olcs.contrib.LazyLoader
 */
class LazyLoader {
  /**
   * @param {string} url
   * @api
   */
  constructor(url) {
    /**
     * @type {Promise<undefined>}
     * @protected
     */
    this.promise;

    /**
     * @private
     * @type {string}
     */
    this.url_ = url;
  }

  /**
   * @return {Promise<undefined>}
   * @api
   */
  load() {
    if (!this.promise) {
      // not yet loading
      this.promise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.head.appendChild(script);
        script.src = this.url_;
      });
    }
    return this.promise;
  }
}


/***/ }),

/***/ "./src/olcs/contrib/Manager.js":
/*!*************************************!*\
  !*** ./src/olcs/contrib/Manager.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _contrib_LazyLoader_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../contrib/LazyLoader.js */ "./src/olcs/contrib/LazyLoader.js");
/* harmony import */ var _OLCesium_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../OLCesium.js */ "./src/olcs/OLCesium.js");
/* harmony import */ var _core_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core.js */ "./src/olcs/core.js");
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../math.js */ "./src/olcs/math.js");
/* harmony import */ var ol_Observable_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ol/Observable.js */ "ol/Observable.js");
/* harmony import */ var ol_Observable_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ol_Observable_js__WEBPACK_IMPORTED_MODULE_4__);
/**
 * @module olcs.contrib.Manager
 */







/**
 * @typedef {Object} ManagerOptions
 * @property {import('ol/Map.js').default} map
 * @property {import('ol/extent.js').Extent} [cameraExtentInRadians]
 * @property {string} [cesiumIonDefaultAccessToken]
 */


const Manager = class extends (ol_Observable_js__WEBPACK_IMPORTED_MODULE_4___default()) {
  /**
   * @param {string} cesiumUrl
   * @param {olcsx.contrib.ManagerOptions} options
   * @api
   */
  constructor(cesiumUrl, {map, cameraExtentInRadians, cesiumIonDefaultAccessToken} = {}) {

    super();

    /**
     * @type {string}
     * @private
     */
    this.cesiumUrl_ = cesiumUrl;

    /**
     * @type {ol.Map}
     * @protected
     */
    this.map = map;

    /**
     * @type {ol.Extent}
     * @protected
     */
    this.cameraExtentInRadians = cameraExtentInRadians || null;

    /**
     * @private
     * @type {Cesium.BoundingSphere}
     */
    this.boundingSphere_;

    /**
     * @type {boolean}
     * @private
     */
    this.blockLimiter_ = false;

    /**
     * @type {Promise.<olcs.OLCesium>}
     * @private
     */
    this.promise_;

    /**
     * @type {string}
     * @private
     */
    this.cesiumIonDefaultAccessToken_ = cesiumIonDefaultAccessToken;

    /**
     * @type {olcs.OLCesium}
     * @protected
     */
    this.ol3d;

    /**
     * @const {number} Tilt angle in radians
     * @private
     */
    this.cesiumInitialTilt_ = (0,_math_js__WEBPACK_IMPORTED_MODULE_3__.toRadians)(50);

    /**
     * @protected
     * @type {number}
     */
    this.fogDensity = 0.0001;

    /**
     * @protected
     * @type {number}
     */
    this.fogSSEFactor = 25;

    /**
     * Limit the minimum distance to the terrain to 2m.
     * @protected
     * @type {number}
     */
    this.minimumZoomDistance = 2;

    /**
     * Limit the maximum distance to the earth to 10'000km.
     * @protected
     * @type {number}
     */
    this.maximumZoomDistance = 10000000;

    // when closer to 3000m, restrict the available positions harder
    /**
     * @protected
     * @param {number} height
     */
    this.limitCameraToBoundingSphereRatio = height => (height > 3000 ? 9 : 3);
  }


  /**
   * @return {Promise.<olcs.OLCesium>}
   */
  load() {
    if (!this.promise_) {
      const cesiumLazyLoader = new _contrib_LazyLoader_js__WEBPACK_IMPORTED_MODULE_0__["default"](this.cesiumUrl_);
      this.promise_ = cesiumLazyLoader.load().then(() => this.onCesiumLoaded());
    }
    return this.promise_;
  }


  /**
   * @protected
   * @return {olcs.OLCesium}
   */
  onCesiumLoaded() {
    if (this.cameraExtentInRadians) {
      const rect = new Cesium.Rectangle(...this.cameraExtentInRadians);
      // Set the fly home rectangle
      Cesium.Camera.DEFAULT_VIEW_RECTANGLE = rect;
      this.boundingSphere_ = Cesium.BoundingSphere.fromRectangle3D(rect, Cesium.Ellipsoid.WGS84, 300); // lux mean height is 300m
    }

    if (this.cesiumIonDefaultAccessToken_) {
      Cesium.Ion.defaultAccessToken = this.cesiumIonDefaultAccessToken_;
    }

    this.ol3d = this.instantiateOLCesium();
    const scene = this.ol3d.getCesiumScene();
    this.configureForUsability(scene);
    this.configureForPerformance(scene);
    this.dispatchEvent('load');
    return this.ol3d;
  }


  /**
   * Application code should override this method.
   * @return {olcs.OLCesium}
   */
  instantiateOLCesium() {
    console.assert(this.map);
    const ol3d = new _OLCesium_js__WEBPACK_IMPORTED_MODULE_1__["default"]({map: this.map});
    const scene = ol3d.getCesiumScene();
    const terrainProvider = Cesium.createWorldTerrain();
    scene.terrainProvider = terrainProvider;
    return ol3d;
  }


  /**
   * @param {!Cesium.Scene} scene The scene, passed as parameter for convenience.
   * @protected
   */
  configureForPerformance(scene) {
    const fog = scene.fog;
    fog.enabled = true;
    fog.density = this.fogDensity;
    fog.screenSpaceErrorFactor = this.fogSSEFactor;
  }


  /**
   * @param {!Cesium.Scene} scene The scene, passed as parameter for convenience.
   * @protected
   */
  configureForUsability(scene) {
    const sscController = scene.screenSpaceCameraController;
    sscController.minimumZoomDistance = this.minimumZoomDistance;
    sscController.maximumZoomDistance = this.maximumZoomDistance;

    // Do not see through the terrain. Seeing through the terrain does not make
    // sense anyway, except for debugging
    scene.globe.depthTestAgainstTerrain = true;

    // Use white instead of the black default colour for the globe when tiles are missing
    scene.globe.baseColor = Cesium.Color.WHITE;
    scene.backgroundColor = Cesium.Color.WHITE;

    if (this.boundingSphere_) {
      scene.postRender.addEventListener(this.limitCameraToBoundingSphere.bind(this), scene);
    }
    // Stop rendering Cesium when there is nothing to do. This drastically reduces CPU/GPU consumption.
    this.ol3d.enableAutoRenderLoop();
  }


  /**
   * Constrain the camera so that it stays close to the bounding sphere of the map extent.
   * Near the ground the allowed distance is shorter.
   * @protected
   */
  limitCameraToBoundingSphere() {
    if (this.boundingSphere_ && !this.blockLimiter_) {
      const scene = this.ol3d.getCesiumScene();
      const camera = scene.camera;
      const position = camera.position;
      const carto = Cesium.Cartographic.fromCartesian(position);
      const ratio = this.limitCameraToBoundingSphereRatio(carto.height);
      if (Cesium.Cartesian3.distance(this.boundingSphere_.center, position) > this.boundingSphere_.radius * ratio) {
        const currentlyFlying = camera.flying;
        if (currentlyFlying === true) {
          // There is a flying property and its value is true
          return;
        } else {
          this.blockLimiter_ = true;
          const unblockLimiter = () => this.blockLimiter_ = false;
          camera.flyToBoundingSphere(this.boundingSphere_, {
            complete: unblockLimiter,
            cancel: unblockLimiter
          });
        }
      }
    }
  }


  /**
   * Enable or disable ol3d with a default animation.
   * @export
   * @return {Promise<undefined>}
   */
  toggle3d() {
    return this.load().then((/** @const {!olcs.OLCesium} */ ol3d) => {
      const is3DCurrentlyEnabled = ol3d.getEnabled();
      const scene = ol3d.getCesiumScene();
      if (is3DCurrentlyEnabled) {
        // Disable 3D
        console.assert(this.map);
        return _core_js__WEBPACK_IMPORTED_MODULE_2__["default"].resetToNorthZenith(this.map, scene).then(() => {
          ol3d.setEnabled(false);
          this.dispatchEvent('toggle');
        });
      } else {
        // Enable 3D
        ol3d.setEnabled(true);
        this.dispatchEvent('toggle');
        return _core_js__WEBPACK_IMPORTED_MODULE_2__["default"].rotateAroundBottomCenter(scene, this.cesiumInitialTilt_);
      }
    });
  }


  /**
   * Enable ol3d with a view built from parameters.
   *
   * @export
   * @param {number} lon
   * @param {number} lat
   * @param {number} elevation
   * @param {number} headingDeg Heading value in degrees.
   * @param {number} pitchDeg Pitch value in degrees.
   * @returns {Promise<undefined>}
   */
  set3dWithView(lon, lat, elevation, headingDeg, pitchDeg) {
    return this.load().then((/** @const {!olcs.OLCesium} */ ol3d) => {
      const is3DCurrentlyEnabled = ol3d.getEnabled();
      const scene = ol3d.getCesiumScene();
      const camera = scene.camera;
      const destination = Cesium.Cartesian3.fromDegrees(lon, lat, elevation);
      const heading = Cesium.Math.toRadians(headingDeg);
      const pitch = Cesium.Math.toRadians(pitchDeg);
      const roll = 0;
      const orientation = {heading, pitch, roll};

      if (!is3DCurrentlyEnabled) {
        ol3d.setEnabled(true);
        this.dispatchEvent('toggle');
      }

      camera.setView({
        destination,
        orientation
      });
    });
  }


  /**
   * @export
   * @return {boolean}
   */
  is3dEnabled() {
    return !!this.ol3d && this.ol3d.getEnabled();
  }


  /**
   * @return {number}
   */
  getHeading() {
    return this.map ? this.map.getView().getRotation() || 0 : 0;
  }


  /**
   * @return {number|undefined}
   */
  getTiltOnGlobe() {
    const scene = this.ol3d.getCesiumScene();
    const tiltOnGlobe = _core_js__WEBPACK_IMPORTED_MODULE_2__["default"].computeSignedTiltAngleOnGlobe(scene);
    return -tiltOnGlobe;
  }


  /**
   * @param {number} angle
   */
  setHeading(angle) {
    const scene = this.ol3d.getCesiumScene();
    const bottom = _core_js__WEBPACK_IMPORTED_MODULE_2__["default"].pickBottomPoint(scene);
    if (bottom) {
      _core_js__WEBPACK_IMPORTED_MODULE_2__["default"].setHeadingUsingBottomCenter(scene, angle, bottom);
    }
  }

  /**
   * @export
   * @return {olcs.OLCesium}
   */
  getOl3d() {
    return this.ol3d;
  }

  /**
   * @export
   * @return {!ol.View}
   */
  getOlView() {
    const view = this.map.getView();
    console.assert(view);
    return view;
  }

  /**
   * @export
   * @return {Cesium.Matrix4}
   */
  getCesiumViewMatrix() {
    return this.ol3d.getCesiumScene().camera.viewMatrix;
  }

  /**
   * @export
   * @return {!Cesium.Scene}
   */
  getCesiumScene() {
    return this.ol3d.getCesiumScene();
  }

  /**
   * @export
   * @param {!Cesium.Rectangle} rectangle
   * @param {number=} offset in meters
   * @return {Promise<undefined>}
   */
  flyToRectangle(rectangle, offset = 0) {
    const camera = this.getCesiumScene().camera;
    const destination = camera.getRectangleCameraCoordinates(rectangle);

    const mag = Cesium.Cartesian3.magnitude(destination) + offset;
    Cesium.Cartesian3.normalize(destination, destination);
    Cesium.Cartesian3.multiplyByScalar(destination, mag, destination);

    return new Promise((resolve, reject) => {
      if (!this.cameraExtentInRadians) {
        reject();
        return;
      }

      camera.flyTo({
        destination,
        complete: () => resolve(),
        cancel: () => reject(),
        endTransform: Cesium.Matrix4.IDENTITY
      });
    });
  }

  /**
   * @protected
   * @return {Cesium.Rectangle|undefined}
   */
  getCameraExtentRectangle() {
    if (this.cameraExtentInRadians) {
      return new Cesium.Rectangle(...this.cameraExtentInRadians);
    }
  }
};


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Manager);


/***/ }),

/***/ "./src/olcs/core.js":
/*!**************************!*\
  !*** ./src/olcs/core.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "attributionsFunctionToCredits": () => (/* binding */ attributionsFunctionToCredits),
/* harmony export */   "calcDistanceForResolution": () => (/* binding */ calcDistanceForResolution),
/* harmony export */   "calcResolutionForDistance": () => (/* binding */ calcResolutionForDistance),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var ol_easing_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ol/easing.js */ "ol/easing.js");
/* harmony import */ var ol_easing_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ol_easing_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ol_layer_Tile_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ol/layer/Tile.js */ "ol/layer/Tile.js");
/* harmony import */ var ol_layer_Tile_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ol_layer_Tile_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var ol_layer_Image_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ol/layer/Image.js */ "ol/layer/Image.js");
/* harmony import */ var ol_layer_Image_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ol_layer_Image_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var ol_proj_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ol/proj.js */ "ol/proj.js");
/* harmony import */ var ol_proj_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ol_proj_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var ol_source_ImageStatic_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ol/source/ImageStatic.js */ "ol/source/ImageStatic.js");
/* harmony import */ var ol_source_ImageStatic_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(ol_source_ImageStatic_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var ol_source_ImageWMS_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ol/source/ImageWMS.js */ "ol/source/ImageWMS.js");
/* harmony import */ var ol_source_ImageWMS_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(ol_source_ImageWMS_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var ol_source_TileImage_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ol/source/TileImage.js */ "ol/source/TileImage.js");
/* harmony import */ var ol_source_TileImage_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(ol_source_TileImage_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var ol_source_TileWMS_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ol/source/TileWMS.js */ "ol/source/TileWMS.js");
/* harmony import */ var ol_source_TileWMS_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(ol_source_TileWMS_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var ol_source_VectorTile_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ol/source/VectorTile.js */ "ol/source/VectorTile.js");
/* harmony import */ var ol_source_VectorTile_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(ol_source_VectorTile_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var ol_source_Image_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ol/source/Image.js */ "ol/source/Image.js");
/* harmony import */ var ol_source_Image_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(ol_source_Image_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _core_OLImageryProvider_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./core/OLImageryProvider.js */ "./src/olcs/core/OLImageryProvider.js");
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./util.js */ "./src/olcs/util.js");
/* harmony import */ var _MVTImageryProvider_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./MVTImageryProvider.js */ "./src/olcs/MVTImageryProvider.js");
/* harmony import */ var ol_layer_VectorTile_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ol/layer/VectorTile.js */ "ol/layer/VectorTile.js");
/* harmony import */ var ol_layer_VectorTile_js__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(ol_layer_VectorTile_js__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var ol_extent__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ol/extent */ "ol/extent");
/* harmony import */ var ol_extent__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(ol_extent__WEBPACK_IMPORTED_MODULE_14__);
/**
 * @module olcs.core
 */
















const exports = {};


/**
 * @typedef {Object} CesiumUrlDefinition
 * @property {string} url
 * @property {string} subdomains
 */


/**
 * Options for rotate around axis core function.
 * @typedef {Object} RotateAroundAxisOption
 * @property {number} [duration]
 * @property {function(number): number} [easing]
 * @property {function(): void} [callback]
 */



/**
 * @typedef {Object} LayerWithParents
 * @property {import('ol/layer/Base.js').default} layer
 * @property {Array<import('ol/layer/Group.js').default>} parents
 */


/**
 * Compute the pixel width and height of a point in meters using the
 * camera frustum.
 * @param {!Cesium.Scene} scene
 * @param {!Cesium.Cartesian3} target
 * @return {!Cesium.Cartesian2} the pixel size
 * @api
 */
exports.computePixelSizeAtCoordinate = function(scene, target) {
  const camera = scene.camera;
  const canvas = scene.canvas;
  const frustum = camera.frustum;
  const distance = Cesium.Cartesian3.magnitude(Cesium.Cartesian3.subtract(
      camera.position, target, new Cesium.Cartesian3()));
  return frustum.getPixelDimensions(canvas.clientWidth, canvas.clientHeight,
      distance, scene.pixelRatio, new Cesium.Cartesian2());
};


/**
 * Compute bounding box around a target point.
 * @param {!Cesium.Scene} scene
 * @param {!Cesium.Cartesian3} target
 * @param {number} amount Half the side of the box, in pixels.
 * @return {Array<Cesium.Cartographic>} bottom left and top right
 * coordinates of the box
 */
exports.computeBoundingBoxAtTarget = function(scene, target, amount) {
  const pixelSize = exports.computePixelSizeAtCoordinate(scene, target);
  const transform = Cesium.Transforms.eastNorthUpToFixedFrame(target);

  const bottomLeft = Cesium.Matrix4.multiplyByPoint(
      transform,
      new Cesium.Cartesian3(-pixelSize.x * amount, -pixelSize.y * amount, 0),
      new Cesium.Cartesian3());

  const topRight = Cesium.Matrix4.multiplyByPoint(
      transform,
      new Cesium.Cartesian3(pixelSize.x * amount, pixelSize.y * amount, 0),
      new Cesium.Cartesian3());

  return Cesium.Ellipsoid.WGS84.cartesianArrayToCartographicArray(
      [bottomLeft, topRight]);
};


/**
 *
 * @param {!ol.geom.Geometry} geometry
 * @param {number} height
 * @api
 */
exports.applyHeightOffsetToGeometry = function(geometry, height) {
  geometry.applyTransform((input, output, stride) => {
    console.assert(input === output);
    if (stride !== undefined && stride >= 3) {
      for (let i = 0; i < output.length; i += stride) {
        output[i + 2] = output[i + 2] + height;
      }
    }
    return output;
  });
};


/**
 * @param {ol.Coordinate} coordinates
 * @param {number=} rotation
 * @param {!Cesium.Cartesian3=} translation
 * @param {!Cesium.Cartesian3=} scale
 * @return {!Cesium.Matrix4}
 * @api
 */
exports.createMatrixAtCoordinates = function(coordinates, rotation = 0, translation = Cesium.Cartesian3.ZERO, scale = new Cesium.Cartesian3(1, 1, 1)) {
  const position = exports.ol4326CoordinateToCesiumCartesian(coordinates);
  const rawMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
  const quaternion = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, -rotation);
  const rotationMatrix = Cesium.Matrix4.fromTranslationQuaternionRotationScale(translation, quaternion, scale);
  return Cesium.Matrix4.multiply(rawMatrix, rotationMatrix, new Cesium.Matrix4());
};


/**
 * @param {!Cesium.Camera} camera
 * @param {number} angle
 * @param {!Cesium.Cartesian3} axis
 * @param {!Cesium.Matrix4} transform
 * @param {RotateAroundAxisOption=} opt_options
 * @api
 */
exports.rotateAroundAxis = function(camera, angle, axis, transform,
    opt_options) {
  const clamp = Cesium.Math.clamp;
  const defaultValue = Cesium.defaultValue;

  const options = opt_options || {};
  const duration = defaultValue(options.duration, 500); // ms
  const easing = defaultValue(options.easing, ol_easing_js__WEBPACK_IMPORTED_MODULE_0__.linear);
  const callback = options.callback;

  let lastProgress = 0;
  const oldTransform = new Cesium.Matrix4();

  const start = Date.now();
  const step = function() {
    const timestamp = Date.now();
    const timeDifference = timestamp - start;
    const progress = easing(clamp(timeDifference / duration, 0, 1));
    console.assert(progress >= lastProgress);

    camera.transform.clone(oldTransform);
    const stepAngle = (progress - lastProgress) * angle;
    lastProgress = progress;
    camera.lookAtTransform(transform);
    camera.rotate(axis, stepAngle);
    camera.lookAtTransform(oldTransform);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      if (callback) {
        callback();
      }
    }
  };
  window.requestAnimationFrame(step);
};


/**
 * @param {!Cesium.Scene} scene
 * @param {number} heading
 * @param {!Cesium.Cartesian3} bottomCenter
 * @param {RotateAroundAxisOption=} opt_options
 * @api
 */
exports.setHeadingUsingBottomCenter = function(scene, heading,
    bottomCenter, opt_options) {
  const camera = scene.camera;
  // Compute the camera position to zenith quaternion
  const angleToZenith = exports.computeAngleToZenith(scene, bottomCenter);
  const axis = camera.right;
  const quaternion = Cesium.Quaternion.fromAxisAngle(axis, angleToZenith);
  const rotation = Cesium.Matrix3.fromQuaternion(quaternion);

  // Get the zenith point from the rotation of the position vector
  const vector = new Cesium.Cartesian3();
  Cesium.Cartesian3.subtract(camera.position, bottomCenter, vector);
  const zenith = new Cesium.Cartesian3();
  Cesium.Matrix3.multiplyByVector(rotation, vector, zenith);
  Cesium.Cartesian3.add(zenith, bottomCenter, zenith);

  // Actually rotate around the zenith normal
  const transform = Cesium.Matrix4.fromTranslation(zenith);
  const rotateAroundAxis = exports.rotateAroundAxis;
  rotateAroundAxis(camera, heading, zenith, transform, opt_options);
};


/**
 * Get the 3D position of the given pixel of the canvas.
 * @param {!Cesium.Scene} scene
 * @param {!Cesium.Cartesian2} pixel
 * @return {!Cesium.Cartesian3|undefined}
 * @api
 */
exports.pickOnTerrainOrEllipsoid = function(scene, pixel) {
  const ray = scene.camera.getPickRay(pixel);
  const target = scene.globe.pick(ray, scene);
  return target || scene.camera.pickEllipsoid(pixel);
};


/**
 * Get the 3D position of the point at the bottom-center of the screen.
 * @param {!Cesium.Scene} scene
 * @return {!Cesium.Cartesian3|undefined}
 * @api
 */
exports.pickBottomPoint = function(scene) {
  const canvas = scene.canvas;
  const bottom = new Cesium.Cartesian2(
      canvas.clientWidth / 2, canvas.clientHeight);
  return exports.pickOnTerrainOrEllipsoid(scene, bottom);
};


/**
 * Get the 3D position of the point at the center of the screen.
 * @param {!Cesium.Scene} scene
 * @return {!Cesium.Cartesian3|undefined}
 * @api
 */
exports.pickCenterPoint = function(scene) {
  const canvas = scene.canvas;
  const center = new Cesium.Cartesian2(
      canvas.clientWidth / 2,
      canvas.clientHeight / 2);
  return exports.pickOnTerrainOrEllipsoid(scene, center);
};


/**
 * Compute the signed tilt angle on globe, between the opposite of the
 * camera direction and the target normal. Return undefined if there is no
 * intersection of the camera direction with the globe.
 * @param {!Cesium.Scene} scene
 * @return {number|undefined}
 * @api
 */
exports.computeSignedTiltAngleOnGlobe = function(scene) {
  const camera = scene.camera;
  const ray = new Cesium.Ray(camera.position, camera.direction);
  let target = scene.globe.pick(ray, scene);

  if (!target) {
    // no tiles in the area were loaded?
    const ellipsoid = Cesium.Ellipsoid.WGS84;
    const obj = Cesium.IntersectionTests.rayEllipsoid(ray, ellipsoid);
    if (obj) {
      target = Cesium.Ray.getPoint(ray, obj.start);
    }
  }

  if (!target) {
    return undefined;
  }

  const normal = new Cesium.Cartesian3();
  Cesium.Ellipsoid.WGS84.geocentricSurfaceNormal(target, normal);

  const angleBetween = exports.signedAngleBetween;
  const angle = angleBetween(camera.direction, normal, camera.right) - Math.PI;
  return Cesium.Math.convertLongitudeRange(angle);
};


/**
 * Compute the ray from the camera to the bottom-center of the screen.
 * @param {!Cesium.Scene} scene
 * @return {!Cesium.Ray}
 */
exports.bottomFovRay = function(scene) {
  const camera = scene.camera;
  const fovy2 = camera.frustum.fovy / 2;
  const direction = camera.direction;
  const rotation = Cesium.Quaternion.fromAxisAngle(camera.right, fovy2);
  const matrix = Cesium.Matrix3.fromQuaternion(rotation);
  const vector = new Cesium.Cartesian3();
  Cesium.Matrix3.multiplyByVector(matrix, direction, vector);
  return new Cesium.Ray(camera.position, vector);
};


/**
 * Compute the angle between two Cartesian3.
 * @param {!Cesium.Cartesian3} first
 * @param {!Cesium.Cartesian3} second
 * @param {!Cesium.Cartesian3} normal Normal to test orientation against.
 * @return {number}
 */
exports.signedAngleBetween = function(first, second, normal) {
  // We are using the dot for the angle.
  // Then the cross and the dot for the sign.
  const a = new Cesium.Cartesian3();
  const b = new Cesium.Cartesian3();
  const c = new Cesium.Cartesian3();
  Cesium.Cartesian3.normalize(first, a);
  Cesium.Cartesian3.normalize(second, b);
  Cesium.Cartesian3.cross(a, b, c);

  const cosine = Cesium.Cartesian3.dot(a, b);
  const sine = Cesium.Cartesian3.magnitude(c);

  // Sign of the vector product and the orientation normal
  const sign = Cesium.Cartesian3.dot(normal, c);
  const angle = Math.atan2(sine, cosine);
  return sign >= 0 ? angle : -angle;
};


/**
 * Compute the rotation angle around a given point, needed to reach the
 * zenith position.
 * At a zenith position, the camera direction is going througth the earth
 * center and the frustrum bottom ray is going through the chosen pivot
 * point.
 * The bottom-center of the screen is a good candidate for the pivot point.
 * @param {!Cesium.Scene} scene
 * @param {!Cesium.Cartesian3} pivot Point around which the camera rotates.
 * @return {number}
 * @api
 */
exports.computeAngleToZenith = function(scene, pivot) {
  // This angle is the sum of the angles 'fy' and 'a', which are defined
  // using the pivot point and its surface normal.
  //        Zenith |    camera
  //           \   |   /
  //            \fy|  /
  //             \ |a/
  //              \|/pivot
  const camera = scene.camera;
  const fy = camera.frustum.fovy / 2;
  const ray = exports.bottomFovRay(scene);
  const direction = Cesium.Cartesian3.clone(ray.direction);
  Cesium.Cartesian3.negate(direction, direction);

  const normal = new Cesium.Cartesian3();
  Cesium.Ellipsoid.WGS84.geocentricSurfaceNormal(pivot, normal);

  const left = new Cesium.Cartesian3();
  Cesium.Cartesian3.negate(camera.right, left);

  const a = exports.signedAngleBetween(normal, direction, left);
  return a + fy;
};


/**
 * Convert an OpenLayers extent to a Cesium rectangle.
 * @param {ol.Extent} extent Extent.
 * @param {ol.ProjectionLike} projection Extent projection.
 * @return {Cesium.Rectangle} The corresponding Cesium rectangle.
 * @api
 */
exports.extentToRectangle = function(extent, projection) {
  if (extent && projection) {
    const ext = (0,ol_proj_js__WEBPACK_IMPORTED_MODULE_3__.transformExtent)(extent, projection, 'EPSG:4326');
    return Cesium.Rectangle.fromDegrees(ext[0], ext[1], ext[2], ext[3]);
  } else {
    return null;
  }
};


/**
 * @param {!ol.Map} olMap
 * @param {!ol.source.Source} source
 * @param {!ol.View} viewProj
 * @param {!ol.layer.Base} olLayer
 * @return {!Cesium.ImageryProvider}
 */
exports.sourceToImageryProvider = function(olMap, source, viewProj, olLayer) {
  const skip = source.get('olcs_skip');
  if (skip) {
    return null;
  }
  let provider = null;
  // Convert ImageWMS to TileWMS
  if (source instanceof (ol_source_ImageWMS_js__WEBPACK_IMPORTED_MODULE_5___default()) && source.getUrl() &&
    source.getImageLoadFunction() === ol_source_Image_js__WEBPACK_IMPORTED_MODULE_9__.defaultImageLoadFunction) {
    const sourceProps = {
      'olcs.proxy': source.get('olcs.proxy'),
      'olcs.extent': source.get('olcs.extent'),
      'olcs.projection': source.get('olcs.projection'),
      'olcs.imagesource': source
    };
    source = new (ol_source_TileWMS_js__WEBPACK_IMPORTED_MODULE_7___default())({
      url: source.getUrl(),
      attributions: source.getAttributions(),
      projection: source.getProjection(),
      params: source.getParams()
    });
    source.setProperties(sourceProps);
  }

  if (source instanceof (ol_source_TileImage_js__WEBPACK_IMPORTED_MODULE_6___default())) {
    let projection = _util_js__WEBPACK_IMPORTED_MODULE_11__["default"].getSourceProjection(source);

    if (!projection) {
      // if not explicit, assume the same projection as view
      projection = viewProj;
    }

    if (exports.isCesiumProjection(projection)) {
      provider = new _core_OLImageryProvider_js__WEBPACK_IMPORTED_MODULE_10__["default"](olMap, source, viewProj);
    }
    // Projection not supported by Cesium
    else {
      return null;
    }
  } else if (source instanceof (ol_source_ImageStatic_js__WEBPACK_IMPORTED_MODULE_4___default())) {
    let projection = _util_js__WEBPACK_IMPORTED_MODULE_11__["default"].getSourceProjection(source);
    if (!projection) {
      projection = viewProj;
    }
    if (exports.isCesiumProjection(projection)) {
      provider = new Cesium.SingleTileImageryProvider({
        url: source.getUrl(),
        rectangle: new Cesium.Rectangle.fromDegrees(
            source.getImageExtent()[0],
            source.getImageExtent()[1],
            source.getImageExtent()[2],
            source.getImageExtent()[3]
        )
      });
    }
    // Projection not supported by Cesium
    else {
      return null;
    }
  } else if (source instanceof (ol_source_VectorTile_js__WEBPACK_IMPORTED_MODULE_8___default())) {
    let projection = _util_js__WEBPACK_IMPORTED_MODULE_11__["default"].getSourceProjection(source);

    if (!projection) {
      projection = viewProj;
    }
    if (skip === false) {
      // MVT is experimental, it should be whitelisted to be synchronized
      const fromCode = projection.getCode().split(':')[1];
      const urls = source.urls.map(u => u.replace(fromCode, '3857'));
      const extent = olLayer.getExtent();
      const rectangle = exports.extentToRectangle(extent, projection);
      const minimumLevel = source.get('olcs_minimumLevel');
      const attributionsFunction = source.getAttributions();
      const styleFunction = olLayer.getStyleFunction();
      let credit;
      if (extent && attributionsFunction) {
        const center = (0,ol_extent__WEBPACK_IMPORTED_MODULE_14__.getCenter)(extent);
        credit = attributionsFunctionToCredits(attributionsFunction, 0, center, extent)[0];
      }

      provider = new _MVTImageryProvider_js__WEBPACK_IMPORTED_MODULE_12__["default"]({
        credit,
        rectangle,
        minimumLevel,
        styleFunction,
        urls
      });
      return provider;
    }
    return null; // FIXME: it is disabled by default right now
  } else {
    // sources other than TileImage|ImageStatic are currently not supported
    return null;
  }
  return provider;
};

/**
 * Creates Cesium.ImageryLayer best corresponding to the given ol.layer.Layer.
 * Only supports raster layers and static images
 * @param {!ol.Map} olMap
 * @param {!ol.layer.Base} olLayer
 * @param {!ol.proj.Projection} viewProj Projection of the view.
 * @return {?Cesium.ImageryLayer} null if not possible (or supported)
 * @api
 */
exports.tileLayerToImageryLayer = function(olMap, olLayer, viewProj) {

  if (!(olLayer instanceof (ol_layer_Tile_js__WEBPACK_IMPORTED_MODULE_1___default())) && !(olLayer instanceof (ol_layer_Image_js__WEBPACK_IMPORTED_MODULE_2___default())) &&
    !(olLayer instanceof (ol_layer_VectorTile_js__WEBPACK_IMPORTED_MODULE_13___default()))) {
    return null;
  }

  const source = olLayer.getSource();
  if (!source) {
    return null;
  }
  let provider = source.get('olcs_provider');
  if (!provider) {
    provider = this.sourceToImageryProvider(olMap, source, viewProj, olLayer);
  }
  if (!provider) {
    return null;
  }

  const layerOptions = {};

  const forcedExtent = /** @type {ol.Extent} */ (olLayer.get('olcs.extent'));
  const ext = forcedExtent || olLayer.getExtent();
  if (ext) {
    layerOptions.rectangle = exports.extentToRectangle(ext, viewProj);
  }

  const cesiumLayer = new Cesium.ImageryLayer(provider, layerOptions);
  return cesiumLayer;
};


/**
 * Synchronizes the layer rendering properties (opacity, visible)
 * to the given Cesium ImageryLayer.
 * @param {olcsx.LayerWithParents} olLayerWithParents
 * @param {!Cesium.ImageryLayer} csLayer
 * @api
 */
exports.updateCesiumLayerProperties = function(olLayerWithParents, csLayer) {
  let opacity = 1;
  let visible = true;
  [olLayerWithParents.layer].concat(olLayerWithParents.parents).forEach((olLayer) => {
    const layerOpacity = olLayer.getOpacity();
    if (layerOpacity !== undefined) {
      opacity *= layerOpacity;
    }
    const layerVisible = olLayer.getVisible();
    if (layerVisible !== undefined) {
      visible &= layerVisible;
    }
  });
  csLayer.alpha = opacity;
  csLayer.show = visible;
};


/**
 * Convert a 2D or 3D OpenLayers coordinate to Cesium.
 * @param {ol.Coordinate} coordinate Ol3 coordinate.
 * @return {!Cesium.Cartesian3} Cesium cartesian coordinate
 * @api
 */
exports.ol4326CoordinateToCesiumCartesian = function(coordinate) {
  const coo = coordinate;
  return coo.length > 2 ?
    Cesium.Cartesian3.fromDegrees(coo[0], coo[1], coo[2]) :
    Cesium.Cartesian3.fromDegrees(coo[0], coo[1]);
};


/**
 * Convert an array of 2D or 3D OpenLayers coordinates to Cesium.
 * @param {Array.<!ol.Coordinate>} coordinates Ol3 coordinates.
 * @return {!Array.<Cesium.Cartesian3>} Cesium cartesian coordinates
 * @api
 */
exports.ol4326CoordinateArrayToCsCartesians = function(coordinates) {
  console.assert(coordinates !== null);
  const toCartesian = exports.ol4326CoordinateToCesiumCartesian;
  const cartesians = [];
  for (let i = 0; i < coordinates.length; ++i) {
    cartesians.push(toCartesian(coordinates[i]));
  }
  return cartesians;
};


/**
 * Reproject an OpenLayers geometry to EPSG:4326 if needed.
 * The geometry will be cloned only when original projection is not EPSG:4326
 * and the properties will be shallow copied.
 * @param {!T} geometry
 * @param {!ol.ProjectionLike} projection
 * @return {!T}
 * @template T
 * @api
 */
exports.olGeometryCloneTo4326 = function(geometry, projection) {
  console.assert(projection);

  const proj4326 = (0,ol_proj_js__WEBPACK_IMPORTED_MODULE_3__.get)('EPSG:4326');
  const proj = (0,ol_proj_js__WEBPACK_IMPORTED_MODULE_3__.get)(projection);
  if (proj !== proj4326) {
    const properties = geometry.getProperties();
    geometry = geometry.clone();
    geometry.transform(proj, proj4326);
    geometry.setProperties(properties);
  }
  return geometry;
};


/**
 * Convert an OpenLayers color to Cesium.
 * @param {ol.Color|CanvasGradient|CanvasPattern|string} olColor
 * @return {!Cesium.Color}
 * @api
 */
exports.convertColorToCesium = function(olColor) {
  olColor = olColor || 'black';
  if (Array.isArray(olColor)) {
    return new Cesium.Color(
        Cesium.Color.byteToFloat(olColor[0]),
        Cesium.Color.byteToFloat(olColor[1]),
        Cesium.Color.byteToFloat(olColor[2]),
        olColor[3]
    );
  } else if (typeof olColor == 'string') {
    return Cesium.Color.fromCssColorString(olColor);
  } else if (olColor instanceof CanvasPattern || olColor instanceof CanvasGradient) {
    // Render the CanvasPattern/CanvasGradient into a canvas that will be sent to Cesium as material
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.height = 256;
    ctx.fillStyle = olColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return new Cesium.ImageMaterialProperty({
      image: canvas
    });
  }
  console.assert(false, 'impossible');
};


/**
 * Convert an OpenLayers url to Cesium.
 * @param {string} url
 * @return {!CesiumUrlDefinition}
 * @api
 */
exports.convertUrlToCesium = function(url) {
  let subdomains = '';
  const re = /\{(\d|[a-z])-(\d|[a-z])\}/;
  const match = re.exec(url);
  if (match) {
    url = url.replace(re, '{s}');
    const startCharCode = match[1].charCodeAt(0);
    const stopCharCode = match[2].charCodeAt(0);
    let charCode;
    for (charCode = startCharCode; charCode <= stopCharCode; ++charCode) {
      subdomains += String.fromCharCode(charCode);
    }
  }
  return {
    url,
    subdomains
  };
};


/**
 * Animate the return to a top-down view from the zenith.
 * The camera is rotated to orient to the North.
 * @param {!ol.Map} map
 * @param {!Cesium.Scene} scene
 * @return {Promise<undefined>}
 * @api
 */
exports.resetToNorthZenith = function(map, scene) {
  return new Promise((resolve, reject) => {
    const camera = scene.camera;
    const pivot = exports.pickBottomPoint(scene);
    if (!pivot) {
      reject('Could not get bottom pivot');
      return;
    }

    const currentHeading = map.getView().getRotation();
    if (currentHeading === undefined) {
      reject('The view is not initialized');
      return;
    }
    const angle = exports.computeAngleToZenith(scene, pivot);

    // Point to North
    exports.setHeadingUsingBottomCenter(scene, currentHeading, pivot);

    // Go to zenith
    const transform = Cesium.Matrix4.fromTranslation(pivot);
    const axis = camera.right;
    const options = {
      callback: () => {
        const view = map.getView();
        exports.normalizeView(view);
        resolve();
      }
    };
    exports.rotateAroundAxis(camera, -angle, axis, transform, options);
  });
};


/**
 * @param {!Cesium.Scene} scene
 * @param {number} angle in radian
 * @return {Promise<undefined>}
 * @api
 */
exports.rotateAroundBottomCenter = function(scene, angle) {
  return new Promise((resolve, reject) => {
    const camera = scene.camera;
    const pivot = exports.pickBottomPoint(scene);
    if (!pivot) {
      reject('could not get bottom pivot');
      return;
    }

    const options = {callback: resolve};
    const transform = Cesium.Matrix4.fromTranslation(pivot);
    const axis = camera.right;
    const rotateAroundAxis = exports.rotateAroundAxis;
    rotateAroundAxis(camera, -angle, axis, transform, options);
  });
};


/**
 * Set the OpenLayers view to a specific rotation and
 * the nearest resolution.
 * @param {ol.View} view
 * @param {number=} angle
 * @api
 */
exports.normalizeView = function(view, angle = 0) {
  const resolution = view.getResolution();
  view.setRotation(angle);
  if (view.constrainResolution) {
    view.setResolution(view.constrainResolution(resolution));
  } else {
    view.setResolution(view.getConstrainedResolution(resolution));
  }
};

/**
 * Check if the given projection is managed by Cesium (WGS84 or Mercator Spheric)
 *
 * @param {ol.proj.Projection} projection Projection to check.
 * @returns {boolean} Whether it's managed by Cesium.
 */
exports.isCesiumProjection = function(projection) {
  const is3857 = projection === (0,ol_proj_js__WEBPACK_IMPORTED_MODULE_3__.get)('EPSG:3857');
  const is4326 = projection === (0,ol_proj_js__WEBPACK_IMPORTED_MODULE_3__.get)('EPSG:4326');
  return is3857 || is4326;
};


function attributionsFunctionToCredits(attributionsFunction, zoom, center, extent) {
  const frameState = {
    viewState: {zoom, center},
    extent,
  };

  if (!attributionsFunction) {
    return [];
  }
  let attributions = attributionsFunction(frameState);
  if (!Array.isArray(attributions)) {
    attributions = [attributions];
  }

  return attributions.map(html => new Cesium.Credit(html, true));
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (exports);


/**
 * calculate the distance between camera and centerpoint based on the resolution and latitude value
 * @param {number} resolution Number of map units per pixel.
 * @param {number} latitude Latitude in radians.
 * @param {import('cesium').Scene} scene.
 * @param {import('ol/proj/Projection').default} projection View projection.
 * @return {number} The calculated distance.
 * @api
 */
function calcDistanceForResolution(resolution, latitude, scene, projection) {
  const canvas = scene.canvas;
  const camera = scene.camera;
  const fovy = camera.frustum.fovy; // vertical field of view
  console.assert(!isNaN(fovy));
  const metersPerUnit = projection.getMetersPerUnit();

  // number of "map units" visible in 2D (vertically)
  const visibleMapUnits = resolution * canvas.clientHeight;

  // The metersPerUnit does not take latitude into account, but it should
  // be lower with increasing latitude -- we have to compensate.
  // In 3D it is not possible to maintain the resolution at more than one point,
  // so it only makes sense to use the latitude of the "target" point.
  const relativeCircumference = Math.cos(Math.abs(latitude));

  // how many meters should be visible in 3D
  const visibleMeters = visibleMapUnits * metersPerUnit * relativeCircumference;

  // distance required to view the calculated length in meters
  //
  //  fovy/2
  //    |\
  //  x | \
  //    |--\
  // visibleMeters/2
  const requiredDistance = (visibleMeters / 2) / Math.tan(fovy / 2);

  // NOTE: This calculation is not absolutely precise, because metersPerUnit
  // is a great simplification. It does not take ellipsoid/terrain into account.

  return requiredDistance;
}

/**
 * calculate the resolution based on a distance(camera to position) and latitude value
 * @param {number} distance
 * @param {number} latitude
 * @param {import('cesium').Scene} scene.
 * @param {import('ol/proj/Projection').default} projection View projection.
 * @return {number} The calculated resolution.
 * @api
 */
function calcResolutionForDistance(distance, latitude, scene, projection) {
  // See the reverse calculation (calcDistanceForResolution) for details
  const canvas = scene.canvas;
  const camera = scene.camera;
  const fovy = camera.frustum.fovy; // vertical field of view
  console.assert(!isNaN(fovy));
  const metersPerUnit = projection.getMetersPerUnit();

  const visibleMeters = 2 * distance * Math.tan(fovy / 2);
  const relativeCircumference = Math.cos(Math.abs(latitude));
  const visibleMapUnits = visibleMeters / metersPerUnit / relativeCircumference;
  const resolution = visibleMapUnits / canvas.clientHeight;

  return resolution;
}


/***/ }),

/***/ "./src/olcs/core/OLImageryProvider.js":
/*!********************************************!*\
  !*** ./src/olcs/core/OLImageryProvider.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var ol_proj_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ol/proj.js */ "ol/proj.js");
/* harmony import */ var ol_proj_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ol_proj_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util.js */ "./src/olcs/util.js");
/* harmony import */ var ol_source_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ol/source.js */ "ol/source.js");
/* harmony import */ var ol_source_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ol_source_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _core_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core.js */ "./src/olcs/core.js");
/**
 * @module olcs.core.OLImageryProvider
 */






const olUseNewCoordinates = (function() {
  const tileSource = new ol_source_js__WEBPACK_IMPORTED_MODULE_2__.Tile({
    projection: 'EPSG:3857',
    wrapX: true
  });
  const tileCoord = tileSource.getTileCoordForTileUrlFunction([6, -31, 22]);
  return tileCoord && tileCoord[1] === 33 && tileCoord[2] === 22;
  // See b/test/spec/ol/source/tile.test.js
  // of e9a30c5cb7e3721d9370025fbe5472c322847b35 in OpenLayers repository
})();


class OLImageryProvider /* should not extend Cesium.ImageryProvider */ {
  /**
   * Special class derived from Cesium.ImageryProvider
   * that is connected to the given ol.source.TileImage.
   * @param {!ol.Map} olMap
   * @param {!ol.source.TileImage} source
   * @param {ol.proj.Projection=} opt_fallbackProj Projection to assume if the
   *                                               projection of the source is not defined.
   * @constructor
   * @extends {Cesium.ImageryProvider}
   */
  constructor(olMap, source, opt_fallbackProj) {
    // Do not extend or call super constructor from
    // Cesium.ImageryProvider since this particular function is a
    // 'non instanciable interface' which throws on instanciation.

    /**
     * @type {!ol.source.TileImage}
     * @private
     */
    this.source_ = source;

    /**
     * @type {?ol.proj.Projection}
     * @private
     */
    this.projection_ = null;

    /**
     * @type {?ol.proj.Projection}
     * @private
     */
    this.fallbackProj_ = opt_fallbackProj || null;

    /**
     * @type {boolean}
     * @private
     */
    this.ready_ = false;

    /**
     * @type {?Cesium.TilingScheme}
     * @private
     */
    this.tilingScheme_ = null;

    /**
     * @type {?Cesium.Rectangle}
     * @private
     */
    this.rectangle_ = null;

    /**
     * @type {!ol.Map}
     * @private
     */
    this.map_ = olMap;


    /**
     * @type {boolean}
     * @private
     */
    this.shouldRequestNextLevel = false;

    const proxy = this.source_.get('olcs.proxy');
    if (proxy) {
      if (typeof proxy === 'function') {
        this.proxy_ = {
          'getURL': proxy
        };
      } else if (typeof proxy === 'string') {
        this.proxy_ = new Cesium.DefaultProxy(proxy);
      }
    }

    this.errorEvent_ = new Cesium.Event();

    this.emptyCanvas_ = document.createElement('canvas');
    this.emptyCanvas_.width = 1;
    this.emptyCanvas_.height = 1;

    this.source_.on('change', (e) => {
      this.handleSourceChanged_();
    });
    this.handleSourceChanged_();
  }

  /**
   * Checks if the underlying source is ready and cached required data.
   * @private
   */
  handleSourceChanged_(frameState) {
    if (!this.ready_ && this.source_.getState() == 'ready') {
      this.projection_ = _util_js__WEBPACK_IMPORTED_MODULE_1__["default"].getSourceProjection(this.source_) || this.fallbackProj_;
      const options = {numberOfLevelZeroTilesX: 1, numberOfLevelZeroTilesY: 1};

      if (this.source_.tileGrid !== null) {
        // Get the number of tiles at level 0 if it is defined
        this.source_.tileGrid.forEachTileCoord(this.projection_.getExtent(), 0, ([zoom, xIndex, yIndex]) => {
          options.numberOfLevelZeroTilesX = xIndex + 1;
          options.numberOfLevelZeroTilesY = yIndex + 1;
        });
      }

      if (this.projection_ == (0,ol_proj_js__WEBPACK_IMPORTED_MODULE_0__.get)('EPSG:4326')) {
        // Cesium zoom level 0 is OpenLayers zoom level 1 for layer in EPSG:4326 with a single tile on level 0
        this.shouldRequestNextLevel = options.numberOfLevelZeroTilesX === 1 && options.numberOfLevelZeroTilesY === 1;
        this.tilingScheme_ = new Cesium.GeographicTilingScheme(options);
      } else if (this.projection_ == (0,ol_proj_js__WEBPACK_IMPORTED_MODULE_0__.get)('EPSG:3857')) {
        this.shouldRequestNextLevel = false;
        this.tilingScheme_ = new Cesium.WebMercatorTilingScheme(options);
      } else {
        return;
      }
      this.rectangle_ = this.tilingScheme_.rectangle;

      this.ready_ = true;
    }
  }

  /**
   * Generates the proper attributions for a given position and zoom
   * level.
   * @export
   * @override
   */
  getTileCredits(x, y, level) {
    const attributionsFunction = this.source_.getAttributions();
    if (!attributionsFunction) {
      return [];
    }
    const extent = this.map_.getView().calculateExtent(this.map_.getSize());
    const center = this.map_.getView().getCenter();
    const zoom = this.shouldRequestNextLevel ? level + 1 : level;
    return (0,_core_js__WEBPACK_IMPORTED_MODULE_3__.attributionsFunctionToCredits)(attributionsFunction, zoom, center, extent);
  }

  /**
   * @export
   * @override
   */
  requestImage(x, y, level) {
    const tileUrlFunction = this.source_.getTileUrlFunction();
    if (tileUrlFunction && this.projection_) {

      const z_ = this.shouldRequestNextLevel ? level + 1 : level;

      let y_ = y;
      if (!olUseNewCoordinates) {
        // OpenLayers version 3 to 5 tile coordinates increase from bottom to top
        y_ = -y - 1;
      }
      let url = tileUrlFunction.call(this.source_, [z_, x, y_], 1, this.projection_);
      if (this.proxy_) {
        url = this.proxy_.getURL(url);
      }
      return url ? Cesium.ImageryProvider.loadImage(this, url) : this.emptyCanvas_;
    } else {
      // return empty canvas to stop Cesium from retrying later
      return this.emptyCanvas_;
    }
  }
}

// definitions of getters that are required to be present
// in the Cesium.ImageryProvider instance:
Object.defineProperties(OLImageryProvider.prototype, {
  'ready': {
    'get': /** @this {olcs.core.OLImageryProvider} */
        function() {return this.ready_;}
  },

  'rectangle': {
    'get': /** @this {olcs.core.OLImageryProvider} */
        function() {return this.rectangle_;}
  },

  'tileWidth': {
    'get': /** @this {olcs.core.OLImageryProvider} */
        function() {
          const tg = this.source_.getTileGrid();
          return tg ? (Array.isArray(tg.getTileSize(0)) ? tg.getTileSize(0)[0] : tg.getTileSize(0)) : 256;
        }
  },

  'tileHeight': {
    'get': /** @this {olcs.core.OLImageryProvider} */
        function() {
          const tg = this.source_.getTileGrid();
          return tg ? (Array.isArray(tg.getTileSize(0)) ? tg.getTileSize(0)[1] : tg.getTileSize(0)) : 256;
        }
  },

  'maximumLevel': {
    'get': /** @this {olcs.core.OLImageryProvider} */
        function() {
          const tg = this.source_.getTileGrid();
          return tg ? tg.getMaxZoom() : 18;
        }
  },

  'minimumLevel': {
    'get': /** @this {olcs.core.OLImageryProvider} */
        function() {
          // WARNING: Do not use the minimum level (at least until the extent is
          // properly set). Cesium assumes the minimumLevel to contain only
          // a few tiles and tries to load them all at once -- this can
          // freeze and/or crash the browser !
          return 0;
          //var tg = this.source_.getTileGrid();
          //return tg ? tg.getMinZoom() : 0;
        }
  },

  'tilingScheme': {
    'get': /** @this {olcs.core.OLImageryProvider} */
        function() {return this.tilingScheme_;}
  },

  'tileDiscardPolicy': {
    'get': function() {return undefined;}
  },

  'errorEvent': {
    'get': /** @this {olcs.core.OLImageryProvider} */
        function() {return this.errorEvent_;}
  },

  'proxy': {
    'get': /** @this {olcs.core.OLImageryProvider} */
        function() {return this.proxy_;}
  },

  'hasAlphaChannel': {
    'get': function() {return true;}
  },

  'pickFeatures': {
    'get': function() {return undefined;}
  }
});


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (OLImageryProvider);


/***/ }),

/***/ "./src/olcs/core/VectorLayerCounterpart.js":
/*!*************************************************!*\
  !*** ./src/olcs/core/VectorLayerCounterpart.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var ol_Observable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ol/Observable.js */ "ol/Observable.js");
/* harmony import */ var ol_Observable_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ol_Observable_js__WEBPACK_IMPORTED_MODULE_0__);
/**
 * @module olcs.core.VectorLayerCounterpart
 */



/**
 * Context for feature conversion.
 * @typedef {Object} OlFeatureToCesiumContext
 * @property {!(import('ol/Projection.js').default|string)} projection
 * @property {!Cesium.PrimitiveCollection} primitives
 * @property {Object<number, Array<!Cesium.Primitive|!Cesium.Billboard>>} featureToCesiumMap
 * @property {!Cesium.BillboardCollection} billboards
 */


class VectorLayerCounterpart {
  /**
  * Result of the conversion of an OpenLayers layer to Cesium.
  * @param {!(ol.proj.Projection|string)} layerProjection
  * @param {!Cesium.Scene} scene
  */
  constructor(layerProjection, scene) {
    const billboards = new Cesium.BillboardCollection({scene});
    const primitives = new Cesium.PrimitiveCollection();

    /**
    * @type {!Array.<ol.EventsKey>}
    */
    this.olListenKeys = [];

    this.rootCollection_ = new Cesium.PrimitiveCollection();
    /**
    * @type {!OlFeatureToCesiumContext}
    */
    this.context = {
      projection: layerProjection,
      billboards,
      featureToCesiumMap: {},
      primitives
    };

    this.rootCollection_.add(billboards);
    this.rootCollection_.add(primitives);
  }

  /**
  * Unlisten.
  */
  destroy() {
    this.olListenKeys.forEach(ol_Observable_js__WEBPACK_IMPORTED_MODULE_0__.unByKey);
    this.olListenKeys.length = 0;
  }

  /**
  * @return {!Cesium.Primitive}
  */
  getRootPrimitive() {
    return this.rootCollection_;
  }
}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VectorLayerCounterpart);


/***/ }),

/***/ "./src/olcs/math.js":
/*!**************************!*\
  !*** ./src/olcs/math.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "toDegrees": () => (/* binding */ toDegrees),
/* harmony export */   "toRadians": () => (/* binding */ toRadians)
/* harmony export */ });
/**
 * Converts radians to to degrees.
 *
 * @param {number} angleInRadians Angle in radians.
 * @return {number} Angle in degrees.
 */
function toDegrees(angleInRadians) {
  return angleInRadians * 180 / Math.PI;
}


/**
 * Converts degrees to radians.
 *
 * @param {number} angleInDegrees Angle in degrees.
 * @return {number} Angle in radians.
 */
function toRadians(angleInDegrees) {
  return angleInDegrees * Math.PI / 180;
}


/***/ }),

/***/ "./src/olcs/util.js":
/*!**************************!*\
  !*** ./src/olcs/util.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "getUid": () => (/* binding */ getUid),
/* harmony export */   "isGroundPolylinePrimitiveSupported": () => (/* binding */ isGroundPolylinePrimitiveSupported),
/* harmony export */   "olcsListen": () => (/* binding */ olcsListen),
/* harmony export */   "removeChildren": () => (/* binding */ removeChildren),
/* harmony export */   "removeNode": () => (/* binding */ removeNode),
/* harmony export */   "stableSort": () => (/* binding */ stableSort)
/* harmony export */ });
/**
 * @module olcs.util
 */
const exports = {};


/**
 * Cast to object.
 * @param {Object} param
 * @return {Object}
 */
exports.obj = function(param) {
  return param;
};


/**
 * @type {boolean|undefined}
 * @private
 */
exports.supportsImageRenderingPixelatedResult_ = undefined;


/**
 * @type {string|undefined}
 * @private
 */
exports.imageRenderingValueResult_ = undefined;


/**
 * @return {boolean}
 */
exports.supportsImageRenderingPixelated = function() {
  if (exports.supportsImageRenderingPixelatedResult_ === undefined) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('style', 'image-rendering: -moz-crisp-edges; image-rendering: pixelated;');
    // canvas.style.imageRendering will be undefined, null or an
    // empty string on unsupported browsers.
    const tmp = canvas.style['imageRendering']; // non standard
    exports.supportsImageRenderingPixelatedResult_ = !!tmp;
    if (exports.supportsImageRenderingPixelatedResult_) {
      exports.imageRenderingValueResult_ = tmp;
    }
  }
  return exports.supportsImageRenderingPixelatedResult_;
};


/**
 * @return {string}
 */
exports.imageRenderingValue = function() {
  exports.supportsImageRenderingPixelated();
  return exports.imageRenderingValueResult_ || '';
};

/**
 * Return the projection of the source that Cesium should use.
 *
 * @param {ol.source.Source} source Source.
 * @returns {ol.proj.Projection} The projection of the source.
 */
exports.getSourceProjection = function(source) {
  return /** @type {ol.proj.Projection} */ (source.get('olcs.projection'))
    || source.getProjection();
};

/**
 * @param {ol.Observable} observable
 * @param {string} type
 * @param {Function} listener
 * @return {!ol.events.EventsKey}
 */
function olcsListen(observable, type, listener) {
  // See https://github.com/openlayers/openlayers/pull/8481
  // ol.events.listen is internal so we use `on` instead.
  // And since `on` as a convoluted API (can return an EventsKey or an array of them)
  // we use a cast here.
  return /** @type {!ol.events.EventsKey} */ (observable.on(type, listener));
}

/**
 * Counter for getUid.
 * @type {number}
 */
let uidCounter_ = 0;

/**
 * Gets a unique ID for an object. This mutates the object so that further calls
 * with the same object as a parameter returns the same value. Unique IDs are generated
 * as a strictly increasing sequence. Adapted from goog.getUid.
 *
 * @param {Object} obj The object to get the unique ID for.
 * @return {number} The unique ID for the object.
 */
function getUid(obj) {
  return obj.olcs_uid || (obj.olcs_uid = ++uidCounter_);
}

/**
 * Sort the passed array such that the relative order of equal elements is preverved.
 * See https://en.wikipedia.org/wiki/Sorting_algorithm#Stability for details.
 * @param {Array<*>} arr The array to sort (modifies original).
 * @param {!function(*, *): number} compareFnc Comparison function.
 */
function stableSort(arr, compareFnc) {
  const length = arr.length;
  const tmp = Array(arr.length);
  for (let i = 0; i < length; i++) {
    tmp[i] = {index: i, value: arr[i]};
  }
  tmp.sort((a, b) => compareFnc(a.value, b.value) || a.index - b.index);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = tmp[i].value;
  }
}

/**
 * @param {Node} node The node to remove.
 * @returns {Node} The node that was removed or null.
 */
function removeNode(node) {
  return node && node.parentNode ? node.parentNode.removeChild(node) : null;
}

/**
 * @param {Node} node The node to remove the children from.
 */
function removeChildren(node) {
  while (node.lastChild) {
    node.removeChild(node.lastChild);
  }
}

/**
 * @param {Cesium.Scene} scene The scene.
 */
function isGroundPolylinePrimitiveSupported(scene) {
  const obj = Cesium.GroundPolylinePrimitive;
  return obj && obj.isSupported(scene);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (exports);


/***/ }),

/***/ "ol/Observable.js":
/*!********************************!*\
  !*** external "ol.Observable" ***!
  \********************************/
/***/ ((module) => {

module.exports = ol.Observable;

/***/ }),

/***/ "ol/Overlay.js":
/*!*****************************!*\
  !*** external "ol.Overlay" ***!
  \*****************************/
/***/ ((module) => {

module.exports = ol.Overlay;

/***/ }),

/***/ "ol/easing.js":
/*!****************************!*\
  !*** external "ol.easing" ***!
  \****************************/
/***/ ((module) => {

module.exports = ol.easing;

/***/ }),

/***/ "ol/extent":
/*!****************************!*\
  !*** external "ol.extent" ***!
  \****************************/
/***/ ((module) => {

module.exports = ol.extent;

/***/ }),

/***/ "ol/format/MVT.js":
/*!********************************!*\
  !*** external "ol.format.MVT" ***!
  \********************************/
/***/ ((module) => {

module.exports = ol.format.MVT;

/***/ }),

/***/ "ol/geom/Geometry.js":
/*!***********************************!*\
  !*** external "ol.geom.Geometry" ***!
  \***********************************/
/***/ ((module) => {

module.exports = ol.geom.Geometry;

/***/ }),

/***/ "ol/geom/Point.js":
/*!********************************!*\
  !*** external "ol.geom.Point" ***!
  \********************************/
/***/ ((module) => {

module.exports = ol.geom.Point;

/***/ }),

/***/ "ol/geom/Polygon.js":
/*!**********************************!*\
  !*** external "ol.geom.Polygon" ***!
  \**********************************/
/***/ ((module) => {

module.exports = ol.geom.Polygon;

/***/ }),

/***/ "ol/geom/SimpleGeometry.js":
/*!*****************************************!*\
  !*** external "ol.geom.SimpleGeometry" ***!
  \*****************************************/
/***/ ((module) => {

module.exports = ol.geom.SimpleGeometry;

/***/ }),

/***/ "ol/layer/Group.js":
/*!*********************************!*\
  !*** external "ol.layer.Group" ***!
  \*********************************/
/***/ ((module) => {

module.exports = ol.layer.Group;

/***/ }),

/***/ "ol/layer/Image.js":
/*!*********************************!*\
  !*** external "ol.layer.Image" ***!
  \*********************************/
/***/ ((module) => {

module.exports = ol.layer.Image;

/***/ }),

/***/ "ol/layer/Layer.js":
/*!*********************************!*\
  !*** external "ol.layer.Layer" ***!
  \*********************************/
/***/ ((module) => {

module.exports = ol.layer.Layer;

/***/ }),

/***/ "ol/layer/Tile.js":
/*!********************************!*\
  !*** external "ol.layer.Tile" ***!
  \********************************/
/***/ ((module) => {

module.exports = ol.layer.Tile;

/***/ }),

/***/ "ol/layer/Vector.js":
/*!**********************************!*\
  !*** external "ol.layer.Vector" ***!
  \**********************************/
/***/ ((module) => {

module.exports = ol.layer.Vector;

/***/ }),

/***/ "ol/layer/VectorTile.js":
/*!**************************************!*\
  !*** external "ol.layer.VectorTile" ***!
  \**************************************/
/***/ ((module) => {

module.exports = ol.layer.VectorTile;

/***/ }),

/***/ "ol/proj.js":
/*!**************************!*\
  !*** external "ol.proj" ***!
  \**************************/
/***/ ((module) => {

module.exports = ol.proj;

/***/ }),

/***/ "ol/render.js":
/*!****************************!*\
  !*** external "ol.render" ***!
  \****************************/
/***/ ((module) => {

module.exports = ol.render;

/***/ }),

/***/ "ol/source.js":
/*!****************************!*\
  !*** external "ol.source" ***!
  \****************************/
/***/ ((module) => {

module.exports = ol.source;

/***/ }),

/***/ "ol/source/Cluster.js":
/*!************************************!*\
  !*** external "ol.source.Cluster" ***!
  \************************************/
/***/ ((module) => {

module.exports = ol.source.Cluster;

/***/ }),

/***/ "ol/source/Image.js":
/*!**********************************!*\
  !*** external "ol.source.Image" ***!
  \**********************************/
/***/ ((module) => {

module.exports = ol.source.Image;

/***/ }),

/***/ "ol/source/ImageStatic.js":
/*!****************************************!*\
  !*** external "ol.source.ImageStatic" ***!
  \****************************************/
/***/ ((module) => {

module.exports = ol.source.ImageStatic;

/***/ }),

/***/ "ol/source/ImageWMS.js":
/*!*************************************!*\
  !*** external "ol.source.ImageWMS" ***!
  \*************************************/
/***/ ((module) => {

module.exports = ol.source.ImageWMS;

/***/ }),

/***/ "ol/source/TileImage.js":
/*!**************************************!*\
  !*** external "ol.source.TileImage" ***!
  \**************************************/
/***/ ((module) => {

module.exports = ol.source.TileImage;

/***/ }),

/***/ "ol/source/TileWMS.js":
/*!************************************!*\
  !*** external "ol.source.TileWMS" ***!
  \************************************/
/***/ ((module) => {

module.exports = ol.source.TileWMS;

/***/ }),

/***/ "ol/source/Vector.js":
/*!***********************************!*\
  !*** external "ol.source.Vector" ***!
  \***********************************/
/***/ ((module) => {

module.exports = ol.source.Vector;

/***/ }),

/***/ "ol/source/VectorTile.js":
/*!***************************************!*\
  !*** external "ol.source.VectorTile" ***!
  \***************************************/
/***/ ((module) => {

module.exports = ol.source.VectorTile;

/***/ }),

/***/ "ol/structs/LRUCache.js":
/*!**************************************!*\
  !*** external "ol.structs.LRUCache" ***!
  \**************************************/
/***/ ((module) => {

module.exports = ol.structs.LRUCache;

/***/ }),

/***/ "ol/style/Icon.js":
/*!********************************!*\
  !*** external "ol.style.Icon" ***!
  \********************************/
/***/ ((module) => {

module.exports = ol.style.Icon;

/***/ }),

/***/ "ol/style/Stroke.js":
/*!**********************************!*\
  !*** external "ol.style.Stroke" ***!
  \**********************************/
/***/ ((module) => {

module.exports = ol.style.Stroke;

/***/ }),

/***/ "ol/style/Style.js":
/*!*********************************!*\
  !*** external "ol.style.Style" ***!
  \*********************************/
/***/ ((module) => {

module.exports = ol.style.Style;

/***/ }),

/***/ "ol/tilegrid.js":
/*!******************************!*\
  !*** external "ol.tilegrid" ***!
  \******************************/
/***/ ((module) => {

module.exports = ol.tilegrid;

/***/ }),

/***/ "ol/tileurlfunction.js":
/*!*************************************!*\
  !*** external "ol.tileurlfunction" ***!
  \*************************************/
/***/ ((module) => {

module.exports = ol.tileurlfunction;

/***/ }),

/***/ "ol/util.js":
/*!**************************!*\
  !*** external "ol.util" ***!
  \**************************/
/***/ ((module) => {

module.exports = ol.util;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!******************************!*\
  !*** ./src/index.library.js ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _olcs_OLCesium_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./olcs/OLCesium.js */ "./src/olcs/OLCesium.js");
/* harmony import */ var _olcs_AbstractSynchronizer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./olcs/AbstractSynchronizer.js */ "./src/olcs/AbstractSynchronizer.js");
/* harmony import */ var _olcs_RasterSynchronizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./olcs/RasterSynchronizer.js */ "./src/olcs/RasterSynchronizer.js");
/* harmony import */ var _olcs_VectorSynchronizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./olcs/VectorSynchronizer.js */ "./src/olcs/VectorSynchronizer.js");
/* harmony import */ var _olcs_core_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./olcs/core.js */ "./src/olcs/core.js");
/* harmony import */ var _olcs_core_OLImageryProvider_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./olcs/core/OLImageryProvider.js */ "./src/olcs/core/OLImageryProvider.js");
/* harmony import */ var _olcs_core_VectorLayerCounterpart_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./olcs/core/VectorLayerCounterpart.js */ "./src/olcs/core/VectorLayerCounterpart.js");
/* harmony import */ var _olcs_contrib_LazyLoader_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./olcs/contrib/LazyLoader.js */ "./src/olcs/contrib/LazyLoader.js");
/* harmony import */ var _olcs_contrib_Manager_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./olcs/contrib/Manager.js */ "./src/olcs/contrib/Manager.js");














/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_olcs_OLCesium_js__WEBPACK_IMPORTED_MODULE_0__["default"]);

// Using var for phantomJS
// eslint-disable-next-line no-var
var olcs = window['olcs'] = {};
olcs.OLCesium = _olcs_OLCesium_js__WEBPACK_IMPORTED_MODULE_0__["default"];

olcs.AbstractSynchronizer = _olcs_AbstractSynchronizer_js__WEBPACK_IMPORTED_MODULE_1__["default"];
olcs.RasterSynchronizer = _olcs_RasterSynchronizer_js__WEBPACK_IMPORTED_MODULE_2__["default"];
olcs.VectorSynchronizer = _olcs_VectorSynchronizer_js__WEBPACK_IMPORTED_MODULE_3__["default"];

olcs.core = _olcs_core_js__WEBPACK_IMPORTED_MODULE_4__["default"];
olcs.core.OLImageryProvider = _olcs_core_OLImageryProvider_js__WEBPACK_IMPORTED_MODULE_5__["default"];
olcs.core.VectorLayerCounterpart = _olcs_core_VectorLayerCounterpart_js__WEBPACK_IMPORTED_MODULE_6__["default"];

olcs.contrib = {};
olcs.contrib.LazyLoader = _olcs_contrib_LazyLoader_js__WEBPACK_IMPORTED_MODULE_7__["default"];
olcs.contrib.Manager = _olcs_contrib_Manager_js__WEBPACK_IMPORTED_MODULE_8__["default"];

})();

olcs_unused_var = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=olcesium-debug.js.map