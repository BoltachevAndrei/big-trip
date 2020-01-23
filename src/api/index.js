import DestinationModel from '../models/destination-model.js';
import OfferModel from '../models/offer-model.js';
import PointModel from '../models/point-model.js';

const Code = {
  OK: 200,
  MULTIPLE_CHOICE: 300
};

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkResponseStatus = (response) => {
  if (response.status >= Code.OK && response.status <= Code.MULTIPLE_CHOICE) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class Api {
  constructor(remoteHost, authorizationKey) {
    this._remoteHost = remoteHost;
    this._authorizationKey = authorizationKey;
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then((response) => response.json())
      .then(DestinationModel.parseDestinations);
  }

  getPoints() {
    return this._load({url: `points`})
      .then((response) => response.json())
      .then(PointModel.parsePoints);
  }

  getOffers() {
    return this._load({url: `offers`})
      .then((response) => response.json())
      .then(OfferModel.parseOffers);
  }

  createPoint(point) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(point.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(PointModel.parsePoint);
  }

  deletePoint(id) {
    return this._load({url: `points/${id}`, method: Method.DELETE});
  }

  updatePoint(id, data) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(PointModel.parsePoint);
  }

  sync(data) {
    return this._load({
      url: `points/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json());
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorizationKey);

    return fetch(`${this._remoteHost}/${url}`, {method, body, headers})
      .then(checkResponseStatus)
      .catch((err) => {
        throw err;
      });
  }
}
