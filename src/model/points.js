import Observer from '../utils/observer.js';

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
        begin: point.date_from,
        end: point.date_to,
        description: point.destination.description,
        images: point.destination.pictures,
        destination: point.destination.name,
        duration: '', //посчитать
        favorite: point.is_favorite,
        price: point.base_price,
        offers: offersIds,

        //dueDate: point.due_date !== null ? new Date(point.due_date) : point.due_date, // На клиенте дата хранится как экземпляр Date
        //isArchive: point.is_archived,
        //isFavorite: point.is_favorite,
        //repeating: point.repeating_days,
      },
    );

    // Ненужные ключи мы удаляем
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;
    delete adaptedPoint.base_price;
    //delete adaptedPoint.destination.description;
    //delete adaptedPoint.destination.name;


    //delete adaptedPoint.due_date;
    //delete adaptedPoint.is_archived;
    //delete adaptedPoint.is_favorite;
    //delete adaptedPoint.repeating_days;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        'due_date': point.dueDate instanceof Date ? point.dueDate.toISOString() : null, // На сервере дата хранится в ISO формате
        'is_archived': point.isArchive,
        'is_favorite': point.isFavorite,
        'repeating_days': point.repeating,
      },
    );

    // Ненужные ключи мы удаляем
    delete adaptedPoint.dueDate;
    delete adaptedPoint.isArchive;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.repeating;

    return adaptedPoint;
  }

}
