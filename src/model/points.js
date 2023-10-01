import Observer from '../utils/observer.js';

import { formatDuration } from '../utils/trip-point.js';

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
    this._offers = [];
  }

  setPoints(points) {
    this._points = points.slice();
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType);
  }


  static adaptToClient(point) {
    const adoptedPointOffers = [];
    const offersIds = [];

    point.offers.forEach((offer, index) => {
      adoptedPointOffers.push(Object.assign(
        {},
        offer,
        {
          type: point.type,
          id: point.id.toString() + (index*101).toString(),
        },
      ));

      offersIds.push(point.id.toString() + (index*101).toString());
    });
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        begin: new Date(point.date_from),
        end: new Date(point.date_to),
        description: point.destination.description,
        images: point.destination.pictures,
        destination: point.destination.name,
        duration: formatDuration(point.date_to - point.date_from),
        favorite: point.is_favorite,
        price: point.base_price,
        offers: offersIds,
      },
    );

    // Ненужные ключи мы удаляем
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;
    delete adaptedPoint.base_price;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        'date_from': point.begin.toISOString(),
        'date_to': point.end.toISOString(),
        'is_favorite': point.favorite,
        'base_price': point.price,
        destination: {
          name: point.destination,
          description: point.description,
          pictures: point.images,
        },
      //  offers: дописать !!!
      },
    );

    // Ненужные ключи мы удаляем
    delete adaptedPoint.begin;
    delete adaptedPoint.end;
    delete adaptedPoint.duration;
    delete adaptedPoint.favorite;
    delete adaptedPoint.price;
    delete adaptedPoint.description;
    delete adaptedPoint.images;

    return adaptedPoint;
  }

}
