import PointModel from '../models/point-model.js';
import DestinationModel from '../models/destination-model.js';
import OfferModel from '../models/offer-model.js';

const getSynchronizedPoints = (points) => points.filter(({success}) => success).map(({payload}) => payload.point);

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
  }

  getPoints() {
    if (this._isOnLine()) {
      return this._api.getPoints()
        .then((points) => {
          points.forEach((point) => {
            this._store.setItem(point.id, point.toRAW());
          });
          return points;
        });
    }
    const storePoints = this._getStorePoints();
    this._isSynchronized = false;
    return Promise.resolve(PointModel.parsePoints(storePoints));
  }

  getDestinations() {
    if (this._isOnLine()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._store.setItem(`destinations`, destinations);
          return destinations;
        });
    }
    const storeDestinations = this._store.getAll()[`destinations`];
    this._isSynchronized = false;
    return Promise.resolve(DestinationModel.parseDestinations(storeDestinations));
  }

  getOffers() {
    if (this._isOnLine()) {
      return this._api.getOffers()
        .then((offers) => {
          this._store.setItem(`offers`, offers);
          return offers;
        });
    }
    const storeOffers = this._store.getAll()[`offers`];
    this._isSynchronized = false;
    return Promise.resolve(OfferModel.parseOffers(storeOffers));
  }

  createPoint(point) {
    if (this._isOnLine()) {
      return this._api.createPoint(point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, newPoint.toRAW());
          return newPoint;
        });
    }
    const fakeNewPointId = String(Number(new Date()) + Math.random());
    const fakeNewPoint = PointModel.parsePoint(Object.assign({}, point.toRAW(), {id: fakeNewPointId}));
    this._isSynchronized = false;
    this._store.setItem(fakeNewPoint.id, Object.assign({}, fakeNewPoint.toRAW(), {offline: true}));
    return Promise.resolve(fakeNewPoint);
  }

  updatePoint(id, point) {
    if (this._isOnLine()) {
      return this._api.updatePoint(id, point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, newPoint.toRAW());
          return newPoint;
        });
    }
    const fakeUpdatedPoint = PointModel.parsePoint(Object.assign({}, point.toRAW(), {id}));
    this._isSynchronized = false;
    this._store.setItem(id, Object.assign({}, fakeUpdatedPoint.toRAW(), {offline: true}));
    return Promise.resolve(fakeUpdatedPoint);
  }

  deletePoint(id) {
    if (this._isOnLine()) {
      return this._api.deletePoint(id)
        .then(() => this._store.removeItem(id));
    }
    this._isSynchronized = false;
    this._store.removeItem(id);
    return Promise.resolve();
  }

  sync() {
    if (this._isOnLine()) {
      const storePoints = this._getStorePoints();
      return this._api.sync(storePoints)
        .then((response) => {
          storePoints.filter((point) => point.offline).forEach((point) => this._store.removeItem(point.id));
          const createdPoints = getSynchronizedPoints(response.created);
          const updatedPoints = getSynchronizedPoints(response.updated);
          [...createdPoints, ...updatedPoints].forEach((point) => this._store.setItem(point.id, point));
          this._isSynchronized = true;
          return Promise.resolve();
        });
    }
    return Promise.reject(new Error(`Sync data failed`));
  }

  getSynchronizeStatus() {
    return this._isSynchronized;
  }

  _isOnLine() {
    return window.navigator.onLine;
  }

  _getStorePoints() {
    const storeKeys = Object.keys(this._store.getAll());
    const storeValues = this._store.getAll();
    let storePoints = [];
    for (const key of storeKeys) {
      if (key !== `destinations` && key !== `offers`) {
        storePoints.push(storeValues[key]);
      }
    }
    return storePoints;
  }
}
