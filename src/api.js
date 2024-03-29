import PointsModel from './model/points.js';
import OffersModel from './model/offers.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
    this._pointsData = [];
    this._pointsData = this.getPointsData();
    //console.log(this._pointsData);
  }


  //удалить после адаптирования
  getPointsData() {
    return this._load({url: 'points'})
      .then(Api.toJSON);
  }

  getPoints() {
    return this._pointsData
      .then((points) => points.map(PointsModel.adaptToClient));
  }

  getOffers() {
    return this._pointsData
      .then(OffersModel.adaptToClient);
  }

  getDestinations() {
    return this._load({url: 'destinations'})
      .then(Api.toJSON);
  }

  getOffersIndex() {
    return this._load({url: 'offers'})
      .then(Api.toJSON);
  }

  updatePoint(point) {
    //console.log(PointsModel.adaptToServer(point));
    return this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(PointsModel.adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(PointsModel.adaptToClient);
  }

  addPoint(point) {
    //console.log(point, PointsModel.adaptToServer(point));
    return this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(PointsModel.adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(PointsModel.adaptToClient);
  }

  deletePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });
  }


  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
